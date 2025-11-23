import TagChip from '../components/TagChip.jsx';

const ProjectView = ({
  project,
  standSearch,
  onStandSearch,
  tagFilter,
  onTagFilterChange,
  availableTags,
  stands,
  tagPalette,
  onEditStand,
}) => {
  if (!project) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Selected Project</p>
            <h2 className="text-lg font-semibold">{project.name}</h2>
            <p className="text-sm text-slate-300">{project.location}</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>{project.dates}</p>
            <p className="mt-1">{project.tags.join(', ')}</p>
          </div>
        </div>
        <div className="pt-3 space-y-3">
          <div>
            <label className="text-sm text-slate-300 font-medium" htmlFor="stand-search">
              Filter stands
            </label>
            <div className="mt-2 flex items-center gap-2 bg-slate-800/70 rounded-xl px-3 py-2 border border-slate-700 focus-within:border-cyan-400/60">
              <span className="text-slate-400 text-sm">🔍</span>
              <input
                id="stand-search"
                className="w-full bg-transparent outline-none text-sm placeholder:text-slate-500"
                placeholder="Stand name or tag"
                value={standSearch}
                onChange={(event) => onStandSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', ...availableTags].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagFilterChange(tag)}
                className={`px-3 py-1 rounded-full border text-xs font-semibold transition ${
                  tagFilter === tag
                    ? 'border-cyan-300/70 bg-cyan-500/10 text-cyan-100'
                    : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-cyan-300/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {stands.length ? (
          stands.map((stand) => {
            const initials = stand.company
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <article
                key={stand.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg hover:border-cyan-400/50 transition"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 border border-slate-700 flex items-center justify-center text-lg font-bold text-white">
                  {initials}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-base font-semibold">{stand.company}</p>
                  <div className="flex flex-wrap gap-2">
                    {stand.tags.map((tag) => {
                      const color = tagPalette.find((item) => item.label === tag)?.color ?? '#94a3b8';
                      return <TagChip key={tag} label={tag} color={color} />;
                    })}
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-semibold hover:border-cyan-400/60 transition"
                  onClick={onEditStand}
                >
                  Edit
                </button>
              </article>
            );
          })
        ) : (
          <div className="text-sm text-center text-slate-400 py-6 rounded-xl border border-dashed border-slate-800">
            No stands match that filter yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
