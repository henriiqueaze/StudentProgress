import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  AlertBanner,
  AuthPanel,
  AnalyticsTab,
  AppHeader,
  PartialUpdateTab,
  RegisterTab,
  StudentsTab,
  TabNavigation,
} from "./components";
import type {
  Alert,
  AuthForm,
  AuthMode,
  AuthResponse,
  AuthUser,
  ApiErrorBody,
  PagedStudentsResponse,
  Student,
  StudentAverage,
  StudentForm,
  StudentStatus,
  TabKey,
} from "./types";
import {
  collectNotes,
  splitNotes,
  toInputDate,
  toIsoDate,
} from "./utils/studentFormatters";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const LOGO_URL = "/student-progress-logo.png";
const AUTH_TOKEN_KEY = "studentprogress.auth.token";
const AUTH_USER_KEY = "studentprogress.auth.user";
const PAGE_SIZE = 12;
type StudentStatusFilter = StudentStatus | "ALL";
const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "register", label: "Cadastro" },
  { key: "partial", label: "Atualização parcial" },
  { key: "analytics", label: "Médias" },
  { key: "students", label: "Lista" },
];

const emptyStudentForm: StudentForm = {
  id: "",
  name: "",
  birthDate: "",
  cpf: "",
  email: "",
  registration: "",
  course: "",
  classSchool: "",
  note1: "",
  note2: "",
  note3: "",
};

const emptyAuthForm: AuthForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function readStoredAuthUser(): AuthUser | null {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

function clearStoredAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  if (response.status === 401 && storedToken) {
    clearStoredAuthSession();
    window.dispatchEvent(new Event("studentprogress:unauthorized"));
  }

  const raw = await response.text();
  let parsed: ApiErrorBody | T | undefined;

  if (raw) {
    try {
      parsed = JSON.parse(raw) as ApiErrorBody | T;
    } catch {
      parsed = undefined;
    }
  }

  if (!response.ok) {
    const errorBody = parsed as ApiErrorBody | undefined;
    const status =
      typeof errorBody?.status === "number"
        ? errorBody.status
        : response.status;

    throw new ApiError(
      errorBody?.message ||
        errorBody?.error ||
        "Erro na comunicacao com a API.",
      status,
    );
  }

  return parsed as T;
}

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authForm, setAuthForm] = useState<AuthForm>(emptyAuthForm);
  const [authLoading, setAuthLoading] = useState(false);
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem(AUTH_TOKEN_KEY) ?? "",
  );
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() =>
    readStoredAuthUser(),
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [allStudentsLoading, setAllStudentsLoading] = useState(false);
  const [studentForm, setStudentForm] = useState<StudentForm>(emptyStudentForm);
  const [patchForm, setPatchForm] = useState<StudentForm>(emptyStudentForm);
  const [partialStudentSearch, setPartialStudentSearch] = useState("");
  const [searchNameQuery, setSearchNameQuery] = useState("");
  const [averageResult, setAverageResult] = useState<StudentAverage | null>(
    null,
  );
  const [averageStudentSearch, setAverageStudentSearch] = useState("");
  const [averageSelectedStudentId, setAverageSelectedStudentId] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatusFilter>("ALL");
  const [alert, setAlert] = useState<Alert | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<TabKey>("register");
  const [editingId, setEditingId] = useState<number | null>(null);

  function syncStudentCollections(updatedStudent: Student) {
    setStudents((previous) =>
      previous.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student,
      ),
    );

    setAllStudents((previous) =>
      previous.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student,
      ),
    );
  }

  function removeStudentFromCollections(studentId: number) {
    setStudents((previous) =>
      previous.filter((student) => student.id !== studentId),
    );

    setAllStudents((previous) =>
      previous.filter((student) => student.id !== studentId),
    );
  }

  useEffect(() => {
    const handleUnauthorized = () => {
      setAlert({
        type: "error",
        message: "Sessão expirada. Faça login novamente.",
      });
      handleLogout();
    };

    window.addEventListener("studentprogress:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener(
        "studentprogress:unauthorized",
        handleUnauthorized,
      );
    };
  }, []);

  useEffect(() => {
    if (!alert) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAlert(null);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [alert]);

  useEffect(() => {
    if (partialStudentSearch.trim() === "") {
      setPatchForm(emptyStudentForm);
    }
  }, [partialStudentSearch]);

  const canGoBack = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const paginationLabel = useMemo(() => {
    const firstItem = totalElements === 0 ? 0 : currentPage * PAGE_SIZE + 1;
    const lastItem = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);
    return `${firstItem}-${lastItem} de ${totalElements}`;
  }, [currentPage, totalElements]);

  const fetchStudentsPage = useCallback(
    async (page = 0, sortDirection = direction) => {
      return request<PagedStudentsResponse>(
        `/student?page=${page}&size=${PAGE_SIZE}&direction=${sortDirection}`,
      );
    },
    [direction],
  );

  const loadStudents = useCallback(
    async (page = 0, sortDirection = direction) => {
      setListLoading(true);

      try {
        const response = await fetchStudentsPage(page, sortDirection);

        setStudents(response._embedded?.students ?? []);
        setCurrentPage(response.page?.number ?? page);
        setTotalPages(response.page?.totalPages ?? 1);
        setTotalElements(response.page?.totalElements ?? 0);
      } catch (error) {
        setAlert({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Falha ao carregar alunos.",
        });
      } finally {
        setListLoading(false);
      }
    },
    [direction, fetchStudentsPage],
  );

  useEffect(() => {
    const initializeStudents = async () => {
      if (!authToken) {
        return;
      }

      setListLoading(true);

      try {
        const response = await fetchStudentsPage(0);

        setStudents(response._embedded?.students ?? []);
        setCurrentPage(response.page?.number ?? 0);
        setTotalPages(response.page?.totalPages ?? 1);
        setTotalElements(response.page?.totalElements ?? 0);
      } catch (error) {
        setAlert({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Falha ao carregar alunos.",
        });
      } finally {
        setListLoading(false);
      }
    };

    void initializeStudents();
  }, [authToken, fetchStudentsPage]);

  function updateMainForm<K extends keyof StudentForm>(
    field: K,
    value: StudentForm[K],
  ) {
    setStudentForm((previous) => ({ ...previous, [field]: value }));
  }

  function updatePatchForm<K extends keyof StudentForm>(
    field: K,
    value: StudentForm[K],
  ) {
    setPatchForm((previous) => ({ ...previous, [field]: value }));
  }

  function updateAuthForm<K extends keyof AuthForm>(
    field: K,
    value: AuthForm[K],
  ) {
    setAuthForm((previous) => ({ ...previous, [field]: value }));
  }

  function saveAuthSession(response: AuthResponse) {
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
    setAuthToken(response.token);
    setCurrentUser(response.user);
  }

  function handleLogout() {
    clearStoredAuthSession();
    setAuthToken("");
    setCurrentUser(null);
    setAuthMode("login");
    setAuthForm(emptyAuthForm);
    setStudents([]);
    setAllStudents([]);
    setStudentForm(emptyStudentForm);
    setPatchForm(emptyStudentForm);
    setPartialStudentSearch("");
    setSearchNameQuery("");
    setAverageStudentSearch("");
    setAverageSelectedStudentId("");
    setAverageResult(null);
    setActiveTab("register");
    setEditingId(null);
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);

    try {
      if (
        authMode === "register" &&
        authForm.password !== authForm.confirmPassword
      ) {
        throw new Error("As senhas precisam ser iguais.");
      }

      const endpoint =
        authMode === "register" ? "/auth/register" : "/auth/login";
      const payload =
        authMode === "register"
          ? {
              name: authForm.name.trim(),
              email: authForm.email.trim(),
              password: authForm.password,
            }
          : {
              email: authForm.email.trim(),
              password: authForm.password,
            };

      const response = await request<AuthResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      saveAuthSession(response);
      setAuthForm(emptyAuthForm);
      setAuthMode("login");
      setAlert({
        type: "success",
        message:
          authMode === "register"
            ? "Conta criada e acesso liberado."
            : "Login realizado com sucesso.",
      });
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error instanceof Error ? error.message : "Falha na autenticação.",
      });
    } finally {
      setAuthLoading(false);
    }
  }

  function buildStudentPayload(form: StudentForm) {
    const notes = collectNotes([form.note1, form.note2, form.note3]);

    if (
      !form.name.trim() ||
      !form.birthDate ||
      !form.registration.trim() ||
      !form.course.trim() ||
      !form.classSchool.trim() ||
      notes.length !== 3
    ) {
      throw new Error(
        "Preencha nome, data de nascimento, matrícula, curso, turma e as 3 notas.",
      );
    }

    return {
      id: editingId ?? undefined,
      name: form.name.trim(),
      birthDate: toIsoDate(form.birthDate),
      cpf: form.cpf.trim() || undefined,
      email: form.email.trim() || undefined,
      registration: form.registration.trim(),
      course: form.course.trim(),
      classSchool: form.classSchool.trim(),
      notes,
    };
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const payload = buildStudentPayload(studentForm);
      const updatedStudent = editingId
        ? await request<Student>("/student", {
            method: "PUT",
            body: JSON.stringify(payload),
          })
        : await request<Student>("/student", {
            method: "POST",
            body: JSON.stringify(payload),
          });

      if (editingId) {
        setAlert({ type: "success", message: "Aluno atualizado com sucesso." });
      } else {
        setAlert({ type: "success", message: "Aluno criado com sucesso." });
      }

      syncStudentCollections(updatedStudent);

      setStudentForm(emptyStudentForm);
      setEditingId(null);
      await loadStudents(currentPage);
      setActiveTab("students");
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel salvar o aluno.",
      });
    }
  }

  async function handlePatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const payload = buildStudentPayload(patchForm);
      const updatedStudent = await request<Student>("/student", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setAlert({ type: "success", message: "Aluno atualizado com sucesso." });
      syncStudentCollections(updatedStudent);
      setPatchForm(emptyStudentForm);
      setPartialStudentSearch("");
      await loadStudents(currentPage);
      setActiveTab("students");
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel atualizar via PATCH.",
      });
    }
  }

  async function handleDelete(student: Student) {
    if (!student.id) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir ${student.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await request<void>(`/student/${student.id}`, { method: "DELETE" });
      setAlert({ type: "success", message: `Aluno ${student.name} removido.` });
      removeStudentFromCollections(student.id);

      const targetPage =
        students.length === 1 && currentPage > 0
          ? currentPage - 1
          : currentPage;
      await loadStudents(targetPage);
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel remover o aluno.",
      });
    }
  }

  async function handleAverageBySelectedStudent(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const numericId = Number(averageSelectedStudentId);
    if (Number.isNaN(numericId)) {
      setAlert({
        type: "error",
        message: "Selecione um aluno para calcular a média.",
      });
      return;
    }

    try {
      const data = await request<StudentAverage>(
        `/student/average/${numericId}`,
      );
      setAverageResult(data);
      setAverageStudentSearch("");
      setAverageSelectedStudentId("");
      setAlert({ type: "success", message: "Média calculada com sucesso." });
    } catch (error) {
      setAverageResult(null);
      setAlert({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel calcular a media.",
      });
    }
  }

  async function loadAverageFromStudent(student: Student) {
    if (!student.id) {
      setAlert({
        type: "error",
        message: "Não foi possível identificar o aluno selecionado.",
      });
      return;
    }

    try {
      const data = await request<StudentAverage>(
        `/student/average/${student.id}`,
      );
      setAverageStudentSearch(student.name);
      setAverageSelectedStudentId(String(student.id));
      setAverageResult(data);
      setAverageStudentSearch("");
      setAverageSelectedStudentId("");
      setAlert({ type: "success", message: "Média calculada com sucesso." });
      setActiveTab("analytics");
    } catch (error) {
      setAverageResult(null);
      setAlert({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel calcular a media.",
      });
    }
  }

  function loadStudentIntoPatch(student: Student) {
    const [note1, note2, note3] = splitNotes(student.notes);

    setPatchForm({
      id: String(student.id ?? ""),
      name: student.name,
      birthDate: toInputDate(student.birthDate),
      cpf: student.cpf ?? "",
      email: student.email ?? "",
      registration: student.registration,
      course: student.course,
      classSchool: student.classSchool,
      note1,
      note2,
      note3,
    });
    setPartialStudentSearch(student.name);
    setActiveTab("partial");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAverageStudentSearchChange(value: string) {
    setAverageStudentSearch(value);
    setAverageSelectedStudentId("");
  }

  function handleAverageStudentSelect(student: Student) {
    if (!student.id) {
      return;
    }

    setAverageStudentSearch(student.name);
    setAverageSelectedStudentId(String(student.id));
  }

  const fetchAllStudents = useCallback(async (): Promise<Student[]> => {
    const overview = await request<PagedStudentsResponse>(
      "/student?page=0&size=1&direction=asc",
    );
    const total = overview.page?.totalElements ?? 0;

    if (total === 0) {
      return [];
    }

    const response = await request<PagedStudentsResponse>(
      `/student?page=0&size=${Math.max(total, PAGE_SIZE)}&direction=asc`,
    );
    return response._embedded?.students ?? [];
  }, []);

  useEffect(() => {
    const initializeAllStudents = async () => {
      if (
        !authToken ||
        !["partial", "analytics", "students"].includes(activeTab) ||
        allStudents.length > 0 ||
        allStudentsLoading
      ) {
        return;
      }

      setAllStudentsLoading(true);

      try {
        const response = await fetchAllStudents();
        setAllStudents(response);
      } catch (error) {
        setAlert({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Falha ao carregar a lista completa de alunos.",
        });
      } finally {
        setAllStudentsLoading(false);
      }
    };

    void initializeAllStudents();
  }, [
    activeTab,
    allStudents.length,
    allStudentsLoading,
    authToken,
    fetchAllStudents,
  ]);

  if (!authToken) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(9,86,126,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,#f1f7fb_0%,#eff7fa_42%,#e8f1f6_100%)] text-slate-900">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
          {alert ? <AlertBanner alert={alert} /> : null}
          <AuthPanel
            mode={authMode}
            form={authForm}
            loading={authLoading}
            onModeChange={setAuthMode}
            onChange={updateAuthForm}
            onSubmit={handleAuthSubmit}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(9,86,126,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,#f1f7fb_0%,#eff7fa_42%,#e8f1f6_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <AppHeader
          logoUrl={LOGO_URL}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {alert ? <AlertBanner alert={alert} /> : null}

        {activeTab === "register" ? (
          <RegisterTab
            editingId={editingId}
            studentForm={studentForm}
            onCancelEdit={() => {
              setEditingId(null);
              setStudentForm(emptyStudentForm);
            }}
            onSubmit={handleCreate}
            onChange={updateMainForm}
          />
        ) : null}

        {activeTab === "partial" ? (
          <PartialUpdateTab
            patchForm={patchForm}
            students={allStudents}
            studentsLoading={allStudentsLoading}
            studentSearch={partialStudentSearch}
            onSubmit={handlePatch}
            onChange={updatePatchForm}
            onStudentSearchChange={setPartialStudentSearch}
            onStudentSelect={loadStudentIntoPatch}
          />
        ) : null}

        {activeTab === "analytics" ? (
          <AnalyticsTab
            averageStudentSearch={averageStudentSearch}
            averageSelectedStudentId={averageSelectedStudentId}
            averageResult={averageResult}
            students={allStudents}
            studentsLoading={allStudentsLoading}
            onAverageStudentSearchChange={handleAverageStudentSearchChange}
            onAverageStudentSelect={handleAverageStudentSelect}
            onAverageSubmit={handleAverageBySelectedStudent}
          />
        ) : null}

        {activeTab === "students" ? (
          <StudentsTab
            students={students}
            listLoading={listLoading}
            direction={direction}
            paginationLabel={paginationLabel}
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            searchNameQuery={searchNameQuery}
            statusFilter={statusFilter}
            onDirectionChange={setDirection}
            onRefresh={() => {
              void loadStudents(currentPage);
            }}
            onPrevious={() => {
              void loadStudents(currentPage - 1);
            }}
            onNext={() => {
              void loadStudents(currentPage + 1);
            }}
            onNameQueryChange={setSearchNameQuery}
            onStatusFilterChange={setStatusFilter}
            onEdit={loadStudentIntoPatch}
            onAverage={loadAverageFromStudent}
            onDelete={(student) => {
              void handleDelete(student);
            }}
          />
        ) : null}
      </div>
    </main>
  );
}

export default App;
