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
    <nav className="rounded-[1.4rem] border border-slate-200 bg-white/85 p-1.5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur">
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
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
