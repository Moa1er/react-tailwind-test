const Sidebar = ({ views, activeView, onViewChange, onNewProject }) => {
  return (
    <>
      <aside className="hidden w-full shrink-0 md:block md:w-64 lg:w-72">
        <div className="sticky top-6 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-4 shadow-xl shadow-slate-950/50">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Expo Toolkit</p>
              <h1 className="text-xl font-semibold">Stand Editor</h1>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 text-lg">
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

      <div className="fixed inset-x-4 bottom-4 z-50 md:hidden">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-3 py-2 shadow-2xl shadow-slate-950/60 backdrop-blur">
          <nav className="grid grid-cols-6 gap-2">
            {views.map((view) => {
              const isActive = view.id === activeView;
              return (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => onViewChange(view.id)}
                  className={`flex h-12 items-center justify-center rounded-2xl border text-xl transition ${
                    isActive
                      ? 'border-cyan-400/80 bg-slate-900/80 text-white shadow-cyan-500/20'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-cyan-400/50 hover:text-white'
                  }`}
                  aria-label={view.label}
                >
                  <span aria-hidden>{view.icon}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={onNewProject}
              className="flex h-12 items-center justify-center rounded-2xl border border-dashed border-cyan-400/70 bg-cyan-500/10 text-xl font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
              aria-label="Create new project"
            >
              +
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
