const ExportView = ({ project }) => {
  if (!project) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 shadow-lg text-sm text-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Delivery</p>
          <h2 className="text-lg font-semibold">Export Center</h2>
        </div>
        <span className="text-xs text-slate-400">{project.stands.length} stands</span>
      </div>
      <p className="text-slate-400">
        Prepare booth briefs, export gallery assets, and send a summary PDF to vendors. This placeholder keeps the layout ready
        for future integration.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs text-slate-400">Project</p>
          <p className="font-semibold">{project.name}</p>
          <p className="text-xs text-slate-500">{project.location}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs text-slate-400">Dates</p>
          <p className="font-semibold">{project.dates}</p>
          <p className="text-xs text-slate-500">Tags: {project.tags.join(', ')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs text-slate-400">Next Steps</p>
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400">
            <li>Finalize booth drawings</li>
            <li>Confirm AV vendor</li>
            <li>Send PDF summary</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExportView;
