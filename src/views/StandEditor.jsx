import TagChip from '../components/TagChip.jsx';

const ListEditor = ({
  title,
  eyebrow,
  items,
  color,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{eyebrow}</p>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className={`h-2 w-2 rounded-full`} style={{ backgroundColor: color }} />
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex items-start gap-2">
            <span className="mt-2 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <textarea
              value={item}
              onChange={(event) => onUpdate(index, event.target.value)}
              rows={2}
              className="flex-1 rounded-xl bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 resize-none border border-slate-200"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-xs text-slate-500 hover:text-red-500 px-2 py-1 rounded-lg border border-transparent hover:border-red-200"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="w-full rounded-xl border border-dashed border-cyan-300/50 text-cyan-200 px-4 py-2 text-sm font-semibold hover:bg-cyan-500/10 transition"
        >
          + Add item
        </button>
      </div>
    </div>
  );
};

const Contacts = ({ contacts, isOpen, onToggle, onAdd, onRemove, onUpdate }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-4 shadow-lg shadow-slate-950/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Project</p>
          <h2 className="text-lg font-semibold">Contacts</h2>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs text-slate-300 rounded-full border border-slate-700 px-3 py-1"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>
      {isOpen ? (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3 shadow-inner space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{contact.name || 'New contact'}</p>
                <button
                  type="button"
                  onClick={() => onRemove(contact.id)}
                  className="text-xs text-slate-500 hover:text-red-500 px-2 py-1 rounded-lg border border-transparent hover:border-red-200"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  value={contact.name}
                  onChange={(event) => onUpdate(contact.id, 'name', event.target.value)}
                  placeholder="Name"
                  className="w-full rounded-xl bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200"
                />
                <input
                  value={contact.role}
                  onChange={(event) => onUpdate(contact.id, 'role', event.target.value)}
                  placeholder="Role / Responsibility"
                  className="w-full rounded-xl bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200"
                />
                <input
                  value={contact.email}
                  onChange={(event) => onUpdate(contact.id, 'email', event.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200"
                />
                <input
                  value={contact.phone}
                  onChange={(event) => onUpdate(contact.id, 'phone', event.target.value)}
                  placeholder="Phone"
                  className="w-full rounded-xl bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={onAdd}
            className="w-full rounded-xl border border-dashed border-cyan-300/50 text-cyan-200 px-4 py-2 text-sm font-semibold hover:bg-cyan-500/10 transition"
          >
            + Add Contact
          </button>
        </div>
      ) : null}
    </div>
  );
};

const PhotoRail = ({ photos, onAddPhoto, onPhotoSelected, onRemovePhoto, fileInputRef, cameraInputRef }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 shadow-lg shadow-slate-950/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Assets</p>
          <h2 className="text-lg font-semibold">Photo Gallery</h2>
        </div>
        <span className="text-xs text-slate-400">{photos.length} items</span>
      </div>
      <p className="text-xs text-slate-400">Capture directly from your camera or upload from your files. Previews appear immediately after selection.</p>
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onPhotoSelected}
          multiple={false}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPhotoSelected}
          multiple
        />
        <button
          type="button"
          onClick={() => onAddPhoto('camera')}
          className="flex-none h-24 w-24 rounded-2xl border-2 border-dashed border-cyan-300/60 text-cyan-200 flex items-center justify-center text-sm font-semibold bg-slate-900/80 hover:bg-cyan-500/5"
        >
          📷 Use Camera
        </button>
        <button
          type="button"
          onClick={() => onAddPhoto('file')}
          className="flex-none h-24 w-24 rounded-2xl border-2 border-dashed border-slate-400/60 text-slate-100 flex items-center justify-center text-sm font-semibold bg-slate-900/80 hover:bg-slate-700/60"
        >
          📁 Upload Files
        </button>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative flex-none h-24 w-24 rounded-2xl border border-slate-700 bg-slate-800 overflow-hidden shadow-inner"
            style={{ backgroundColor: `${photo.color}22`, borderColor: `${photo.color}55` }}
          >
            {photo.preview ? (
              <img src={photo.preview} alt={photo.label} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-200">
                {photo.label}
              </div>
            )}
            <button
              type="button"
              onClick={() => onRemovePhoto(photo.id)}
              className="absolute top-1 right-1 rounded-full bg-slate-900/80 border border-slate-700 px-2 text-[10px] text-slate-200"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const StandEditor = ({
  standForm,
  onFieldChange,
  onGenerateAi,
  aiLoading,
  onAddListItem,
  onUpdateListItem,
  onRemoveListItem,
  contactsOpen,
  onToggleContacts,
  onAddContact,
  onRemoveContact,
  onUpdateContact,
  onAddPhoto,
  onPhotoSelected,
  onRemovePhoto,
  fileInputRef,
  cameraInputRef,
}) => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-4 shadow-lg shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Stand</p>
            <h2 className="text-lg font-semibold">Basic Info</h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">Step 1</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
          <p>Speed up with AI suggestions</p>
          <button
            type="button"
            onClick={onGenerateAi}
            disabled={aiLoading}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold border border-cyan-300/60 text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {aiLoading ? 'Generating…' : 'Generate with AI'}
          </button>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-slate-200 font-medium" htmlFor="companyName">
              Company Name
            </label>
            <input
              id="companyName"
              value={standForm.companyName}
              onChange={(event) => onFieldChange('companyName', event.target.value)}
              className="w-full rounded-xl bg-slate-100 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter company name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200 font-medium" htmlFor="productRef">
              Product Ref
            </label>
            <input
              id="productRef"
              value={standForm.productRef}
              onChange={(event) => onFieldChange('productRef', event.target.value)}
              className="w-full rounded-xl bg-slate-100 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Internal reference"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200 font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={standForm.description}
              onChange={(event) => onFieldChange('description', event.target.value)}
              className="w-full rounded-xl bg-slate-100 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              placeholder="Describe the stand goals, layout, and highlights"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-4 shadow-lg shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Stand</p>
            <h2 className="text-lg font-semibold">Pros & Cons</h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
            Pros
            <span className="h-2 w-2 rounded-full bg-rose-400 inline-block" />
            Cons
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ListEditor
            title="Pros"
            eyebrow="Strengths"
            items={standForm.pros}
            color="#10b981"
            onAdd={() => onAddListItem('pros')}
            onUpdate={(index, value) => onUpdateListItem('pros', index, value)}
            onRemove={(index) => onRemoveListItem('pros', index)}
          />
          <ListEditor
            title="Cons"
            eyebrow="Risks"
            items={standForm.cons}
            color="#f43f5e"
            onAdd={() => onAddListItem('cons')}
            onUpdate={(index, value) => onUpdateListItem('cons', index, value)}
            onRemove={(index) => onRemoveListItem('cons', index)}
          />
        </div>
      </div>

      <Contacts
        contacts={standForm.contacts}
        isOpen={contactsOpen}
        onToggle={onToggleContacts}
        onAdd={onAddContact}
        onRemove={onRemoveContact}
        onUpdate={onUpdateContact}
      />

      <PhotoRail
        photos={standForm.photos}
        onAddPhoto={onAddPhoto}
        onPhotoSelected={onPhotoSelected}
        onRemovePhoto={onRemovePhoto}
        fileInputRef={fileInputRef}
        cameraInputRef={cameraInputRef}
      />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 shadow-lg shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Tags</p>
            <h2 className="text-lg font-semibold">Stand Tags</h2>
          </div>
          <span className="text-xs text-slate-400">Attach quick labels</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {standForm.pros.slice(0, 3).map((item, index) => (
            <TagChip key={`tag-${index}`} label={item || 'Tag'} color="#22d3ee" />
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Tag selection is a placeholder for future integration with the global tag manager.
        </p>
      </div>
    </div>
  );
};

export default StandEditor;
