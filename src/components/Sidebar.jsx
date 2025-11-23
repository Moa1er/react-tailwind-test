const Sidebar = ({ views, activeView, onViewChange, onNewProject }) => {
  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="sticky top-6 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-4 shadow-xl shadow-slate-950/50">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Expo Toolkit</p>
            <h1 className="text-xl font-semibold">Stand Editor</h1>
          </div>
          <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 border border-slate-700 flex items-center justify-center text-lg">
            🎛️
          </span>
        </header>
        <nav className="space-y-2">
          {views.map((view) => {
            const isActive = view.id === activeView;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => onViewChange(view.id)}
                className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-cyan-400/80 bg-slate-900/70 text-white shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-cyan-400/40 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{view.icon}</span>
                  <span className="font-semibold">{view.label}</span>
                </span>
                {isActive ? <span className="text-xs text-cyan-300">Active</span> : null}
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={onNewProject}
          className="w-full rounded-2xl border border-dashed border-cyan-400/60 bg-slate-900/40 px-4 py-3 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/10"
        >
          + New Project
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
