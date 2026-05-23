import type { FormEvent } from "react";
import type { AuthForm, AuthMode } from "../types";

type AuthPanelProps = {
  mode: AuthMode;
  form: AuthForm;
  loading: boolean;
  onModeChange: (mode: AuthMode) => void;
  onChange: <K extends keyof AuthForm>(field: K, value: AuthForm[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AuthPanel({
  mode,
  form,
  loading,
  onModeChange,
  onChange,
  onSubmit,
}: AuthPanelProps) {
  const isRegister = mode === "register";

  return (
    <section className="mx-auto grid w-full max-w-5xl items-stretch gap-5 lg:grid-cols-2">
      <article className="relative flex h-[39.5rem] min-h-[39.5rem] overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-slate-950 p-6 text-slate-50 shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:p-8">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute -left-16 top-0 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute right-0 top-8 h-60 w-60 rounded-full bg-sky-500/20 blur-3xl" />
        </div>

        <div className="relative flex h-full flex-col items-center justify-center space-y-5 text-center">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg backdrop-blur">
              <img
                src="/student-progress-logo.png"
                alt="Logo do Student Progress"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-cyan-300">
                Student Progress
              </p>
              <p className="text-sm text-slate-300">
                Gerenciamento e acompanhamento de alunos
              </p>
            </div>
          </div>

          <div className="max-w-xl space-y-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Cadastro e acesso ao sistema em um único painel
            </h1>
            <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Crie sua conta ou acesse sua área de forma simples e prática.
              Após entrar no sistema, todas as funcionalidades ficam disponíveis
              em um painel organizado e seguro.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs font-medium text-slate-200">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-cyan-100 backdrop-blur">
              Progresso
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-slate-100 backdrop-blur">
              Acadêmico
            </span>
          </div>
        </div>
      </article>

      <article className="flex h-[39.5rem] min-h-[39.5rem] flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
              !isRegister
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => onModeChange("register")}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
              isRegister
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            }`}
          >
            Criar conta
          </button>
        </div>

        <div key={mode} className="animate-fade-in-up mt-6 space-y-2">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            {isRegister ? "Novo usuário" : "Acesso"}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
            {isRegister ? "Criar conta" : "Entrar no sistema"}
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {isRegister
              ? "Use seu nome, e-mail e senha para liberar o acesso ao painel."
              : "Entre com seu e-mail e senha para carregar o sistema."}
          </p>
        </div>

        <form
          key={`${mode}-form`}
          className={`animate-fade-in-up flex flex-1 flex-col ${
            isRegister ? "justify-between gap-4" : "justify-start gap-3 pt-8"
          }`}
          onSubmit={onSubmit}
        >
          <div
            className={`flex flex-col ${
              isRegister ? "gap-4" : "mx-auto w-full max-w-md gap-3"
            }`}
          >
            {isRegister ? (
              <label className="block space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <span>Nome</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => onChange("name", event.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
                />
              </label>
            ) : null}

            <label className="block space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>E-mail</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="voce@exemplo.com"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <span>Senha</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => onChange("password", event.target.value)}
                placeholder="Sua senha"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
              />
            </label>

            {isRegister ? (
              <label className="block space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                <span>Confirmar senha</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) =>
                    onChange("confirmPassword", event.target.value)
                  }
                  placeholder="Repita sua senha"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800"
                />
              </label>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-600 dark:text-slate-950 dark:hover:bg-cyan-500 ${
              isRegister ? "mt-0" : "mx-auto mt-0 max-w-md"
            }`}
          >
            {loading ? "Processando..." : isRegister ? "Criar conta" : "Entrar"}
          </button>
        </form>
      </article>
    </section>
  );
}
