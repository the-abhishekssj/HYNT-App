import { useMemo, useState } from 'react'
import {
  ChatCircleDots,
  Check,
  CheckCircle,
  Circle,
  ClockCountdown,
  DotsThree,
  Kanban,
  ListBullets,
  PaperPlaneTilt,
  PencilSimple,
  Plus,
  Trash,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'

const tabs = [
  { key: 'my', label: 'My Tasks' },
  { key: 'team', label: 'Team' },
  { key: 'approvals', label: 'Approvals' },
]

const taskFilters = ['To do', 'In progress', 'Done']

const approvalSeed = [
  {
    id: 'apr-1',
    title: 'Kitchen countertop - Granite vs Marble',
    type: 'Material selection',
    status: 'pending',
    description: 'Please select your preferred countertop material. Granite is more durable, marble feels more premium.',
    dueDate: '28 Oct',
    sentAt: '22 Oct',
    image: '/hynt-home/product.png',
    clientQuestion: '',
  },
  {
    id: 'apr-2',
    title: 'Wall colour - Sage green vs Warm grey',
    type: 'Design selection',
    status: 'question',
    description: 'This room can go calmer or warmer depending on the finish you want for the sofa wall.',
    dueDate: '30 Oct',
    sentAt: '20 Oct',
    image: '/hynt-home/idea-1.png',
    clientQuestion: 'Can I see the sage green with the existing sofa colour first?',
  },
  {
    id: 'apr-3',
    title: 'False ceiling layout - Cove lighting',
    type: 'Design approval',
    status: 'approved',
    description: 'Cove layout aligned with the lighting and AC coordination plan.',
    dueDate: '21 Oct',
    sentAt: '18 Oct',
    image: '/hynt-home/idea-2.png',
    clientQuestion: '',
  },
  {
    id: 'apr-4',
    title: 'Kids room theme - Jungle vs Space',
    type: 'Theme review',
    status: 'rejected',
    description: 'Two directions for the kids room accent palette and graphic wall.',
    dueDate: '20 Oct',
    sentAt: '17 Oct',
    image: '/hynt-home/brand.png',
    clientQuestion: 'Neither. Please explore an ocean theme instead.',
  },
]

const dueTone = {
  Overdue: 'bg-[#fff0f0] text-[#c34545]',
  Today: 'bg-[#fff4e8] text-[#c66f19]',
  Done: 'bg-[#eef7f1] text-[#267449]',
}

const approvalTone = {
  pending: 'bg-[#fff4dd] text-[#a86a00]',
  question: 'bg-[#f2edff] text-[#6844d8]',
  approved: 'bg-[#eaf8ef] text-[#267449]',
  rejected: 'bg-[#fff0f0] text-[#c34545]',
}

const approvalLabel = {
  pending: 'Awaiting',
  question: 'Question',
  approved: 'Approved',
  rejected: 'Rejected',
}

function TaskStatusChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`typo-body inline-flex h-10 items-center rounded-full border px-4 transition ${
        selected ? 'border-[#173324] bg-[#173324] typo-weight-semibold text-white' : 'border-[#d8e0da] bg-white text-[#355244]'
      }`}
    >
      {label}
    </button>
  )
}

function SectionHeader({ title, meta, tone = 'text-[#6f7d74]' }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className={`typo-label uppercase ${tone}`}>{title}</p>
      {meta ? <span className="typo-meta text-[#8a948f]">{meta}</span> : null}
    </div>
  )
}

function TaskRow({
  task,
  onOpen,
  onToggleStatus,
  onOpenActions,
  assigneeLabel = task.assignee,
  canUpdate = true,
}) {
  return (
    <article className="border-b border-[#edf1ee] py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggleStatus(task)}
          disabled={!canUpdate}
          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border ${
            task.status === 'done'
              ? 'border-[#26c485] bg-[#26c485] text-white'
              : task.status === 'inprogress'
                ? 'border-[#d6b08d] bg-[#fff4e8] text-[#b66d29]'
                : 'border-[#d5ddd7] bg-white text-[#94a096]'
          } ${!canUpdate ? 'cursor-not-allowed opacity-45' : ''}`}
          aria-label={`Update ${task.title}`}
        >
          {task.status === 'done' ? <Check size={14} weight="bold" /> : task.status === 'inprogress' ? <ClockCountdown size={14} weight="bold" /> : <Circle size={12} weight="bold" />}
        </button>

        <button type="button" onClick={() => onOpen(task.id)} className="min-w-0 flex-1 text-left">
          <p className={`typo-card-title ${task.status === 'done' ? 'text-[#8c9891] line-through' : 'text-[#1c1c1c]'}`}>{task.title}</p>
          <div className="typo-caption mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[#6b7670]">
            {task.priority ? (
              <span className="inline-flex items-center gap-1">
                <span className={`size-1.5 rounded-full ${
                  task.priority === 'High'
                    ? 'bg-[#c34545]'
                    : task.priority === 'Medium'
                      ? 'bg-[#d18c33]'
                      : 'bg-[#5fa87a]'
                }`} />
                {task.priority}
              </span>
            ) : null}
            <span className="text-[#4d5b53]">{assigneeLabel}</span>
            {task.linkedTo ? <span className="text-[#8b978f]">/ {task.linkedTo}</span> : null}
          </div>
        </button>

        {canUpdate ? (
          <button type="button" onClick={() => onOpenActions(task.id)} className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f6f8f7] text-[#728078]" aria-label="Task actions">
            <DotsThree size={16} weight="bold" />
          </button>
        ) : null}
      </div>
    </article>
  )
}

function ApprovalCard({ item, onOpen }) {
  const tone = approvalTone[item.status]

  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      className="flex w-full gap-3 border-b border-[#e5ece7] py-4 text-left last:border-b-0"
    >
      <img src={item.image} alt={item.title} className="size-14 shrink-0 rounded-[14px] object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="typo-body-strong truncate text-[#121212]">{item.title}</p>
          </div>
          <span className={`typo-caption shrink-0 whitespace-nowrap rounded-full px-3 py-1 uppercase ${tone}`}>
            {approvalLabel[item.status]}
          </span>
        </div>
        <p className="typo-body mt-2 line-clamp-2 text-[#355244]">{item.description}</p>
        <p className="typo-meta mt-2 text-[#8a948f]">Sent {item.sentAt} / Due {item.dueDate}</p>
      </div>
    </button>
  )
}

function ProTaskDetail({
  selectedProject,
  task,
  completedByIndex,
  canMoveTask,
  onBack,
  onMoveTask,
  onToggleStep,
}) {
  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-24 pt-16">
        <ProjectWorkspaceHeader
          title="Task details"
          subtitle={selectedProject.scope}
          onBack={onBack}
          actions={<span className={`typo-caption rounded-full px-3 py-1 uppercase ${dueTone[task.due] || 'bg-[#f2f4f3] text-[#6b7670]'}`}>{task.due}</span>}
        />

        <div className="ui-screen-content pt-6">
          <section className="rounded-[20px] border border-[#e3ebe5] bg-[#fbfcfb] p-5">
            <p className="typo-page-title text-[#102418]">{task.title}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {[
                ['Assigned to', task.assignee],
                ['Assigned by', task.assignedBy],
                ['Due date', task.dueDate],
                ['Due time', task.dueTime],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="typo-caption uppercase text-[#91a097]">{label}</p>
                  <p className="typo-body mt-1 text-[#1d1d1d]">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-[#e3ebe5] pt-1">
              {[
                ['Priority', task.priority],
                ['Source', task.linkedTo || 'Manual'],
                ...(task.sourceLabel ? [['Diary update', task.sourceLabel]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-[#edf1ee] py-3 last:border-b-0">
                  <p className="typo-caption uppercase text-[#91a097]">{label}</p>
                  <p className="typo-body max-w-[62%] text-right text-[#1d1d1d]">{value}</p>
                </div>
              ))}
            </div>
            {task.note ? (
              <div className="mt-4 border-l-2 border-[#d46f1f] pl-3">
                <p className="typo-caption uppercase text-[#a85d22]">Issue note</p>
                <p className="typo-body mt-1 text-[#46544c]">{task.note}</p>
              </div>
            ) : null}
          </section>

          <section className="mt-6 rounded-[20px] border border-[#e3ebe5] bg-white p-5">
            <SectionHeader title="Remaining steps" meta={`${task.steps.length} steps`} />
            <div>
              {task.steps.map((step, index) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => onToggleStep(index)}
                  disabled={!canMoveTask}
                  className={`flex w-full items-start gap-3 border-b border-[#edf1ee] py-4 text-left last:border-b-0 ${!canMoveTask ? 'cursor-default' : ''}`}
                >
                  <span className="mt-0.5 text-[#5c6e63]">
                    {completedByIndex[index] ? <CheckCircle size={18} weight="fill" className="text-[#26c485]" /> : <Circle size={18} />}
                  </span>
                  <span className="min-w-0">
                    <p className={`typo-body ${completedByIndex[index] ? 'text-[#92a097] line-through' : 'text-[#1d1d1d]'}`}>{index + 1}. {step}</p>
                    {completedByIndex[index] ? <p className="typo-meta mt-1 text-[#8a948f]">Completed at {completedByIndex[index]}</p> : null}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      {canMoveTask ? (
        <div className="fixed bottom-0 left-1/2 z-[85] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e6ece8] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          <p className="typo-label mb-3 uppercase text-[#7a8780]">Move task to</p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <TaskStatusChip label="To do" selected={task.status === 'todo'} onClick={() => onMoveTask('todo')} />
            <TaskStatusChip label="In progress" selected={task.status === 'inprogress'} onClick={() => onMoveTask('inprogress')} />
            <TaskStatusChip label="Done" selected={task.status === 'done'} onClick={() => onMoveTask('done')} />
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-1/2 z-[85] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e6ece8] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          <p className="typo-body text-[#6f7c74]">This role can review task details, but only assigned contributors or the principal pro can move statuses.</p>
        </div>
      )}
    </main>
  )
}

export default function ProjectTasksWorkspace({
  mode = 'pro',
  selectedProject,
  tasks = [],
  setTasks,
  approvals = null,
  setApprovals = null,
  selectedTaskId,
  setSelectedTaskId,
  taskStepCompletion = {},
  setTaskStepCompletion,
  onBack,
  homeownerClientName = 'Priya Sharma',
  homeownerProjectName = 'Sharma 3BHK',
  homeownerDesignerName = 'Riya Desai',
  permissions = null,
  viewerRoleLabel = 'Principal Pro',
  viewerName = 'Riya Desai',
}) {
  const resolvedPermissions = permissions || {
    canViewTasks: true,
    canCreateTasks: true,
    canUpdateTasks: true,
    canApproveTasks: true,
    canViewTeamTasks: true,
    isHomeowner: false,
  }
  const [activeTab, setActiveTab] = useState('my')
  const [approvalView, setApprovalView] = useState('pending')
  const [taskFilter, setTaskFilter] = useState('All')
  const [viewMode, setViewMode] = useState('list')
  const [taskActionTargetId, setTaskActionTargetId] = useState(null)
  const [composerMode, setComposerMode] = useState(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('Me')
  const [newTaskPriority, setNewTaskPriority] = useState('High')
  const [newTaskDue, setNewTaskDue] = useState('Today')
  const [localApprovalItems, setLocalApprovalItems] = useState(approvalSeed)
  const approvalItems = approvals ?? localApprovalItems
  const updateApprovalItems = setApprovals ?? setLocalApprovalItems
  const [newApprovalTitle, setNewApprovalTitle] = useState('')
  const [newApprovalType, setNewApprovalType] = useState('Material selection')
  const [newApprovalDescription, setNewApprovalDescription] = useState('')
  const [newApprovalDueDate, setNewApprovalDueDate] = useState('')
  const [newApprovalMediaType, setNewApprovalMediaType] = useState('image')
  const [editingApprovalId, setEditingApprovalId] = useState(null)
  const [selectedApprovalId, setSelectedApprovalId] = useState(null)
  const [clientResponse, setClientResponse] = useState('')
  const viewerTaskAliases = useMemo(() => {
    const firstName = viewerName.split(' ')[0]
    return Array.from(new Set([viewerName, firstName].filter(Boolean)))
  }, [viewerName])

  const scopedTasks = useMemo(() => {
    if (mode === 'homeowner') return tasks
    if (resolvedPermissions.canViewTeamTasks || resolvedPermissions.isPrincipalPro) return tasks
    return tasks.filter((task) => viewerTaskAliases.includes(task.assignee) || viewerTaskAliases.includes(task.assignedBy))
  }, [mode, resolvedPermissions.canViewTeamTasks, resolvedPermissions.isPrincipalPro, tasks, viewerTaskAliases])

  const visibleTabs = useMemo(() => {
    if (mode === 'homeowner') return []
    return tabs.filter((tab) => {
      if (tab.key === 'my') return resolvedPermissions.canViewTasks
      if (tab.key === 'team') return resolvedPermissions.canViewTeamTasks
      if (tab.key === 'approvals') return resolvedPermissions.canApproveTasks
      return true
    })
  }, [mode, resolvedPermissions.canApproveTasks, resolvedPermissions.canViewTasks, resolvedPermissions.canViewTeamTasks])

  const currentTab = visibleTabs.some((tab) => tab.key === activeTab) ? activeTab : (visibleTabs[0]?.key || 'my')
  const selectedTask = scopedTasks.find((task) => task.id === selectedTaskId) || null
  const selectedApproval = approvalItems.find((item) => item.id === selectedApprovalId) || null

  const groupedTasks = useMemo(() => ({
    overdue: scopedTasks.filter((task) => task.due === 'Overdue'),
    today: scopedTasks.filter((task) => task.due === 'Today'),
    week: scopedTasks.filter((task) => !['Overdue', 'Today', 'Done'].includes(task.due)),
    done: scopedTasks.filter((task) => task.status === 'done' || task.due === 'Done'),
  }), [scopedTasks])

  const getTaskCount = (filter) => {
    if (filter === 'All') return scopedTasks.length
    if (filter === 'To do') return scopedTasks.filter((task) => task.status === 'todo').length
    if (filter === 'In progress') return scopedTasks.filter((task) => task.status === 'inprogress').length
    return scopedTasks.filter((task) => task.status === 'done').length
  }

  const teamGroups = useMemo(() => {
    const map = new Map()
    scopedTasks.forEach((task) => {
      const current = map.get(task.assignee) || []
      current.push(task)
      map.set(task.assignee, current)
    })
    return Array.from(map.entries())
  }, [scopedTasks])

  const approvalSections = {
    pending: approvalItems.filter((item) => item.status === 'pending' || item.status === 'question'),
    completed: approvalItems.filter((item) => item.status === 'approved' || item.status === 'rejected'),
  }
  const visibleApprovalItems = approvalView === 'pending' ? approvalSections.pending : approvalSections.completed

  const moveTaskStatus = (taskId, nextStatus) => {
    if (!resolvedPermissions.canUpdateTasks) return
    setTasks((prev) => prev.map((task) => (
      task.id === taskId
        ? {
            ...task,
            status: nextStatus,
            due: nextStatus === 'done' ? 'Done' : task.due === 'Done' ? 'Today' : task.due,
          }
        : task
    )))
  }

  const cycleTaskStatus = (task) => {
    if (!resolvedPermissions.canUpdateTasks) return
    const next = task.status === 'todo' ? 'inprogress' : task.status === 'inprogress' ? 'done' : 'todo'
    moveTaskStatus(task.id, next)
  }

  const createTask = () => {
    if (!resolvedPermissions.canCreateTasks) return
    if (!newTaskTitle.trim()) return
    setTasks((prev) => [
      {
        id: `t-${Date.now()}`,
        projectId: selectedProject?.id || 'p-1',
        title: newTaskTitle.trim(),
        assignee: newTaskAssignee === 'Me' ? 'You' : newTaskAssignee,
        assignedBy: viewerName,
        due: newTaskDue,
        dueDate: newTaskDue === 'Today' ? '20 May 2026' : newTaskDue === 'Overdue' ? '18 May 2026' : '27 May 2026',
        dueTime: '06:00 PM',
        status: newTaskDue === 'Done' ? 'done' : 'todo',
        steps: [
          'Review requirement and confirm scope',
          'Align owner and timeline',
          'Close the task with client update',
        ],
        priority: newTaskPriority,
        linkedTo: null,
        sourceEntryId: null,
        sourceIssueId: null,
        sourceLabel: '',
        note: '',
      },
      ...prev,
    ])
    setNewTaskTitle('')
    setNewTaskAssignee('Me')
    setNewTaskPriority('High')
    setNewTaskDue('Today')
    setComposerMode(null)
  }

  const resetApprovalDraft = () => {
    setNewApprovalTitle('')
    setNewApprovalType('Material selection')
    setNewApprovalDescription('')
    setNewApprovalDueDate('')
    setNewApprovalMediaType('image')
  }

  const closeComposer = () => {
    const approvalIdToRestore = editingApprovalId
    setComposerMode(null)
    setEditingApprovalId(null)
    if (approvalIdToRestore) {
      setSelectedApprovalId(approvalIdToRestore)
    }
  }

  const openNewApprovalComposer = () => {
    resetApprovalDraft()
    setEditingApprovalId(null)
    setComposerMode('approval')
  }

  const openApprovalEditor = (approval) => {
    if (!approval) return
    setNewApprovalTitle(approval.title || '')
    setNewApprovalType(approval.type || 'Material selection')
    setNewApprovalDescription(approval.description || '')
    setNewApprovalDueDate(approval.dueDateInput || '')
    setNewApprovalMediaType(approval.mediaType || 'image')
    setEditingApprovalId(approval.id)
    setSelectedApprovalId(null)
    setComposerMode('approval')
  }

  const createApproval = () => {
    if (!resolvedPermissions.canApproveTasks || !newApprovalTitle.trim() || !newApprovalDescription.trim()) return
    const now = new Date()
    const currentApproval = editingApprovalId ? approvalItems.find((item) => item.id === editingApprovalId) : null
    const dueDate = newApprovalDueDate
      ? new Date(`${newApprovalDueDate}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      : currentApproval?.dueDate || 'TBD'
    const nextApprovalId = editingApprovalId || `apr-${Date.now()}`
    const nextApproval = {
      ...(currentApproval || {}),
      id: nextApprovalId,
      projectId: selectedProject?.id || 'p-1',
      title: newApprovalTitle.trim(),
      type: newApprovalType,
      status: currentApproval?.status || 'pending',
      description: newApprovalDescription.trim(),
      dueDate,
      dueDateInput: newApprovalDueDate || currentApproval?.dueDateInput || '',
      sentAt: currentApproval?.sentAt || now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      sentBy: currentApproval?.sentBy || viewerName,
      homeownerName: currentApproval?.homeownerName || selectedProject?.client || homeownerClientName,
      image: newApprovalMediaType === 'video' ? '/hynt-home/idea-2.png' : '/hynt-home/product.png',
      mediaType: newApprovalMediaType,
      clientQuestion: currentApproval?.clientQuestion || '',
      respondedAt: currentApproval?.respondedAt || null,
    }
    updateApprovalItems((prev) => editingApprovalId ? prev.map((item) => (
      item.id === editingApprovalId ? nextApproval : item
    )) : [nextApproval, ...prev])
    const editedApprovalId = editingApprovalId
    resetApprovalDraft()
    setEditingApprovalId(null)
    setActiveTab('approvals')
    setComposerMode(null)
    if (editedApprovalId) {
      setSelectedApprovalId(editedApprovalId)
    }
  }

  const handleApprovalResponse = (nextStatus) => {
    if (!selectedApproval) return
    updateApprovalItems((prev) => prev.map((item) => (
      item.id === selectedApproval.id
        ? {
            ...item,
            status: nextStatus,
            clientQuestion: ['question', 'rejected'].includes(nextStatus) ? clientResponse.trim() || item.clientQuestion : item.clientQuestion,
            respondedAt: new Date().toISOString(),
          }
        : item
    )))
    setClientResponse('')
    setSelectedApprovalId(null)
  }

  if (mode === 'homeowner') {
    if (selectedApproval) {
      return (
        <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-[#f7faf8] text-black">
          <section className="mx-auto w-full max-w-[390px] pb-8 pt-16">
            <ProjectWorkspaceHeader
              title="Approval task"
              subtitle={`${homeownerDesignerName} / ${homeownerProjectName}`}
              onBack={() => setSelectedApprovalId(null)}
              actions={<span className={`typo-caption rounded-full px-3 py-1 uppercase ${approvalTone[selectedApproval.status]}`}>{approvalLabel[selectedApproval.status]}</span>}
            />

            <div className="px-4 pt-5">
              <article className="rounded-[20px] border border-[#e2e9e4] bg-white p-5 shadow-[0_12px_32px_rgba(17,24,20,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <span className={`typo-caption rounded-full px-3 py-1 uppercase ${approvalTone[selectedApproval.status]}`}>
                    {approvalLabel[selectedApproval.status]}
                  </span>
                  <span className="typo-meta text-[#7b8780]">Due {selectedApproval.dueDate}</span>
                </div>
                <p className="typo-page-title mt-4 text-[#102418]">{selectedApproval.title}</p>
                <p className="typo-body mt-1 text-[#708078]">{selectedApproval.type}</p>

                <div className="mt-5 rounded-[20px] bg-[#f2f7f4] px-4 py-5">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-white">
                    <img src={selectedApproval.image} alt={selectedApproval.title} className="h-full w-full object-cover" />
                  </div>
                  <p className="typo-body mt-4 text-[#24362d]">{selectedApproval.description}</p>
                </div>

                {selectedApproval.clientQuestion ? (
                  <div className={`mt-5 rounded-[20px] px-4 py-4 ${selectedApproval.status === 'rejected' ? 'bg-[#fff2f2]' : 'bg-[#f4efff]'}`}>
                    <p className={`typo-label uppercase ${selectedApproval.status === 'rejected' ? 'text-[#c34545]' : 'text-[#6844d8]'}`}>
                      {selectedApproval.status === 'rejected' ? 'Reason shared' : 'Question raised'}
                    </p>
                    <p className="typo-body mt-2 text-[#24362d]">{selectedApproval.clientQuestion}</p>
                  </div>
                ) : null}

                <textarea
                  value={clientResponse}
                  onChange={(event) => setClientResponse(event.target.value)}
                  rows={3}
                  placeholder="Add a note if you want to ask a question or explain your choice"
                  className="typo-body mt-5 w-full rounded-[20px] border border-[#d7e2db] px-4 py-3 text-[#24362d] outline-none placeholder:text-[#98a39d]"
                />

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => handleApprovalResponse('approved')} className="typo-body-strong rounded-2xl bg-[#173324] px-4 py-3 text-white">
                    Approve
                  </button>
                  <button type="button" onClick={() => handleApprovalResponse('rejected')} className="typo-body-strong rounded-2xl border border-[#efcaca] bg-[#fff4f4] px-4 py-3 text-[#c34545]">
                    Reject
                  </button>
                  <button type="button" onClick={() => handleApprovalResponse('question')} className="typo-body-strong rounded-2xl border border-[#ddd6fb] bg-[#f4efff] px-4 py-3 text-[#6844d8]">
                    Ask
                  </button>
                </div>
              </article>
            </div>
          </section>
        </main>
      )
    }

    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-[#f7faf8] text-black">
        <section className="mx-auto w-full max-w-[390px] pb-8 pt-16">
          <ProjectWorkspaceHeader title="Tasks" subtitle={`${homeownerDesignerName} / ${homeownerProjectName}`} onBack={onBack} />

          <div className="px-4 pt-5">
            <section>
              <SectionHeader title="Needs your response" meta={String(approvalSections.pending.length)} tone="text-[#102418]" />
              <div className="space-y-3">
                {approvalSections.pending.map((item) => (
                  <ApprovalCard key={item.id} item={item} onOpen={setSelectedApprovalId} />
                ))}
              </div>
            </section>

            <section className="mt-8">
              <SectionHeader title="Completed" meta={String(approvalSections.completed.length)} tone="text-[#102418]" />
              <div className="space-y-3">
                {approvalSections.completed.map((item) => (
                  <ApprovalCard key={item.id} item={item} onOpen={setSelectedApprovalId} compact />
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    )
  }

  if (!resolvedPermissions.canViewTasks) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-12 pt-16">
          <ProjectWorkspaceHeader title="Tasks" subtitle={selectedProject?.scope || homeownerProjectName} onBack={onBack} />
          <div className="px-4 pt-8">
            <section className="rounded-[24px] border border-[#e3ebe5] bg-[#fbfcfb] px-5 py-6">
              <p className="typo-label uppercase text-[#7a8780]">Restricted access</p>
              <h1 className="typo-page-title mt-2 text-[#102418]">{viewerRoleLabel} cannot open project tasks.</h1>
              <p className="typo-body mt-3 text-[#5f6f66]">Switch to a role with task visibility, or grant this member access from People & Access.</p>
            </section>
          </div>
        </section>
      </main>
    )
  }

  if (selectedTask) {
    const completedByIndex = taskStepCompletion[selectedTask.id] || {}
    const toggleStep = (stepIndex) => {
      setTaskStepCompletion((prev) => {
        const currentTaskMap = prev[selectedTask.id] || {}
        const nextTaskMap = { ...currentTaskMap }
        if (nextTaskMap[stepIndex]) {
          delete nextTaskMap[stepIndex]
        } else {
          const now = new Date()
          const hh = String(now.getHours()).padStart(2, '0')
          const mm = String(now.getMinutes()).padStart(2, '0')
          nextTaskMap[stepIndex] = `${hh}:${mm}`
        }
        return { ...prev, [selectedTask.id]: nextTaskMap }
      })
    }

    return (
      <ProTaskDetail
        selectedProject={selectedProject}
        task={selectedTask}
        completedByIndex={completedByIndex}
        canMoveTask={resolvedPermissions.canUpdateTasks}
        onBack={() => setSelectedTaskId(null)}
        onMoveTask={(nextStatus) => moveTaskStatus(selectedTask.id, nextStatus)}
        onToggleStep={toggleStep}
      />
    )
  }

  if (selectedApproval) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
          <ProjectWorkspaceHeader
            title="Approval item"
            subtitle={selectedProject?.scope || homeownerProjectName}
            onBack={() => setSelectedApprovalId(null)}
            actions={<span className={`typo-caption shrink-0 rounded-full px-3 py-1 uppercase ${approvalTone[selectedApproval.status]}`}>{approvalLabel[selectedApproval.status]}</span>}
          />

          <div className="ui-screen-content pt-6">
            <section className="border-b border-[#e5ece7] pb-5">
              <p className="typo-page-title text-[#102418]">{selectedApproval.title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="typo-caption rounded-full bg-[#f3f6f4] px-3 py-1 text-[#5f6f66]">{selectedApproval.type}</span>
                <span className="typo-caption text-[#7b8780]">Sent {selectedApproval.sentAt}</span>
                <span className="typo-caption text-[#7b8780]">Due {selectedApproval.dueDate}</span>
              </div>
            </section>

            <section className="border-b border-[#e5ece7] py-5">
              <img src={selectedApproval.image} alt={selectedApproval.title} className="aspect-[4/3] w-full rounded-[22px] object-cover" />
              <p className="typo-body mt-4 text-[#2a3b32]">{selectedApproval.description}</p>
              {selectedApproval.clientQuestion ? (
                <div className={`mt-4 rounded-[20px] px-4 py-3 ${selectedApproval.status === 'rejected' ? 'bg-[#fff2f2]' : 'bg-[#f4efff]'}`}>
                  <p className={`typo-label uppercase ${selectedApproval.status === 'rejected' ? 'text-[#c34545]' : 'text-[#6844d8]'}`}>
                    {selectedApproval.status === 'rejected' ? 'Client feedback' : 'Client question'}
                  </p>
                  <p className="typo-body mt-2 text-[#24362d]">{selectedApproval.clientQuestion}</p>
                </div>
              ) : null}
            </section>

            <section className="py-5">
              <p className="typo-label mb-3 uppercase text-[#7a8780]">Manage</p>
              <div className="divide-y divide-[#e5ece7] border-y border-[#e5ece7]">
                <button type="button" onClick={() => openApprovalEditor(selectedApproval)} className="typo-body-strong flex h-12 w-full items-center justify-between text-left text-[#355244]">
                  <span>Edit item</span>
                  <PencilSimple size={18} />
                </button>
                {selectedApproval.clientQuestion ? (
                  <button type="button" className="typo-body-strong flex h-12 w-full items-center justify-between text-left text-[#6844d8]">
                    <span>Reply to client</span>
                    <ChatCircleDots size={18} />
                  </button>
                ) : null}
              </div>
            </section>
          </div>

          {['pending', 'question'].includes(selectedApproval.status) ? (
            <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e6ece8] bg-white px-4 pb-6 pt-4">
              <Button type="button" fullWidth leadingIcon={PaperPlaneTilt} className="h-12 rounded-[20px]">
                Send reminder
              </Button>
            </div>
          ) : null}
        </section>
      </main>
    )
  }

  const workspaceHeaderAction = currentTab === 'approvals'
    ? resolvedPermissions.canApproveTasks ? (
        <Button type="button" icon={PaperPlaneTilt} onClick={openNewApprovalComposer} aria-label="Send for approval" />
      ) : null
    : resolvedPermissions.canCreateTasks ? (
        <Button type="button" icon={Plus} onClick={() => setComposerMode('task')} aria-label="Create task" />
      ) : null

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-24 pt-[120px]">
        <ProjectWorkspaceHeader
          title="Tasks"
          subtitle={selectedProject?.scope || homeownerProjectName}
          onBack={onBack}
          actions={workspaceHeaderAction}
          below={visibleTabs.length ? (
            <div className="no-scrollbar flex gap-2 overflow-x-auto" role="tablist" aria-label="Task workspace">
              {visibleTabs.map((tab) => {
                const active = currentTab === tab.key
                const count = tab.key === 'my'
                  ? scopedTasks.length
                  : tab.key === 'team'
                    ? teamGroups.length
                    : approvalSections.pending.length
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-full py-2 pl-3 pr-2 ${active ? 'bg-[#5fc18a]' : 'border border-[#d1d1d1] bg-white'}`}
                  >
                    <span className={`typo-body ${active ? 'typo-weight-semibold text-white' : 'text-black'}`}>{tab.label}</span>
                    <span className="typo-badge grid size-6 place-items-center rounded-full bg-black text-white">
                      {String(count).padStart(2, '0')}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}
        />

        <div className="px-4 pt-5">
          {currentTab === 'my' ? (
            <section>
              <div className="flex justify-end">
                <div className="inline-flex rounded-full border border-[#dbe6df] bg-[#f2f6f3] p-0.5" role="group" aria-label="Task view">
                  {[
                    ['list', 'List', ListBullets],
                    ['kanban', 'Kanban', Kanban],
                  ].map(([key, label, Icon]) => {
                    const active = viewMode === key
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setViewMode(key)}
                        className={`typo-label inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${active ? 'bg-white text-[#102418] shadow-[0_1px_2px_rgba(16,36,24,0.08)]' : 'text-[#6f7d74]'}`}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
              {viewMode === 'list' ? (
                <>
              <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto">
                {taskFilters.map((filter) => {
                  const active = taskFilter === filter
                  const dotColor = filter === 'To do'
                    ? 'bg-[#94a096]'
                    : filter === 'In progress'
                      ? 'bg-[#d18c33]'
                      : 'bg-[#5fa87a]'
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setTaskFilter(active ? 'All' : filter)}
                      className={`typo-body inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${active ? 'bg-[#ececec] text-black' : 'text-[#6f7d74] hover:bg-[#f2f2f2]'}`}
                    >
                      <span className={`size-1.5 rounded-full ${dotColor}`} />
                      {filter}
                      <span className={`typo-caption ${active ? 'text-[#5a5a5a]' : 'text-[#9b9b9b]'}`}>
                        {getTaskCount(filter)}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 space-y-6">
                {taskFilter === 'Done' ? (
                  groupedTasks.done.length ? (
                    <section>
                      <SectionHeader title="Completed" meta={String(groupedTasks.done.length)} tone="text-[#96a39c]" />
                      <div className="overflow-hidden rounded-[20px] border border-[#e7ece9] bg-[#fbfcfb] px-4">
                        {groupedTasks.done.map((task) => (
                          <TaskRow
                            key={task.id}
                            task={task}
                            onOpen={setSelectedTaskId}
                            onToggleStatus={cycleTaskStatus}
                            onOpenActions={setTaskActionTargetId}
                            assigneeLabel={task.assignee}
                            canUpdate={resolvedPermissions.canUpdateTasks}
                          />
                        ))}
                      </div>
                    </section>
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-[#d8e2db] bg-white px-4 py-6">
                      <p className="typo-body text-[#6f7c74]">Nothing completed yet.</p>
                    </div>
                  )
                ) : (() => {
                  const sections = [
                    ['Overdue', groupedTasks.overdue, 'text-[#c34545]'],
                    ['Today', groupedTasks.today, 'text-[#c66f19]'],
                    ['This week', groupedTasks.week, 'text-[#6f7d74]'],
                  ].map(([label, sectionTasks, tone]) => {
                    const visibleTasks = sectionTasks.filter((task) => {
                      if (task.status === 'done') return false
                      if (taskFilter === 'To do') return task.status === 'todo'
                      if (taskFilter === 'In progress') return task.status === 'inprogress'
                      return true
                    })
                    return { label, tone, visibleTasks }
                  })
                  const totalVisible = sections.reduce((n, s) => n + s.visibleTasks.length, 0)
                  if (totalVisible === 0) {
                    return (
                      <div className="rounded-[20px] border border-dashed border-[#d8e2db] bg-white px-4 py-6">
                        <p className="typo-body text-[#6f7c74]">Nothing on the plate right now.</p>
                      </div>
                    )
                  }
                  return sections.map(({ label, tone, visibleTasks }) => {
                    if (!visibleTasks.length) return null
                    return (
                      <section key={label}>
                        <SectionHeader title={label} meta={String(visibleTasks.length)} tone={tone} />
                        <div className="overflow-hidden rounded-[20px] border border-[#e3ebe5] bg-white px-4">
                          {visibleTasks.map((task) => (
                            <TaskRow
                              key={task.id}
                              task={task}
                              onOpen={setSelectedTaskId}
                              onToggleStatus={cycleTaskStatus}
                              onOpenActions={setTaskActionTargetId}
                              assigneeLabel={task.assignee}
                              canUpdate={resolvedPermissions.canUpdateTasks}
                            />
                          ))}
                        </div>
                      </section>
                    )
                  })
                })()}
              </div>
                </>
              ) : (
                <div className="mt-4 grid grid-cols-[260px_260px_260px] gap-3 overflow-x-auto pb-2">
                  {[
                    { key: 'todo', label: 'To do', tasks: scopedTasks.filter((t) => t.status === 'todo'), dot: 'bg-[#94a096]' },
                    { key: 'inprogress', label: 'In progress', tasks: scopedTasks.filter((t) => t.status === 'inprogress'), dot: 'bg-[#d18c33]' },
                    { key: 'done', label: 'Done', tasks: scopedTasks.filter((t) => t.status === 'done'), dot: 'bg-[#5fa87a]' },
                  ].map(({ key, label, tasks: columnTasks, dot }) => (
                    <section key={key} className="flex flex-col rounded-[20px] bg-[#f2f5f3] p-2.5">
                      <div className="mb-2.5 flex items-center gap-2 px-1.5 pt-0.5">
                        <span className={`size-2 rounded-full ${dot}`} />
                        <p className="typo-body-strong text-[#173324]">{label}</p>
                        <span className="typo-badge ml-auto text-[#7c8a83]">{columnTasks.length}</span>
                      </div>
                      <div className="space-y-2">
                        {columnTasks.length === 0 ? (
                          <div className="grid place-items-center rounded-[14px] border border-dashed border-[#dbe3dd] bg-white/50 py-6">
                            <p className="typo-caption text-[#8b978f]">Nothing here</p>
                          </div>
                        ) : null}
                        {columnTasks.map((task) => {
                          const priority = task.priority
                          const priorityTone = priority === 'High'
                            ? 'bg-[#fbecec] text-[#a83636]'
                            : priority === 'Medium'
                              ? 'bg-[#fcf1e3] text-[#a06520]'
                              : priority === 'Low'
                                ? 'bg-[#eaf3ed] text-[#3f7a55]'
                                : ''
                          const initials = (task.assignee || '')
                            .split(' ')
                            .map((part) => part[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                          return (
                            <button
                              key={task.id}
                              type="button"
                              onClick={() => setSelectedTaskId(task.id)}
                              className="w-full rounded-[14px] border border-[#e6ece8] bg-white px-3 py-3 text-left shadow-[0_1px_2px_rgba(16,36,24,0.04)]"
                            >
                              {priority ? (
                                <span className={`typo-badge inline-block rounded-full px-2 py-0.5 ${priorityTone}`}>{priority}</span>
                              ) : null}
                              <p className={`typo-body-strong mt-2 line-clamp-2 ${task.status === 'done' ? 'text-[#8c9891] line-through' : 'text-[#173324]'}`}>{task.title}</p>
                              <div className="mt-3 flex items-center justify-between gap-2">
                                <span className="typo-caption text-[#7c8a83]">{task.due}</span>
                                <span
                                  className="typo-badge grid size-6 place-items-center rounded-full bg-[#173324] text-white"
                                  title={task.assignee}
                                  aria-label={task.assignee}
                                >
                                  {initials}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {currentTab === 'team' ? (
            <section className="space-y-6">
              {teamGroups.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-[#d8e2db] bg-white px-4 py-6">
                  <p className="typo-body text-[#6f7c74]">No team tasks are visible for this role yet.</p>
                </div>
              ) : null}
              {teamGroups.map(([assignee, assigneeTasks]) => (
                <section key={assignee}>
                  <SectionHeader title={assignee} meta={`${assigneeTasks.length} tasks`} tone="text-[#102418]" />
                  <div className="overflow-hidden rounded-[20px] border border-[#e3ebe5] bg-white px-4">
                    {assigneeTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onOpen={setSelectedTaskId}
                        onToggleStatus={cycleTaskStatus}
                        onOpenActions={setTaskActionTargetId}
                        assigneeLabel={assignee}
                        canUpdate={resolvedPermissions.canUpdateTasks}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </section>
          ) : null}

          {currentTab === 'approvals' ? (
            <section>
              <div className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto">
                {[
                  ['pending', 'Pending', approvalSections.pending.length, 'bg-[#d18c33]'],
                  ['completed', 'Resolved', approvalSections.completed.length, 'bg-[#5fa87a]'],
                ].map(([key, label, count, dotColor]) => {
                  const selected = approvalView === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setApprovalView(key)}
                      className={`typo-body inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${selected ? 'bg-[#ececec] text-black' : 'text-[#6f7d74] hover:bg-[#f2f2f2]'}`}
                    >
                      <span className={`size-1.5 rounded-full ${dotColor}`} />
                      {label}
                      <span className={`typo-caption ${selected ? 'text-[#5a5a5a]' : 'text-[#9b9b9b]'}`}>{count}</span>
                    </button>
                  )
                })}
              </div>

              <div className="border-y border-[#e5ece7]">
                {visibleApprovalItems.length ? visibleApprovalItems.map((item) => (
                  <ApprovalCard key={item.id} item={item} onOpen={setSelectedApprovalId} />
                )) : (
                  <p className="typo-body px-1 py-4 text-[#6f7c74]">No {approvalView === 'pending' ? 'pending' : 'resolved'} approvals.</p>
                )}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      {composerMode ? (
        <main className="ui-screen-base ui-feature-surface fixed inset-0 z-[100] min-h-dvh w-full overflow-x-hidden bg-white text-black">
          <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
            <ProjectWorkspaceHeader
              title={composerMode === 'task' ? 'Create task' : editingApprovalId ? 'Edit approval' : 'Send for approval'}
              subtitle={selectedProject?.scope || homeownerProjectName}
              onBack={closeComposer}
            />

            <div className="ui-screen-content pt-6">
              {composerMode === 'task' ? (
                <div className="space-y-5">
                  <label className="block">
                    <p className="typo-label mb-2 uppercase text-[#7a8780]">Task title</p>
                    <input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="What needs to be done?" autoFocus className="typo-body h-12 w-full rounded-[18px] border border-[#d8e2db] bg-white px-4 outline-none placeholder:text-[#99a39d]" />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <p className="typo-label mb-2 uppercase text-[#7a8780]">Assign to</p>
                      <select value={newTaskAssignee} onChange={(event) => setNewTaskAssignee(event.target.value)} className="typo-body h-12 w-full rounded-[18px] border border-[#d8e2db] bg-white px-3 outline-none">
                        {['Me', 'Riya Desai', 'Aanya Rao', 'Nisha Reddy', 'Priya Sharma'].map((name) => <option key={name}>{name}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <p className="typo-label mb-2 uppercase text-[#7a8780]">Priority</p>
                      <select value={newTaskPriority} onChange={(event) => setNewTaskPriority(event.target.value)} className="typo-body h-12 w-full rounded-[18px] border border-[#d8e2db] bg-white px-3 outline-none">
                        {['High', 'Medium', 'Low'].map((priority) => <option key={priority}>{priority}</option>)}
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <p className="typo-label mb-2 uppercase text-[#7a8780]">Due bucket</p>
                    <select value={newTaskDue} onChange={(event) => setNewTaskDue(event.target.value)} className="typo-body h-12 w-full rounded-[18px] border border-[#d8e2db] bg-white px-3 outline-none">
                      {['Today', 'Overdue', 'This week', 'Done'].map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <div className="border-l-2 border-[#b7c8bd] pl-3">
                    <p className="typo-body text-[#5d6d64]">This is an internal project task. It will only appear to the assigned professional team.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <label className="block">
                    <p className="typo-label mb-2 uppercase text-[#7a8780]">Approval title</p>
                    <input value={newApprovalTitle} onChange={(event) => setNewApprovalTitle(event.target.value)} placeholder="What should the homeowner decide?" autoFocus className="typo-body h-12 w-full rounded-[18px] border border-[#d8e2db] bg-white px-4 outline-none placeholder:text-[#99a39d]" />
                  </label>
                  <label className="block">
                    <p className="typo-label mb-2 uppercase text-[#7a8780]">Approval type</p>
                    <select value={newApprovalType} onChange={(event) => setNewApprovalType(event.target.value)} className="typo-body h-12 w-full rounded-[18px] border border-[#d8e2db] bg-white px-3 outline-none">
                      {['Material selection', 'Design approval', 'Design selection', 'Change request', 'Other'].map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <p className="typo-label mb-2 uppercase text-[#7a8780]">Description for homeowner</p>
                    <textarea value={newApprovalDescription} onChange={(event) => setNewApprovalDescription(event.target.value)} rows={5} placeholder="Explain the decision and the available options" className="typo-body w-full resize-none rounded-[18px] border border-[#d8e2db] bg-white px-4 py-3 outline-none placeholder:text-[#99a39d]" />
                  </label>
                  <div>
                    <p className="typo-label mb-2 uppercase text-[#7a8780]">Add image/video</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['image', 'Add image'],
                        ['video', 'Add video'],
                      ].map(([type, label]) => {
                        const selected = newApprovalMediaType === type
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setNewApprovalMediaType(type)}
                            className={`typo-body-strong flex h-20 flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed ${selected ? 'border-black bg-[#f5f7f5] text-black' : 'border-[#cbd9d0] bg-white text-[#607169]'}`}
                          >
                            <Plus size={18} />
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <label className="block">
                    <p className="typo-label mb-2 uppercase text-[#7a8780]">Response needed by</p>
                    <input type="date" value={newApprovalDueDate} onChange={(event) => setNewApprovalDueDate(event.target.value)} className="typo-body h-12 w-full rounded-[18px] border border-[#d8e2db] bg-white px-4 outline-none" />
                  </label>
                </div>
              )}
            </div>

            <div className="fixed bottom-0 left-1/2 z-[101] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e6ece8] bg-white px-4 pb-6 pt-4">
              <div className="grid grid-cols-[auto_1fr] gap-3">
                <Button type="button" variant="ghost" onClick={closeComposer} className="h-12 rounded-[20px] border border-[#d8e2db] px-5 text-[#4f5d55]">
                  Cancel
                </Button>
                <Button
                  type="button"
                  fullWidth
                  onClick={composerMode === 'task' ? createTask : createApproval}
                  disabled={composerMode === 'task' ? !newTaskTitle.trim() : !newApprovalTitle.trim() || !newApprovalDescription.trim()}
                  className="h-12 rounded-[20px]"
                >
                  {composerMode === 'task' ? 'Create task' : editingApprovalId ? 'Save changes' : 'Send to homeowner'}
                </Button>
              </div>
            </div>
          </section>
        </main>
      ) : null}

      {taskActionTargetId && resolvedPermissions.canUpdateTasks ? (
        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e6ece8] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          <p className="typo-label mb-3 uppercase text-[#7a8780]">Task actions</p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <TaskStatusChip label="To do" selected={scopedTasks.find((task) => task.id === taskActionTargetId)?.status === 'todo'} onClick={() => { moveTaskStatus(taskActionTargetId, 'todo'); setTaskActionTargetId(null) }} />
            <TaskStatusChip label="In progress" selected={scopedTasks.find((task) => task.id === taskActionTargetId)?.status === 'inprogress'} onClick={() => { moveTaskStatus(taskActionTargetId, 'inprogress'); setTaskActionTargetId(null) }} />
            <TaskStatusChip label="Done" selected={scopedTasks.find((task) => task.id === taskActionTargetId)?.status === 'done'} onClick={() => { moveTaskStatus(taskActionTargetId, 'done'); setTaskActionTargetId(null) }} />
          </div>
          <button
            type="button"
            onClick={() => {
              setTasks((prev) => prev.filter((task) => task.id !== taskActionTargetId))
              setTaskActionTargetId(null)
            }}
            className="typo-body-strong mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#efcaca] bg-[#fff4f4] text-[#c34545]"
          >
            <Trash size={16} />
            Delete task
          </button>
        </div>
      ) : null}

    </main>
  )
}


