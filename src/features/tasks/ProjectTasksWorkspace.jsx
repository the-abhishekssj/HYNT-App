import { useMemo, useState } from 'react'
import {
  CaretLeft,
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
  SealQuestion,
  Trash,
  UsersThree,
  XCircle,
} from '@phosphor-icons/react'

const tabs = [
  { key: 'my', label: 'My Tasks', icon: ListBullets },
  { key: 'team', label: 'Team', icon: UsersThree },
  { key: 'approvals', label: 'Approvals', icon: SealQuestion },
]

const taskFilters = ['All', 'To do', 'In progress', 'Done']

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
      className={`inline-flex h-10 items-center rounded-full border px-4 text-[14px] leading-[20px] transition ${
        selected ? 'border-[#173324] bg-[#173324] font-bold text-white' : 'border-[#d8e0da] bg-white font-medium text-[#355244]'
      }`}
    >
      {label}
    </button>
  )
}

function SectionHeader({ title, meta, tone = 'text-[#6f7d74]' }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className={`text-[12px] font-bold uppercase ${tone}`}>{title}</p>
      {meta ? <span className="text-[12px] font-medium text-[#8a948f]">{meta}</span> : null}
    </div>
  )
}

function TaskRow({ task, onOpen, onToggleStatus, onOpenActions, assigneeLabel = task.assignee }) {
  return (
    <article className="border-b border-[#edf1ee] py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggleStatus(task)}
          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border ${
            task.status === 'done'
              ? 'border-[#26c485] bg-[#26c485] text-white'
              : task.status === 'inprogress'
                ? 'border-[#d6b08d] bg-[#fff4e8] text-[#b66d29]'
                : 'border-[#d5ddd7] bg-white text-[#94a096]'
          }`}
          aria-label={`Update ${task.title}`}
        >
          {task.status === 'done' ? <Check size={14} weight="bold" /> : task.status === 'inprogress' ? <ClockCountdown size={14} weight="bold" /> : <Circle size={12} weight="bold" />}
        </button>

        <button type="button" onClick={() => onOpen(task.id)} className="min-w-0 flex-1 text-left">
          <p className={`text-[14px] leading-[20px] ${task.status === 'done' ? 'font-medium text-[#8c9891 line-through]' : 'font-bold text-[#1c1c1c]'}`}>{task.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[#ecf5ef] px-2 py-1 text-[10px] font-bold leading-[14px] text-[#267449]">{assigneeLabel}</span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-bold leading-[14px] ${dueTone[task.due] || 'bg-[#f2f4f3] text-[#6b7670]'}`}>{task.due}</span>
            <span className={`rounded-md px-2 py-1 text-[10px] font-bold leading-[14px] ${
              task.status === 'done'
                ? 'bg-[#eaf8ef] text-[#267449]'
                : task.status === 'inprogress'
                  ? 'bg-[#fff1e3] text-[#b66d29]'
                  : 'bg-[#eef2ff] text-[#4868c7]'
            }`}>
              {task.status === 'todo' ? 'To do' : task.status === 'inprogress' ? 'In progress' : 'Done'}
            </span>
          </div>
        </button>

        <button type="button" onClick={() => onOpenActions(task.id)} className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f6f8f7] text-[#728078]" aria-label="Task actions">
          <DotsThree size={16} weight="bold" />
        </button>
      </div>
    </article>
  )
}

function ApprovalCard({ item, onOpen, compact = false }) {
  const tone = approvalTone[item.status]

  return (
    <article
      className={`rounded-[20px] border bg-white ${compact ? 'p-4' : 'p-5'} ${
        item.status === 'approved'
          ? 'border-[#dbeee2]'
          : item.status === 'rejected'
            ? 'border-[#f0d4d4]'
            : item.status === 'question'
              ? 'border-[#ddd6fb]'
              : 'border-[#eadcb2]'
      }`}
    >
      <button type="button" onClick={() => onOpen(item.id)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[16px] font-bold leading-[22px] text-[#121212]">{item.title}</p>
            <p className="mt-1 text-[12px] font-medium leading-[18px] text-[#7b8780]">{item.type}</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${tone}`}>
            {approvalLabel[item.status]}
          </span>
        </div>
        <div className="mt-4 rounded-2xl bg-[#f3f7f4] px-4 py-5">
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>
          <p className="mt-3 text-[14px] leading-[20px] text-[#355244]">{item.description}</p>
        </div>
        <p className="mt-3 text-[12px] font-medium leading-[18px] text-[#8a948f]">Sent {item.sentAt} · Due {item.dueDate}</p>
      </button>
    </article>
  )
}

function ProTaskDetail({
  selectedProject,
  task,
  completedByIndex,
  onBack,
  onMoveTask,
  onToggleStep,
}) {
  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-24 pt-16">
        <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e6ece8] bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <button type="button" onClick={onBack} className="flex items-center gap-3">
              <CaretLeft size={20} />
              <div className="text-left">
                <p className="text-[16px] font-bold leading-[22px] text-black">Task details</p>
                <p className="text-[12px] font-medium leading-[18px] text-[#7f8a84]">{selectedProject.scope}</p>
              </div>
            </button>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${dueTone[task.due] || 'bg-[#f2f4f3] text-[#6b7670]'}`}>{task.due}</span>
          </div>
        </header>

        <div className="px-4 pt-6">
          <section className="rounded-[20px] border border-[#e3ebe5] bg-[#fbfcfb] p-5">
            <p className="text-[20px] font-bold leading-[26px] text-[#102418]">{task.title}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {[
                ['Assigned to', task.assignee],
                ['Assigned by', task.assignedBy],
                ['Due date', task.dueDate],
                ['Due time', task.dueTime],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase text-[#91a097]">{label}</p>
                  <p className="mt-1 text-[14px] font-medium leading-[20px] text-[#1d1d1d]">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-[20px] border border-[#e3ebe5] bg-white p-5">
            <SectionHeader title="Remaining steps" meta={`${task.steps.length} steps`} />
            <div>
              {task.steps.map((step, index) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => onToggleStep(index)}
                  className="flex w-full items-start gap-3 border-b border-[#edf1ee] py-4 text-left last:border-b-0"
                >
                  <span className="mt-0.5 text-[#5c6e63]">
                    {completedByIndex[index] ? <CheckCircle size={18} weight="fill" className="text-[#26c485]" /> : <Circle size={18} />}
                  </span>
                  <span className="min-w-0">
                    <p className={`text-[14px] leading-[20px] ${completedByIndex[index] ? 'font-medium text-[#92a097 line-through]' : 'font-medium text-[#1d1d1d]'}`}>{index + 1}. {step}</p>
                    {completedByIndex[index] ? <p className="mt-1 text-[12px] font-medium leading-[18px] text-[#8a948f]">Completed at {completedByIndex[index]}</p> : null}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 z-[85] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e6ece8] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-[12px] font-bold uppercase text-[#7a8780]">Move task to</p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <TaskStatusChip label="To do" selected={task.status === 'todo'} onClick={() => onMoveTask('todo')} />
          <TaskStatusChip label="In progress" selected={task.status === 'inprogress'} onClick={() => onMoveTask('inprogress')} />
          <TaskStatusChip label="Done" selected={task.status === 'done'} onClick={() => onMoveTask('done')} />
        </div>
      </div>
    </main>
  )
}

export default function ProjectTasksWorkspace({
  mode = 'pro',
  selectedProject,
  tasks = [],
  setTasks,
  selectedTaskId,
  setSelectedTaskId,
  taskStepCompletion = {},
  setTaskStepCompletion,
  onBack,
  homeownerClientName = 'Priya Sharma',
  homeownerProjectName = 'Sharma 3BHK',
  homeownerDesignerName = 'Riya Desai',
}) {
  const [activeTab, setActiveTab] = useState('my')
  const [activeView, setActiveView] = useState('list')
  const [taskFilter, setTaskFilter] = useState('All')
  const [taskActionTargetId, setTaskActionTargetId] = useState(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskAssignee, setNewTaskAssignee] = useState('Me')
  const [newTaskPriority, setNewTaskPriority] = useState('High')
  const [newTaskDue, setNewTaskDue] = useState('Today')
  const [approvalItems, setApprovalItems] = useState(approvalSeed)
  const [selectedApprovalId, setSelectedApprovalId] = useState(null)
  const [clientResponse, setClientResponse] = useState('')

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null
  const selectedApproval = approvalItems.find((item) => item.id === selectedApprovalId) || null

  const groupedTasks = useMemo(() => ({
    overdue: tasks.filter((task) => task.due === 'Overdue'),
    today: tasks.filter((task) => task.due === 'Today'),
    week: tasks.filter((task) => !['Overdue', 'Today', 'Done'].includes(task.due)),
    done: tasks.filter((task) => task.status === 'done' || task.due === 'Done'),
  }), [tasks])

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'All') return tasks
    if (taskFilter === 'To do') return tasks.filter((task) => task.status === 'todo')
    if (taskFilter === 'In progress') return tasks.filter((task) => task.status === 'inprogress')
    return tasks.filter((task) => task.status === 'done')
  }, [taskFilter, tasks])

  const getTaskCount = (filter) => {
    if (filter === 'All') return tasks.length
    if (filter === 'To do') return tasks.filter((task) => task.status === 'todo').length
    if (filter === 'In progress') return tasks.filter((task) => task.status === 'inprogress').length
    return tasks.filter((task) => task.status === 'done').length
  }

  const teamGroups = useMemo(() => {
    const map = new Map()
    tasks.forEach((task) => {
      const current = map.get(task.assignee) || []
      current.push(task)
      map.set(task.assignee, current)
    })
    return Array.from(map.entries())
  }, [tasks])

  const columns = [
    { key: 'todo', title: 'To do', tone: 'bg-[#f2f4f3] text-[#5f6b64]' },
    { key: 'inprogress', title: 'In progress', tone: 'bg-[#fff1e3] text-[#ad6522]' },
    { key: 'done', title: 'Done', tone: 'bg-[#ebf8ef] text-[#267449]' },
  ]

  const approvalSections = {
    pending: approvalItems.filter((item) => item.status === 'pending' || item.status === 'question'),
    completed: approvalItems.filter((item) => item.status === 'approved' || item.status === 'rejected'),
  }

  const moveTaskStatus = (taskId, nextStatus) => {
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
    const next = task.status === 'todo' ? 'inprogress' : task.status === 'inprogress' ? 'done' : 'todo'
    moveTaskStatus(task.id, next)
  }

  const createTask = () => {
    if (!newTaskTitle.trim()) return
    setTasks((prev) => [
      {
        id: `t-${Date.now()}`,
        title: newTaskTitle.trim(),
        assignee: newTaskAssignee === 'Me' ? 'You' : newTaskAssignee,
        assignedBy: selectedProject?.client || homeownerClientName,
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
      },
      ...prev,
    ])
    setNewTaskTitle('')
    setNewTaskAssignee('Me')
    setNewTaskPriority('High')
    setNewTaskDue('Today')
    setIsComposerOpen(false)
  }

  const handleApprovalResponse = (nextStatus) => {
    if (!selectedApproval) return
    setApprovalItems((prev) => prev.map((item) => (
      item.id === selectedApproval.id
        ? {
            ...item,
            status: nextStatus,
            clientQuestion: nextStatus === 'question' ? clientResponse.trim() || item.clientQuestion : item.clientQuestion,
          }
        : item
    )))
    setClientResponse('')
    setSelectedApprovalId(null)
  }

  if (mode === 'homeowner') {
    if (selectedApproval) {
      return (
        <main className="min-h-dvh w-full overflow-x-hidden bg-[#f7faf8] font-['Urbanist'] text-black">
          <section className="mx-auto w-full max-w-[390px] pb-8">
            <header className="bg-[#173324] px-4 pb-5 pt-5 text-white">
              <button type="button" onClick={() => setSelectedApprovalId(null)} className="mb-4 flex items-center gap-2 text-[14px] font-medium">
                <CaretLeft size={18} />
                Back
              </button>
              <p className="text-[24px] font-bold leading-[30px]">Approvals needed</p>
              <p className="mt-2 text-[14px] leading-[20px] text-white/72">From {homeownerDesignerName} · {homeownerProjectName}</p>
            </header>

            <div className="px-4 pt-5">
              <article className="rounded-[20px] border border-[#e2e9e4] bg-white p-5 shadow-[0_12px_32px_rgba(17,24,20,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${approvalTone[selectedApproval.status]}`}>
                    {approvalLabel[selectedApproval.status]}
                  </span>
                  <span className="text-[12px] font-medium leading-[18px] text-[#7b8780]">Due {selectedApproval.dueDate}</span>
                </div>
                <p className="mt-4 text-[20px] font-bold leading-[26px] text-[#102418]">{selectedApproval.title}</p>
                <p className="mt-1 text-[14px] font-medium leading-[20px] text-[#708078]">{selectedApproval.type}</p>

                <div className="mt-5 rounded-[20px] bg-[#f2f7f4] px-4 py-5">
                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-white">
                    <img src={selectedApproval.image} alt={selectedApproval.title} className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-4 text-[14px] leading-[22px] text-[#24362d]">{selectedApproval.description}</p>
                </div>

                {selectedApproval.clientQuestion ? (
                  <div className={`mt-5 rounded-[20px] px-4 py-4 ${selectedApproval.status === 'rejected' ? 'bg-[#fff2f2]' : 'bg-[#f4efff]'}`}>
                    <p className={`text-[12px] font-bold uppercase ${selectedApproval.status === 'rejected' ? 'text-[#c34545]' : 'text-[#6844d8]'}`}>
                      {selectedApproval.status === 'rejected' ? 'Reason shared' : 'Question raised'}
                    </p>
                    <p className="mt-2 text-[14px] leading-[20px] text-[#24362d]">{selectedApproval.clientQuestion}</p>
                  </div>
                ) : null}

                <textarea
                  value={clientResponse}
                  onChange={(event) => setClientResponse(event.target.value)}
                  rows={3}
                  placeholder="Add a note if you want to ask a question or explain your choice"
                  className="mt-5 w-full rounded-[20px] border border-[#d7e2db] px-4 py-3 text-[14px] font-medium leading-[20px] text-[#24362d] outline-none placeholder:text-[#98a39d]"
                />

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => handleApprovalResponse('approved')} className="rounded-2xl bg-[#173324] px-4 py-3 text-[14px] font-bold leading-[20px] text-white">
                    Approve
                  </button>
                  <button type="button" onClick={() => handleApprovalResponse('rejected')} className="rounded-2xl border border-[#efcaca] bg-[#fff4f4] px-4 py-3 text-[14px] font-bold leading-[20px] text-[#c34545]">
                    Reject
                  </button>
                  <button type="button" onClick={() => handleApprovalResponse('question')} className="rounded-2xl border border-[#ddd6fb] bg-[#f4efff] px-4 py-3 text-[14px] font-bold leading-[20px] text-[#6844d8]">
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
      <main className="min-h-dvh w-full overflow-x-hidden bg-[#f7faf8] font-['Urbanist'] text-black">
        <section className="mx-auto w-full max-w-[390px] pb-8">
          <header className="bg-[#173324] px-4 pb-5 pt-5 text-white">
            <button type="button" onClick={onBack} className="mb-4 flex items-center gap-2 text-[14px] font-medium">
              <CaretLeft size={18} />
              Back
            </button>
            <p className="text-[24px] font-bold leading-[30px]">Approvals needed</p>
            <p className="mt-2 text-[14px] leading-[20px] text-white/72">From {homeownerDesignerName} · {homeownerProjectName}</p>
          </header>

          <div className="px-4 pt-5">
            <div className="rounded-[20px] bg-[#eaf5ee] px-4 py-3 text-[14px] font-bold leading-[20px] text-[#267449]">
              {homeownerDesignerName} needs your decisions on these items. Open each card to review and respond.
            </div>

            <section className="mt-6">
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
        onBack={() => setSelectedTaskId(null)}
        onMoveTask={(nextStatus) => moveTaskStatus(selectedTask.id, nextStatus)}
        onToggleStep={toggleStep}
      />
    )
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-24 pt-16">
        <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e6ece8] bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <button type="button" onClick={onBack} className="flex items-center gap-3">
              <CaretLeft size={20} />
              <div className="text-left">
                <p className="text-[16px] font-bold leading-[22px] text-black">Tasks</p>
                <p className="text-[12px] font-medium leading-[18px] text-[#7f8a84]">{selectedProject?.scope || homeownerProjectName}</p>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setActiveTab('approvals')} className="grid size-9 place-items-center rounded-full bg-[#f4efff] text-[#6844d8]" aria-label="Open approvals">
                <PaperPlaneTilt size={18} weight="bold" />
              </button>
              <button type="button" onClick={() => setIsComposerOpen((prev) => !prev)} className="grid size-9 place-items-center rounded-full bg-[#173324] text-white" aria-label="Create task">
                <Plus size={18} weight="bold" />
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 pt-5">
          <div className="grid grid-cols-3 gap-2 rounded-[20px] border border-[#e4ebe6] bg-[#fbfcfb] p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-2xl px-3 py-3 text-left transition ${active ? 'bg-[#173324] text-white shadow-[0_10px_24px_rgba(23,51,36,0.16)]' : 'text-[#6f7c74]'}`}
                >
                  <Icon size={16} weight={active ? 'fill' : 'regular'} />
                  <p className={`mt-2 text-[12px] leading-[16px] ${active ? 'font-bold' : 'font-medium'}`}>{tab.label}</p>
                </button>
              )
            })}
          </div>

          {isComposerOpen ? (
            <section className="mt-6 rounded-[20px] border border-[#e3ebe5] bg-[#f7faf8] p-5">
              <SectionHeader title="New task" />
              <div className="space-y-4">
                <label className="block">
                  <p className="mb-2 text-[12px] font-bold uppercase text-[#7a8780]">Task title</p>
                  <input
                    value={newTaskTitle}
                    onChange={(event) => setNewTaskTitle(event.target.value)}
                    placeholder="What needs to be done?"
                    className="h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 text-[14px] font-medium outline-none placeholder:text-[#99a39d]"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <p className="mb-2 text-[12px] font-bold uppercase text-[#7a8780]">Assign to</p>
                    <select value={newTaskAssignee} onChange={(event) => setNewTaskAssignee(event.target.value)} className="h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 text-[14px] font-medium outline-none">
                      {['Me', 'Rohan', 'Aarav', 'Nisha', 'Vikram', 'Meera', 'Arjun'].map((name) => <option key={name}>{name}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <p className="mb-2 text-[12px] font-bold uppercase text-[#7a8780]">Priority</p>
                    <select value={newTaskPriority} onChange={(event) => setNewTaskPriority(event.target.value)} className="h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 text-[14px] font-medium outline-none">
                      {['High', 'Medium', 'Low'].map((priority) => <option key={priority}>{priority}</option>)}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <p className="mb-2 text-[12px] font-bold uppercase text-[#7a8780]">Due bucket</p>
                    <select value={newTaskDue} onChange={(event) => setNewTaskDue(event.target.value)} className="h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 text-[14px] font-medium outline-none">
                      {['Today', 'Overdue', 'This week', 'Done'].map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                  <div className="flex items-end">
                    <button type="button" onClick={createTask} className="h-12 w-full rounded-2xl bg-[#173324] px-4 text-[14px] font-bold text-white">
                      Create task
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {activeTab === 'my' ? (
            <section className="mt-6">
              <div className="flex items-center rounded-2xl border border-[#e4ebe6] bg-[#f5f8f6] p-1">
                {[
                  ['list', 'List', ListBullets],
                  ['kanban', 'Kanban', Kanban],
                ].map(([viewKey, label, Icon]) => {
                  const active = activeView === viewKey
                  return (
                    <button
                      key={viewKey}
                      type="button"
                      onClick={() => setActiveView(viewKey)}
                      className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-[14px] px-4 text-[14px] leading-[20px] ${active ? 'bg-white font-bold text-[#173324] shadow-sm' : 'font-medium text-[#6f7c74]'}`}
                    >
                      <Icon size={16} weight={active ? 'fill' : 'regular'} />
                      {label}
                    </button>
                  )
                })}
              </div>

              <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
                {taskFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setTaskFilter(filter)}
                    className={`flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-[20px] py-2 pl-3 pr-2 text-[14px] font-bold leading-[20px] ${taskFilter === filter ? 'bg-[#5fc18a] text-white' : 'border border-[#d1d1d1] bg-white text-black'}`}
                  >
                    {filter}
                    <span className={`grid size-6 place-items-center rounded-xl text-[12px] font-bold leading-[18px] ${taskFilter === filter ? 'bg-black text-white' : 'bg-[#f2f4f3] text-[#5f6f66]'}`}>
                      {String(getTaskCount(filter)).padStart(2, '0')}
                    </span>
                  </button>
                ))}
              </div>

              {activeView === 'list' ? (
                <div className="mt-6 space-y-6">
                  {[
                    ['Overdue', groupedTasks.overdue, 'text-[#c34545]'],
                    ['Today', groupedTasks.today, 'text-[#c66f19]'],
                    ['This week', groupedTasks.week, 'text-[#6f7d74]'],
                    ['Done', groupedTasks.done, 'text-[#96a39c]'],
                  ].map(([label, sectionTasks, tone]) => {
                    const visibleTasks = sectionTasks.filter((task) => (
                      taskFilter === 'All'
                        ? true
                        : taskFilter === 'To do'
                          ? task.status === 'todo'
                          : taskFilter === 'In progress'
                            ? task.status === 'inprogress'
                            : task.status === 'done'
                    ))
                    if (!visibleTasks.length) return null
                    return (
                      <section key={label}>
                        <SectionHeader title={label} meta={String(visibleTasks.length)} tone={tone} />
                        <div className={`overflow-hidden rounded-[20px] border ${label === 'Done' ? 'border-[#e7ece9] bg-[#fbfcfb]' : 'border-[#e3ebe5] bg-white'} px-4`}>
                          {visibleTasks.map((task) => (
                            <TaskRow
                              key={task.id}
                              task={task}
                              onOpen={setSelectedTaskId}
                              onToggleStatus={cycleTaskStatus}
                              onOpenActions={setTaskActionTargetId}
                              assigneeLabel={task.assignee}
                            />
                          ))}
                        </div>
                      </section>
                    )
                  })}
                </div>
              ) : (
                <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-2">
                  {columns.map((column) => {
                    const columnTasks = filteredTasks.filter((task) => task.status === column.key)
                    return (
                      <section key={column.key} className="w-[264px] shrink-0 rounded-[20px] border border-[#e3ebe5] bg-[#f8faf9] p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-[14px] font-bold leading-[20px] text-[#173324]">{column.title}</p>
                          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${column.tone}`}>{columnTasks.length}</span>
                        </div>
                        <div className="space-y-3">
                          {columnTasks.map((task) => (
                            <button key={task.id} type="button" onClick={() => setSelectedTaskId(task.id)} className="w-full rounded-[20px] border border-[#dde6e0] bg-white p-4 text-left">
                              <p className="text-[14px] font-bold leading-[20px] text-[#1d1d1d]">{task.title}</p>
                              <div className="mt-3 flex items-center justify-between">
                                <span className="rounded-md bg-[#ecf5ef] px-2 py-1 text-[10px] font-bold leading-[14px] text-[#267449]">{task.assignee}</span>
                                <span className={`rounded-full px-2 py-1 text-[10px] font-bold leading-[14px] ${dueTone[task.due] || 'bg-[#f2f4f3] text-[#6b7670]'}`}>{task.due}</span>
                              </div>
                            </button>
                          ))}
                          <button type="button" onClick={() => setIsComposerOpen(true)} className="flex w-full items-center gap-2 rounded-[18px] border border-dashed border-[#d8e2db] px-4 py-3 text-[14px] font-medium text-[#6f7c74]">
                            <span className="grid size-6 place-items-center rounded-lg bg-[#ecf5ef] text-[#267449]"><Plus size={14} weight="bold" /></span>
                            Add task
                          </button>
                        </div>
                      </section>
                    )
                  })}
                </div>
              )}
            </section>
          ) : null}

          {activeTab === 'team' ? (
            <section className="mt-6 space-y-6">
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
                      />
                    ))}
                  </div>
                </section>
              ))}
            </section>
          ) : null}

          {activeTab === 'approvals' ? (
            <section className="mt-6 space-y-6">
              <div className="rounded-[20px] bg-[#f3f7f4] px-4 py-3 text-[14px] font-bold leading-[20px] text-[#355244]">
                Items sent to {selectedProject?.client || homeownerClientName} for approval. The homeowner side uses the same structure and can respond from their task workspace.
              </div>

              <section>
                <SectionHeader title="Pending" meta={String(approvalSections.pending.length)} tone="text-[#102418]" />
                <div className="space-y-3">
                  {approvalSections.pending.map((item) => (
                    <ApprovalCard key={item.id} item={item} onOpen={setSelectedApprovalId} />
                  ))}
                </div>
              </section>

              <section>
                <SectionHeader title="Resolved" meta={String(approvalSections.completed.length)} tone="text-[#102418]" />
                <div className="space-y-3">
                  {approvalSections.completed.map((item) => (
                    <ApprovalCard key={item.id} item={item} onOpen={setSelectedApprovalId} compact />
                  ))}
                </div>
              </section>
            </section>
          ) : null}
        </div>
      </section>

      {taskActionTargetId ? (
        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e6ece8] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          <p className="mb-3 text-[12px] font-bold uppercase text-[#7a8780]">Task actions</p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <TaskStatusChip label="To do" selected={tasks.find((task) => task.id === taskActionTargetId)?.status === 'todo'} onClick={() => { moveTaskStatus(taskActionTargetId, 'todo'); setTaskActionTargetId(null) }} />
            <TaskStatusChip label="In progress" selected={tasks.find((task) => task.id === taskActionTargetId)?.status === 'inprogress'} onClick={() => { moveTaskStatus(taskActionTargetId, 'inprogress'); setTaskActionTargetId(null) }} />
            <TaskStatusChip label="Done" selected={tasks.find((task) => task.id === taskActionTargetId)?.status === 'done'} onClick={() => { moveTaskStatus(taskActionTargetId, 'done'); setTaskActionTargetId(null) }} />
          </div>
          <button
            type="button"
            onClick={() => {
              setTasks((prev) => prev.filter((task) => task.id !== taskActionTargetId))
              setTaskActionTargetId(null)
            }}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#efcaca] bg-[#fff4f4] text-[14px] font-bold text-[#c34545]"
          >
            <Trash size={16} />
            Delete task
          </button>
        </div>
      ) : null}

      {selectedApproval ? (
        <div className="fixed inset-0 z-[98] bg-black/30 backdrop-blur-sm">
          <div className="mx-auto flex min-h-dvh w-full max-w-[390px] items-end">
            <section className="w-full rounded-t-[32px] bg-white p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-bold uppercase text-[#7a8780]">Approval item</p>
                  <p className="mt-2 text-[20px] font-bold leading-[26px] text-[#102418]">{selectedApproval.title}</p>
                </div>
                <button type="button" onClick={() => setSelectedApprovalId(null)} className="grid size-10 place-items-center rounded-full bg-[#f4f6f5] text-[#607169]">
                  <XCircle size={20} weight="fill" />
                </button>
              </div>

              <div className="mt-5 rounded-[20px] bg-[#f3f7f4] px-4 py-4">
                <p className="text-[14px] leading-[20px] text-[#2a3b32]">{selectedApproval.description}</p>
                {selectedApproval.clientQuestion ? (
                  <div className={`mt-4 rounded-2xl px-4 py-3 ${selectedApproval.status === 'rejected' ? 'bg-[#fff2f2]' : 'bg-[#f4efff]'}`}>
                    <p className={`text-[12px] font-bold uppercase ${selectedApproval.status === 'rejected' ? 'text-[#c34545]' : 'text-[#6844d8]'}`}>
                      {selectedApproval.status === 'rejected' ? 'Client feedback' : 'Client question'}
                    </p>
                    <p className="mt-2 text-[14px] leading-[20px] text-[#24362d]">{selectedApproval.clientQuestion}</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3">
                <button type="button" onClick={() => setSelectedApprovalId(null)} className="flex h-12 items-center justify-between rounded-2xl border border-[#d8e2db] bg-white px-4 text-[14px] font-bold text-[#355244]">
                  Edit item
                  <PencilSimple size={16} />
                </button>
                <button type="button" onClick={() => setSelectedApprovalId(null)} className="flex h-12 items-center justify-between rounded-2xl border border-[#eadcb2] bg-[#fff9ee] px-4 text-[14px] font-bold text-[#a86a00]">
                  Send reminder
                  <PaperPlaneTilt size={16} />
                </button>
                <button type="button" onClick={() => setSelectedApprovalId(null)} className="flex h-12 items-center justify-between rounded-2xl border border-[#ddd6fb] bg-[#f4efff] px-4 text-[14px] font-bold text-[#6844d8]">
                  Reply to client
                  <ChatCircleDots size={16} />
                </button>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </main>
  )
}


