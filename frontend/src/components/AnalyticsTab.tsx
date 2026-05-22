import type { FormEvent } from "react";
import type { StudentAverage, Student } from "../types";
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from "../constants";

type AnalyticsTabProps = {
  averageStudentSearch: string;
  averageSelectedStudentId: string;
  averageResult: StudentAverage | null;
  students: Student[];
  studentsLoading: boolean;
  onAverageStudentSearchChange: (value: string) => void;
  onAverageStudentSelect: (student: Student) => void;
  onAverageSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AnalyticsTab({
  averageStudentSearch,
  averageSelectedStudentId,
  averageResult,
  students,
  studentsLoading,
  onAverageStudentSearchChange,
  onAverageStudentSelect,
  onAverageSubmit,
}: AnalyticsTabProps) {
  const filteredStudents = students.filter((student) => {
    const query = averageStudentSearch.toLowerCase().trim();
    if (!query) {
      return true;
    }

    return [
      student.name,
      student.registration,
      student.course,
      student.classSchool,
    ].some((value) => value.toLowerCase().includes(query));
  });

  const selectedStudent = students.find(
    (student) => String(student.id ?? "") === averageSelectedStudentId,
  );

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <article>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Médias
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Calcular média por aluno
        </h2>
        <form className="mt-4 space-y-4" onSubmit={onAverageSubmit}>
          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-3">
            <input
              type="text"
              value={averageStudentSearch}
              onChange={(event) =>
                onAverageStudentSearchChange(event.target.value)
              }
              placeholder="Pesquisar por nome, matrícula, curso ou turma"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
            />

            <div className="mt-3 max-h-52 overflow-auto rounded-2xl border border-slate-200 bg-white">
              {studentsLoading ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  Carregando alunos...
                </div>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isSelected =
                    String(student.id ?? "") === averageSelectedStudentId;

                  return (
                    <button
                      key={`${student.id ?? student.registration}-${student.name}`}
                      type="button"
                      onClick={() => onAverageStudentSelect(student)}
                      className={`flex w-full flex-col items-start gap-1 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${
                        isSelected ? "bg-cyan-50" : "bg-white"
                      }`}
                    >
                      <span className="font-semibold text-slate-950">
                        {student.name}
                      </span>
                      <span className="text-xs text-slate-500">
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

          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              {selectedStudent ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Selecionado: {selectedStudent.name}
                </span>
              ) : (
                <span>Selecione um aluno na lista acima.</span>
              )}
            </div>
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Calcular média
            </button>
          </div>
        </form>

        {averageResult ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  {averageResult.studentName}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Notas: {averageResult.notes.join(", ")}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASSES[averageResult.status]}`}
              >
                {STATUS_LABELS[averageResult.status]}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-slate-500">Média</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {averageResult.average.toFixed(1)}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-slate-500">Status</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {STATUS_LABELS[averageResult.status]}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}
