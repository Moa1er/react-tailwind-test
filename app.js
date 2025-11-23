import React, { useMemo, useState } from 'https://esm.sh/react@18.3.1';
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

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'project':
        return renderPlaceholder('Project Detail View');
      case 'standEditor':
        return renderPlaceholder('Stand Editor');
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
        e(
          'button',
          {
            key: 'fab',
            type: 'button',
            className:
              'fixed bottom-20 right-6 bg-cyan-500 text-slate-950 font-semibold px-5 py-3 rounded-full shadow-xl shadow-cyan-500/40 border border-cyan-300 hover:scale-[1.02] active:scale-95 transition',
            onClick: handleNewProject,
          },
          '+ New Project'
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
