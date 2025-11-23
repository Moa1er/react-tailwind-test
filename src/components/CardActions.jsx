const CardActions = ({ onSetActive, onEdit, onArchive }) => {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-200">
      <button
        type="button"
        className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition"
        onClick={onSetActive}
      >
        Set Active
      </button>
      <button
        type="button"
        className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition"
        onClick={onEdit}
      >
        Edit
      </button>
      <button
        type="button"
        className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition"
        onClick={onArchive}
      >
        Archive
      </button>
    </div>
  );
};

export default CardActions;
