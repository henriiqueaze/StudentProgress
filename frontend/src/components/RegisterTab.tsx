import type { FormEvent } from "react";
import type { StudentForm } from "../types";
import { maskCpf, normalizeGradeInput } from "../utils/studentFormatters";

type RegisterTabProps = {
  editingId: number | null;
  studentForm: StudentForm;
  onCancelEdit: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: <K extends keyof StudentForm>(
    field: K,
    value: StudentForm[K],
  ) => void;
};

export function RegisterTab({
  editingId,
  studentForm,
  onCancelEdit,
  onSubmit,
  onChange,
}: RegisterTabProps) {
  return (
    <section className="w-full">
      <article className="w-full rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Cadastro
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
              {editingId ? "Atualizar aluno" : "Cadastrar aluno"}
            </h2>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancelar edição
            </button>
          ) : null}
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>Nome *</span>
              <input
                type="text"
                value={studentForm.name}
                onChange={(event) => onChange("name", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>Data de nascimento *</span>
              <input
                type="date"
                value={studentForm.birthDate}
                onChange={(event) => onChange("birthDate", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>CPF</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={14}
                value={studentForm.cpf}
                onChange={(event) =>
                  onChange("cpf", maskCpf(event.target.value))
                }
                placeholder="000.000.000-00"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>Email</span>
              <input
                type="email"
                value={studentForm.email}
                onChange={(event) => onChange("email", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600">
              <span>Matrícula *</span>
              <input
                type="text"
                value={studentForm.registration}
                onChange={(event) =>
                  onChange("registration", event.target.value.toUpperCase())
                }
                required
                placeholder="2026A001"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>Curso *</span>
              <input
                type="text"
                value={studentForm.course}
                onChange={(event) => onChange("course", event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>Turma *</span>
              <input
                type="text"
                value={studentForm.classSchool}
                onChange={(event) =>
                  onChange("classSchool", event.target.value)
                }
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
              />
            </label>

            <div className="space-y-2 text-sm font-medium text-slate-600 sm:col-span-2">
              <span>Notas *</span>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <span>Nota 1</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="8.5"
                    value={studentForm.note1}
                    onChange={(event) =>
                      onChange("note1", normalizeGradeInput(event.target.value))
                    }
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <span>Nota 2</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="6.0"
                    value={studentForm.note2}
                    onChange={(event) =>
                      onChange("note2", normalizeGradeInput(event.target.value))
                    }
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <span>Nota 3</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="9.25"
                    value={studentForm.note3}
                    onChange={(event) =>
                      onChange("note3", normalizeGradeInput(event.target.value))
                    }
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-cyan-600 dark:text-slate-900"
            >
              {editingId ? "Salvar atualização" : "Criar aluno"}
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}
