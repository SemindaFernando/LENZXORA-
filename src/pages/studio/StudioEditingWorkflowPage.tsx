import React, { useState } from 'react';
import {
  Film,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Sliders,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatDate } from '../../utils/formatters';
import { EditingProject, EditingStage, PriorityLevel, PhotographyCategory } from '../../types';

const STAGES: { id: EditingStage; title: string; count: number }[] = [
  { id: 'shoot_scheduled', title: 'Shoot Scheduled', count: 0 },
  { id: 'shoot_completed', title: 'Shoot Completed', count: 0 },
  { id: 'sorting_selection', title: 'Sorting & Selection', count: 0 },
  { id: 'editing', title: 'In Editing', count: 0 },
  { id: 'internal_review', title: 'Internal Review', count: 0 },
  { id: 'client_review', title: 'Client Review', count: 0 },
  { id: 'revisions', title: 'Revisions', count: 0 },
  { id: 'final_delivery', title: 'Final Delivery', count: 0 },
];

export const StudioEditingWorkflowPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';

  const [projects, setProjects] = useState<EditingProject[]>(() =>
    dataService.getEditingProjects(photographerId)
  );
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeProjectForEdit, setActiveProjectForEdit] = useState<EditingProject | null>(null);

  // New project form state
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [category, setCategory] = useState<PhotographyCategory>('Weddings');
  const [eventDate, setEventDate] = useState('2025-05-15');
  const [deadline, setDeadline] = useState('2025-05-29');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [expectedDeliverables, setExpectedDeliverables] = useState('');
  const [photoCount, setPhotoCount] = useState(450);

  const handleMoveStage = (projectId: string, direction: 'next' | 'prev') => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const currentIndex = STAGES.findIndex(s => s.id === project.stage);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < STAGES.length) {
      const nextStage = STAGES[nextIndex].id;
      dataService.updateEditingStage(projectId, nextStage);
      setProjects(dataService.getEditingProjects(photographerId));
    }
  };

  const handleUpdateProgress = (projectId: string, newProgress: number) => {
    dataService.updateEditingProject(projectId, { progressPercentage: newProgress });
    setProjects(dataService.getEditingProjects(photographerId));
  };

  const handleSaveDeliveryLink = (projectId: string, link: string) => {
    dataService.updateEditingProject(projectId, { deliveryLink: link, stage: 'final_delivery', progressPercentage: 100 });
    setProjects(dataService.getEditingProjects(photographerId));
    setActiveProjectForEdit(null);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.addEditingProject({
      photographerId,
      title,
      clientName,
      category,
      eventDate,
      deadline,
      priority,
      stage: 'shoot_scheduled',
      expectedDeliverables,
      photoCount: Number(photoCount),
      progressPercentage: 0,
    });
    setProjects(dataService.getEditingProjects(photographerId));
    setAddModalOpen(false);
    setTitle('');
    setClientName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Post-Production Editing Workflow</h1>
          <p className="text-xs text-neutral-500">
            Track client photo & video curation across the 8-stage production pipeline to final delivery.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-neutral-200 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Deadline List
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>New Editing Job</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
          {STAGES.map((col, idx) => {
            const colProjects = projects.filter(p => p.stage === col.id);
            return (
              <div
                key={col.id}
                className="w-72 shrink-0 bg-neutral-100/80 rounded-3xl p-3.5 border border-neutral-200/80 flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-1.5 mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <h3 className="font-bold text-xs text-neutral-900">{col.title}</h3>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-white text-neutral-700 text-[10px] font-bold flex items-center justify-center border shadow-2xs">
                    {colProjects.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colProjects.length === 0 ? (
                    <div className="p-4 text-center rounded-2xl border border-dashed border-neutral-300 text-[11px] text-neutral-400">
                      No jobs in this stage
                    </div>
                  ) : (
                    colProjects.map(project => (
                      <div
                        key={project.id}
                        className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs hover:shadow-md transition-shadow space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                            {project.category}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            project.priority === 'urgent'
                              ? 'bg-red-100 text-red-800'
                              : project.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {project.priority}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-neutral-900 leading-snug">
                            {project.title}
                          </h4>
                          <span className="text-[11px] text-neutral-500 block mt-0.5">
                            Client: {project.clientName}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] text-neutral-500">
                            <span>Progress</span>
                            <span className="font-semibold text-neutral-800">{project.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-1.5 rounded-full"
                              style={{ width: `${project.progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-100">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>Due: {formatDate(project.deadline)}</span>
                          </span>
                          {project.photoCount && <span>{project.photoCount} RAWs</span>}
                        </div>

                        {project.deliveryLink && (
                          <a
                            href={project.deliveryLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate">Client Download Portal</span>
                          </a>
                        )}

                        {/* Stage Mover Controls */}
                        <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveStage(project.id, 'prev')}
                            className="p-1 rounded text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                            title="Move to previous stage"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setActiveProjectForEdit(project)}
                            className="text-[10px] text-neutral-500 hover:text-neutral-900 font-medium"
                          >
                            Update Details
                          </button>

                          <button
                            disabled={idx === STAGES.length - 1}
                            onClick={() => handleMoveStage(project.id, 'next')}
                            className="p-1 rounded text-amber-600 hover:text-amber-800 disabled:opacity-30"
                            title="Move to next stage"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List / Deadline View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-neutral-900">All Production Deliverables Sorted by Deadline</h3>
          <div className="space-y-3">
            {projects
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .map(p => (
                <div
                  key={p.id}
                  className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                        {p.stage.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-xs text-neutral-900">{p.title}</h4>
                    </div>
                    <div className="text-xs text-neutral-500">
                      Client: {p.clientName} • Event Date: {formatDate(p.eventDate)} • {p.expectedDeliverables}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-xs">
                    <div>
                      <span className="text-[11px] text-neutral-400 block">Progress</span>
                      <span className="font-bold text-neutral-900">{p.progressPercentage}%</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-neutral-400 block">Deadline</span>
                      <span className="font-bold text-amber-700">{formatDate(p.deadline)}</span>
                    </div>

                    <button
                      onClick={() => setActiveProjectForEdit(p)}
                      className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Project Details / Update Modal */}
      {activeProjectForEdit && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-4">
            <button
              onClick={() => setActiveProjectForEdit(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-neutral-900">{activeProjectForEdit.title}</h3>
            <p className="text-xs text-neutral-500">Client: {activeProjectForEdit.clientName}</p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Adjust Progress ({activeProjectForEdit.progressPercentage}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={activeProjectForEdit.progressPercentage}
                  onChange={e => handleUpdateProgress(activeProjectForEdit.id, Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Final Download / Gallery Delivery URL
                </label>
                <input
                  type="text"
                  placeholder="https://pixieset.com/... or Google Drive link"
                  defaultValue={activeProjectForEdit.deliveryLink || ''}
                  id="deliveryInput"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('deliveryInput') as HTMLInputElement;
                    handleSaveDeliveryLink(activeProjectForEdit.id, input.value);
                  }}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold"
                >
                  Mark Delivered & Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-neutral-900">Create Editing Project</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Set deadlines, shot count, and track post-production pipeline.
            </p>

            <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ruwan & Nelum Traditional Wedding Album"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ruwan de Silva"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Delivery Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Deliverables Description</label>
                <input
                  type="text"
                  placeholder="e.g. 500 Photos + 1 Leather Album + Teaser"
                  value={expectedDeliverables}
                  onChange={e => setExpectedDeliverables(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Add to Editing Pipeline
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
