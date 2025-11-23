import CardActions from '../components/CardActions.jsx';
import TagChip from '../components/TagChip.jsx';

const Dashboard = ({
  statusStyles,
  searchTerm,
  onSearchChange,
  projects,
  selectedProjectId,
  onSelectProject,
  onSetActive,
  onEdit,
  onArchive,
  tagPalette,
}) => {
  return (
    <div className="space-y-5">
      <div className="bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-800 shadow-lg">
        <div className="p-4 border-b border-slate-800">
          <label className="text-sm text-slate-300 font-medium" htmlFor="project-search">
            Search projects
          </label>
          <div className="mt-2 flex items-center gap-2 bg-slate-800/70 rounded-xl px-3 py-2 border border-slate-700 focus-within:border-cyan-400/60">
            <span className="text-slate-400 text-sm">🔍</span>
            <input
              id="project-search"
              className="w-full bg-transparent outline-none text-sm placeholder:text-slate-500"
              placeholder="Name, location, or tag"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>
        <div className="p-4 space-y-3">
          {projects.length ? (
            projects.map((project) => (
              <article
                key={project.id}
                className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border p-4 shadow-lg space-y-3 transition hover:border-cyan-400/50 ${
                  project.id === selectedProjectId
                    ? 'border-cyan-400/70 shadow-cyan-500/20'
                    : 'border-slate-700/60'
                }`}
                onClick={() => onSelectProject(project.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    <p className="text-sm text-slate-300">{project.location}</p>
                    <p className="text-xs text-slate-500">{project.dates}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      statusStyles[project.status] ?? 'bg-slate-700 text-slate-200 border-slate-600'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => {
                    const tagColor = tagPalette.find((item) => item.label === tag)?.color ?? '#94a3b8';
                    return <TagChip key={tag} label={tag} color={tagColor} />;
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    {project.stands.length} stands
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
                    Tags: {project.tags.length}
                  </span>
                </div>
                <CardActions
                  onSetActive={() => onSetActive(project.id)}
                  onEdit={() => onEdit(project.id)}
                  onArchive={() => onArchive(project.id)}
                />
              </article>
            ))
          ) : (
            <div className="text-sm text-center text-slate-400 py-6">No projects match that search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
