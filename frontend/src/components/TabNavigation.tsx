import type { TabKey } from "../types";

type TabNavigationProps = {
  tabs: Array<{ key: TabKey; label: string }>;
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export function TabNavigation({
  tabs,
  activeTab,
  onChange,
}: TabNavigationProps) {
  return (
    <nav className="rounded-[1.4rem] border border-slate-700 bg-slate-950 p-1.5 shadow-none backdrop-blur-0">
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-cyan-400 text-slate-950 shadow-[0_10px_24px_rgba(34,211,238,0.18)] ring-1 ring-cyan-300/40 dark:bg-cyan-500 dark:text-slate-950 dark:ring-cyan-300/30"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
