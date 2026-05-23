import { useState } from "react";
import type { FormEvent } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { Student, StudentForm } from "../types";
import {
  maskCpf,
  normalizeGradeInput,
  stripAccents,
} from "../utils/studentFormatters";

type PartialUpdateTabProps = {
  patchForm: StudentForm;
  students: Student[];
  studentsLoading: boolean;
  studentSearch: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: <K extends keyof StudentForm>(
    field: K,
    value: StudentForm[K],
  ) => void;
  onStudentSearchChange: (value: string) => void;
  onStudentSelect: (student: Student) => void;
};

export function PartialUpdateTab({
  patchForm,
  students,
  studentsLoading,
  studentSearch,
  onSubmit,
  onChange,
  onStudentSearchChange,
  onStudentSelect,
}: PartialUpdateTabProps) {
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);

  const selectedStudent = students.find(
    (student) => String(student.id ?? "") === patchForm.id,
  );

  const filteredStudents = students.filter((student) => {
    const query = stripAccents(studentSearch).toLowerCase().trim();
    if (!query) {
      return true;
    }

    return [
      student.name,
      student.registration,
      student.course,
      student.classSchool,
    ].some((value) => stripAccents(value).toLowerCase().includes(query));
  });

  return (
    <section className="space-y-4 rounded-[1.9rem] border border-slate-200/80 bg-slate-50 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-950 dark:backdrop-blur-none dark:shadow-none">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Regra
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Atualiza somente o preenchido
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Se um campo não for alterado, ele é ignorado na atualização. Para notas,
            preencha os 3 campos quando quiser atualizar a lista completa.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-cyan-100 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-none">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            Dica
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-100">
            Use a lista para preencher rapidamente
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            O botão editar na lista carrega os dados do aluno para facilitar a
            mudança.
          </p>
        </article>
      </div>

      <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Atualização parcial
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Aluno *</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pesquise e selecione um aluno para carregar os dados.
                  </p>
                </div>
                {selectedStudent ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    Selecionado: {selectedStudent.name}
                  </span>
                ) : null}
              </div>

              <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSearchCollapsed((previous) => !previous)}
                    aria-label={isSearchCollapsed ? "Expandir busca" : "Minimizar busca"}
                    className="search-toggle-button inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
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
                      ? "max-h-0 opacity-0 pointer-events-none -translate-y-1"
                      : "max-h-[22rem] opacity-100 translate-y-0"
                  }`}
                >
                  <div>
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(event) =>
                        onStudentSearchChange(event.target.value)
                      }
                      placeholder="Pesquisar por nome, matrícula, curso ou turma"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />

                    <div className="mt-3 max-h-52 overflow-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      {studentsLoading ? (
                        <div className="px-4 py-6 text-center text-sm text-slate-500">
                          Carregando alunos...
                        </div>
                      ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => {
                          const isSelected =
                            String(student.id ?? "") === patchForm.id;

                          return (
                            <button
                              key={`${student.id ?? student.registration}-${student.name}`}
                              type="button"
                              onClick={() => onStudentSelect(student)}
                              className={`flex w-full flex-col items-start gap-1 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 ${
                                isSelected ? "bg-cyan-50 dark:bg-cyan-900" : "bg-white dark:bg-slate-900"
                              }`}
                            >
                              <span className="font-semibold text-slate-950 dark:text-slate-100">
                                {student.name}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                ID {student.id ?? "-"} · {student.registration} ·{" "}
                                {student.course}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-slate-500">
                          Nenhum aluno encontrado.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>Nome</span>
              <input
                type="text"
                value={patchForm.name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="Novo nome"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>Data de nascimento</span>
              <input
                type="date"
                value={patchForm.birthDate}
                onChange={(event) => onChange("birthDate", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>CPF</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={14}
                value={patchForm.cpf}
                onChange={(event) =>
                  onChange("cpf", maskCpf(event.target.value))
                }
                placeholder="000.000.000-00"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>Email</span>
              <input
                type="email"
                value={patchForm.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="novo@email.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>Matrícula</span>
              <input
                type="text"
                value={patchForm.registration}
                onChange={(event) =>
                  onChange("registration", event.target.value.toUpperCase())
                }
                placeholder="2026A001"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>Curso</span>
              <input
                type="text"
                value={patchForm.course}
                onChange={(event) => onChange("course", event.target.value)}
                placeholder="Novo curso"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>Turma</span>
              <input
                type="text"
                value={patchForm.classSchool}
                onChange={(event) =>
                  onChange("classSchool", event.target.value)
                }
                placeholder="Nova turma"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
              />
            </label>

            <div className="space-y-2 text-sm font-medium text-slate-600 sm:col-span-2">
              <span>Notas</span>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="space-y-2 text-sm font-medium text-slate-600">
                  <span>Nota 1</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={patchForm.note1}
                    onChange={(event) =>
                      onChange("note1", normalizeGradeInput(event.target.value))
                    }
                    placeholder="8.0"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-600">
                  <span>Nota 2</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={patchForm.note2}
                    onChange={(event) =>
                      onChange("note2", normalizeGradeInput(event.target.value))
                    }
                    placeholder="9.5"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-600">
                  <span>Nota 3</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={patchForm.note3}
                    onChange={(event) =>
                      onChange("note3", normalizeGradeInput(event.target.value))
                    }
                    placeholder="7.0"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Aplicar atualização parcial
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}
