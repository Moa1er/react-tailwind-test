import React, { useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './views/Dashboard.jsx';
import ProjectView from './views/ProjectView.jsx';
import StandEditor from './views/StandEditor.jsx';
import TagManager from './views/TagManager.jsx';
import ExportView from './views/ExportView.jsx';
import Toast from './components/Toast.jsx';

const VIEWS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'project', label: 'Project View', icon: '📂' },
  { id: 'standEditor', label: 'Stand Editor', icon: '✏️' },
  { id: 'tagManager', label: 'Tag Manager', icon: '🏷️' },
  { id: 'export', label: 'Export', icon: '⬇️' },
];

const STATUS_STYLES = {
  Active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  Planning: 'bg-amber-500/15 text-amber-200 border-amber-500/40',
  Archived: 'bg-slate-500/20 text-slate-200 border-slate-500/40',
};

const INITIAL_TAGS = [
  { id: 't1', label: 'Sustainability', color: '#22d3ee' },
  { id: 't2', label: 'Innovation', color: '#a855f7' },
  { id: 't3', label: 'VR/AR', color: '#f97316' },
  { id: 't4', label: 'Hospitality', color: '#34d399' },
  { id: 't5', label: 'Retail', color: '#facc15' },
];

const INITIAL_PROJECTS = [
  {
    id: 'expo-1',
    name: 'Future Mobility Expo',
    location: 'Berlin, Germany',
    dates: 'May 12 - 15, 2024',
    status: 'Active',
    tags: ['Sustainability', 'Innovation'],
    stands: [
      { id: 's1', company: 'AeroDynamics', tags: ['VR/AR'] },
      { id: 's2', company: 'VoltRide', tags: ['Innovation'] },
    ],
  },
  {
    id: 'expo-2',
    name: 'Luxury Hospitality Summit',
    location: 'Dubai, UAE',
    dates: 'June 02 - 05, 2024',
    status: 'Planning',
    tags: ['Hospitality', 'Retail'],
    stands: [
      { id: 's3', company: 'Oasis Living', tags: ['Hospitality'] },
      { id: 's4', company: 'Skyline Interiors', tags: ['Retail'] },
    ],
  },
  {
    id: 'expo-3',
    name: 'Immersive Tech Fair',
    location: 'Austin, USA',
    dates: 'July 18 - 20, 2024',
    status: 'Archived',
    tags: ['VR/AR', 'Innovation'],
    stands: [
      { id: 's5', company: 'VisionGrid', tags: ['VR/AR'] },
      { id: 's6', company: 'HoloBay', tags: ['Innovation'] },
    ],
  },
];

const INITIAL_STAND_FORM = {
  companyName: 'AeroDynamics',
  productRef: 'AD-204',
  description: 'Premium modular booth showcasing our latest aerodynamic components with interactive demos.',
  pros: ['Lightweight modular walls', 'Immersive VR demo corner', 'Quick assembly crew'],
  cons: ['Limited storage space', 'Power drop far from entry'],
  photos: [
    { id: 'p1', label: 'Hero Render', color: '#22d3ee' },
    { id: 'p2', label: 'VR Pod', color: '#a855f7' },
    { id: 'p3', label: 'Lighting Plan', color: '#f97316' },
  ],
  contacts: [
    {
      id: 'contact-1',
      name: 'Lena Fischer',
      role: 'Marketing Lead',
      email: 'lena.fischer@aerodynamics.io',
      phone: '+49 30 1234 987',
    },
    {
      id: 'contact-2',
      name: 'Samir Patel',
      role: 'Partnerships',
      email: 'samir.patel@aerodynamics.io',
      phone: '+1 737 555 2299',
    },
  ],
};

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [standSearch, setStandSearch] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState('expo-1');
  const [globalTags, setGlobalTags] = useState(INITIAL_TAGS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [standForm, setStandForm] = useState(INITIAL_STAND_FORM);
  const [contactsOpen, setContactsOpen] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState('');
  const photoInputRef = useRef(null);

  const getPaletteColor = () => {
    const palette = globalTags.map((tag) => tag.color);
    return palette[Math.floor(Math.random() * palette.length)] ?? '#22d3ee';
  };

  const handleSetActive = (projectId) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, status: 'Active' }
          : project.status === 'Active'
            ? { ...project, status: 'Planning' }
            : project
      )
    );
    setSelectedProjectId(projectId);
  };

  const handleArchive = (projectId) => {
    setProjects((prev) => prev.map((project) => (project.id === projectId ? { ...project, status: 'Archived' } : project)));
    setSelectedProjectId(projectId);
  };

  const handleEdit = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveView('standEditor');
  };

  const handleNewProject = () => {
    const now = new Date();
    const newId = `project-${now.getTime()}`;
    const today = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const defaultTags = globalTags.slice(0, 2).map((tag) => tag.label);

    const newProject = {
      id: newId,
      name: 'Untitled Project',
      location: 'Set location',
      dates: today,
      status: 'Planning',
      tags: defaultTags,
      stands: [],
    };

    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newId);
    setActiveView('project');
  };

  const filteredProjects = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return projects;
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(value) ||
        project.location.toLowerCase().includes(value) ||
        project.tags.some((tag) => tag.toLowerCase().includes(value))
    );
  }, [projects, searchTerm]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0],
    [projects, selectedProjectId]
  );

  const standFilterTags = useMemo(() => {
    if (!selectedProject) return [];
    const tagSet = new Set(selectedProject.tags);
    selectedProject.stands.forEach((stand) => stand.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [selectedProject]);

  useEffect(() => {
    setStandSearch('');
    setActiveTagFilter('All');
  }, [selectedProjectId]);

  const filteredStands = useMemo(() => {
    if (!selectedProject) return [];
    const value = standSearch.trim().toLowerCase();
    return selectedProject.stands.filter((stand) => {
      const matchesSearch = value
        ? stand.company.toLowerCase().includes(value) || stand.tags.some((tag) => tag.toLowerCase().includes(value))
        : true;
      const matchesTag = activeTagFilter === 'All' ? true : stand.tags.some((tag) => tag === activeTagFilter);
      return matchesSearch && matchesTag;
    });
  }, [activeTagFilter, selectedProject, standSearch]);

  const updateStandField = (field, value) => {
    setStandForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateContact = (id, field, value) => {
    setStandForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact) => (contact.id === id ? { ...contact, [field]: value } : contact)),
    }));
  };

  const addContact = () => {
    const timestamp = Date.now();
    setStandForm((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { id: `contact-${timestamp}`, name: '', role: '', email: '', phone: '' }],
    }));
  };

  const removeContact = (id) => {
    setStandForm((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((contact) => contact.id !== id),
    }));
  };

  const addListItem = (field) => {
    setStandForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] ?? []), ''],
    }));
  };

  const updateListItem = (field, index, value) => {
    setStandForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const removeListItem = (field, index) => {
    setStandForm((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updated };
    });
  };

  const handleAddPhoto = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
      return;
    }
    const id = `photo-${Date.now()}`;
    setStandForm((prev) => ({
      ...prev,
      photos: [...prev.photos, { id, label: 'New Capture', color: getPaletteColor() }],
    }));
  };

  const handlePhotoSelected = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const id = `photo-${Date.now()}-${index}`;
        setStandForm((prev) => ({
          ...prev,
          photos: [
            ...prev.photos,
            {
              id,
              label: file.name || 'New Capture',
              color: getPaletteColor(),
              preview: typeof reader.result === 'string' ? reader.result : undefined,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  };

  const removePhoto = (id) => {
    setStandForm((prev) => ({ ...prev, photos: prev.photos.filter((photo) => photo.id !== id) }));
  };

  const mockAiData = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('apple')) {
      return {
        description:
          'Premium experience booth highlighting iPhone lineup with hands-on camera demos, iOS tips bar, and sustainability messaging.',
        pros: ['Instant brand recognition', 'Staff trained on Pro camera tips', 'High dwell time near demo bar'],
        cons: ['Requires strong Wi-Fi for iCloud demos', 'High security staffing needs'],
      };
    }
    if (lower.includes('volt') || lower.includes('ride')) {
      return {
        description: 'EV mobility corner with test-drive simulators, modular charging showcase, and bold neon edge lighting.',
        pros: ['Immersive simulator attracts queues', 'Clear sustainability storytelling', 'Scalable footprint'],
        cons: ['Simulator needs extra power', 'Queue management barriers required'],
      };
    }
    return {
      description:
        'Engaging stand featuring interactive demos, tactile product displays, and a concise value narrative tailored to visitors.',
      pros: ['Clear messaging hierarchy', 'Hands-on product zones', 'Staff rotation schedule defined'],
      cons: ['Pending AV vendor confirmation', 'Need final safety sign-off'],
    };
  };

  const handleGenerateAi = () => {
    if (aiLoading) return;
    setAiLoading(true);
    setToast('');
    setTimeout(() => {
      const aiData = mockAiData(standForm.companyName || '');
      setStandForm((prev) => ({
        ...prev,
        description: aiData.description,
        pros: aiData.pros,
        cons: aiData.cons,
      }));
      setAiLoading(false);
      setToast('AI suggestions applied successfully.');
      setTimeout(() => setToast(''), 2500);
    }, 2000);
  };

  const handleAddTag = () => {
    const id = `tag-${Date.now()}`;
    const palette = ['#22d3ee', '#a855f7', '#f97316', '#34d399', '#facc15'];
    const color = palette[Math.floor(Math.random() * palette.length)];
    setGlobalTags((prev) => [...prev, { id, label: `Tag ${prev.length + 1}`, color }]);
  };

  const renderView = () => {
    if (activeView === 'dashboard') {
      return (
        <Dashboard
          statusStyles={STATUS_STYLES}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          projects={filteredProjects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onSetActive={handleSetActive}
          onEdit={handleEdit}
          onArchive={handleArchive}
          tagPalette={globalTags}
        />
      );
    }

    if (activeView === 'project') {
      return (
        <ProjectView
          project={selectedProject}
          standSearch={standSearch}
          onStandSearch={setStandSearch}
          tagFilter={activeTagFilter}
          onTagFilterChange={setActiveTagFilter}
          availableTags={standFilterTags}
          stands={filteredStands}
          tagPalette={globalTags}
          onEditStand={() => setActiveView('standEditor')}
        />
      );
    }

    if (activeView === 'standEditor') {
      return (
        <StandEditor
          standForm={standForm}
          onFieldChange={updateStandField}
          onGenerateAi={handleGenerateAi}
          aiLoading={aiLoading}
          onAddListItem={addListItem}
          onUpdateListItem={updateListItem}
          onRemoveListItem={removeListItem}
          contactsOpen={contactsOpen}
          onToggleContacts={() => setContactsOpen((prev) => !prev)}
          onAddContact={addContact}
          onRemoveContact={removeContact}
          onUpdateContact={updateContact}
          onAddPhoto={handleAddPhoto}
          onPhotoSelected={handlePhotoSelected}
          onRemovePhoto={removePhoto}
          photoInputRef={photoInputRef}
        />
      );
    }

    if (activeView === 'tagManager') {
      return <TagManager tags={globalTags} onAddTag={handleAddTag} />;
    }

    if (activeView === 'export') {
      return <ExportView project={selectedProject} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <Sidebar
            views={VIEWS}
            activeView={activeView}
            onViewChange={setActiveView}
            onNewProject={handleNewProject}
          />

          <main className="flex-1 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4 shadow-xl shadow-slate-950/60">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Current Project</p>
                  <h2 className="text-xl font-semibold">{selectedProject?.name ?? 'No project selected'}</h2>
                  <p className="text-xs text-slate-400">{selectedProject?.location ?? 'Choose a project to begin'}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>{selectedProject?.dates}</p>
                  <p className="mt-1">{selectedProject?.tags.join(', ')}</p>
                </div>
              </div>
            </div>

            {renderView()}
          </main>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
};

export default App;
