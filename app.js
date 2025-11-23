import React, { useEffect, useMemo, useRef, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

const e = React.createElement;

const views = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'project', label: 'Project View', icon: '📂' },
  { id: 'standEditor', label: 'Stand Editor', icon: '✏️' },
  { id: 'tagManager', label: 'Tag Manager', icon: '🏷️' },
  { id: 'export', label: 'Export', icon: '⬇️' },
];

const statusStyles = {
  Active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  Planning: 'bg-amber-500/15 text-amber-200 border-amber-500/40',
  Archived: 'bg-slate-500/20 text-slate-200 border-slate-500/40',
};

const TagChip = ({ label, color }) =>
  e(
    'span',
    {
      className: 'px-3 py-1 rounded-full text-xs font-medium border',
      style: {
        backgroundColor: `${color}22`,
        color,
        borderColor: `${color}44`,
      },
    },
    label
  );

const CardActions = ({ onSetActive, onEdit, onArchive }) =>
  e(
    'div',
    { className: 'flex items-center gap-2 text-xs text-slate-200' },
    [
      e(
        'button',
        {
          key: 'set',
          className:
            'px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition',
          type: 'button',
          onClick: onSetActive,
        },
        'Set Active'
      ),
      e(
        'button',
        {
          key: 'edit',
          className:
            'px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition',
          type: 'button',
          onClick: onEdit,
        },
        'Edit'
      ),
      e(
        'button',
        {
          key: 'archive',
          className:
            'px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition',
          type: 'button',
          onClick: onArchive,
        },
        'Archive'
      ),
    ]
  );

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('expo-1');
  const [standSearch, setStandSearch] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState('All');
  const [globalTags] = useState([
    { id: 't1', label: 'Sustainability', color: '#22d3ee' },
    { id: 't2', label: 'Innovation', color: '#a855f7' },
    { id: 't3', label: 'VR/AR', color: '#f97316' },
    { id: 't4', label: 'Hospitality', color: '#34d399' },
    { id: 't5', label: 'Retail', color: '#facc15' },
  ]);
  const [projects, setProjects] = useState([
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
  ]);

  const [standForm, setStandForm] = useState({
    companyName: 'AeroDynamics',
    productRef: 'AD-204',
    description:
      'Premium modular booth showcasing our latest aerodynamic components with interactive demos.',
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
  });
  const [contactsOpen, setContactsOpen] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState('');
  const photoInputRef = useRef(null);

  const getPaletteColor = () => {
    const palette = ['#22d3ee', '#a855f7', '#f97316', '#34d399', '#facc15'];
    return palette[Math.floor(Math.random() * palette.length)];
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
    setProjects((prev) =>
      prev.map((project) => (project.id === projectId ? { ...project, status: 'Archived' } : project))
    );
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
        ? stand.company.toLowerCase().includes(value) ||
          stand.tags.some((tag) => tag.toLowerCase().includes(value))
        : true;
      const matchesTag =
        activeTagFilter === 'All' ? true : stand.tags.some((tag) => tag === activeTagFilter);
      return matchesSearch && matchesTag;
    });
  }, [activeTagFilter, selectedProject, standSearch]);

  const updateStandField = (field, value) => {
    setStandForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateContact = (id, field, value) => {
    setStandForm((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  const addContact = () => {
    const timestamp = Date.now();
    setStandForm((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        { id: `contact-${timestamp}`, name: '', role: '', email: '', phone: '' },
      ],
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

  const addPhotoPlaceholder = () => {
    const id = `photo-${Date.now()}`;
    const color = getPaletteColor();
    setStandForm((prev) => ({
      ...prev,
      photos: [...prev.photos, { id, label: 'New Capture', color }],
    }));
  };

  const handleAddPhoto = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
      return;
    }
    addPhotoPlaceholder();
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
        description:
          'EV mobility corner with test-drive simulators, modular charging showcase, and bold neon edge lighting.',
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

  const renderDashboard = () =>
    e(
      'div',
      { className: 'space-y-5' },
      e(
        'div',
        { className: 'bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-800 shadow-lg' },
        [
          e(
            'div',
            { key: 'search', className: 'p-4 border-b border-slate-800' },
            [
              e(
                'label',
                { className: 'text-sm text-slate-300 font-medium', htmlFor: 'project-search' },
                'Search projects'
              ),
              e(
                'div',
                {
                  className:
                    'mt-2 flex items-center gap-2 bg-slate-800/70 rounded-xl px-3 py-2 border border-slate-700 focus-within:border-cyan-400/60',
                },
                [
                  e('span', { key: 'icon', className: 'text-slate-400 text-sm' }, '🔍'),
                  e('input', {
                    key: 'input',
                    id: 'project-search',
                    className: 'w-full bg-transparent outline-none text-sm placeholder:text-slate-500',
                    placeholder: 'Name, location, or tag',
                    value: searchTerm,
                    onChange: (event) => setSearchTerm(event.target.value),
                  }),
                ]
              ),
            ]
          ),
          e(
            'div',
            { key: 'cards', className: 'p-4 space-y-3' },
            filteredProjects.length
              ? filteredProjects.map((project) =>
                  e(
                    'article',
                    {
                      key: project.id,
                      className: `bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border p-4 shadow-lg space-y-3 transition hover:border-cyan-400/50 ${
                        project.id === selectedProjectId
                          ? 'border-cyan-400/70 shadow-cyan-500/20'
                          : 'border-slate-700/60'
                      }`,
                      onClick: () => setSelectedProjectId(project.id),
                    },
                    [
                      e(
                        'div',
                        { key: 'head', className: 'flex items-start justify-between gap-3' },
                        [
                          e(
                            'div',
                            { key: 'title', className: 'space-y-1' },
                            [
                              e('h3', { key: 'name', className: 'text-lg font-semibold text-white' }, project.name),
                              e('p', { key: 'loc', className: 'text-sm text-slate-300' }, project.location),
                              e('p', { key: 'date', className: 'text-xs text-slate-500' }, project.dates),
                            ]
                          ),
                          e(
                            'span',
                            {
                              key: 'status',
                              className: `px-3 py-1 rounded-full text-xs font-semibold border ${
                                statusStyles[project.status] ?? 'bg-slate-700 text-slate-200 border-slate-600'
                              }`,
                            },
                            project.status
                          ),
                        ]
                      ),
                      e(
                        'div',
                        { key: 'tags', className: 'flex flex-wrap gap-2' },
                        project.tags.map((tag) => {
                          const tagColor = globalTags.find((item) => item.label === tag)?.color ?? '#94a3b8';
                          return e(TagChip, { key: tag, label: tag, color: tagColor });
                        })
                      ),
                      e(
                        'div',
                        { key: 'meta', className: 'flex items-center justify-between text-xs text-slate-400' },
                        [
                          e(
                            'span',
                            { key: 'stands', className: 'flex items-center gap-2' },
                            [
                              e('span', { key: 'dot1', className: 'h-2 w-2 rounded-full bg-cyan-400' }),
                              `${project.stands.length} stands`,
                            ]
                          ),
                          e(
                            'span',
                            { key: 'tags-count', className: 'flex items-center gap-2' },
                            [
                              e('span', { key: 'dot2', className: 'h-2 w-2 rounded-full bg-fuchsia-400' }),
                              `Tags: ${project.tags.length}`,
                            ]
                          ),
                        ]
                      ),
                      e(CardActions, {
                        key: 'actions',
                        onSetActive: () => handleSetActive(project.id),
                        onEdit: () => handleEdit(project.id),
                        onArchive: () => handleArchive(project.id),
                      }),
                    ]
                  )
                )
              : e(
                  'div',
                  { className: 'text-sm text-center text-slate-400 py-6' },
                  'No projects match that search.'
                )
          ),
        ]
      ),
      e(
        'div',
        { className: 'grid grid-cols-2 gap-2 text-xs text-slate-400' },
        [
          e('div', { key: 'ui', className: 'p-3 rounded-xl border border-slate-800 bg-slate-900/80' }, 'Swipe-ready UI'),
          e(
            'div',
            { key: 'touch', className: 'p-3 rounded-xl border border-slate-800 bg-slate-900/80' },
            'Touch-friendly spacing'
          ),
        ]
      )
    );

  const renderProjectDetail = () => {
    if (!selectedProject) return null;

    return e(
      'div',
      { className: 'space-y-4' },
      [
        e(
          'div',
          {
            key: 'header',
            className:
              'rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-lg space-y-4',
          },
          [
            e(
              'div',
              { key: 'title', className: 'flex items-start justify-between gap-3' },
              [
                e(
                  'div',
                  { key: 'info', className: 'space-y-1' },
                  [
                    e('p', { key: 'eyebrow', className: 'text-xs text-cyan-300 uppercase tracking-[0.3em]' }, 'Project'),
                    e('h2', { key: 'name', className: 'text-xl font-semibold' }, selectedProject.name),
                    e('p', { key: 'loc', className: 'text-sm text-slate-400' }, selectedProject.location),
                  ]
                ),
                e(
                  'span',
                  {
                    key: 'status',
                    className: `px-3 py-1 rounded-full text-xs font-semibold border ${
                      statusStyles[selectedProject.status] ?? 'bg-slate-700 text-slate-200 border-slate-600'
                    }`,
                  },
                  selectedProject.status
                ),
              ]
            ),
            e(
              'div',
              { key: 'stats', className: 'grid grid-cols-3 gap-3 text-center text-sm text-slate-300' },
              [
                e(
                  'div',
                  {
                    key: 'stands',
                    className: 'rounded-xl border border-slate-800 bg-slate-900/70 py-3 shadow-inner shadow-cyan-500/10',
                  },
                  [
                    e('p', { key: 'label', className: 'text-xs text-slate-400' }, 'Stands'),
                    e('p', { key: 'value', className: 'text-lg font-semibold text-cyan-300' }, selectedProject.stands.length),
                  ]
                ),
                e(
                  'div',
                  {
                    key: 'tags',
                    className: 'rounded-xl border border-slate-800 bg-slate-900/70 py-3 shadow-inner shadow-fuchsia-500/10',
                  },
                  [
                    e('p', { key: 'label', className: 'text-xs text-slate-400' }, 'Tags'),
                    e('p', { key: 'value', className: 'text-lg font-semibold text-fuchsia-300' }, standFilterTags.length),
                  ]
                ),
                e(
                  'div',
                  {
                    key: 'dates',
                    className: 'rounded-xl border border-slate-800 bg-slate-900/70 py-3 shadow-inner shadow-emerald-500/10',
                  },
                  [
                    e('p', { key: 'label', className: 'text-xs text-slate-400' }, 'Dates'),
                    e('p', { key: 'value', className: 'text-sm font-semibold text-emerald-200' }, selectedProject.dates),
                  ]
                ),
              ]
            ),
          ]
        ),
        e(
          'div',
          { key: 'filters', className: 'rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 shadow-lg' },
          [
            e('p', { key: 'label', className: 'text-xs uppercase tracking-[0.2em] text-slate-400' }, 'Filter by Tag'),
            e(
              'div',
              { key: 'chips', className: 'flex gap-2 overflow-x-auto pb-1' },
              [
                e(
                  'button',
                  {
                    key: 'all',
                    type: 'button',
                    className: `px-3 py-2 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
                      activeTagFilter === 'All'
                        ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`,
                    onClick: () => setActiveTagFilter('All'),
                  },
                  'All'
                ),
                ...standFilterTags.map((tag) => {
                  const color = globalTags.find((item) => item.label === tag)?.color ?? '#94a3b8';
                  const isActive = activeTagFilter === tag;
                  return e(
                    'button',
                    {
                      key: tag,
                      type: 'button',
                      className: `flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/60'
                          : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500'
                      }`,
                      onClick: () => setActiveTagFilter(tag),
                    },
                    [
                      e('span', {
                        key: 'dot',
                        className: 'h-2.5 w-2.5 rounded-full',
                        style: { backgroundColor: color },
                      }),
                      tag,
                    ]
                  );
                }),
              ]
            ),
          ]
        ),
        e(
          'div',
          { key: 'search', className: 'rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg' },
          [
            e(
              'label',
              { className: 'text-sm text-slate-300 font-medium', htmlFor: 'stand-search' },
              'Search stands'
            ),
            e(
              'div',
              {
                className:
                  'mt-2 flex items-center gap-2 bg-slate-800/70 rounded-xl px-3 py-2 border border-slate-700 focus-within:border-cyan-400/60',
              },
              [
                e('span', { key: 'icon', className: 'text-slate-400 text-sm' }, '🔍'),
                e('input', {
                  key: 'input',
                  id: 'stand-search',
                  className: 'w-full bg-transparent outline-none text-sm placeholder:text-slate-500',
                  placeholder: 'Stand name or tag',
                  value: standSearch,
                  onChange: (event) => setStandSearch(event.target.value),
                }),
              ]
            ),
          ]
        ),
        e(
          'div',
          { key: 'stands', className: 'space-y-3' },
          filteredStands.length
            ? filteredStands.map((stand) => {
                const initials = stand.company
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();
                return e(
                  'article',
                  {
                    key: stand.id,
                    className:
                      'flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg hover:border-cyan-400/50 transition',
                  },
                  [
                    e(
                      'div',
                      {
                        key: 'thumb',
                        className:
                          'h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 border border-slate-700 flex items-center justify-center text-lg font-bold text-white',
                      },
                      initials
                    ),
                    e(
                      'div',
                      { key: 'info', className: 'flex-1 space-y-2' },
                      [
                        e('p', { key: 'name', className: 'text-base font-semibold' }, stand.company),
                        e(
                          'div',
                          { key: 'tags', className: 'flex flex-wrap gap-2' },
                          stand.tags.map((tag) => {
                            const color = globalTags.find((item) => item.label === tag)?.color ?? '#94a3b8';
                            return e(TagChip, { key: tag, label: tag, color });
                          })
                        ),
                      ]
                    ),
                    e(
                      'button',
                      {
                        key: 'edit',
                        type: 'button',
                        className:
                          'px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-semibold hover:border-cyan-400/60 transition',
                        onClick: () => setActiveView('standEditor'),
                      },
                      'Edit'
                    ),
                  ]
                );
              })
            : e(
                'div',
                { className: 'text-sm text-center text-slate-400 py-6 rounded-xl border border-dashed border-slate-800' },
                'No stands match that filter yet.'
              )
        ),
      ]
    );
  };

  const renderPlaceholder = (label) =>
    e(
      'div',
      { className: 'rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center text-slate-300 space-y-2' },
      [
        e('p', { key: 'title', className: 'font-semibold text-white' }, label),
        e('p', { key: 'subtitle', className: 'text-sm text-slate-400' }, 'Build steps coming soon.'),
        selectedProject
          ? e(
              'p',
              { key: 'selected', className: 'text-xs text-slate-500' },
              `Selected project: ${selectedProject.name}`
            )
          : null,
      ]
    );

  const renderStandEditor = () =>
    e(
      'div',
      { className: 'space-y-5' },
      [
        e(
          'div',
          {
            key: 'basic-info',
            className:
              'rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-4 shadow-lg shadow-slate-950/40',
          },
          [
            e(
              'div',
              { key: 'header', className: 'flex items-center justify-between' },
              [
                e('div', { key: 'title' }, [
                  e('p', { key: 'eyebrow', className: 'text-xs uppercase tracking-[0.2em] text-cyan-300' }, 'Stand'),
                  e('h2', { key: 'heading', className: 'text-lg font-semibold' }, 'Basic Info'),
                ]),
                e(
                  'span',
                  { key: 'pill', className: 'px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700' },
                  'Step 1'
                ),
              ]
            ),
            e(
              'div',
              { key: 'fields', className: 'space-y-4' },
              [
                e(
                  'div',
                  { key: 'ai-row', className: 'flex items-center justify-between gap-3' },
                  [
                    e('p', { key: 'hint', className: 'text-xs text-slate-400' }, 'Speed up with AI suggestions'),
                    e(
                      'button',
                      {
                        key: 'ai-btn',
                        type: 'button',
                        onClick: handleGenerateAi,
                        disabled: aiLoading,
                        className:
                          'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold border border-cyan-300/60 text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-60 disabled:cursor-not-allowed',
                      },
                      aiLoading ? 'Generating…' : 'Generate with AI'
                    ),
                  ]
                ),
                e(
                  'div',
                  { key: 'company', className: 'space-y-2' },
                  [
                    e('label', { className: 'text-sm text-slate-200 font-medium', htmlFor: 'companyName' }, 'Company Name'),
                    e('input', {
                      id: 'companyName',
                      value: standForm.companyName,
                      onChange: (event) => updateStandField('companyName', event.target.value),
                      className:
                        'w-full rounded-xl bg-slate-100 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400',
                      placeholder: 'Enter company name',
                    }),
                  ]
                ),
                e(
                  'div',
                  { key: 'productRef', className: 'space-y-2' },
                  [
                    e('label', { className: 'text-sm text-slate-200 font-medium', htmlFor: 'productRef' }, 'Product Ref'),
                    e('input', {
                      id: 'productRef',
                      value: standForm.productRef,
                      onChange: (event) => updateStandField('productRef', event.target.value),
                      className:
                        'w-full rounded-xl bg-slate-100 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400',
                      placeholder: 'Internal reference',
                    }),
                  ]
                ),
                e(
                  'div',
                  { key: 'description', className: 'space-y-2' },
                  [
                    e('label', { className: 'text-sm text-slate-200 font-medium', htmlFor: 'description' }, 'Description'),
                    e('textarea', {
                      id: 'description',
                      rows: 4,
                      value: standForm.description,
                      onChange: (event) => updateStandField('description', event.target.value),
                      className:
                        'w-full rounded-xl bg-slate-100 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 resize-none',
                      placeholder: 'Describe the stand goals, layout, and highlights',
                    }),
                  ]
                ),
              ]
            ),
          ]
        ),
        e(
          'div',
          {
            key: 'pros-cons',
            className:
              'rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-4 shadow-lg shadow-slate-950/40',
          },
          [
            e(
              'div',
              { key: 'header', className: 'flex items-center justify-between' },
              [
                e('div', { key: 'title' }, [
                  e('p', { key: 'eyebrow', className: 'text-xs uppercase tracking-[0.2em] text-cyan-300' }, 'Stand'),
                  e('h2', { key: 'heading', className: 'text-lg font-semibold' }, 'Pros & Cons'),
                ]),
                e(
                  'div',
                  { key: 'legend', className: 'flex items-center gap-3 text-xs text-slate-400' },
                  [
                    e('span', { key: 'pro-dot', className: 'h-2 w-2 rounded-full bg-emerald-400 inline-block' }),
                    'Pros',
                    e('span', { key: 'con-dot', className: 'h-2 w-2 rounded-full bg-rose-400 inline-block' }),
                    'Cons',
                  ]
                ),
              ]
            ),
            e(
              'div',
              { key: 'lists', className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
              [
                e(
                  'div',
                  {
                    key: 'pros',
                    className:
                      'rounded-xl border border-emerald-400/40 bg-emerald-500/5 p-3 space-y-3 shadow-inner shadow-emerald-500/10',
                  },
                  [
                    e('div', { key: 'label', className: 'flex items-center justify-between' }, [
                      e('span', { key: 'title', className: 'text-sm font-semibold text-emerald-200' }, 'Pros'),
                      e(
                        'button',
                        {
                          key: 'add-pro',
                          type: 'button',
                          onClick: () => addListItem('pros'),
                          className:
                            'text-xs font-semibold text-emerald-200 px-2 py-1 rounded-lg border border-emerald-300/50 hover:bg-emerald-400/10',
                        },
                        '+ Add'
                      ),
                    ]),
                    ...standForm.pros.map((item, index) =>
                      e(
                        'div',
                        { key: `pro-${index}`, className: 'flex items-center gap-2' },
                        [
                          e('span', {
                            key: 'dot',
                            className: 'h-2 w-2 rounded-full bg-emerald-400',
                          }),
                          e('input', {
                            key: 'input',
                            value: item,
                            onChange: (event) => updateListItem('pros', index, event.target.value),
                            placeholder: 'Benefit',
                            className:
                              'flex-1 rounded-lg bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300 border border-emerald-100',
                          }),
                          e(
                            'button',
                            {
                              key: 'remove',
                              type: 'button',
                              onClick: () => removeListItem('pros', index),
                              className:
                                'text-xs text-emerald-200 px-2 py-1 rounded-lg border border-transparent hover:border-emerald-200',
                            },
                            '×'
                          ),
                        ]
                      )
                    ),
                  ]
                ),
                e(
                  'div',
                  {
                    key: 'cons',
                    className:
                      'rounded-xl border border-rose-400/40 bg-rose-500/5 p-3 space-y-3 shadow-inner shadow-rose-500/10',
                  },
                  [
                    e('div', { key: 'label', className: 'flex items-center justify-between' }, [
                      e('span', { key: 'title', className: 'text-sm font-semibold text-rose-200' }, 'Cons'),
                      e(
                        'button',
                        {
                          key: 'add-con',
                          type: 'button',
                          onClick: () => addListItem('cons'),
                          className:
                            'text-xs font-semibold text-rose-200 px-2 py-1 rounded-lg border border-rose-300/50 hover:bg-rose-400/10',
                        },
                        '+ Add'
                      ),
                    ]),
                    ...standForm.cons.map((item, index) =>
                      e(
                        'div',
                        { key: `con-${index}`, className: 'flex items-center gap-2' },
                        [
                          e('span', {
                            key: 'dot',
                            className: 'h-2 w-2 rounded-full bg-rose-400',
                          }),
                          e('input', {
                            key: 'input',
                            value: item,
                            onChange: (event) => updateListItem('cons', index, event.target.value),
                            placeholder: 'Risk or limitation',
                            className:
                              'flex-1 rounded-lg bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-300 border border-rose-100',
                          }),
                          e(
                            'button',
                            {
                              key: 'remove',
                              type: 'button',
                              onClick: () => removeListItem('cons', index),
                              className:
                                'text-xs text-rose-200 px-2 py-1 rounded-lg border border-transparent hover:border-rose-200',
                            },
                            '×'
                          ),
                        ]
                      )
                    ),
                  ]
                ),
              ]
            ),
          ]
        ),
        e(
          'div',
          {
            key: 'contacts',
            className:
              'rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-4 shadow-lg shadow-slate-950/40',
          },
          [
            e(
              'button',
              {
                key: 'toggle',
                type: 'button',
                className:
                  'w-full flex items-center justify-between rounded-xl bg-slate-800/60 border border-slate-700 px-4 py-3 text-left',
                onClick: () => setContactsOpen((open) => !open),
              },
              [
                e('div', { key: 'text', className: 'space-y-1' }, [
                  e('p', { key: 'eyebrow', className: 'text-xs uppercase tracking-[0.2em] text-cyan-300' }, 'Contacts'),
                  e('span', { key: 'title', className: 'text-sm font-semibold' }, 'Key Stakeholders'),
                ]),
                e(
                  'span',
                  { key: 'chevron', className: 'text-lg' },
                  contactsOpen ? '▴' : '▾'
                ),
              ]
            ),
            contactsOpen
              ? e(
                  'div',
                  { key: 'contact-list', className: 'space-y-3' },
                  [
                    ...standForm.contacts.map((contact) =>
                      e(
                        'div',
                        {
                          key: contact.id,
                          className:
                            'rounded-xl bg-slate-100 text-slate-900 p-3 space-y-3 border border-slate-200 shadow-inner',
                        },
                        [
                          e(
                            'div',
                            { key: 'row', className: 'flex justify-between items-start gap-3' },
                            [
                              e('p', { key: 'label', className: 'text-xs font-semibold text-slate-700 uppercase' }, 'Contact'),
                              e(
                                'button',
                                {
                                  key: 'delete',
                                  type: 'button',
                                  onClick: () => removeContact(contact.id),
                                  className:
                                    'text-xs text-slate-500 hover:text-red-500 px-2 py-1 rounded-lg border border-transparent hover:border-red-200',
                                },
                                'Delete'
                              ),
                            ]
                          ),
                          e(
                            'div',
                            { key: 'fields', className: 'space-y-2' },
                            [
                              e('input', {
                                key: 'name',
                                value: contact.name,
                                onChange: (event) => updateContact(contact.id, 'name', event.target.value),
                                placeholder: 'Name',
                                className:
                                  'w-full rounded-xl bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200',
                              }),
                              e('input', {
                                key: 'role',
                                value: contact.role,
                                onChange: (event) => updateContact(contact.id, 'role', event.target.value),
                                placeholder: 'Role / Responsibility',
                                className:
                                  'w-full rounded-xl bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200',
                              }),
                              e('input', {
                                key: 'email',
                                value: contact.email,
                                onChange: (event) => updateContact(contact.id, 'email', event.target.value),
                                placeholder: 'Email',
                                className:
                                  'w-full rounded-xl bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200',
                              }),
                              e('input', {
                                key: 'phone',
                                value: contact.phone,
                                onChange: (event) => updateContact(contact.id, 'phone', event.target.value),
                                placeholder: 'Phone',
                                className:
                                  'w-full rounded-xl bg-slate-50 text-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-400 border border-slate-200',
                              }),
                            ]
                          ),
                        ]
                      )
                    ),
                    e(
                      'button',
                      {
                        key: 'add-contact',
                        type: 'button',
                        onClick: addContact,
                        className:
                          'w-full rounded-xl border border-dashed border-cyan-300/50 text-cyan-200 px-4 py-2 text-sm font-semibold hover:bg-cyan-500/10 transition',
                      },
                      '+ Add Contact'
                    ),
                  ]
                )
              : null,
          ]
        ),
        e(
          'div',
          {
            key: 'photos',
            className:
              'rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 shadow-lg shadow-slate-950/40',
          },
          [
            e('div', { key: 'title', className: 'flex items-center justify-between' }, [
              e('div', { key: 'text' }, [
                e('p', { key: 'eyebrow', className: 'text-xs uppercase tracking-[0.2em] text-cyan-300' }, 'Assets'),
                e('h2', { key: 'heading', className: 'text-lg font-semibold' }, 'Photo Gallery'),
              ]),
              e('span', { key: 'count', className: 'text-xs text-slate-400' }, `${standForm.photos.length} items`),
            ]),
            e(
              'div',
              { key: 'rail', className: 'flex items-center gap-3 overflow-x-auto pb-2' },
              [
                e('input', {
                  key: 'photo-input',
                  type: 'file',
                  accept: 'image/*',
                  capture: 'environment',
                  className: 'hidden',
                  ref: photoInputRef,
                  onChange: handlePhotoSelected,
                }),
                e(
                  'button',
                  {
                    key: 'add-photo',
                    type: 'button',
                    onClick: handleAddPhoto,
                    className:
                      'flex-none h-24 w-24 rounded-2xl border-2 border-dashed border-cyan-300/60 text-cyan-200 flex items-center justify-center text-sm font-semibold bg-slate-900/80 hover:bg-cyan-500/5',
                  },
                  '📷 Camera / Files'
                ),
                ...standForm.photos.map((photo) =>
                  e(
                    'div',
                    {
                      key: photo.id,
                      className:
                        'relative flex-none h-24 w-24 rounded-2xl border border-slate-700 bg-slate-800 overflow-hidden shadow-inner',
                      style: { backgroundColor: `${photo.color}22`, borderColor: `${photo.color}55` },
                    },
                    [
                      photo.preview
                        ? e('img', {
                            key: 'img',
                            src: photo.preview,
                            alt: photo.label,
                            className: 'absolute inset-0 h-full w-full object-cover',
                          })
                        : null,
                      e(
                        'div',
                        {
                          key: 'label',
                          className:
                            'absolute inset-0 flex items-center justify-center text-center px-2 text-[11px] font-semibold text-white drop-shadow bg-slate-900/40 backdrop-blur-[1px] break-words leading-tight',
                        },
                        photo.label
                      ),
                      e(
                        'button',
                        {
                          key: 'remove',
                          type: 'button',
                          onClick: () => removePhoto(photo.id),
                          className:
                            'absolute top-1 right-1 h-6 w-6 rounded-full bg-slate-900/80 text-xs text-white border border-slate-700 hover:bg-rose-500 hover:border-rose-300',
                        },
                        '×'
                      ),
                    ]
                  )
                ),
              ]
            ),
          ]
        ),
      ]
    );

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'project':
        return renderProjectDetail();
      case 'standEditor':
        return renderStandEditor();
      case 'tagManager':
        return renderPlaceholder('Tag Management');
      case 'export':
        return renderPlaceholder('Export Module');
      default:
        return null;
    }
  };

  return e(
    'div',
    { className: 'min-h-screen bg-slate-950 text-white flex justify-center' },
    e(
      'div',
      { className: 'w-full max-w-md px-4 pb-32 pt-8 space-y-6' },
      [
        e(
          'header',
          { key: 'header', className: 'space-y-1' },
          [
            e(
              'p',
              { key: 'eyebrow', className: 'text-xs uppercase tracking-[0.3em] text-cyan-300' },
              'Exhibition Toolkit'
            ),
            e('h1', { key: 'title', className: 'text-2xl font-bold' }, 'Stand Management'),
            e(
              'p',
              { key: 'sub', className: 'text-sm text-slate-400' },
              'Mobile-first hub for projects, stands, and tags.'
            ),
          ]
        ),
        e('div', { key: 'view' }, renderView()),
        toast
          ? e(
              'div',
              {
                key: 'toast',
                className:
                  'fixed bottom-32 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg border border-emerald-300/60 text-sm',
              },
              toast
            )
          : null,
        e(
          'button',
          {
            key: 'fab',
            type: 'button',
            className:
              'fixed bottom-20 right-6 bg-cyan-500 text-slate-950 font-semibold px-5 py-3 rounded-full shadow-xl shadow-cyan-500/40 border border-cyan-300 hover:scale-[1.02] active:scale-95 transition',
            onClick: activeView === 'project' ? () => setActiveView('standEditor') : handleNewProject,
          },
          activeView === 'project' ? '+ New Stand' : '+ New Project'
        ),
        e(
          'nav',
          {
            key: 'bottom-nav',
            className:
              'fixed bottom-0 left-0 right-0 bg-slate-950/95 border-t border-slate-800 backdrop-blur px-4 py-3 flex justify-between max-w-md mx-auto',
          },
          views.map((view) =>
            e(
              'button',
              {
                key: view.id,
                type: 'button',
                onClick: () => setActiveView(view.id),
                className: `flex-1 flex flex-col items-center gap-1 text-xs font-medium py-2 rounded-xl transition ${
                  activeView === view.id
                    ? 'text-cyan-300 bg-slate-900 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`,
              },
              [
                e('span', { key: 'icon', className: 'text-lg' }, view.icon),
                e('span', { key: 'label' }, view.label.split(' ')[0]),
              ]
            )
          )
        ),
      ]
    )
  );
}

const root = createRoot(document.getElementById('root'));
root.render(e(App));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.warn('Service worker registration failed', err);
    });
  });
}
