import type { AuthUser } from "../types";

type AppHeaderProps = {
  logoUrl: string;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
};

export function AppHeader({ logoUrl, currentUser, onLogout }: AppHeaderProps) {
  return (
    <header className="animate-fade-in-up rounded-[2.25rem] border border-slate-200/70 bg-slate-950 px-6 py-6 text-slate-50 shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:px-8 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="animate-soft-float flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900">
          <img
            src={logoUrl}
            alt="Logo do Student Progress"
            className="h-10 w-10 object-contain"
          />
        </div>
        <div className="pl-50">
          <div className="text-center">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-cyan-300">
              Student Progress
            </p>

            <p className="text-sm text-slate-300 ">
              Dashboard acadêmico para gestão de alunos
            </p>
          </div>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900">
            <div className="text-left">
              <p className="text-sm font-semibold text-white">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-300">{currentUser.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  Sair
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
