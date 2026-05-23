import type { Student } from "../types";
import type { StudentStatus } from "../types";
import { useState } from "react";
import { formatDate } from "../utils/studentFormatters";
import {
  BarChartOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from "../constants";

type StudentsTabProps = {
  students: Student[];
  listLoading: boolean;
  direction: "asc" | "desc";
  paginationLabel: string;
  canGoBack: boolean;
  canGoNext: boolean;
  searchNameQuery: string;
  statusFilter: StudentStatus | "ALL";
  onDirectionChange: (value: "asc" | "desc") => void;
  onRefresh: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onNameQueryChange: (value: string) => void;
  onStatusFilterChange: (value: StudentStatus | "ALL") => void;
  onEdit: (student: Student) => void;
  onAverage: (student: Student) => void;
  onDelete: (student: Student) => void;
};

function getStudentStatus(notes: number[]): StudentStatus {
  if (notes.length === 0) {
    return "FAILED";
  }

  const average = notes.reduce((sum, note) => sum + note, 0) / notes.length;

  if (average >= 7) {
    return "APPROVED";
  }

  if (average < 4) {
    return "FAILED";
  }

  return "RECOVERY";
}

export function StudentsTab({
  students,
  listLoading,
  direction,
  paginationLabel,
  canGoBack,
  canGoNext,
  searchNameQuery,
  statusFilter,
  onDirectionChange,
  onRefresh,
  onPrevious,
  onNext,
  onNameQueryChange,
  onStatusFilterChange,
  onEdit,
  onAverage,
  onDelete,
}: StudentsTabProps) {
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);

  const filteredStudents =
    statusFilter === "ALL"
      ? students
      : students.filter(
          (student) => getStudentStatus(student.notes) === statusFilter,
        );

  const visibleStudents = filteredStudents.filter((student) =>
    student.name.toLowerCase().includes(searchNameQuery.trim().toLowerCase()),
  );

  return (
    <section className="animate-fade-in-up-delayed space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
      <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Pesquisa
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
          Nome
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Pesquise por nome do aluno. Os resultados aparecem logo abaixo.
        </p>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setIsSearchCollapsed((previous) => !previous)}
            aria-label={isSearchCollapsed ? "Expandir busca" : "Minimizar busca"}
            className="search-toggle-button inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            <span
              className={`inline-flex items-center justify-center leading-none transition-transform duration-300 ${
                isSearchCollapsed ? "rotate-0" : "rotate-180"
              }`}
            >
              <DownOutlined className="text-sm" />
            </span>
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchCollapsed
              ? "mt-0 max-h-0 opacity-0 pointer-events-none -translate-y-1"
              : "mt-4 max-h-44 opacity-100 translate-y-0"
          }`}
        >
          <div>
            <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>Nome</span>
              <input
                type="text"
                value={searchNameQuery}
                onChange={(event) => onNameQueryChange(event.target.value)}
                placeholder="Ex.: Maria"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-600"
              />
            </label>
          </div>
        </div>

        <div className="pt-6">

        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-[220px]">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            Lista
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-500 dark:text-slate-400">
            Alunos cadastrados
          </h2>
        </div>

        <div className="ml-auto flex flex-wrap items-end gap-8">
          <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <span className="inline-block -translate-x-2">Ordenação</span>
            <select
              value={direction}
              onChange={(event) =>
                onDirectionChange(event.target.value as "asc" | "desc")
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
            >
              <option value="asc">Nome A-Z</option>
              <option value="desc">Nome Z-A</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <span className="inline-block -translate-x-2">Status</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(
                  event.target.value as StudentStatus | "ALL",
                )
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
            >
              <option value="ALL">Todos</option>
              <option value="APPROVED">Aprovado</option>
              <option value="FAILED">Reprovado</option>
              <option value="RECOVERY">Recuperação</option>
            </select>
          </label>

          <button
            type="button"
            onClick={onRefresh}
            disabled={listLoading}
            className="list-primary-button rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
          >
            Atualizar lista
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">ID</th>
                <th className="px-4 py-3 text-center font-semibold">Nome</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Nascimento
                </th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Curso</th>
                <th className="px-4 py-3 text-center font-semibold">Turma</th>
                <th className="px-4 py-3 text-center font-semibold">Notas</th>
                <th className="px-4 py-3 text-center font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
              {visibleStudents.map((student) => {
                const studentStatus = getStudentStatus(student.notes);

                return (
                  <tr
                    key={`${student.id ?? student.registration}-${student.name}`}
                    className="align-top"
                  >
                    <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                      {student.id}
                    </td>
                    <td className="px-4 py-4 text-center font-medium text-slate-950 dark:text-slate-100">
                      {student.name}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                      {formatDate(student.birthDate)}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASSES[studentStatus]}`}
                      >
                        {STATUS_LABELS[studentStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                      {student.course}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                      {student.classSchool}
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600 dark:text-slate-300">
                      {student.notes.join(", ")}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        <div className="group relative">
                          <button
                            type="button"
                            onClick={() => onEdit(student)}
                            className="list-edit-button inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                            aria-label="Editar aluno"
                          >
                            <EditOutlined />
                            <span className="sr-only">Editar</span>
                          </button>
                          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-slate-950 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 transition-all duration-150 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-within:-translate-y-1 group-focus-within:opacity-100 dark:bg-slate-700">
                            Editar
                          </span>
                        </div>
                        {student.id ? (
                          <div className="group relative">
                            <button
                              type="button"
                              onClick={() => onAverage(student)}
                              className="inline-flex items-center justify-center rounded-full bg-slate-950 p-2 text-white hover:bg-slate-800 dark:bg-cyan-600 dark:text-slate-900"
                              aria-label="Calcular média"
                            >
                              <BarChartOutlined />
                              <span className="sr-only">Média</span>
                            </button>
                            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-slate-950 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 transition-all duration-150 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-within:-translate-y-1 group-focus-within:opacity-100 dark:bg-slate-700">
                              Média
                            </span>
                          </div>
                        ) : null}
                        <div className="group relative">
                          <button
                            type="button"
                            onClick={() => onDelete(student)}
                            className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 dark:border-rose-700 dark:bg-rose-900 dark:text-rose-300"
                            aria-label="Excluir aluno"
                          >
                            <DeleteOutlined />
                            <span className="sr-only">Excluir</span>
                          </button>
                          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-slate-950 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white opacity-0 transition-all duration-150 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-within:-translate-y-1 group-focus-within:opacity-100 dark:bg-slate-700">
                            Excluir
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!listLoading && visibleStudents.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-dashed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          Nenhum aluno encontrado.
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoBack || listLoading}
          className="list-nav-button rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          Anterior
        </button>
        <span>{paginationLabel}</span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext || listLoading}
          className="list-nav-button rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          Próxima
        </button>
      </div>
        </div>
      </article>
    </section>
  );
}
