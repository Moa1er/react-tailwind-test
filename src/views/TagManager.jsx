import TagChip from '../components/TagChip.jsx';

const TagManager = ({ tags, onAddTag }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Global</p>
          <h2 className="text-lg font-semibold">Tag Manager</h2>
        </div>
        <button
          type="button"
          onClick={onAddTag}
          className="rounded-xl border border-dashed border-cyan-400/60 bg-slate-900/40 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/10"
        >
          + Add Tag
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3 space-y-2"
          >
            <TagChip label={tag.label} color={tag.color} />
            <p className="text-xs text-slate-400">{tag.color}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Use tags to quickly label stands and projects. Future iterations will sync these with the stand editor chips.
      </p>
    </div>
  );
};

export default TagManager;
