import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUp,
  Bell,
  ChatsCircle,
  Bookmark,
  BookmarkSimple,
  Camera,
  CalendarDots,
  CaretLeft,
  CaretDown,
  CaretRight,
  CaretUp,
  Check,
  CheckCircle,
  CheckSquareOffset,
  Circle,
  CurrencyInr,
  HandDeposit,
  Handshake,
  House,
  IdentificationBadge,
  ImagesSquare,
  Kanban,
  MapPinSimpleArea,
  MagnifyingGlass,
  PaperPlaneTilt,
  PencilSimpleLine,
  Plus,
  Crosshair,
  DotsThreeVertical,
  Palette,
  Scroll,
  MoneyWavy,
  ReadCvLogo,
  SlidersHorizontal,
  User,
  Eye,
  Microphone,
  X,
  XCircle,
} from '@phosphor-icons/react'
import './App.css'

const INR = '\u20b9'
const EMPTY = '\u2014'
const RANGE_DASH = '\u2013'
const FLOW_STORAGE_KEY = 'hynt-active-flow'

const quickActions = [
  { label: 'Brand of the day', icon: null },
  { label: 'Saved Ideas', icon: ImagesSquare },
  { label: 'Saved Products', icon: Bookmark },
  { label: 'Shortlisted Pros', icon: Handshake },
  { label: 'Posted Requirements', icon: HandDeposit },
]

const roomTags = ['Living Room', 'Bedroom', 'Kitchen', 'Home Office', 'Bathroom']

const homepageIdeas = [
  {
    badge: null,
    image: '/hynt-home/idea-1.png',
  },
  {
    badge: '1/16',
    image: '/hynt-home/idea-2.png',
  },
]

const homepagePros = [
  {
    name: 'Rohan Kapoor',
    role: 'Interior Designer',
    image: '/hynt-home/pro-1.png',
  },
  {
    name: 'Arjun Murthy',
    role: 'Interior Designer',
    image: '/hynt-home/pro-2.png',
  },
  {
    name: 'Maya Jain',
    role: 'Vastu Specialist',
    image: '/hynt-home/pro-2.png',
  },
]
const homepageProducts = [
  {
    title: 'Alto Modular Kitchen L-Shape',
    category: 'Kitchen Cabinets',
    image: '/hynt-home/product.png',
  },
  {
    title: 'Alto Modular Kitchen L-Shape',
    category: 'Kitchen Cabinets',
    image: '/hynt-home/product.png',
  },
]

const homepageEvents = [
  {
    title: 'AD Design Show',
    date: 'Thu, 11 Dec 2025',
    city: 'Hyderabad',
    interested: '100+ interested',
    image: '/hynt-home/event-1.png',
  },
  {
    title: 'FOAID',
    date: 'Fri, 19 Dec 2025',
    city: 'Mumbai',
    interested: '64 interested',
    image: '/hynt-home/event-2.png',
  },
]

const proTools = [
  { title: 'Moodboard', subtitle: 'AI + Manual', icon: Palette },
  { title: 'BOQs', subtitle: 'Autogenerate', icon: Scroll },
  { title: 'Finance', subtitle: 'Invoice and Track', icon: MoneyWavy },
  { title: 'Contracts', subtitle: 'Legal Templates', icon: ReadCvLogo },
]

const proProjects = [
  {
    id: 'p-1',
    client: 'Aarav Mehta',
    avatar: '/hynt-home/pro-1.png',
    phone: '+91 98765 43210',
    email: 'aarav.mehta@example.com',
    location: 'Bengaluru',
    scope: '3BHK renovation',
    status: 'Active',
    progress: 72,
    kickoffDate: '2026-04-01',
    budgetL: 28,
    spentL: 19.8,
    receivedL: 21.2,
    dueDate: '30 Sep 2026',
  },
  {
    id: 'p-2',
    client: 'Nisha Reddy',
    avatar: '/hynt-home/pro-2.png',
    phone: '+91 98220 44556',
    email: 'nisha.reddy@example.com',
    location: 'Hyderabad',
    scope: '2BHK new interior',
    status: 'Active',
    progress: 48,
    kickoffDate: '2026-04-08',
    budgetL: 16,
    spentL: 7.3,
    receivedL: 9.8,
    dueDate: '12 Nov 2026',
  },
  {
    id: 'p-3',
    client: 'Vikram Sethi',
    avatar: '/hynt-home/pro-2.png',
    phone: '+91 98110 99887',
    email: 'vikram.sethi@example.com',
    location: 'Mumbai',
    scope: '4BHK renovation',
    status: 'Pending',
    progress: 36,
    kickoffDate: '2026-03-21',
    budgetL: 42,
    spentL: 15.6,
    receivedL: 12.3,
    dueDate: '05 Jan 2027',
  },
  {
    id: 'p-4',
    client: 'Meera Khanna',
    avatar: '/hynt-home/pro-1.png',
    phone: '+91 98870 11223',
    email: 'meera.khanna@example.com',
    location: 'Pune',
    scope: '2BHK renovation',
    status: 'Done',
    progress: 100,
    kickoffDate: '2026-02-14',
    budgetL: 14,
    spentL: 13.4,
    receivedL: 14,
    dueDate: '18 Aug 2026',
  },
]

const projectDetailTools = [
  { label: 'Mood board', icon: ImagesSquare },
  { label: 'BOQ', icon: Scroll },
  { label: 'Tasks', icon: CheckSquareOffset },
  { label: 'Site diary', icon: PencilSimpleLine },
  { label: 'Finance', icon: CurrencyInr },
  { label: 'Contract', icon: Handshake },
  { label: 'Team', icon: User },
  { label: 'Floor plan', icon: House },
]

const initialProjectTasks = [
  {
    id: 't-1',
    title: 'Finalize living room flooring sample',
    assignee: 'Rohan',
    assignedBy: 'Aarav Mehta',
    due: 'Today',
    dueDate: '20 May 2026',
    dueTime: '06:00 PM',
    status: 'todo',
    steps: ['Get final sample board from vendor', 'Confirm finish with client', 'Lock SKU in BOQ'],
  },
  {
    id: 't-2',
    title: 'Site measurement re-check for kitchen wall',
    assignee: 'Aarav',
    assignedBy: 'Nisha Reddy',
    due: 'Overdue',
    dueDate: '18 May 2026',
    dueTime: '11:30 AM',
    status: 'todo',
    steps: ['Re-measure wall width and plumbing offset', 'Update drawing markups', 'Send revised dims to carpentry team'],
  },
  {
    id: 't-3',
    title: 'Share BOQ revision v2 with client',
    assignee: 'Nisha',
    assignedBy: 'Rohan',
    due: 'Today',
    dueDate: '20 May 2026',
    dueTime: '04:00 PM',
    status: 'inprogress',
    steps: ['Review line-item changes', 'Export PDF', 'Send to client on WhatsApp + email'],
  },
  {
    id: 't-4',
    title: 'Electrical conduit layout approval',
    assignee: 'Vikram',
    assignedBy: 'Aarav Mehta',
    due: 'Overdue',
    dueDate: '17 May 2026',
    dueTime: '02:00 PM',
    status: 'inprogress',
    steps: ['Collect electrician markup', 'Cross-check with lighting plan', 'Approve revised layout'],
  },
  {
    id: 't-5',
    title: 'Bedroom false ceiling work complete',
    assignee: 'Meera',
    assignedBy: 'Vikram',
    due: 'Done',
    dueDate: '16 May 2026',
    dueTime: '05:00 PM',
    status: 'done',
    steps: ['Level check complete', 'Edge profile finished', 'QC sign-off uploaded'],
  },
  {
    id: 't-6',
    title: 'Finalize vanity lighting selection',
    assignee: 'Arjun',
    assignedBy: 'Nisha Reddy',
    due: 'Done',
    dueDate: '15 May 2026',
    dueTime: '03:30 PM',
    status: 'done',
    steps: ['Compare shortlisted fixtures', 'Confirm power load', 'Place purchase request'],
  },
]

const initialBoqItems = [
  { id: 'boq-1', item: 'Living Room Flooring', area: '320 sqft', rate: 180, unit: 'sqft' },
  { id: 'boq-2', item: 'Wall putty + primer', area: 860, rate: 42, unit: 'sqft' },
  { id: 'boq-3', item: 'Modular kitchen carcass', area: 72, rate: 950, unit: 'sqft' },
  { id: 'boq-4', item: 'Electrical rewiring', area: 1, rate: 38000, unit: 'unit' },
]

const initialProjectInvoices = [
  { id: 'inv-1', projectId: 'p-1', number: 'INV-2401', title: 'Advance - civil package', date: '12 Apr 2026', amountL: 4.5, status: 'Paid' },
  { id: 'inv-2', projectId: 'p-1', number: 'INV-2407', title: 'Kitchen modular milestone', date: '03 May 2026', amountL: 3.2, status: 'In transit' },
  { id: 'inv-3', projectId: 'p-1', number: 'INV-2413', title: 'False ceiling stage 2', date: '16 May 2026', amountL: 2.1, status: 'Unpaid' },
  { id: 'inv-4', projectId: 'p-2', number: 'INV-2511', title: 'Design + planning retainer', date: '05 Apr 2026', amountL: 2.4, status: 'Paid' },
]

const initialProjectDiaryEntries = [
  {
    id: 'diary-1',
    projectId: 'p-1',
    createdAt: '2026-05-21T14:45:00+05:30',
    note: 'Ceiling channels installed in master bedroom. Need one correction near AC duct.',
    photos: ['/hynt-home/idea-1.png'],
  },
  {
    id: 'diary-2',
    projectId: 'p-1',
    createdAt: '2026-05-21T11:10:00+05:30',
    note: '',
    photos: ['/hynt-home/idea-2.png', '/hynt-home/product.png'],
  },
  {
    id: 'diary-3',
    projectId: 'p-1',
    createdAt: '2026-05-20T18:20:00+05:30',
    note: 'Client approved revised kitchen handle profile. Proceeding with procurement.',
    photos: [],
  },
]

const initialProjectTeamMembers = [
  { id: 'tm-1', projectId: 'p-1', name: 'Aarav Mehta', role: 'Lead designer', avatar: '/hynt-home/pro-1.png', isYou: true, phone: '+91 98765 43210' },
  { id: 'tm-2', projectId: 'p-1', name: 'Nisha Reddy', role: 'Site supervisor', avatar: '/hynt-home/pro-2.png', isYou: false, phone: '+91 98220 44556' },
  { id: 'tm-3', projectId: 'p-1', name: 'Arjun Murthy', role: '3D visualizer', avatar: '/hynt-home/pro-2.png', isYou: false, phone: '+91 98123 44567' },
  { id: 'tm-4', projectId: 'p-2', name: 'Meera Khanna', role: 'Procurement lead', avatar: '/hynt-home/pro-1.png', isYou: true, phone: '+91 98870 11223' },
]

const initialFirmMembers = [
  { id: 'fm-1', name: 'Aarav Mehta', role: 'Lead designer', avatar: '/hynt-home/pro-1.png', phone: '+91 98765 43210', occupancy: { status: 'occupied', project: '3BHK renovation', day: 51 } },
  { id: 'fm-2', name: 'Nisha Reddy', role: 'Site supervisor', avatar: '/hynt-home/pro-2.png', phone: '+91 98220 44556', occupancy: { status: 'occupied', project: '2BHK new interior', day: 44 } },
  { id: 'fm-3', name: 'Arjun Murthy', role: '3D visualizer', avatar: '/hynt-home/pro-2.png', phone: '+91 98123 44567', occupancy: { status: 'idle' } },
  { id: 'fm-4', name: 'Vikram Sethi', role: 'Project manager', avatar: '/hynt-home/pro-1.png', phone: '+91 98110 99887', occupancy: { status: 'occupied', project: '4BHK renovation', day: 63 } },
  { id: 'fm-5', name: 'Maya Jain', role: 'Vastu specialist', avatar: '/hynt-home/pro-2.png', phone: '+91 99567 11234', occupancy: { status: 'idle' } },
]
const styleOptions = [
  {
    id: 'warm-tones',
    label: 'Warm tones',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'rustic',
    label: 'Rustic',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'japandi',
    label: 'Japandi',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'modern-indian',
    label: 'Modern Indian',
    image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'earthy-luxe',
    label: 'Earthy luxe',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80',
  },
]

const scopeOptions = ['Full renovation', 'Furniture only', 'Lighting', 'False ceiling', 'Kitchen upgrade', 'Storage planning']

const professionalOptions = [
  {
    id: 'rohan-kapoor',
    name: 'Rohan Kapoor',
    role: 'Interior Designer',
    image: '/hynt-home/pro-1.png',
    meta: '42 projects | Mumbai',
    tone: 'Warm contemporary homes',
  },
  {
    id: 'arjun-murthy',
    name: 'Arjun Murthy',
    role: 'Interior Designer',
    image: '/hynt-home/pro-2.png',
    meta: '58 projects | Bengaluru',
    tone: 'Turnkey renovations',
  },
  {
    id: 'maya-jain',
    name: 'Maya Jain',
    role: 'Vastu Specialist',
    image: '/hynt-home/pro-2.png',
    meta: '31 projects | Delhi NCR',
    tone: 'Furniture and lighting curation',
  },
  {
    id: 'isha-studio',
    name: 'Isha Studio',
    role: 'Design-build firm',
    image: '/hynt-home/pro-1.png',
    meta: '27 projects | Pune',
    tone: 'False ceiling, storage, built-ins',
  },
]

const styleAssistImages = [
  {
    id: 'assist-1',
    image: 'https://images.unsplash.com/photo-1616594039964-3bb9f7f2b6f4?auto=format&fit=crop&w=900&q=80',
    tags: ['Japandi', 'Minimal'],
  },
  {
    id: 'assist-2',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    tags: ['Modern Indian', 'Earthy luxe'],
  },
  {
    id: 'assist-3',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=80',
    tags: ['Rustic', 'Warm tones'],
  },
  {
    id: 'assist-4',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=900&q=80',
    tags: ['Minimal', 'Earthy luxe'],
  },
  {
    id: 'assist-5',
    image: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=900&q=80',
    tags: ['Warm tones', 'Modern Indian'],
  },
  {
    id: 'assist-6',
    image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=900&q=80',
    tags: ['Rustic', 'Japandi'],
  },
]

const initialIntent = {
  style: [],
  budget: null,
  scope: [],
  professional: [],
}
const THINKING_DELAY_MS = 3500

const selectorMeta = {
  style: {
    title: 'Choose a style direction',
    cta: 'Choose style',
    intentKey: 'style',
  },
  budget: {
    title: 'Set a rough budget',
    cta: 'Set budget',
    intentKey: 'budget',
  },
  scope: {
    title: 'Pick project scope',
    cta: 'Choose scope',
    intentKey: 'scope',
  },
  professional: {
    title: 'Select professionals',
    cta: 'Choose professionals',
    intentKey: 'professional',
  },
}

const formatCurrency = (value) => `${INR}${value}L`
const formatBudget = ([min, max]) => `${formatCurrency(min)} ${RANGE_DASH} ${formatCurrency(max)}`
const asSummary = (value) => {
  if (Array.isArray(value)) return value.join(', ')
  if (value && typeof value === 'object' && 'range' in value) return value.range
  return value
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function TaskStatusChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 inline-flex items-center rounded-full border ${selected
        ? 'border-[#5FC18A] bg-[#E8F7EF] pb-[6px] pl-[6px] pr-[12px] pt-[6px]'
        : 'border-[#D9D9D9] bg-white px-[12px] py-[6px]'}`}
    >
      <span className={`inline-flex items-center justify-center ${selected ? 'gap-[4px]' : ''}`}>
        {selected ? <CheckCircle size={16} weight="fill" className="block text-[#5FC18A]" /> : null}
        <span className={`block font-['Urbanist'] text-[12px] leading-[18px] ${selected ? 'font-bold text-[#5FC18A]' : 'font-semibold text-[#1D1D1D]'}`}>{label}</span>
      </span>
    </button>
  )
}

function FlowSelection({ onSelectFlow }) {
  return (
    <main className="h-dvh w-full overflow-hidden bg-[#eef3f0] font-['Urbanist'] text-slate-950">
      <section className="mx-auto flex h-dvh w-full max-w-[480px] flex-col px-5 pb-8 pt-10">
        <header className="mb-8">
          <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-12 w-auto object-contain" />
          <h1 className="mt-5 text-[30px] font-black leading-[1.12] tracking-[-0.03em]">Choose your flow</h1>
          <p className="mt-2 text-[15px] font-medium leading-6 text-[#4a4a4a]">Pick how you want to continue in HYNT.</p>
        </header>
        <div className="grid gap-4">
          <button
            type="button"
            onClick={() => onSelectFlow('homeowner')}
            className="rounded-3xl border border-[#d6e5dd] bg-white p-5 text-left shadow-[0_12px_28px_rgba(22,35,29,0.08)]"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#267449]">Flow 1</p>
            <p className="mt-2 text-[24px] font-black leading-[1.2] text-black">Homeowner</p>
            <p className="mt-1 text-[14px] font-medium leading-[1.45] text-[#5f5f5f]">navigate homeowner user flow</p>
          </button>
          <button
            type="button"
            onClick={() => onSelectFlow('professional')}
            className="rounded-3xl border border-[#d6e5dd] bg-white p-5 text-left shadow-[0_12px_28px_rgba(22,35,29,0.08)]"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#267449]">Flow 2</p>
            <p className="mt-2 text-[24px] font-black leading-[1.2] text-black">Professional</p>
            <p className="mt-1 text-[14px] font-medium leading-[1.45] text-[#5f5f5f]">preview professional user flow</p>
          </button>
        </div>
      </section>
    </main>
  )
}

function ProfessionalHome({ onOpenFlowSwitcher }) {
  const [isProjectsViewOpen, setIsProjectsViewOpen] = useState(false)
  const [projectStatusFilter, setProjectStatusFilter] = useState('All')
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedProjectPage, setSelectedProjectPage] = useState('overview')
  const [boqItems, setBoqItems] = useState(initialBoqItems)
  const [projectTasks, setProjectTasks] = useState(initialProjectTasks)
  const [projectInvoices, setProjectInvoices] = useState(initialProjectInvoices)
  const [projectDiaryEntries, setProjectDiaryEntries] = useState(initialProjectDiaryEntries)
  const [projectTeamMembers, setProjectTeamMembers] = useState(initialProjectTeamMembers)
  const [firmMembers] = useState(initialFirmMembers)
  const [taskFilter, setTaskFilter] = useState('All')
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const [taskActionTargetId, setTaskActionTargetId] = useState(null)
  const [taskStepCompletion, setTaskStepCompletion] = useState({})
  const [isDiaryComposerOpen, setIsDiaryComposerOpen] = useState(false)
  const [diaryDraftNote, setDiaryDraftNote] = useState('')
  const [diaryDraftPhotos, setDiaryDraftPhotos] = useState([])
  const [diaryActionEntryId, setDiaryActionEntryId] = useState(null)
  const [editingDiaryEntryId, setEditingDiaryEntryId] = useState(null)
  const [teamInvitePhone, setTeamInvitePhone] = useState('')
  const [selectedFirmMemberId, setSelectedFirmMemberId] = useState(null)
  const [selectedFirmMemberIds, setSelectedFirmMemberIds] = useState([])
  const [selectedMemberProjectIds, setSelectedMemberProjectIds] = useState([])
  const renderInrValue = (value, className = 'text-[13px] font-extrabold leading-[19px]', iconSize = 17) => (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      <CurrencyInr size={iconSize} weight="bold" />
      {value}
    </span>
  )

  const projectFilterChips = ['All', 'Active', 'Pending', 'Done']
  const filteredProjects = projectStatusFilter === 'All'
    ? proProjects
    : proProjects.filter((project) => project.status === projectStatusFilter)
  const selectedProject = proProjects.find((project) => project.id === selectedProjectId) || null
  const getProjectCount = (status) => (
    status === 'All'
      ? proProjects.length
      : proProjects.filter((project) => project.status === status).length
  )

  if (isProjectsViewOpen) {
    if (selectedProject) {
      const pendingL = Math.max(0, selectedProject.budgetL - selectedProject.receivedL)
      const formatLakhs = (value) => `${value.toFixed(1)}L`
      const parseAreaValue = (area) => {
        if (typeof area === 'number') return area
        const numeric = Number.parseFloat(String(area).replace(/[^0-9.]/g, ''))
        return Number.isFinite(numeric) ? numeric : 0
      }
      const rowAmount = (row) => parseAreaValue(row.area) * row.rate
      const formatRupees = (value) => `${Math.round(value).toLocaleString('en-IN')}`
      const totalEstimate = boqItems.reduce((acc, row) => acc + rowAmount(row), 0)
      const projectInvoicesList = projectInvoices.filter((invoice) => invoice.projectId === selectedProject.id)
      const selectedInvoice = projectInvoicesList.find((invoice) => invoice.id === selectedInvoiceId) || null

      const shareBoq = async () => {
        const shareText = boqItems
          .map((row) => `${row.item} | Area: ${row.area} | Rate: ${INR}${formatRupees(row.rate)} | Amount: ${INR}${formatRupees(rowAmount(row))}`)
          .join('\n')
        const payload = {
          title: `${selectedProject.scope} - BOQ`,
          text: `BOQ for ${selectedProject.client}\n\n${shareText}\n\nTotal: ${INR}${Math.round(totalEstimate).toLocaleString('en-IN')}`,
        }
        try {
          if (navigator.share) {
            await navigator.share(payload)
            return
          }
          await navigator.clipboard.writeText(payload.text)
        } catch {
          // Intentionally no-op to keep flow smooth if share is dismissed.
        }
      }

      if (selectedProjectPage === 'boq') {
        return (
          <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
            <section className="mx-auto w-full max-w-[390px] pb-[156px] pt-[56px]">
              <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between py-1">
                    <button type="button" onClick={() => setSelectedProjectPage('overview')} className="flex items-center gap-4">
                      <span className="grid size-6 place-items-center rounded">
                        <CaretLeft size={24} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[16px] font-bold leading-6 text-black">Create BOQ</span>
                        <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">{selectedProject.scope}</span>
                      </span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={shareBoq} className="grid size-9 place-items-center" aria-label="Share BOQ">
                        <PaperPlaneTilt size={18} weight="regular" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = boqItems.length + 1
                          setBoqItems((prev) => [
                            { id: `boq-${Date.now()}`, item: `New line item ${next}`, area: 1, rate: 1000, unit: 'unit' },
                            ...prev,
                          ])
                        }}
                        className="grid size-9 place-items-center"
                        aria-label="Add line item"
                      >
                        <Plus size={18} weight="regular" />
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              <div className="fixed left-1/2 top-[72px] z-[88] w-full max-w-[390px] -translate-x-1/2 bg-white px-4">
                <div className="grid grid-cols-[2fr_0.8fr_1fr_1fr] border-b border-[#ececec] bg-white py-2">
                  {['Item', 'Area', 'Rate', 'Amount'].map((head) => (
                    <p key={head} className={`text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#26c485] ${head === 'Amount' ? 'text-right pr-2' : 'pl-2'}`}>{head}</p>
                  ))}
                </div>
              </div>

              <div className="px-4 pb-5 pt-[102px]">
                <section>
                  <div>
                    {boqItems.map((row) => (
                      <div key={row.id} className="grid grid-cols-[2fr_0.8fr_1fr_1fr] items-center border-b border-[#f1f1f1] py-3 last:border-b-0">
                        <p className="pl-2 pr-2 text-[12px] font-semibold leading-[18px] text-black">{row.item}</p>
                        <p className="pl-2 text-[12px] font-semibold leading-[18px] text-[#444]">{row.area}</p>
                        <p className="pl-2 text-[12px] font-semibold leading-[18px] text-[#444]">{renderInrValue(`${formatRupees(row.rate)} /${row.unit || 'unit'}`, 'inline-flex items-start text-[12px] font-semibold leading-[18px] text-[#444]')}</p>
                        <p className="self-center pr-2 text-right text-[12px] font-extrabold leading-[18px] text-black">{renderInrValue(formatRupees(rowAmount(row)), 'inline-flex items-center justify-end text-[12px] font-extrabold leading-[18px] text-black')}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="fixed bottom-0 left-1/2 z-[85] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
                <div className="mb-3 flex items-center justify-between rounded-2xl border border-[#d9e9df] bg-[linear-gradient(145deg,#f7fff9,#eef7f1)] px-4 py-3 shadow-[0_8px_20px_rgba(22,35,29,0.08)]">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] leading-[16px] text-[#5b7768]">Total estimate</p>
                    <p className="mt-0.5 text-[10px] font-medium leading-[14px] text-[#7e9187]">Inclusive of all listed BOQ line items</p>
                  </div>
                  <p className="text-[22px] font-extrabold leading-[1] text-black">{renderInrValue(formatRupees(totalEstimate), 'text-[22px] font-extrabold leading-[1] text-black')}</p>
                </div>
                <button type="button" className="w-full rounded-2xl bg-black px-4 py-3 text-[14px] font-bold leading-[21px] text-white">
                  Create invoice from BOQ
                </button>
              </div>
            </section>
          </main>
        )
      }

      if (selectedProjectPage === 'tasks') {
        const selectedTask = projectTasks.find((task) => task.id === selectedTaskId) || null
        if (selectedTask) {
          const completedByIndex = taskStepCompletion[selectedTask.id] || {}
          const moveTaskTo = (nextStatus) => {
            setProjectTasks((prev) => prev.map((task) => (
              task.id === selectedTask.id ? { ...task, status: nextStatus } : task
            )))
          }
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
            <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
              <section className="mx-auto w-full max-w-[390px] pb-[132px] pt-[56px]">
                <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between py-1">
                      <button type="button" onClick={() => setSelectedTaskId(null)} className="flex items-center gap-4">
                        <span className="grid size-6 place-items-center rounded">
                          <CaretLeft size={24} />
                        </span>
                        <span className="text-left">
                          <span className="block text-[16px] font-bold leading-6 text-black">Task details</span>
                          <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">{selectedProject.scope}</span>
                        </span>
                      </button>
                      <span className="grid size-10 place-items-center opacity-0"><ChatsCircle size={24} /></span>
                    </div>
                  </div>
                </header>

                <div className="px-4 pb-5 pt-9">
                  <section>
                    <p className="text-[17px] font-extrabold leading-6">{selectedTask.title}</p>
                    <div className="-mx-4 mt-3 grid grid-cols-2 gap-2">
                      <div className="px-4 py-2">
                        <p className="text-[10px] font-bold text-[#7b7b7b]">Assigned to</p>
                        <p className="mt-1 text-[13px] font-semibold">{selectedTask.assignee}</p>
                      </div>
                      <div className="px-4 py-2">
                        <p className="text-[10px] font-bold text-[#7b7b7b]">Assigned by</p>
                        <p className="mt-1 text-[13px] font-semibold">{selectedTask.assignedBy}</p>
                      </div>
                      <div className="px-4 py-2">
                        <p className="text-[10px] font-bold text-[#7b7b7b]">Due date</p>
                        <p className="mt-1 text-[13px] font-semibold">{selectedTask.dueDate}</p>
                      </div>
                      <div className="px-4 py-2">
                        <p className="text-[10px] font-bold text-[#7b7b7b]">Due time</p>
                        <p className="mt-1 text-[13px] font-semibold">{selectedTask.dueTime}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#7b7b7b]">Task status</p>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${selectedTask.due === 'Overdue' ? 'bg-[#ffeaea] text-[#c34545]' : selectedTask.due === 'Today' ? 'bg-[#eaf9f1] text-[#289765]' : 'bg-[#eef3ff] text-[#3d68b8]'}`}>{selectedTask.due}</span>
                    </div>
                    <p className="mt-1 text-[11px] font-medium leading-[16px] text-[#8a8a8a]">
                      Due on {selectedTask.dueDate} at {selectedTask.dueTime}. Assigned by {selectedTask.assignedBy}.
                    </p>
                  </section>

                  <div className="-mx-4 mt-5 h-[6px] w-[calc(100%+32px)] bg-[#e0e0e0]" />

                  <section className="py-5">
                    <p className="mb-3 text-[14px] font-extrabold leading-[21px]">Remaining steps</p>
                    <div>
                      {selectedTask.steps.map((step, index) => (
                        <article key={step} className="border-b border-[#d2d2d2] py-3 last:border-b-0">
                          <button type="button" onClick={() => toggleStep(index)} className="flex w-full items-start gap-2 text-left">
                            <span className="mt-0.5 text-[#5f5f5f]">
                              {completedByIndex[index] ? <CheckCircle size={16} weight="fill" className="text-[#26c485]" /> : <Circle size={16} weight="regular" />}
                            </span>
                            <span className="min-w-0">
                              <p className={`text-[12px] font-semibold leading-[18px] ${completedByIndex[index] ? 'text-[#9a9a9a] line-through' : 'text-[#202020]'}`}>{index + 1}. {step}</p>
                              {completedByIndex[index] ? <p className="mt-0.5 text-[10px] font-medium leading-[14px] text-[#8d8d8d]">Completed at {completedByIndex[index]}</p> : null}
                            </span>
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
              </section>

              <div className="fixed bottom-0 left-1/2 z-[85] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">Move task to</p>
                <div className="no-scrollbar flex items-center gap-[8px] overflow-x-auto">
                  <TaskStatusChip label="To do" selected={selectedTask.status === 'todo'} onClick={() => moveTaskTo('todo')} />
                  <TaskStatusChip label="In progress" selected={selectedTask.status === 'inprogress'} onClick={() => moveTaskTo('inprogress')} />
                  <TaskStatusChip label="Done" selected={selectedTask.status === 'done'} onClick={() => moveTaskTo('done')} />
                </div>
                <button
                  type="button"
                  className="mt-3 h-11 w-full rounded-full bg-black text-[14px] font-bold text-white"
                >
                  Save
                </button>
              </div>
            </main>
          )
        }

        const taskFilterChips = ['All', 'Today', 'Overdue', 'Done']
        const filteredTasks = taskFilter === 'All'
          ? projectTasks
          : projectTasks.filter((task) => task.due === taskFilter)
        const getTaskCount = (chip) => (
          chip === 'All'
            ? projectTasks.length
            : projectTasks.filter((task) => task.due === chip).length
        )
        const columns = [
          { key: 'todo', title: 'To do' },
          { key: 'inprogress', title: 'In progress' },
          { key: 'done', title: 'Done' },
        ]

        return (
          <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
            <section className="mx-auto w-full max-w-[390px] pb-6 pt-[64px]">
              <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between py-1">
                    <button type="button" onClick={() => setSelectedProjectPage('overview')} className="flex items-center gap-4">
                      <span className="grid size-6 place-items-center rounded">
                        <CaretLeft size={24} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[16px] font-bold leading-6 text-black">Tasks</span>
                        <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">{selectedProject.scope}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Add task"
                      onClick={() => {
                        const next = projectTasks.length + 1
                        setProjectTasks((prev) => [
                          {
                            id: `t-${Date.now()}`,
                            title: `New task ${next}`,
                            assignee: selectedProject.client.split(' ')[0],
                            assignedBy: 'You',
                            due: 'Today',
                            dueDate: '20 May 2026',
                            dueTime: '06:30 PM',
                            status: 'todo',
                            steps: ['Define task scope', 'Assign owner', 'Track completion'],
                          },
                          ...prev,
                        ])
                      }}
                      className="grid size-9 place-items-center"
                    >
                      <Plus size={22} />
                    </button>
                  </div>
                </div>
              </header>

              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 pt-4">
                {taskFilterChips.map((chip) => {
                  const selected = taskFilter === chip
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setTaskFilter(chip)}
                      className={`flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-[20px] py-2 pl-3 pr-2 ${selected ? 'bg-[#5fc18a]' : 'border border-[#d1d1d1] bg-white'}`}
                    >
                      <span className={`text-[14px] leading-[1.5] ${selected ? 'font-semibold text-white' : 'font-medium text-black'}`}>{chip}</span>
                      <span className="grid size-6 place-items-center rounded-xl bg-black text-[12px] font-semibold leading-[1.5] text-white">{String(getTaskCount(chip)).padStart(2, '0')}</span>
                    </button>
                  )
                })}
              </div>

              <div className="-mx-0 h-[6px] bg-[#e0e0e0]" />

              <section className="px-4 py-5">
                <div className="no-scrollbar flex gap-3 overflow-x-auto">
                  {columns.map((column) => {
                    const tasksInColumn = filteredTasks.filter((task) => task.status === column.key)
                    return (
                      <section key={column.key} className="w-[252px] shrink-0 rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[13px] font-extrabold leading-[19px] text-black">{column.title}</p>
                          <span className="rounded-full bg-[#ececec] px-2 py-0.5 text-[11px] font-bold text-[#555]">{tasksInColumn.length}</span>
                        </div>
                        <div className="space-y-2">
                          {tasksInColumn.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-[#d9d9d9] bg-white px-3 py-4 text-[12px] font-medium text-[#8a8a8a]">No tasks</p>
                          ) : tasksInColumn.map((task) => (
                            <article key={task.id} className="rounded-xl border border-[#e1e1e1] bg-white p-3">
                              <button type="button" onClick={() => setSelectedTaskId(task.id)} className="w-full text-left">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="min-w-0 flex-1 text-[13px] font-semibold leading-[19px] text-black">{task.title}</p>
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(event) => {
                                      event.preventDefault()
                                      event.stopPropagation()
                                      setTaskActionTargetId(task.id)
                                    }}
                                    onKeyDown={(event) => {
                                      if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault()
                                        setTaskActionTargetId(task.id)
                                      }
                                    }}
                                    className="grid size-6 shrink-0 place-items-center rounded-md"
                                    aria-label="Task actions"
                                  >
                                    <DotsThreeVertical size={14} weight="bold" />
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-[11px] font-semibold leading-4 text-[#666]">{task.assignee}</span>
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${task.due === 'Overdue' ? 'bg-[#ffeaea] text-[#c34545]' : task.due === 'Today' ? 'bg-[#eaf9f1] text-[#289765]' : 'bg-[#eef3ff] text-[#3d68b8]'}`}>{task.due}</span>
                                </div>
                              </button>
                            </article>
                          ))}
                        </div>
                      </section>
                    )
                  })}
                </div>
              </section>
            </section>
            {taskActionTargetId ? (
              <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#7b7b7b]">Task actions</p>
                <div className="no-scrollbar flex items-center gap-[8px] overflow-x-auto">
                  <TaskStatusChip label="To do" selected={projectTasks.find((task) => task.id === taskActionTargetId)?.status === 'todo'} onClick={() => { setProjectTasks((prev) => prev.map((task) => (task.id === taskActionTargetId ? { ...task, status: 'todo' } : task))); setTaskActionTargetId(null) }} />
                  <TaskStatusChip label="In progress" selected={projectTasks.find((task) => task.id === taskActionTargetId)?.status === 'inprogress'} onClick={() => { setProjectTasks((prev) => prev.map((task) => (task.id === taskActionTargetId ? { ...task, status: 'inprogress' } : task))); setTaskActionTargetId(null) }} />
                  <TaskStatusChip label="Done" selected={projectTasks.find((task) => task.id === taskActionTargetId)?.status === 'done'} onClick={() => { setProjectTasks((prev) => prev.map((task) => (task.id === taskActionTargetId ? { ...task, status: 'done' } : task))); setTaskActionTargetId(null) }} />
                </div>
                <button type="button" onClick={() => { setProjectTasks((prev) => prev.filter((task) => task.id !== taskActionTargetId)); setTaskActionTargetId(null) }} className="mt-3 h-11 w-full rounded-full border border-[#e1b8b8] bg-white text-[14px] font-bold text-[#c34545]">
                  Delete task
                </button>
              </div>
            ) : null}
          </main>
        )
      }

      if (selectedProjectPage === 'finance') {
        const invoiceStatuses = ['Paid', 'Unpaid', 'In transit', 'In progress']
        const statusTone = (status) => {
          if (status === 'Paid') return 'bg-[#eaf9f1] text-[#2a9a64]'
          if (status === 'Unpaid') return 'bg-[#fff0f0] text-[#c34545]'
          if (status === 'In transit') return 'bg-[#eef3ff] text-[#3d68b8]'
          return 'bg-[#f2f2f2] text-[#6a6a6a]'
        }

        return (
          <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
            <section className="mx-auto w-full max-w-[390px] pb-6 pt-[56px]">
              <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between py-1">
                    <button type="button" onClick={() => setSelectedProjectPage('overview')} className="flex items-center gap-4">
                      <span className="grid size-6 place-items-center rounded">
                        <CaretLeft size={24} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[16px] font-bold leading-6 text-black">Finance</span>
                        <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">{selectedProject.scope}</span>
                      </span>
                    </button>
                    <span className="grid size-10 place-items-center opacity-0">
                      <ChatsCircle size={24} />
                    </span>
                  </div>
                </div>
              </header>

              <div className="px-4 py-5">
                <section className="py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7d7d7d]">Project total</p>
                  <p className="mt-1 text-[24px] font-extrabold leading-[30px]">{renderInrValue(formatLakhs(selectedProject.spentL), 'text-[24px] font-extrabold leading-[30px]', 27)}</p>
                  <p className="mt-1 text-[12px] font-medium leading-[18px] text-[#777]">Total money spent over this project</p>
                </section>

                <div className="-mx-4 h-[6px] bg-[#e0e0e0]" />

                <section className="py-5">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-[#e2e2e2] bg-white px-2 py-2 text-center">
                      <p className="text-[13px] font-extrabold leading-[19px]">{renderInrValue(formatLakhs(selectedProject.receivedL))}</p>
                      <p className="mt-0.5 text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Received</p>
                    </div>
                    <div className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-[#e2e2e2] bg-white px-2 py-2 text-center">
                      <p className="text-[13px] font-extrabold leading-[19px]">{renderInrValue(formatLakhs(pendingL))}</p>
                      <p className="mt-0.5 text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Pending</p>
                    </div>
                    <div className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-[#e2e2e2] bg-white px-2 py-2 text-center">
                      <p className="text-[13px] font-extrabold leading-[19px]">{renderInrValue(formatLakhs(Math.max(0, selectedProject.spentL - selectedProject.receivedL)))}</p>
                      <p className="mt-0.5 text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Upcoming expense</p>
                    </div>
                  </div>
                </section>

                <div className="-mx-4 h-[6px] bg-[#e0e0e0]" />

                <section className="py-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[16px] font-extrabold leading-6">Invoices</p>
                    <p className="text-[12px] font-semibold leading-[18px] text-[#7b7b7b]">{projectInvoicesList.length} total</p>
                  </div>
                  <div className="space-y-2">
                    {projectInvoicesList.map((invoice) => (
                      <article
                        key={invoice.id}
                        onClick={() => setSelectedInvoiceId(invoice.id)}
                        className="cursor-pointer rounded-xl border border-[#e1e1e1] bg-white px-3 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold leading-4 text-[#7b7b7b]">{invoice.number}</p>
                            <p className="mt-0.5 truncate text-[13px] font-semibold leading-[19px] text-black">{invoice.title}</p>
                            <p className="mt-1 text-[11px] font-medium leading-4 text-[#777]">{invoice.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-extrabold leading-[19px]">{renderInrValue(formatLakhs(invoice.amountL))}</p>
                            <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTone(invoice.status)}`}>{invoice.status}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            {selectedInvoice ? (
              <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7b7b7b]">Update invoice status</p>
                <p className="mt-1 truncate text-[13px] font-semibold leading-[19px]">{selectedInvoice.number} - {selectedInvoice.title}</p>
                <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                  {invoiceStatuses.map((status) => {
                    const active = selectedInvoice.status === status
                    return (
                      <TaskStatusChip
                        key={status}
                        label={status}
                        selected={active}
                        onClick={() => {
                          setProjectInvoices((prev) => prev.map((invoice) => (
                            invoice.id === selectedInvoice.id ? { ...invoice, status } : invoice
                          )))
                          setSelectedInvoiceId(null)
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            ) : null}
          </main>
        )
      }

      if (selectedProjectPage === 'site-diary') {
        const diaryEntries = projectDiaryEntries
          .filter((entry) => entry.projectId === selectedProject.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        const selectedDiaryEntry = diaryEntries.find((entry) => entry.id === diaryActionEntryId) || null

        const groupedEntries = diaryEntries.reduce((acc, entry) => {
          const key = new Date(entry.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          if (!acc[key]) acc[key] = []
          acc[key].push(entry)
          return acc
        }, {})

        const groupedDates = Object.keys(groupedEntries)

        return (
          <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
            <section className="mx-auto w-full max-w-[390px] pb-6 pt-[56px]">
              <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between py-1">
                    <button type="button" onClick={() => setSelectedProjectPage('overview')} className="flex items-center gap-4">
                      <span className="grid size-6 place-items-center rounded">
                        <CaretLeft size={24} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[16px] font-bold leading-6 text-black">Site diary</span>
                        <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">{selectedProject.scope}</span>
                      </span>
                    </button>
                    <button type="button" onClick={() => setIsDiaryComposerOpen(true)} className="grid size-9 place-items-center" aria-label="Create diary entry">
                      <Plus size={22} />
                    </button>
                  </div>
                </div>
              </header>

              <div className="px-4 pb-5 pt-10">
                {groupedDates.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-[#d7d7d7] bg-white px-4 py-6 text-[13px] font-medium text-[#7a7a7a]">
                    No entries yet. Tap + to create your first site diary update.
                  </p>
                ) : (
                  <div className="space-y-8">
                    {groupedDates.map((dateLabel) => (
                      <section key={dateLabel}>
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#7b7b7b]">{dateLabel}</p>
                          <p className="text-[12px] font-semibold text-[#7b7b7b]">
                            Day {Math.max(1, Math.floor((new Date(groupedEntries[dateLabel][0].createdAt).setHours(0, 0, 0, 0) - new Date(selectedProject.kickoffDate).setHours(0, 0, 0, 0)) / 86400000) + 1)}
                          </p>
                        </div>
                        <div className="space-y-3">
                          {groupedEntries[dateLabel].map((entry) => {
                            const timeLabel = new Date(entry.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                            return (
                              <article key={entry.id} className="rounded-xl border border-[#e2e2e2] bg-white p-3">
                                <div className="mb-2 flex items-center justify-between">
                                  <p className="text-[12px] font-bold leading-[18px] text-[#7b7b7b]">{timeLabel}</p>
                                  <button type="button" onClick={() => setDiaryActionEntryId(entry.id)} className="grid size-6 place-items-center rounded-md" aria-label="Entry actions">
                                    <DotsThreeVertical size={14} weight="bold" />
                                  </button>
                                </div>
                                {entry.note ? <p className="text-[13px] font-medium leading-[19px] text-[#212121]">{entry.note}</p> : null}
                                {entry.photos.length > 0 ? (
                                  <div className={`${entry.note ? 'mt-3' : ''} grid grid-cols-2 gap-2`}>
                                    {entry.photos.map((photo) => (
                                      <img key={`${entry.id}-${photo}`} src={photo} alt="Site diary" className="h-28 w-full rounded-lg border border-[#e0e0e0] object-cover" />
                                    ))}
                                  </div>
                                ) : null}
                              </article>
                            )
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {isDiaryComposerOpen ? (
              <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7b7b7b]">{editingDiaryEntryId ? 'Edit diary entry' : 'New diary entry'}</p>
                <textarea
                  value={diaryDraftNote}
                  onChange={(event) => setDiaryDraftNote(event.target.value)}
                  placeholder="Add note (optional)"
                  className="mt-2 h-24 w-full resize-none rounded-xl border border-[#d7d7d7] px-3 py-2 text-[13px] font-medium leading-[19px] outline-none"
                />
                <label className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-[#d7d7d7] text-[12px] font-semibold text-[#1d1d1d]">
                  Attach photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      const files = Array.from(event.target.files || [])
                      const nextPhotos = files.map((file) => URL.createObjectURL(file))
                      setDiaryDraftPhotos(nextPhotos)
                    }}
                  />
                </label>
                {diaryDraftPhotos.length > 0 ? (
                  <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
                    {diaryDraftPhotos.map((photo, index) => (
                      <img key={`${photo}-${index}`} src={photo} alt="Attached" className="h-14 w-20 shrink-0 rounded-lg border border-[#dedede] object-cover" />
                    ))}
                  </div>
                ) : null}
                {diaryDraftPhotos.length > 0 ? <p className="mt-1 text-[11px] font-medium text-[#6f6f6f]">{diaryDraftPhotos.length} photo(s) selected</p> : null}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { setIsDiaryComposerOpen(false); setEditingDiaryEntryId(null); setDiaryDraftNote(''); setDiaryDraftPhotos([]) }} className="h-10 rounded-xl border border-[#d7d7d7] text-[13px] font-semibold">Cancel</button>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanNote = diaryDraftNote.trim()
                      if (!cleanNote && diaryDraftPhotos.length === 0) return
                      if (editingDiaryEntryId) {
                        setProjectDiaryEntries((prev) => prev.map((entry) => (
                          entry.id === editingDiaryEntryId ? { ...entry, note: cleanNote, photos: diaryDraftPhotos } : entry
                        )))
                      } else {
                        setProjectDiaryEntries((prev) => [
                          {
                            id: `diary-${Date.now()}`,
                            projectId: selectedProject.id,
                            createdAt: new Date().toISOString(),
                            note: cleanNote,
                            photos: diaryDraftPhotos,
                          },
                          ...prev,
                        ])
                      }
                      setIsDiaryComposerOpen(false)
                      setEditingDiaryEntryId(null)
                      setDiaryDraftNote('')
                      setDiaryDraftPhotos([])
                    }}
                    className="h-10 rounded-xl bg-black text-[13px] font-bold text-white disabled:opacity-40"
                    disabled={!diaryDraftNote.trim() && diaryDraftPhotos.length === 0}
                  >
                    {editingDiaryEntryId ? 'Save changes' : 'Save entry'}
                  </button>
                </div>
              </div>
            ) : null}
            {selectedDiaryEntry ? (
              <div className="fixed bottom-0 left-1/2 z-[96] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7b7b7b]">Entry actions</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDiaryEntryId(selectedDiaryEntry.id)
                      setDiaryDraftNote(selectedDiaryEntry.note || '')
                      setDiaryDraftPhotos(selectedDiaryEntry.photos || [])
                      setDiaryActionEntryId(null)
                      setIsDiaryComposerOpen(true)
                    }}
                    className="h-10 rounded-xl border border-[#d7d7d7] text-[13px] font-semibold"
                  >
                    Edit entry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectDiaryEntries((prev) => prev.filter((entry) => entry.id !== selectedDiaryEntry.id))
                      setDiaryActionEntryId(null)
                    }}
                    className="h-10 rounded-xl border border-[#e1b8b8] bg-white text-[13px] font-bold text-[#c34545]"
                  >
                    Delete entry
                  </button>
                </div>
              </div>
            ) : null}
          </main>
        )
      }

      if (selectedProjectPage === 'team-directory') {
        const currentTeamPhones = new Set(projectTeamMembers.filter((member) => member.projectId === selectedProject.id).map((member) => member.phone))
        const availableFirmMembers = firmMembers.filter((member) => !currentTeamPhones.has(member.phone))

        return (
          <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
            <section className="mx-auto w-full max-w-[390px] pb-[92px] pt-[56px]">
              <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between py-1">
                    <button type="button" onClick={() => setSelectedProjectPage('team')} className="flex items-center gap-4">
                      <span className="grid size-6 place-items-center rounded">
                        <CaretLeft size={24} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[16px] font-bold leading-6 text-black">Firm members</span>
                        <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">Add existing members to projects</span>
                      </span>
                    </button>
                    <span className="text-[12px] font-semibold text-[#6f6f6f]">{availableFirmMembers.length} available</span>
                  </div>
                </div>
              </header>

              <div className="px-4 pb-5 pt-8">
                <div>
                  {availableFirmMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        setSelectedFirmMemberIds((prev) => (
                          prev.includes(member.id) ? prev.filter((id) => id !== member.id) : [...prev, member.id]
                        ))
                      }}
                      className="flex w-full items-center justify-between border-b border-[#d9d9d9] py-3 text-left last:border-b-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img src={member.avatar} alt={member.name} className="size-11 rounded-full border border-[#e0e0e0] object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-bold leading-[21px]">{member.name}</p>
                          <p className="truncate text-[12px] font-medium leading-[18px] text-[#6f6f6f]">{member.role}</p>
                          <p className="truncate text-[11px] font-medium leading-[16px] text-[#7b7b7b]">
                            {member.occupancy.status === 'occupied' ? `Currently working on ${member.occupancy.project} - Day ${member.occupancy.day}` : 'Idle'}
                          </p>
                        </div>
                      </div>
                      {selectedFirmMemberIds.includes(member.id) ? <CheckCircle size={18} weight="fill" className="shrink-0 text-[#5FC18A]" /> : null}
                    </button>
                  ))}
                </div>
              </div>
            </section>
            {selectedFirmMemberIds.length > 0 ? (
              <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedFirmMemberIds.length === 1) {
                      setSelectedFirmMemberId(selectedFirmMemberIds[0])
                      setSelectedMemberProjectIds([selectedProject.id])
                      setSelectedProjectPage('team-member-projects')
                      return
                    }
                    const selectedMembers = firmMembers.filter((member) => selectedFirmMemberIds.includes(member.id))
                    setProjectTeamMembers((prev) => [
                      ...selectedMembers
                        .filter((member) => !prev.some((existing) => existing.projectId === selectedProject.id && existing.phone === member.phone))
                        .map((member) => ({
                          id: `tm-${Date.now()}-${member.id}`,
                          projectId: selectedProject.id,
                          name: member.name,
                          role: member.role,
                          avatar: member.avatar,
                          isYou: false,
                          phone: member.phone,
                        })),
                      ...prev,
                    ])
                    setSelectedFirmMemberIds([])
                    setSelectedProjectPage('team')
                  }}
                  className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white"
                >
                  {selectedFirmMemberIds.length === 1 ? 'Assign projects' : 'Add to project'}
                </button>
              </div>
            ) : null}
          </main>
        )
      }

      if (selectedProjectPage === 'team-member-projects') {
        const firmMember = firmMembers.find((member) => member.id === selectedFirmMemberId) || null
        if (!firmMember) return null

        return (
          <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
            <section className="mx-auto w-full max-w-[390px] pb-[110px] pt-[56px]">
              <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between py-1">
                    <button type="button" onClick={() => setSelectedProjectPage('team-directory')} className="flex items-center gap-4">
                      <span className="grid size-6 place-items-center rounded">
                        <CaretLeft size={24} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[16px] font-bold leading-6 text-black">Add to projects</span>
                        <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">{firmMember.name}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </header>

              <div className="px-4 py-5">
                <div className="space-y-3">
                  {proProjects.map((project) => {
                    const selected = selectedMemberProjectIds.includes(project.id)
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => {
                          setSelectedMemberProjectIds((prev) => (
                            prev.includes(project.id) ? prev.filter((id) => id !== project.id) : [...prev, project.id]
                          ))
                        }}
                        className={`w-full rounded-xl border p-3 text-left ${selected ? 'border-[#5FC18A] bg-[#E8F7EF]' : 'border-[#e1e1e1] bg-white'}`}
                      >
                        <p className="text-[14px] font-bold leading-[21px]">{project.scope}</p>
                        <p className="text-[12px] font-medium leading-[18px] text-[#6f6f6f]">{project.client} - {project.location}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
              <button
                type="button"
                onClick={() => {
                  setProjectTeamMembers((prev) => {
                    const toAdd = selectedMemberProjectIds
                      .filter((projectId) => !prev.some((member) => member.projectId === projectId && member.phone === firmMember.phone))
                      .map((projectId) => ({
                        id: `tm-${Date.now()}-${projectId}`,
                        projectId,
                        name: firmMember.name,
                        role: firmMember.role,
                        avatar: firmMember.avatar,
                        isYou: false,
                        phone: firmMember.phone,
                      }))
                    return [...toAdd, ...prev]
                  })
                  setSelectedProjectPage('team')
                  setSelectedFirmMemberId(null)
                  setSelectedMemberProjectIds([])
                }}
                className="h-11 w-full rounded-full bg-black text-[14px] font-bold text-white disabled:opacity-40"
                disabled={selectedMemberProjectIds.length === 0}
              >
                Add to selected projects
              </button>
            </div>
          </main>
        )
      }

      if (selectedProjectPage === 'team') {
        const teamMembers = projectTeamMembers.filter((member) => member.projectId === selectedProject.id)

        return (
          <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
            <section className="mx-auto w-full max-w-[390px] pb-[154px] pt-[56px]">
              <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between py-1">
                    <button type="button" onClick={() => setSelectedProjectPage('overview')} className="flex items-center gap-4">
                      <span className="grid size-6 place-items-center rounded">
                        <CaretLeft size={24} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[16px] font-bold leading-6 text-black">Team</span>
                        <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">{selectedProject.scope}</span>
                      </span>
                    </button>
                    <button type="button" onClick={() => setSelectedProjectPage('team-directory')} className="grid size-9 place-items-center" aria-label="Add team member">
                      <Plus size={22} />
                    </button>
                  </div>
                </div>
              </header>

              <div className="px-4 pb-5 pt-7">
                <section className="rounded-xl border border-[#e1e1e1] bg-[#fafafa] p-3">
                  <p className="text-[12px] font-semibold leading-[18px] text-[#4c4c4c]">
                    Add team members by mobile number. They receive a HYNT invite to approve.
                  </p>
                </section>

                <section className="mt-6">
                  <p className="mb-3 text-[16px] font-extrabold leading-6">Current team</p>
                  <div>
                    {teamMembers.map((member) => (
                      <article key={member.id} className="flex items-center justify-between border-b border-[#d9d9d9] py-3 last:border-b-0">
                        <div className="flex min-w-0 items-center gap-3">
                          <img src={member.avatar} alt={member.name} className="size-11 rounded-full border border-[#e0e0e0] object-cover" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[14px] font-bold leading-[21px] text-black">{member.name}</p>
                              {member.isYou ? <span className="rounded-full bg-[#eaf9f1] px-2 py-0.5 text-[10px] font-bold text-[#2a9a64]">You</span> : null}
                            </div>
                            <p className="truncate text-[12px] font-medium leading-[18px] text-[#6f6f6f]">{member.role}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#7b7b7b]">Add by mobile number</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="team-invite-phone"
                  value={teamInvitePhone}
                  onChange={(event) => setTeamInvitePhone(event.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-10 min-w-0 flex-1 rounded-xl border border-[#d7d7d7] px-3 text-[13px] font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const cleanPhone = teamInvitePhone.trim()
                    if (!cleanPhone) return
                    setProjectTeamMembers((prev) => [
                      {
                        id: `tm-${Date.now()}`,
                        projectId: selectedProject.id,
                        name: `Invited member ${prev.filter((member) => member.projectId === selectedProject.id).length + 1}`,
                        role: 'Team member',
                        avatar: '/hynt-home/pro-2.png',
                        isYou: false,
                        phone: cleanPhone,
                      },
                      ...prev,
                    ])
                    setTeamInvitePhone('')
                  }}
                  className="h-10 shrink-0 rounded-xl bg-black px-4 text-[13px] font-bold text-white"
                >
                  Invite
                </button>
              </div>
              <p className="mt-2 text-[11px] font-medium leading-[16px] text-[#7b7b7b]">Team members will receive a link to download HYNT and join this project.</p>
            </div>
          </main>
        )
      }

      return (
        <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
          <section className="mx-auto w-full max-w-[390px] pt-[56px]">
            <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between py-1">
                  <button type="button" onClick={() => setSelectedProjectId(null)} className="flex items-center gap-4">
                    <span className="grid size-6 place-items-center rounded">
                      <CaretLeft size={24} />
                    </span>
                    <span className="text-left">
                      <span className="block text-[16px] font-bold leading-6 text-black">{selectedProject.scope}</span>
                      <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">Back to projects</span>
                    </span>
                  </button>
                  <span className="grid size-10 place-items-center opacity-0">
                    <ChatsCircle size={24} />
                  </span>
                </div>
              </div>
            </header>

            <div className="px-4 py-5">
              <section className="py-5">
                <div className="flex items-start gap-3">
                  <img src={selectedProject.avatar} alt={selectedProject.client} className="size-14 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="text-[16px] font-extrabold leading-6">{selectedProject.client}</p>
                    <p className="mt-0.5 truncate text-[12px] font-medium leading-[18px] text-[#6f6f6f]">{selectedProject.phone}</p>
                    <p className="truncate text-[12px] font-medium leading-[18px] text-[#6f6f6f]">{selectedProject.email}</p>
                    <p className="mt-1 text-[12px] font-semibold leading-[18px] text-[#444]">{selectedProject.location}</p>
                  </div>
                </div>
              </section>

              <div className="-mx-4 h-[6px] bg-[#e0e0e0]" />

              <section className="py-5">
                <div className="mb-1 flex items-center justify-between text-[12px] font-semibold leading-[18px] text-[#6f6f6f]">
                  <span>Overall progress</span>
                  <span>{selectedProject.progress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#e4e4e4]">
                  <div className="h-2.5 rounded-full bg-[#26c485]" style={{ width: `${selectedProject.progress}%` }} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-[#e2e2e2] bg-white px-2.5 py-2 text-center">
                    <p className="text-[13px] font-extrabold leading-[19px]">{renderInrValue(formatLakhs(selectedProject.receivedL))}</p>
                    <p className="mt-0.5 text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Received</p>
                  </div>
                  <div className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-[#e2e2e2] bg-white px-2.5 py-2 text-center">
                    <p className="text-[13px] font-extrabold leading-[19px]">{renderInrValue(formatLakhs(pendingL))}</p>
                    <p className="mt-0.5 text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Pending</p>
                  </div>
                  <div className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-[#e2e2e2] bg-white px-2.5 py-2 text-center">
                    <p className="text-[13px] font-extrabold leading-[19px]">{renderInrValue(formatLakhs(selectedProject.spentL))}</p>
                    <p className="mt-0.5 text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Spent</p>
                  </div>
                </div>
              </section>

              <div className="-mx-4 h-[6px] bg-[#e0e0e0]" />

              <section className="py-5">
                <h2 className="pb-4 text-[16px] font-extrabold leading-[1.5]">Quick actions</h2>
                <div className="grid grid-cols-4 gap-2">
                  {projectDetailTools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <button
                        key={tool.label}
                        type="button"
                        onClick={() => {
                          if (tool.label === 'BOQ') setSelectedProjectPage('boq')
                          if (tool.label === 'Tasks') setSelectedProjectPage('tasks')
                          if (tool.label === 'Finance') setSelectedProjectPage('finance')
                          if (tool.label === 'Site diary') setSelectedProjectPage('site-diary')
                          if (tool.label === 'Team') setSelectedProjectPage('team')
                        }}
                        className="rounded-xl border border-[#e1e1e1] bg-white p-2 text-center"
                      >
                        <div className="mx-auto grid size-6 place-items-center">
                          <Icon size={16} weight="regular" />
                        </div>
                        <p className="mt-1 text-[11px] font-semibold leading-[14px] text-[#222]">{tool.label}</p>
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>
          </section>

        </main>
      )
    }

    return (
      <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
        <section className="mx-auto w-full max-w-[390px] pt-[106px]">
          <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#ececec] bg-white/95 backdrop-blur">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between py-1">
                <button type="button" onClick={() => setIsProjectsViewOpen(false)} className="flex items-center gap-4">
                  <span className="grid size-6 place-items-center rounded">
                    <CaretLeft size={24} />
                  </span>
                  <span className="text-left">
                    <span className="block text-[16px] font-bold leading-6 text-black">Projects</span>
                    <span className="block text-[10px] font-medium leading-[15px] text-[#999999]">Back to home</span>
                  </span>
                </button>
                <button type="button" onClick={onOpenFlowSwitcher} aria-label="Switch flow" className="opacity-0">
                  <ChatsCircle size={24} />
                </button>
              </div>
            </div>

            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
              {projectFilterChips.map((chip) => {
                const selected = projectStatusFilter === chip
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setProjectStatusFilter(chip)}
                    className={`flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-[20px] py-2 pl-3 pr-2 ${selected ? 'bg-[#5fc18a]' : 'border border-[#d1d1d1] bg-white'}`}
                  >
                    <span className={`text-[14px] leading-[1.5] ${selected ? 'font-semibold text-white' : 'font-medium text-black'}`}>{chip}</span>
                    <span className="grid size-6 place-items-center rounded-xl bg-black text-[12px] font-semibold leading-[1.5] text-white">{String(getProjectCount(chip)).padStart(2, '0')}</span>
                  </button>
                )
              })}
            </div>
          </header>

          <div className="px-4 py-5">
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="cursor-pointer rounded-2xl border border-[#d8d8d8] bg-[#fbfbfb] p-4"
                  onClick={() => {
                    setSelectedProjectId(project.id)
                    setSelectedProjectPage('overview')
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-extrabold leading-6">{project.client}</p>
                      <p className="mt-0.5 text-[12px] font-semibold leading-[18px] text-[#6f6f6f]">{project.location}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${project.status === 'Active' ? 'bg-[#eaf9f1] text-[#2a9a64]' : project.status === 'Pending' ? 'bg-[#f2f2f2] text-[#777]' : 'bg-[#e9f2ff] text-[#2c67b4]'}`}>{project.status}</span>
                  </div>

                  <p className="mt-3 text-[14px] font-semibold leading-[21px]">{project.scope}</p>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[12px] font-semibold leading-[18px] text-[#6f6f6f]">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#e4e4e4]">
                      <div className="h-2.5 rounded-full bg-[#26c485]" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-[#e2e2e2] bg-white px-2.5 py-2">
                      <p className="text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Budget</p>
                      <p className="mt-0.5 text-[13px] font-extrabold leading-[19px]">{renderInrValue(`${project.budgetL}L`)}</p>
                    </div>
                    <div className="rounded-xl border border-[#e2e2e2] bg-white px-2.5 py-2">
                      <p className="text-[10px] font-bold leading-[14px] text-[#7b7b7b]">Current spend</p>
                      <p className="mt-0.5 text-[13px] font-extrabold leading-[19px]">{renderInrValue(`${project.spentL}L`)}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-[12px] font-semibold leading-[18px] text-[#6f6f6f]">Due date: <span className="font-bold text-black">{project.dueDate}</span></p>
                </article>
              ))}
            </div>
          </div>
        </section>

      </main>
    )
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] overflow-x-hidden pb-[108px]">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4">
            <img src="/hynt-home/pro-1.png" alt="Profile" className="size-10 rounded-full border border-[#e0e0e0] object-cover" />
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Notifications" onClick={onOpenFlowSwitcher} className="relative grid size-[37px] place-items-center rounded-[10px]">
                <Bell size={20} />
                <span className="absolute right-0 top-0.5 size-2 rounded-full bg-[#26c485]" />
              </button>
              <button type="button" aria-label="Messages" className="relative grid size-[37px] place-items-center rounded-[10px]">
                <ChatsCircle size={24} />
                <span className="absolute -right-px -top-[3.5px] grid size-4 place-items-center rounded-lg bg-[#26c485] text-[10px] text-white">3</span>
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 pb-5 pt-5">
          <div className="flex h-20 items-center justify-between rounded-2xl border border-[#d2d2d2] bg-white">
            <button type="button" onClick={() => setIsProjectsViewOpen(true)} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
              <p className="text-[20px] font-extrabold leading-[1.5] text-black">05</p>
              <p className="text-center text-[11px] font-bold leading-[1.5] text-[#888888]">Active projects</p>
            </button>
            <div className="h-full w-px bg-[#d2d2d2]" />
            <article className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
              <p className="text-[20px] font-extrabold leading-[1.5] text-black">12</p>
              <p className="text-center text-[11px] font-bold leading-[1.5] text-[#888888]">New Leads</p>
            </article>
            <div className="h-full w-px bg-[#d2d2d2]" />
            <article className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
              <p className="flex items-center gap-1 text-[20px] font-extrabold leading-[1.5] text-black"><CurrencyInr size={16} weight="fill" />4.2L</p>
              <p className="text-center text-[11px] font-bold leading-[1.5] text-[#888888]">This Month</p>
            </article>
          </div>
        </div>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="rounded-[20px] border border-[rgba(95,193,138,0.24)] bg-black p-4">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-extrabold leading-[1.5] text-white">See all my leads</p>
                <p className="text-[12px] font-bold leading-[1.5] tracking-[0.12px] text-[#949494]">You have 12 leads waiting for you...</p>
              </div>
              <button type="button" className="grid h-10 w-[42px] place-items-center rounded-xl bg-white">
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <h2 className="pb-5 text-[16px] font-extrabold leading-[1.5]">Your tools</h2>
          <div className="grid grid-cols-2 gap-2">
            {proTools.map((tool) => {
              const Icon = tool.icon
              return (
                <article key={tool.title} className="rounded-2xl border border-[#d2d2d2] p-3">
                  <Icon size={16} weight="fill" />
                  <div className="mt-3 flex flex-col gap-0.5">
                    <p className="font-['Urbanist'] text-[14px] font-semibold leading-[21px] text-[#121815]">{tool.title}</p>
                    <p className={`font-['Urbanist'] text-[12px] font-medium leading-[18px] ${tool.subtitle.includes('AI') || tool.subtitle.includes('Auto') ? 'text-[#26c485]' : 'text-[#888888]'}`}>{tool.subtitle}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold leading-[1.5]">Browse By Room</h2>
            <div className="flex items-center gap-1 text-[12px] font-semibold leading-[18px]">See all <ArrowRight size={16} /></div>
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto overflow-y-visible pb-1">
            {roomTags.map((tag) => (
              <div key={tag} className="flex h-10 shrink-0 items-center rounded-[20px] border border-[#9e9e9e] px-4 text-[14px] font-medium leading-[21px]">{tag}</div>
            ))}
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold leading-[1.5]">Ideas For You</h2>
            <div className="flex items-center gap-1 text-[12px] font-semibold leading-[18px]">Explore all <ArrowRight size={16} /></div>
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            {homepageIdeas.map((idea) => (
              <article key={idea.image} className="relative h-48 w-[175px] shrink-0 overflow-hidden rounded-2xl border border-[#e0e0e0]">
                <img src={idea.image} alt="" className="size-full object-cover" />
                {idea.badge ? <span className="absolute right-2 top-2 rounded-lg bg-[#eee5d4] px-[11px] py-[3px] text-[12px] font-medium text-[#525252]">{idea.badge}</span> : null}
                <button type="button" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white"><BookmarkSimple size={16} /></button>
              </article>
            ))}
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold leading-[1.5]">Products</h2>
            <ArrowRight size={16} />
          </div>
          <div className="no-scrollbar mt-4 flex h-[249px] gap-3 overflow-x-auto overflow-y-hidden pb-1">
            {homepageProducts.map((product, index) => (
              <article key={`${product.title}-${index}`} className="h-[249px] w-[184px] shrink-0 rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] p-1">
                <div className="relative h-[139px] overflow-hidden rounded-[15px] border border-[#e0e0e0] bg-white">
                  <img src={product.image} alt={product.title} className="size-full object-cover" />
                  <span className="absolute right-2 top-2 rounded-lg bg-white px-2 py-1 text-[12px] font-semibold">1/5</span>
                </div>
                <div className="px-2 pb-2 pt-3">
                  <p className="truncate text-[14px] font-bold leading-[1.35]">{product.title}</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#808080]">{product.category}</p>
                  <button type="button" className="mt-2 text-[12px] font-semibold text-[#808080] underline decoration-dotted">Get a quote</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold leading-[1.5]">Professionals</h2>
            <div className="flex items-center gap-1 text-[12px] font-semibold leading-[18px]">View all <ArrowRight size={16} /></div>
          </div>
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible pb-1">
            {homepagePros.map((pro) => (
              <article key={pro.name} className="h-[222px] w-[138px] shrink-0 rounded-2xl border border-[#e6e6e6] bg-white p-2">
                <img src={pro.image} alt={pro.name} className="h-[110px] w-[122px] rounded-xl object-cover" />
                <div className="mt-2 px-1">
                  <p className="truncate text-[14px] font-bold leading-[1.5] text-black">{pro.name}</p>
                  <p className="truncate text-[12px] font-medium leading-[1.5] text-[#5f5f5f]">{pro.role}</p>
                </div>
                <div className="mt-2 flex h-[30px] items-center gap-2 px-0.5 text-[12px] font-semibold text-[#808080]"><span className="flex items-center gap-1"><CheckSquareOffset size={16} />42</span><span className="h-3 w-px bg-[#d1d1d1]" /><span className="flex items-center gap-1"><IdentificationBadge size={16} />5 years</span></div>
              </article>
            ))}
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold leading-[1.5]">Upcoming Events</h2>
            <div className="flex items-center gap-1 text-[12px] font-semibold leading-[18px]">View all <ArrowRight size={16} /></div>
          </div>
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible pb-1">
            {homepageEvents.map((event) => (
              <article key={event.title} className="h-[252px] w-[175px] shrink-0 rounded-3xl border border-[#e0e0e0] bg-[#fbfbfb] p-2">
                <div className="relative h-36 overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white">
                  <img src={event.image} alt={event.title} className="size-full object-cover" />
                  <span className="absolute right-2 top-2 rounded-lg border border-[#333] bg-black/70 px-2 py-1 text-[12px] font-medium text-white backdrop-blur">{event.interested}</span>
                </div>
                <div className="px-1 pt-3">
                  <p className="truncate text-[16px] font-bold leading-[1.5]">{event.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-[#808080]"><CalendarDots size={16} />{event.date}</p>
                  <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-[#808080]"><MapPinSimpleArea size={16} />{event.city}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="flex h-24 items-center justify-center py-5 opacity-30">
          <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-[58px] w-24 object-contain grayscale" />
        </div>
      </section>

      <nav className="fixed bottom-0 left-1/2 z-30 flex h-[92px] w-full max-w-[390px] -translate-x-1/2 items-start justify-between border-t border-[#e6e6e6] bg-white/95 px-3 pb-5 pt-3 backdrop-blur">
        {[
          ['Home', House],
          ['Explore', Kanban],
          ['Upload', Plus],
          ['Leads', Crosshair],
          ['Profile', User],
        ].map(([label, Icon], index) => (
          <button key={label} type="button" onClick={label === 'Profile' ? onOpenFlowSwitcher : undefined} className="flex w-16 flex-col items-center justify-center gap-1.5 rounded-[20px] px-2.5 py-2 text-center text-[12px] leading-[1.5] text-black">
            <Icon size={20} weight={index === 0 ? 'fill' : 'regular'} />
            <span className={index === 0 ? 'font-bold hynt-nav-home' : 'font-semibold hynt-nav-item'}>{label}</span>
          </button>
        ))}
      </nav>
    </main>
  )
}

function HomeownerFlow({ activeFlow, onSelectFlow }) {
  const [prompt, setPrompt] = useState('')
  const [chatDraft, setChatDraft] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isBriefCollapsed, setIsBriefCollapsed] = useState(false)
  const [isFlowSwitcherOpen, setIsFlowSwitcherOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [intent, setIntent] = useState(initialIntent)
  const [activeModal, setActiveModal] = useState(null)
  const [draft, setDraft] = useState(null)
  const [isStyleAssistOpen, setIsStyleAssistOpen] = useState(false)
  const [styleAssistDraft, setStyleAssistDraft] = useState([])
  const [budgetModeDraft, setBudgetModeDraft] = useState('flexible')
  const [isBriefDetailOpen, setIsBriefDetailOpen] = useState(false)
  const [RivePlayer, setRivePlayer] = useState(null)
  const [allowRiveLoader, setAllowRiveLoader] = useState(false)
  const [showHomeAiRive, setShowHomeAiRive] = useState(false)
  const thinkingTimersRef = useRef([])
  const chatScrollRef = useRef(null)

  const allIntentFilled = useMemo(() => (
    intent.style.length > 0 && intent.budget?.range && intent.scope.length > 0 && intent.professional.length > 0
  ), [intent])

  const openChatFromHome = (event) => {
    event.preventDefault()
    const text = prompt.trim()
    if (!text) return

    setIsChatOpen(true)
    setPrompt('')
    setIntent(initialIntent)
    setActiveModal(null)
    setDraft(null)
    setIsStyleAssistOpen(false)
    setStyleAssistDraft([])
    setBudgetModeDraft('flexible')
    setIsBriefDetailOpen(false)
    const thinkingId = makeId('thinking')
    setMessages([
      { id: makeId('ai'), role: 'ai', text: "Hey! Tell me what you're looking for in your space." },
      { id: makeId('user'), role: 'user', text },
      { id: thinkingId, role: 'ai', thinking: true },
    ])
    const timer = setTimeout(() => {
      const nextMessage = {
        id: makeId('ai'),
        role: 'ai',
        text: 'Got it. Let me show you some styles that might fit.',
        selector: 'style',
        value: [],
        confirmed: false,
      }
      setMessages((previous) => [...previous, nextMessage])
      const cleanupTimer = setTimeout(() => {
        setMessages((previous) => previous.filter((message) => message.id !== thinkingId))
      }, 250)
      thinkingTimersRef.current.push(cleanupTimer)
    }, THINKING_DELAY_MS)
    thinkingTimersRef.current.push(timer)
  }

  const closeChat = () => {
    setIsChatOpen(false)
    setMessages([])
    setIntent(initialIntent)
    setActiveModal(null)
    setDraft(null)
    setIsStyleAssistOpen(false)
    setStyleAssistDraft([])
    setBudgetModeDraft('flexible')
    setIsBriefDetailOpen(false)
    thinkingTimersRef.current.forEach(clearTimeout)
    thinkingTimersRef.current = []
  }

  const openSelector = (messageId, type) => {
    const currentMessage = messages.find((message) => message.id === messageId)
    const currentValue = currentMessage?.value

    if (type === 'budget') {
      const pattern = new RegExp(`${INR}(\\d+)L\\s+${RANGE_DASH}\\s+${INR}(\\d+)L`)
      const parsed = currentValue?.range ? currentValue.range.match(pattern) : null
      setDraft(parsed ? [Number(parsed[1]), Number(parsed[2])] : [2, 5])
      setBudgetModeDraft(currentValue?.mode === 'fixed' ? 'fixed' : 'flexible')
    } else {
      setDraft(Array.isArray(currentValue) ? currentValue : [])
    }

    setActiveModal({ messageId, type })
  }

  const closeModal = () => {
    setActiveModal(null)
    setDraft(null)
    setIsStyleAssistOpen(false)
    setStyleAssistDraft([])
    setBudgetModeDraft('flexible')
  }

  const appendNextMessage = (type) => {
    if (type === 'style') {
      return {
        id: makeId('ai'),
        role: 'ai',
        text: "Nice picks. What's your rough budget?",
        selector: 'budget',
        value: null,
        confirmed: false,
      }
    }

    if (type === 'budget') {
      return {
        id: makeId('ai'),
        role: 'ai',
        text: "Great. What's the scope of work?",
        selector: 'scope',
        value: [],
        confirmed: false,
      }
    }

    if (type === 'scope') {
      return {
        id: makeId('ai'),
        role: 'ai',
        text: 'Pick professionals you want to consult for this project.',
        selector: 'professional',
        value: [],
        confirmed: false,
      }
    }

    return {
      id: makeId('ai'),
      role: 'ai',
      text: "Perfect. Here's your project brief.",
      summary: true,
    }
  }

  const confirmSelection = () => {
    if (!activeModal) return

    const { messageId, type } = activeModal
    const nextValue = type === 'budget'
      ? { range: formatBudget(draft), mode: budgetModeDraft }
      : draft
    const previousMessage = messages.find((message) => message.id === messageId)
    const shouldContinue = previousMessage && !previousMessage.confirmed
    const intentKey = selectorMeta[type].intentKey
    const thinkingId = shouldContinue ? makeId('thinking') : null

    setIntent((previous) => ({ ...previous, [intentKey]: nextValue }))
    setMessages((previous) => {
      const updated = previous.map((message) => (
        message.id === messageId
          ? { ...message, value: nextValue, confirmed: true }
          : message
      ))
      if (!shouldContinue || !thinkingId) return updated
      return [...updated, { id: thinkingId, role: 'ai', thinking: true }]
    })

    if (shouldContinue && thinkingId) {
      const timer = setTimeout(() => {
        const nextMessage = appendNextMessage(type)
        setMessages((live) => [...live, nextMessage])
        const cleanupTimer = setTimeout(() => {
          setMessages((previous) => previous.filter((message) => message.id !== thinkingId))
        }, 250)
        thinkingTimersRef.current.push(cleanupTimer)
      }, THINKING_DELAY_MS)
      thinkingTimersRef.current.push(timer)
    }
    closeModal()
  }

  useEffect(() => () => {
    thinkingTimersRef.current.forEach(clearTimeout)
    thinkingTimersRef.current = []
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHomeAiRive(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isChatOpen || !chatScrollRef.current) return
    chatScrollRef.current.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isChatOpen])

  useEffect(() => {
    let mounted = true
    import('@rive-app/react-canvas')
      .then((module) => {
        if (mounted) {
          const Candidate = module?.default?.default || module?.default
          if (typeof Candidate === 'function') {
            setRivePlayer(() => Candidate)
            setAllowRiveLoader(true)
          } else {
            setRivePlayer(null)
            setAllowRiveLoader(false)
          }
        }
      })
      .catch(() => {
        if (mounted) {
          setRivePlayer(null)
          setAllowRiveLoader(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [])

  const toggleDraftItem = (label) => {
    setDraft((previous) => (
      previous.includes(label)
        ? previous.filter((item) => item !== label)
        : [...previous, label]
    ))
  }

  const updateBudgetDraft = (index, value) => {
    const numeric = Number(value)
    setDraft(([min, max]) => {
      if (index === 0) return [Math.min(numeric, max - 1), max]
      return [min, Math.max(numeric, min + 1)]
    })
  }

  const renderBudgetRangeWithIcon = ([min, max]) => (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-0.5"><CurrencyInr size={24} weight="bold" />{min}L</span>
      <span>{RANGE_DASH}</span>
      <span className="inline-flex items-center gap-0.5"><CurrencyInr size={24} weight="bold" />{max}L</span>
    </span>
  )

  const toggleStyleAssistItem = (id) => {
    setStyleAssistDraft((previous) => (
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    ))
  }

  const applyStyleAssist = () => {
    const selectedImages = styleAssistImages.filter((item) => styleAssistDraft.includes(item.id))
    const weightedStyles = selectedImages.reduce((acc, item) => {
      item.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {})
    const sortedStyles = Object.entries(weightedStyles)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag)

    setDraft(sortedStyles)
    setIsStyleAssistOpen(false)
  }

  const isConfirmDisabled = !activeModal
    || (activeModal.type === 'style' && isStyleAssistOpen ? styleAssistDraft.length === 0 : Array.isArray(draft) ? draft.length === 0 : !draft)

  const renderSelectorContent = () => {
    if (!activeModal) return null

    if (activeModal.type === 'style') {
      if (isStyleAssistOpen) {
        return (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 rounded-2xl border border-[#d6e5dd] bg-white/80 p-4">
              <p className="text-sm font-semibold leading-6 text-slate-700">Pick images you naturally like. We will infer style tags from your choices.</p>
              <button type="button" onClick={() => setIsStyleAssistOpen(false)} className="shrink-0 text-xs font-extrabold text-slate-700 underline">Back</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {styleAssistImages.map((item) => {
                const selected = styleAssistDraft.includes(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleStyleAssistItem(item.id)}
                    className={`relative overflow-hidden rounded-2xl border bg-white p-1 transition ${selected ? 'border-[#5FC18A] ring-2 ring-[#5FC18A]/35' : 'border-slate-200'}`}
                  >
                    <img src={item.image} alt="Style reference" className="h-28 w-full rounded-xl object-cover" />
                    {selected ? <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-[#5FC18A] text-white"><Check size={14} weight="bold" /></span> : null}
                  </button>
                )
              })}
            </div>
          </div>
        )
      }

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {styleOptions.map((option) => {
              const selected = draft.includes(option.label)
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleDraftItem(option.label)}
                  className={`group relative overflow-hidden rounded-2xl border bg-white/80 p-1.5 text-left shadow-sm transition ${selected ? 'border-[#5FC18A] ring-2 ring-[#5FC18A]/20' : 'border-white/70 hover:border-[#5FC18A]/70'}`}
                >
                  <img src={option.image} alt={option.label} className="h-28 w-full rounded-xl object-cover" />
                  <span className="mt-2 block px-1 pb-1 text-[0.72rem] font-extrabold text-slate-900">{option.label}</span>
                  {selected ? <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-[#5FC18A] text-white"><Check size={14} weight="bold" /></span> : null}
                </button>
              )
            })}
          </div>
          <button type="button" onClick={() => setIsStyleAssistOpen(true)} className="w-full rounded-2xl border border-[#c8d9cf] bg-white px-4 py-3 text-left">
            <p className="text-sm font-black text-slate-900">I&apos;m not sure</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Show me references and infer styles for me.</p>
          </button>
        </div>
      )
    }

    if (activeModal.type === 'budget') {
      return (
        <div className="rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#f7fff9] to-white p-5 shadow-inner">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#3c9d68]">Selected range</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{renderBudgetRangeWithIcon(draft)}</p>
            </div>
          </div>
          <div className="mb-5">
            <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">Budget type</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setBudgetModeDraft('fixed')} className={`rounded-full border px-4 py-2 text-[14px] font-semibold leading-[21px] transition ${budgetModeDraft === 'fixed' ? 'border-[#2188ff] bg-[#d8eaff] text-[#244468]' : 'border-slate-200 bg-white text-slate-600'}`}>
                <span className="inline-flex items-center gap-1"><SlidersHorizontal size={14} />Fixed</span>
              </button>
              <button type="button" onClick={() => setBudgetModeDraft('flexible')} className={`rounded-full border px-4 py-2 text-[14px] font-semibold leading-[21px] transition ${budgetModeDraft === 'flexible' ? 'border-[#2188ff] bg-[#d8eaff] text-[#244468]' : 'border-slate-200 bg-white text-slate-600'}`}>
                <span className="inline-flex items-center gap-1"><SlidersHorizontal size={14} />Flexible</span>
              </button>
            </div>
          </div>
          <p className="mb-4 flex items-center gap-1 text-xs font-semibold text-slate-500">
            <CurrencyInr size={12} weight="bold" />{budgetModeDraft === 'fixed' ? 'Fixed means hard cap for spend.' : 'Flexible means you can stretch if value is clear.'}
          </p>
          <label className="block text-sm font-extrabold text-slate-800" htmlFor="budget-min">Minimum budget</label>
          <input id="budget-min" type="range" min="1" max="20" value={draft[0]} onChange={(event) => updateBudgetDraft(0, event.target.value)} className="hynt-range mt-3 w-full" />
          <label className="mt-7 block text-sm font-extrabold text-slate-800" htmlFor="budget-max">Maximum budget</label>
          <input id="budget-max" type="range" min="2" max="25" value={draft[1]} onChange={(event) => updateBudgetDraft(1, event.target.value)} className="hynt-range mt-3 w-full" />
          <div className="mt-5 flex justify-between text-xs font-bold text-slate-400"><span className="flex items-center gap-0.5"><CurrencyInr size={11} weight="bold" />1L</span><span className="flex items-center gap-0.5"><CurrencyInr size={11} weight="bold" />25L</span></div>
        </div>
      )
    }

    if (activeModal.type === 'scope') {
      return (
        <div className="flex flex-wrap gap-3">
          {scopeOptions.map((option) => {
            const selected = draft.includes(option)
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleDraftItem(option)}
                className={`rounded-full border px-5 py-2.5 [font-size:14px] [font-weight:500] [line-height:21px] tracking-normal transition ${selected ? 'border-[#2188ff] bg-[#c8def9] text-[#244468]' : 'border-[#d0d8e0] bg-white text-[#384b63]'}`}
                style={{ fontSize: '14px', fontWeight: 500, lineHeight: '21px' }}
              >
                {option}
              </button>
            )
          })}
        </div>
      )
    }

    if (activeModal.type === 'professional') {
      return (
        <div className="space-y-3">
          {professionalOptions.map((pro) => {
            const selected = draft.includes(pro.name)
            return (
              <button
                key={pro.id}
                type="button"
                onClick={() => toggleDraftItem(pro.name)}
                className={`flex w-full items-start gap-4 rounded-3xl border p-4 text-left transition ${selected ? 'border-[#2188ff] bg-[#ecf4ff] shadow-lg shadow-[#2188ff]/10' : 'border-[#d8e0ea] bg-white shadow-sm'}`}
              >
                <img src={pro.image} alt={pro.name} className="size-16 shrink-0 rounded-2xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold leading-[21px] text-slate-950">{pro.name}</span>
                  <span className="mt-0.5 block text-[13px] font-semibold leading-5 text-slate-500">{pro.role}</span>
                  <span className="mt-2 block text-[12px] font-semibold text-slate-400">{pro.meta}</span>
                  <span className="mt-2 block text-[12px] font-bold text-[#267449]">{pro.tone}</span>
                </span>
                <div className="mt-1 flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      window.open(`https://hynt.app/pro/${pro.id}`, '_blank', 'noopener,noreferrer')
                    }}
                    aria-label={`Open ${pro.name} profile`}
                    className="grid size-6 place-items-center rounded-full border border-slate-200 bg-white text-slate-500"
                  >
                    <CaretRight size={12} weight="bold" />
                  </button>
                  <span className={`grid size-6 place-items-center rounded-full border ${selected ? 'border-[#5FC18A] bg-[#5FC18A] text-white' : 'border-slate-200 text-transparent'}`}><Check size={14} weight="bold" /></span>
                </div>
              </button>
            )
          })}
        </div>
      )
    }

    return null
  }

  const renderIntentValue = (value) => {
    if (Array.isArray(value)) return value.length ? value.join(', ') : EMPTY
    if (value && typeof value === 'object' && 'range' in value) return `${value.range}${value.mode === 'fixed' ? ' (Fixed)' : ' (Flexible)'}`
    return value || EMPTY
  }

  const renderInlineAction = (message) => (
    <button
      type="button"
      onClick={() => openSelector(message.id, message.selector)}
      className="inline-flex items-center gap-1 text-xs font-black text-slate-700 underline decoration-[#5FC18A] underline-offset-4"
      aria-label="Edit selection"
    >
      <PencilSimpleLine size={13} weight="bold" />
    </button>
  )

  const renderBubbleAction = (message) => {
    if (!message.selector) return null
    const meta = selectorMeta[message.selector]

    if (!message.confirmed) {
      return (
        <button
          type="button"
          onClick={() => openSelector(message.id, message.selector)}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5"
        >
          {meta.cta} <ArrowRight size={16} weight="bold" />
        </button>
      )
    }

    if (message.selector === 'style') {
      const selectedStyles = styleOptions.filter((option) => message.value.includes(option.label))
      return (
        <div className="mt-4 rounded-2xl border border-[#5FC18A]/30 bg-[#f0fff6] p-3">
          <div className="mb-3 flex items-start justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#267449]">Selected style direction</p>
            {renderInlineAction(message)}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {selectedStyles.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-[#cde8d8] bg-white shadow-sm">
                <img src={item.image} alt={item.label} className="h-[82px] w-full object-cover" />
                <p className="px-2 py-1.5 text-[12px] font-bold leading-4 text-[#267449]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (message.selector === 'professional') {
      const selectedPros = professionalOptions.filter((pro) => message.value.includes(pro.name))
      return (
        <div className="mt-4 rounded-2xl border border-[#5FC18A]/30 bg-[#f0fff6] p-3">
          <div className="mb-3 flex items-start justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#267449]">Selected professionals</p>
            {renderInlineAction(message)}
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {selectedPros.map((pro) => (
              <article key={pro.id} className="h-[222px] w-[138px] shrink-0 rounded-2xl border border-[#e6e6e6] bg-white p-2">
                <img src={pro.image} alt={pro.name} className="h-[110px] w-[122px] rounded-xl object-cover" />
                <div className="mt-2 px-1">
                  <p className="truncate text-[14px] font-bold leading-[1.5] text-black">{pro.name}</p>
                  <p className="truncate text-[12px] font-medium leading-[1.5] text-[#5f5f5f]">{pro.role}</p>
                </div>
                <div className="mt-2 flex h-[30px] items-center gap-2 px-0.5 text-[12px] font-semibold leading-[1.5] text-[#808080]">
                  <span className="flex items-center gap-1"><CheckSquareOffset size={16} />42</span>
                  <span className="h-3 w-px bg-[#d1d1d1]" />
                  <span className="flex items-center gap-1"><IdentificationBadge size={16} />5 years</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )
    }

    if (message.selector === 'budget') {
      const value = message.value?.range || ''
      const budgetMatch = value.match(/₹(\d+)L\s+–\s+₹(\d+)L/)
      const min = budgetMatch?.[1] || '2'
      const max = budgetMatch?.[2] || '5'
      return (
        <div className="mt-4 rounded-2xl border border-[#5FC18A]/30 bg-[#f0fff6] p-3">
          <div className="mb-2 flex items-start justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#267449]">Budget preference</p>
            {renderInlineAction(message)}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#cde8d8] bg-white px-3 py-2">
            <p className="inline-flex items-center gap-2 text-lg font-black text-[#267449]">
              <span className="inline-flex items-center gap-0.5"><CurrencyInr size={16} weight="bold" />{min}L</span>
              <span>{RANGE_DASH}</span>
              <span className="inline-flex items-center gap-0.5"><CurrencyInr size={16} weight="bold" />{max}L</span>
            </p>
            <span className="rounded-full bg-[#e8f6ee] px-2.5 py-1 text-[11px] font-bold text-[#267449]">{message.value.mode === 'fixed' ? 'Fixed' : 'Flexible'}</span>
          </div>
        </div>
      )
    }

    return (
      <div className="mt-4 rounded-2xl border border-[#5FC18A]/30 bg-[#f0fff6] p-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-extrabold leading-snug text-[#267449]">{asSummary(message.value)}</p>
          {renderInlineAction(message)}
        </div>
      </div>
    )
  }

  const renderHome = () => (
    <main className="hynt-home min-h-dvh w-full bg-white pb-[92px] font-['Urbanist'] text-black">
      <section className="relative mx-auto w-full max-w-[390px] overflow-x-hidden bg-white">
        <header className="sticky top-0 z-30 h-[57px] overflow-hidden bg-gradient-to-b from-white to-white/0 backdrop-blur-[12px]">
          <div className="flex h-[57px] items-center justify-between pl-6 pr-4">
            <button type="button" className="flex w-[119px] items-center text-[14px] font-bold leading-none text-[#26c485]">
              <span>Mumbai</span>
              <CaretDown className="ml-1" size={12} weight="bold" />
            </button>
            <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-8 w-[53.152px] opacity-0" />
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Search" className="grid size-[37px] place-items-center rounded-[10px] opacity-0"><MagnifyingGlass size={20} /></button>
              <button type="button" aria-label="Notifications" onClick={() => setIsFlowSwitcherOpen(true)} className="relative grid size-[37px] place-items-center rounded-[10px]"><Bell size={24} /><span className="absolute right-0 top-0.5 size-2 rounded-full bg-[#26c485]" /></button>
              <button type="button" aria-label="Messages" className="relative grid size-[37px] place-items-center rounded-[10px]"><ChatsCircle size={24} /><span className="absolute -right-px -top-[3.5px] grid size-4 place-items-center rounded-lg bg-[#26c485] text-center text-[10px] font-normal leading-none tracking-[-0.041px] text-white">3</span></button>
            </div>
          </div>
        </header>

        <div className="pt-2">
          <section className="flex h-[102px] items-start justify-between px-4">
            {quickActions.map(({ label, icon: Icon }, index) => (
              <button key={label} type="button" className="flex w-[68px] shrink-0 flex-col items-center gap-3 overflow-hidden text-center">
                <span className={`grid size-14 place-items-center overflow-hidden rounded-[28px] ${index === 0 ? 'border-[0.438px] border-[#e0e0e0] bg-[#fbfbfb]' : 'border-[0.875px] border-[#a3a3a3] bg-white text-[#26c485]'}`}>
                  {index === 0 ? <img src="/hynt-home/brand.png" alt="" className="size-full rounded-[28px] object-cover" /> : <Icon size={21} weight="fill" />}
                </span>
                <span className="w-[68px] whitespace-normal text-center text-[11px] font-bold leading-[1.5] text-black">{label}</span>
              </button>
            ))}
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-28 px-4">
            <form onSubmit={openChatFromHome} className="h-28 w-[358px] overflow-hidden rounded-3xl border border-[rgba(95,193,138,0.24)] bg-black p-4">
              <div className="flex h-6 items-center gap-2">
                <span className="grid size-6 place-items-center overflow-hidden">
                  {showHomeAiRive && allowRiveLoader && RivePlayer ? (
                    <RivePlayer src="/hynt-home/door-and-star2.riv" autoplay className="size-6" />
                  ) : (
                    <img src="/hynt-home/door-and-star.svg" alt="" className="size-6" />
                  )}
                </span>
                <p className="whitespace-nowrap text-[14px] font-medium leading-[1.5] text-white">Home planning with <span className="font-black">HYNT</span> <span className="text-[10.32px] font-medium text-[#5fc18a]">AI</span></p>
              </div>
              <div className="mt-2 flex h-12 items-center overflow-hidden rounded-2xl border border-[#5fc18a] bg-[#fbfbfb] py-[5px] pl-4 pr-1.5">
                <input
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Ask anything"
                  className="h-[24px] min-w-0 flex-1 bg-transparent text-[16px] font-medium leading-6 text-black outline-none placeholder:text-[#808080] hynt-ai-input"
                />
                <button type="submit" aria-label="Send" className="grid h-9 w-6 shrink-0 place-items-center rounded-[10px] bg-[#26c485] text-black">
                  <ArrowUp size={12} weight="bold" />
                </button>
              </div>
            </form>
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-24 px-4 py-2">
            <div className="flex h-6 items-center justify-between">
              <h2 className="text-[16px] font-extrabold capitalize leading-[1.5]">browse by room</h2>
              <button type="button" className="flex h-5 items-center gap-1 text-[12px] font-semibold leading-[18px]" style={{ fontSize: '12px' }}>See all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-10 gap-2 overflow-x-auto">
              {roomTags.map((tag) => (
                <button key={tag} type="button" className="h-10 shrink-0 overflow-hidden rounded-[20px] border border-[#9e9e9e] bg-white px-5 text-[14px] font-medium leading-[21px] text-black hynt-room-chip">{tag}</button>
              ))}
            </div>
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-64 py-2">
            <div className="flex h-6 items-center justify-between px-4">
              <h2 className="text-[16px] font-extrabold capitalize leading-[1.5]">Ideas for you</h2>
              <button type="button" className="flex h-5 items-center gap-1 text-[12px] font-semibold leading-[18px] hynt-section-link">Explore all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-[200px] gap-2 overflow-x-auto px-4 py-1">
              {homepageIdeas.map((idea, index) => (
                <article key={idea.image} className="relative h-48 w-[175px] shrink-0 overflow-hidden rounded-2xl border-[1.043px] border-[#e0e0e0] bg-white">
                  <img src={idea.image} alt={`Idea ${index + 1}`} className="size-full rounded-[10px] object-cover" />
                  {idea.badge ? <span className="absolute right-2 top-2 rounded-lg bg-[#eee5d4] px-[11px] py-[3px] text-[12px] font-medium leading-[1.5] text-[#525252]">{idea.badge}</span> : null}
                  <button type="button" aria-label="Save idea" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white"><BookmarkSimple size={16} /></button>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="no-scrollbar mt-5 flex h-[172px] gap-2 overflow-x-auto px-4">
            {[0, 1, 2].map((item) => (
              <article key={item} className="relative h-[172px] w-[338px] shrink-0 overflow-hidden rounded-3xl bg-[#070a22]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,#7738ff_0_13%,transparent_34%),radial-gradient(circle_at_25%_75%,#006dff_0_18%,transparent_44%),linear-gradient(135deg,#06091d_0%,#111b70_45%,#7a26ff_100%)]" />
                <p className="absolute left-4 top-4 w-[155px] text-[16px] font-bold uppercase leading-[1.2] text-white">Showcase your brand here</p>
                <button type="button" className="absolute bottom-3 right-3 rounded-lg bg-black px-4 py-2 text-[12px] font-medium leading-[1.5] text-white">Learn more</button>
              </article>
            ))}
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-[286px] py-2">
            <div className="flex h-6 items-center justify-between px-4">
              <h2 className="text-[16px] font-extrabold leading-[1.5]">Professionals for you</h2>
              <button type="button" className="flex h-5 items-center gap-1 text-[12px] font-semibold leading-[18px]" style={{ fontSize: '12px' }}>View all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-[230px] gap-3 overflow-x-auto px-4 py-1">
              {homepagePros.map((pro) => (
                <article key={pro.name} className="h-[222px] w-[138px] shrink-0 rounded-2xl border border-[#e6e6e6] bg-white p-2">
                  <img src={pro.image} alt={pro.name} className="h-[110px] w-[122px] rounded-xl object-cover" />
                  <div className="mt-2 px-1">
                    <p className="truncate text-[14px] font-bold leading-[1.5] text-black">{pro.name}</p>
                    <p className="truncate text-[12px] font-medium leading-[1.5] text-[#5f5f5f]">{pro.role}</p>
                  </div>
                  <div className="mt-2 flex h-[30px] items-center gap-2 px-0.5 text-[12px] font-semibold leading-[1.5] text-[#808080]"><span className="flex items-center gap-1"><CheckSquareOffset size={16} />42</span><span className="h-3 w-px bg-[#d1d1d1]" /><span className="flex items-center gap-1"><IdentificationBadge size={16} />5 years</span></div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-[305px] py-2">
            <div className="flex h-6 items-center justify-between px-4">
              <h2 className="text-[16px] font-extrabold leading-[1.5]">Products you might like</h2>
              <button type="button" className="flex h-5 items-center gap-1 text-[12px] font-semibold leading-[18px]" style={{ fontSize: '12px' }}>View all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-[249px] gap-3 overflow-x-auto overflow-y-hidden px-4">
              {homepageProducts.map((product, index) => (
                <article key={`${product.title}-${index}`} className="h-[249px] w-[184px] shrink-0 rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] p-1">
                  <div className="relative h-[139px] overflow-hidden rounded-[15px] border border-[#e0e0e0] bg-white">
                    <img src={product.image} alt={product.title} className="size-full object-cover" />
                    <span className="absolute right-2 top-2 rounded-lg bg-white px-2 py-1 text-[12px] font-semibold leading-[1.5]">1/5</span>
                    <button type="button" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white"><BookmarkSimple size={16} /></button>
                  </div>
                  <div className="px-2 pb-2 pt-3">
                    <p className="line-clamp-2 text-[14px] font-bold leading-[1.35]">{product.title}</p>
                    <p className="mt-1 text-[12px] font-semibold leading-[1.5] text-[#808080]">{product.category}</p>
                    <button type="button" className="mt-2 text-[12px] font-semibold leading-[1.5] text-[#808080] underline decoration-dotted">Get a quote</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-[292px]">
            <div className="flex h-6 items-center justify-between px-4">
              <h2 className="text-[16px] font-extrabold leading-[1.5]">Upcoming events</h2>
              <button type="button" className="flex h-5 items-center gap-1 text-[12px] font-semibold leading-[18px]" style={{ fontSize: '12px' }}>View all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-[252px] gap-3 overflow-x-auto px-4">
              {homepageEvents.map((event) => (
                <article key={event.title} className="h-[252px] w-[175px] shrink-0 rounded-3xl border border-[#e0e0e0] bg-[#fbfbfb] p-2">
                  <div className="relative h-36 overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white">
                    <img src={event.image} alt={event.title} className="size-full object-cover" />
                    <span className="absolute right-2 top-2 rounded-lg border border-[#333] bg-black/70 px-2 py-1 text-[12px] font-medium leading-[1.5] text-white backdrop-blur">{event.interested}</span>
                  </div>
                  <div className="px-1 pt-3">
                    <p className="truncate text-[16px] font-bold leading-[1.5]">{event.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold leading-[1.5] text-[#808080]"><CalendarDots size={16} />{event.date}</p>
                    <p className="mt-1 flex items-center gap-1 text-[12px] font-semibold leading-[1.5] text-[#808080]"><MapPinSimpleArea size={16} />{event.city}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <div className="mt-5 flex h-24 items-center justify-center opacity-30">
            <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-[58px] w-24 object-contain grayscale" />
          </div>
        </div>
      </section>

      <div className="fixed bottom-[-44px] left-1/2 z-40 flex h-10 w-[358px] max-w-[calc(100vw-32px)] -translate-x-1/2 items-center justify-between rounded-xl border border-[rgba(95,193,138,0.64)] bg-black/25 px-3 text-white backdrop-blur">
        <span className="flex items-center gap-2 text-[12px] font-normal leading-[1.5]"><PaperPlaneTilt size={16} />Requirement sent to all relevant professionals</span>
        <XCircle size={16} />
      </div>

      <nav className="fixed bottom-0 left-1/2 z-30 flex h-[92px] w-full max-w-[390px] -translate-x-1/2 items-start justify-between border-t border-[#e6e6e6] bg-white/95 px-3 pb-5 pt-3 backdrop-blur">
        {[
          ['Home', House],
          ['Explore', Kanban],
          ['Post', Plus],
          ['Events', CalendarDots],
          ['Profile', User],
        ].map(([label, Icon], index) => (
          <button key={label} type="button" className="flex w-16 flex-col items-center justify-center gap-1.5 rounded-[20px] px-2.5 py-2 text-center text-[12px] leading-[1.5] text-black">
            <Icon size={20} weight={index === 0 ? 'fill' : 'regular'} />
            <span className={index === 0 ? 'font-bold hynt-nav-home' : 'font-semibold hynt-nav-item'}>{label}</span>
          </button>
        ))}
      </nav>

      <div className={`fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/52 backdrop-blur-sm transition-opacity duration-300 ${isFlowSwitcherOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <section className={`w-full max-w-[390px] rounded-t-[2rem] bg-white p-5 transition-transform duration-300 ${isFlowSwitcherOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[20px] font-extrabold leading-[1.35] text-black">Switch profile</h2>
            <button type="button" aria-label="Close switch profile" onClick={() => setIsFlowSwitcherOpen(false)} className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-700"><X size={16} weight="bold" /></button>
          </div>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => {
                onSelectFlow('homeowner')
                setIsFlowSwitcherOpen(false)
              }}
              className={`rounded-2xl border p-4 text-left ${activeFlow === 'homeowner' ? 'border-[#5FC18A] bg-[#effaf3]' : 'border-[#e4e4e4] bg-white'}`}
            >
              <p className="text-[16px] font-bold leading-6 text-black">Homeowner</p>
              <p className="mt-1 text-[13px] font-medium leading-5 text-[#6d6d6d]">Current homeowner journey</p>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectFlow('professional')
                setIsFlowSwitcherOpen(false)
              }}
              className={`rounded-2xl border p-4 text-left ${activeFlow === 'professional' ? 'border-[#5FC18A] bg-[#effaf3]' : 'border-[#e4e4e4] bg-white'}`}
            >
              <p className="text-[16px] font-bold leading-6 text-black">Professional</p>
              <p className="mt-1 text-[13px] font-medium leading-5 text-[#6d6d6d]">Dedicated pro journey</p>
            </button>
          </div>
        </section>
      </div>
    </main>
  )
  if (!isChatOpen) return renderHome()

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#eef3f0] font-['Urbanist'] text-slate-950">
      <section className="mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-[#eef3f0]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
          <p className="text-left text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#267449]">HYNT AI</p>
          <button type="button" onClick={closeChat} aria-label="Close chat" className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-700">
            <X size={16} weight="bold" />
          </button>
        </header>
        <div className="border-b border-slate-200 bg-white px-4 pb-3 pt-3">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-black tracking-[-0.04em]">Interactive brief</h1>
              <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-black ${allIntentFilled ? 'bg-[#5FC18A] text-white' : 'bg-[#eaf1ec] text-slate-500'}`}>{allIntentFilled ? 'Complete' : 'In progress'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBriefCollapsed((previous) => !previous)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-[13px] font-bold leading-[1.2] text-slate-700"
              >
                {isBriefCollapsed ? <><CaretDown size={12} weight="bold" />Show brief</> : <><CaretUp size={12} weight="bold" />Hide brief</>}
              </button>
            </div>
          </div>
          {!isBriefCollapsed ? (
            <div className="grid grid-cols-2 gap-2 rounded-[1.35rem] border border-slate-200 bg-white p-3">
              {[['Style', intent.style], ['Budget', intent.budget], ['Scope', intent.scope], ['Professional', intent.professional]].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/75 p-3">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-extrabold leading-tight text-slate-900">{renderIntentValue(value)}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div ref={chatScrollRef} className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
          {messages.map((message) => (
            message.thinking ? (
              <div key={message.id} className="-ml-2 mr-auto flex h-10 items-center gap-3 animate-[bubbleIn_240ms_ease-out_both]">
                <div className="size-9 overflow-hidden">
                  {allowRiveLoader && RivePlayer ? (
                    <RivePlayer src="/ai-loader.riv" autoplay className="h-full w-full" />
                  ) : (
                    <div className="flex h-full w-full items-center gap-1 px-2">
                      <span className="size-1.5 animate-pulse rounded-full bg-slate-300" />
                      <span className="size-1.5 animate-pulse rounded-full bg-slate-300 [animation-delay:120ms]" />
                      <span className="size-1.5 animate-pulse rounded-full bg-slate-300 [animation-delay:240ms]" />
                    </div>
                  )}
                </div>
                <span className="thinking-breathe text-[12px] font-semibold leading-[18px] text-slate-600">Thinking</span>
              </div>
            ) : (
              <article key={message.id} className={`max-w-[86%] animate-[bubbleIn_240ms_ease-out_both] ${message.role === 'user' ? 'ml-auto rounded-[1.3rem] rounded-br-md bg-[#5FC18A] px-4 py-3 text-right text-sm font-bold text-white shadow-lg shadow-[#5FC18A]/30' : 'mr-auto rounded-[1.5rem] rounded-bl-md border border-white/80 bg-white/82 px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-800 shadow-sm backdrop-blur-xl'}`}>
                <p>{message.text}</p>
                {renderBubbleAction(message)}
                {message.summary ? (
                  <button
                    type="button"
                    onClick={() => setIsBriefDetailOpen(true)}
                    className="mt-4 w-full rounded-2xl bg-[linear-gradient(145deg,#071238,#0f2b56)] p-4 text-left text-white shadow-lg shadow-[#071238]/35"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-black">Project brief</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold">
                        <Eye size={13} />
                        View
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/80">Style: {renderIntentValue(intent.style)} | Budget: {renderIntentValue(intent.budget)}</p>
                  </button>
                ) : null}
              </article>
            )
          ))}
          </div>
        </div>
        <div className="border-t border-slate-200 bg-white px-3 py-2">
          <div className="flex h-12 items-center gap-3 overflow-hidden rounded-2xl border border-[#9e9e9e] bg-[#fbfbfb] pl-1 pr-2">
            <button type="button" aria-label="Camera" className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-slate-900">
              <Camera size={24} />
            </button>
            <input
              value={chatDraft}
              onChange={(event) => setChatDraft(event.target.value)}
              placeholder="Enter message..."
              className="h-6 min-w-0 flex-1 bg-transparent text-[16px] font-medium leading-6 tracking-[-0.2px] text-slate-700 outline-none placeholder:text-[#999]"
            />
            <div className="flex h-9 shrink-0 items-center gap-3 rounded-xl px-1 text-slate-900">
              <ImagesSquare size={24} />
              <Microphone size={24} />
            </div>
          </div>
        </div>
      </section>

      <div className={`fixed inset-0 z-50 flex items-end justify-center bg-slate-950/62 backdrop-blur-sm transition-opacity duration-300 ${activeModal ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <section className={`max-h-[88dvh] w-screen overflow-hidden rounded-t-[2rem] bg-white shadow-2xl transition-transform duration-300 ease-out ${activeModal ? 'translate-y-0' : 'translate-y-full'}`}>
          {activeModal ? (
            <>
              <header className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#267449]">Selector</p>
                  <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950">{selectorMeta[activeModal.type].title}</h2>
                </div>
                <button type="button" onClick={closeModal} className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700"><X size={18} weight="bold" /></button>
              </header>
              <div className="max-h-[calc(88dvh-10rem)] overflow-y-auto bg-[linear-gradient(180deg,_#ffffff_0%,_#f4fbf6_100%)] p-5 pb-24">
                {renderSelectorContent()}
              </div>
              <div className="sticky bottom-0 border-t border-white/70 bg-white/82 p-4 backdrop-blur-xl">
                <button
                  type="button"
                  disabled={isConfirmDisabled}
                  onClick={activeModal.type === 'style' && isStyleAssistOpen ? applyStyleAssist : confirmSelection}
                  className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-base font-black text-white shadow-xl shadow-slate-950/20 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {activeModal.type === 'style' && isStyleAssistOpen ? 'Use selected references' : 'Confirm selection'}
                </button>
              </div>
            </>
          ) : null}
        </section>
      </div>

      <div className={`fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/62 backdrop-blur-sm transition-opacity duration-300 ${isBriefDetailOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <section className={`w-screen max-w-[480px] rounded-t-[2rem] bg-white p-5 transition-transform duration-300 ${isBriefDetailOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">Project brief</h3>
            <button type="button" onClick={() => setIsBriefDetailOpen(false)} className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700"><X size={18} weight="bold" /></button>
          </div>
          <div className="rounded-2xl bg-[linear-gradient(145deg,#071238,#0f2b56)] p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Your selections</p>
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-6 text-white/85"><span className="font-bold text-white">Style:</span> {renderIntentValue(intent.style)}</p>
              <p className="text-sm leading-6 text-white/85"><span className="font-bold text-white">Budget:</span> {renderIntentValue(intent.budget)}</p>
              <p className="text-sm leading-6 text-white/85"><span className="font-bold text-white">Scope:</span> {renderIntentValue(intent.scope)}</p>
              <p className="text-sm leading-6 text-white/85"><span className="font-bold text-white">Professional:</span> {renderIntentValue(intent.professional)}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function App() {
  const [activeFlow, setActiveFlow] = useState(() => localStorage.getItem(FLOW_STORAGE_KEY))

  const handleSelectFlow = (flow) => {
    localStorage.setItem(FLOW_STORAGE_KEY, flow)
    setActiveFlow(flow)
  }

  const handleResetFlow = () => {
    localStorage.removeItem(FLOW_STORAGE_KEY)
    setActiveFlow(null)
  }

  if (activeFlow === 'homeowner') return <HomeownerFlow activeFlow={activeFlow} onSelectFlow={handleSelectFlow} />
  if (activeFlow === 'professional') return <ProfessionalHome onOpenFlowSwitcher={handleResetFlow} />
  return <FlowSelection onSelectFlow={handleSelectFlow} />
}

export default App
