import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
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
  Phone,
  Plus,
  Crosshair,
  DotsThreeVertical,
  NotePencil,
  ChatCircleText,
  SlidersHorizontal,
  Trash,
  User,
  Eye,
  Microphone,
  X,
  XCircle,
} from '@phosphor-icons/react'
import './App.css'
import FlowSelection from './features/flow/FlowSelection'
import ProToolsHome from './features/pro/tools/ProToolsHome'
import ProSowWorkspace from './features/sow/ProSowWorkspace'
import HomeownerSowReview from './features/sow/HomeownerSowReview'
import ProjectTasksWorkspace from './features/tasks/ProjectTasksWorkspace'
import PeopleAccessWorkspace from './features/team/PeopleAccessWorkspace'
import { useSharedProject } from './features/collaboration/mockProjectStore'
import HomeownerProjectPortal from './features/homeowner/HomeownerProjectPortal'
import HomeownerArchiveWorkspace from './features/archive/HomeownerArchiveWorkspace'
import HomeownerFinanceWorkspace from './features/finance/HomeownerFinanceWorkspace'
import HomeownerBoqWorkspace from './features/homeowner/HomeownerBoqWorkspace'
import HomeownerTimelineWorkspace from './features/timeline/HomeownerTimelineWorkspace'
import HomeownerSiteDiaryWorkspace from './features/homeowner/HomeownerSiteDiaryWorkspace'
import ProBoqWorkspace from './features/boq/ProBoqWorkspace'
import ProFinanceWorkspace from './features/finance/ProFinanceWorkspace'
import ProSiteDiaryWorkspace from './features/siteDiary/ProSiteDiaryWorkspace'
import ProTimelineWorkspace from './features/timeline/ProTimelineWorkspace'
import ProArchiveWorkspace from './features/archive/ProArchiveWorkspace'
import ProjectWorkspaceWidgets from './features/projects/ProjectWorkspaceWidgets'
import Button from './components/ui/Button'


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
    alerts: [
      {
        id: 'a-1',
        label: 'New remark',
        title: 'Aarav asked for an update on the kitchen scope',
        detail: 'Client wants to confirm whether chimney provision is already included before approving the next step.',
        time: '12m ago',
        target: 'sow',
        sowView: 'remarks',
      },
      {
        id: 'a-2',
        label: 'Payment',
        title: 'Advance payment screenshot shared',
        detail: 'Aarav uploaded a receipt for the latest transfer. Review and mark received if it matches.',
        time: '1h ago',
        target: 'finance',
      },
    ],
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
    alerts: [
      {
        id: 'a-3',
        label: 'Site update',
        title: 'Nisha sent updated site measurements',
        detail: 'Kitchen wall dimension was revised after plumbing check.',
        time: '45m ago',
        target: 'boq',
      },
    ],
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
    alerts: [],
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
    alerts: [
      {
        id: 'a-4',
        label: 'Closed',
        title: 'Final handover note acknowledged',
        detail: 'Client marked the last completion note as received.',
        time: 'Yesterday',
        target: 'site-diary',
      },
    ],
  },
]

const getDaysUntilDate = (value) => {
  const target = new Date(`${value} 00:00:00`)
  if (Number.isNaN(target.getTime())) return null
  const today = new Date()
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const due = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  return Math.ceil((due.getTime() - current.getTime()) / (1000 * 60 * 60 * 24))
}

const getDeadlineTone = (daysLeft) => {
  if (daysLeft === null) {
    return {
      shell: 'border-[#d9e2dc] bg-[#f7faf8]',
      badge: 'bg-[#eef4f0] text-[#5f7467]',
      ring: ['#b9c8be', '#e9f0eb'],
      accent: 'text-[#102418]',
      helper: 'Schedule pending',
    }
  }

  if (daysLeft <= 14) {
    return {
      shell: 'border-[#f2c4bc] bg-[#fff4f1]',
      badge: 'bg-[#ffe3dc] text-[#b14f3c]',
      ring: ['#f47c64', '#ffd9d0'],
      accent: 'text-[#7f2f20]',
      helper: daysLeft < 0 ? 'Past due' : 'Deadline soon',
    }
  }

  if (daysLeft <= 45) {
    return {
      shell: 'border-[#f1d39d] bg-[#fff8ec]',
      badge: 'bg-[#ffecc9] text-[#9b6a00]',
      ring: ['#efb24d', '#ffe9c0'],
      accent: 'text-[#7d5700]',
      helper: 'Keep momentum',
    }
  }

  return {
    shell: 'border-[#bfe6cd] bg-[#eef9f2]',
    badge: 'bg-[#daf2e3] text-[#267449]',
    ring: ['#5fc18a', '#d9efe1'],
    accent: 'text-[#1f5b39]',
    helper: 'Timeline healthy',
  }
}

const getDeadlineProgress = (project) => {
  const daysLeft = getDaysUntilDate(project.dueDate)
  const startDate = new Date(project.kickoffDate)
  const dueDate = new Date(`${project.dueDate} 00:00:00`)
  let progress = 0.35

  if (daysLeft !== null && !Number.isNaN(startDate.getTime()) && !Number.isNaN(dueDate.getTime()) && dueDate > startDate) {
    const today = new Date()
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const totalDuration = dueDate.getTime() - startDate.getTime()
    const elapsedDuration = Math.min(Math.max(current.getTime() - startDate.getTime(), 0), totalDuration)
    progress = Math.min(Math.max(elapsedDuration / totalDuration, 0.08), 0.92)
  }

  return { daysLeft, progress }
}

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

const exploreTabs = ['Ideas', 'Professionals', 'Products']
const exploreFilters = ['Show all', 'Bedroom', 'Kitchen', 'Living room', 'Bathroom']
const fallbackExploreIdeaCards = [
  { id: 'idea-a', image: '/hynt-home/idea-1.png', height: 'h-[174px]', badge: '1/5', type: 'image' },
  { id: 'idea-b', image: '/hynt-home/idea-2.png', height: 'h-[250px]', type: 'image' },
  { id: 'idea-c', image: '/hynt-home/pro-2.png', height: 'h-[173px]', type: 'image' },
  { id: 'idea-d', image: '/hynt-home/product.png', height: 'h-[249px]', type: 'video' },
  { id: 'idea-e', image: '/hynt-home/event-1.png', height: 'h-[171px]', type: 'video' },
  { id: 'idea-f', image: '/hynt-home/event-2.png', height: 'h-[173px]', type: 'image' },
  { id: 'idea-g', image: '/hynt-home/product.png', height: 'h-[179px]', badge: '1/5', type: 'image' },
  { id: 'idea-h', image: '/hynt-home/brand.png', height: 'h-[108px]', type: 'image' },
  { id: 'idea-i', image: styleAssistImages[0].image, height: 'h-[228px]', type: 'image' },
  { id: 'idea-j', image: styleAssistImages[1].image, height: 'h-[196px]', type: 'image' },
  { id: 'idea-k', image: styleAssistImages[2].image, height: 'h-[214px]', type: 'video' },
  { id: 'idea-l', image: styleAssistImages[3].image, height: 'h-[188px]', type: 'image' },
  { id: 'idea-m', image: styleAssistImages[4].image, height: 'h-[242px]', badge: '1/5', type: 'image' },
  { id: 'idea-n', image: styleAssistImages[5].image, height: 'h-[205px]', type: 'image' },
]
const fallbackDesktopExploreIdeaCards = [...fallbackExploreIdeaCards, ...fallbackExploreIdeaCards.slice(0, 14)]
const unsplashExploreHeights = ['h-[174px]', 'h-[250px]', 'h-[173px]', 'h-[249px]', 'h-[171px]', 'h-[173px]', 'h-[179px]', 'h-[228px]', 'h-[196px]', 'h-[214px]', 'h-[188px]', 'h-[242px]', 'h-[205px]']
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

const mapUnsplashPhotoToIdeaCard = (photo, index) => ({
  id: `unsplash-${photo.id}-${index}`,
  image: photo.urls?.regular ?? photo.urls?.small ?? photo.urls?.thumb ?? '',
  height: unsplashExploreHeights[index % unsplashExploreHeights.length],
  badge: index % 7 === 0 ? '1/5' : null,
  type: index % 6 === 0 ? 'video' : 'image',
  photographer: photo.user?.name ?? 'Unsplash',
  photographerUrl: photo.user?.links?.html ? `${photo.user.links.html}${photo.user.links.html.includes('?') ? '&' : '?'}utm_source=hynt_app&utm_medium=referral` : 'https://unsplash.com/?utm_source=hynt_app&utm_medium=referral',
  sourceLabel: 'Unsplash',
})

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
        <span className={`typo-utility block ${selected ? 'typo-weight-bold text-[#5FC18A]' : 'typo-weight-semibold text-[#1D1D1D]'}`}>{label}</span>
      </span>
    </button>
  )
}

function ProfessionalHome({ onOpenFlowSwitcher }) {
  const [isProjectsViewOpen, setIsProjectsViewOpen] = useState(false)
  const [proHomeTab, setProHomeTab] = useState('home')
  const [isProHomeDense, setIsProHomeDense] = useState(false)
  const [proPrompt, setProPrompt] = useState('')
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [isDeleteProjectConfirmOpen, setIsDeleteProjectConfirmOpen] = useState(false)
  const [newProjectForm, setNewProjectForm] = useState({
    client: '',
    phone: '',
    email: '',
    location: '',
    scope: '',
    projectType: 'Full renovation',
    status: 'Active',
    budgetL: '',
    dueDate: '',
  })
  const [proAiMessages, setProAiMessages] = useState([
    { id: 'pro-ai-1', role: 'ai', text: 'What would you like to do?' },
  ])
  const [projectStatusFilter, setProjectStatusFilter] = useState('Active')
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const {
    projects: sharedProjects,
    sow: sharedProjectSow,
    memberships: sharedProjectMemberships,
    archiveItems: sharedProjectArchiveItems,
    financeInvoices: sharedFinanceInvoices,
    financeExpenses: sharedFinanceExpenses,
    siteDiaryEntries: sharedSiteDiaryEntries,
    siteDiaryIssues: sharedSiteDiaryIssues,
    siteDiaryReferences: sharedSiteDiaryReferences,
    timelinePhases: sharedTimelinePhases,
    boqMeta: sharedProjectBoqMeta,
    boqItems: sharedProjectBoqItems,
    projectTasks: sharedProjectTasksPro,
    taskApprovals: sharedTaskApprovalsPro,
    taskStepCompletion: sharedTaskStepCompletionPro,
    actions: sharedProjectActions,
  } = useSharedProject(selectedProjectId)
  const projects = sharedProjects
  const [selectedProjectPage, setSelectedProjectPage] = useState('overview')
  const [boqItems, setBoqItems] = useState(initialBoqItems)
  const [projectTasks, setProjectTasks] = useState(initialProjectTasks)
  const [projectInvoices, setProjectInvoices] = useState(initialProjectInvoices)
  const [projectDiaryEntries, setProjectDiaryEntries] = useState(initialProjectDiaryEntries)
  const [projectTeamMembers, setProjectTeamMembers] = useState(initialProjectTeamMembers)
  const [firmMembers] = useState(initialFirmMembers)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null)
  const [isProSowOpen, setIsProSowOpen] = useState(false)
  const [proSowInitialView, setProSowInitialView] = useState('draft')
  const [taskStepCompletion, setTaskStepCompletion] = useState({})
  const [isDiaryComposerOpen, setIsDiaryComposerOpen] = useState(false)
  const [diaryDraftNote, setDiaryDraftNote] = useState('')
  const [diaryDraftPhotos, setDiaryDraftPhotos] = useState([])
  const [diaryActionEntryId, setDiaryActionEntryId] = useState(null)
  const [editingDiaryEntryId, setEditingDiaryEntryId] = useState(null)
  const [selectedFirmMemberId, setSelectedFirmMemberId] = useState(null)
  const [selectedFirmMemberIds, setSelectedFirmMemberIds] = useState([])
  const [selectedMemberProjectIds, setSelectedMemberProjectIds] = useState([])
  const renderInrValue = (value, className = 'typo-data-value', iconSize = 17) => (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      <CurrencyInr size={iconSize} weight="bold" />
      {value}
    </span>
  )

  const projectFilterChips = ['Active', 'Completed']
  const filteredProjects = projects.filter((project) => (
    projectStatusFilter === 'Completed'
      ? ['Completed', 'Done'].includes(project.status)
      : project.status === 'Active'
  ))
  const projectEmptyState = projectStatusFilter === 'Completed'
    ? {
        title: 'No completed projects yet',
        body: 'Closed-out projects will collect here once a job is marked complete.',
      }
    : {
        title: 'No active projects yet',
        body: 'Create a project to start tracking scope, timelines, and homeowner collaboration.',
      }
  const selectedProject = projects.find((project) => project.id === selectedProjectId) || null
  const getProjectCount = (status) => projects.filter((project) => (
    status === 'Completed'
      ? ['Completed', 'Done'].includes(project.status)
      : project.status === status
  )).length
  const proAiOptions = [
    'Create BOQ from room measurements',
    'Generate site-visit checklist',
    'Draft client update summary',
    'Plan weekly execution timeline',
    'Review material procurement status',
    'Estimate lighting load by room',
  ]
  const proSidebarItems = [
    ['home', 'Home', House, 'icon'],
    ['explore', 'Explore', Kanban, 'icon'],
    ['ai', 'HYNT AI', null, 'hynt-ai'],
    ['leads', 'Leads', Crosshair, 'icon'],
    ['protools', 'Projects', SlidersHorizontal, 'icon'],
  ]
  const handleProNavSelect = (key) => {
    if (key === 'protools') {
      setIsProjectsViewOpen(true)
      return
    }
    if (key === 'ai') {
      setProHomeTab('ai')
      return
    }
    setProHomeTab('home')
  }
  const isProNavSelected = (key) => {
    if (key === 'ai') return proHomeTab === 'ai'
    if (key === 'protools') return isProjectsViewOpen
    return proHomeTab === 'home' && key === 'home'
  }
  const openProjectAlert = (alert) => {
    setSelectedProjectPage('overview')
    if (alert.target === 'sow') {
      setProSowInitialView(alert.sowView || 'draft')
      setIsProSowOpen(true)
      return
    }
    if (alert.target === 'boq' || alert.target === 'tasks' || alert.target === 'finance' || alert.target === 'site-diary' || alert.target === 'team' || alert.target === 'archive' || alert.target === 'timeline') {
      setSelectedProjectPage(alert.target)
    }
  }
  const openProjectTool = (toolLabel) => {
    if (toolLabel === 'SOW') {
      setProSowInitialView('draft')
      setIsProSowOpen(true)
      return
    }
    if (toolLabel === 'Moodboard') {
      setSelectedProjectPage('archive')
      return
    }
    if (toolLabel === 'BOQ') {
      setSelectedProjectPage('boq')
      return
    }
    if (toolLabel === 'Tasks') {
      setSelectedProjectPage('tasks')
      return
    }
    if (toolLabel === 'Finance') {
      setSelectedProjectPage('finance')
      return
    }
    if (toolLabel === 'Site diary') {
      setSelectedProjectPage('site-diary')
      return
    }
    if (toolLabel === 'Timeline') {
      setSelectedProjectPage('timeline')
      return
    }
    if (toolLabel === 'Team') {
      setSelectedProjectPage('team')
    }
  }
  const deleteSelectedProject = () => {
    if (!selectedProject) return
    sharedProjectActions.deleteProject(selectedProject.id)
    setIsDeleteProjectConfirmOpen(false)
    setSelectedProjectId(null)
    setSelectedProjectPage('overview')
  }
  useEffect(() => {
    const updateDenseState = () => {
      if (typeof window === 'undefined') return
      const isDesktop = window.innerWidth >= 1024
      setIsProHomeDense(isDesktop && !isProjectsViewOpen && proHomeTab === 'home' && window.scrollY > 180)
    }

    updateDenseState()
    window.addEventListener('scroll', updateDenseState, { passive: true })
    window.addEventListener('resize', updateDenseState)

    return () => {
      window.removeEventListener('scroll', updateDenseState)
      window.removeEventListener('resize', updateDenseState)
    }
  }, [isProjectsViewOpen, proHomeTab])
  const renderProDesktopNav = () => (
    <aside className="hynt-home-shell__sidebar">
      <div className="hynt-home-shell__sidebar-rail">
        <div className="flex flex-col items-center gap-4">
          <button type="button" aria-label="Open profile switcher" onClick={onOpenFlowSwitcher} className="hynt-home-shell__utility-button">
            <img src="/hynt-home/pro-1.png" alt="" className="size-7 rounded-full object-cover" />
          </button>
          <button type="button" aria-label="Notifications" className="hynt-home-shell__utility-button relative">
            <Bell size={20} />
            <span className="absolute right-[7px] top-[7px] size-2 rounded-full bg-[#26c485]" />
          </button>
          <button type="button" aria-label="Messages" className="hynt-home-shell__utility-button relative">
            <ChatsCircle size={20} />
            <span className="typo-status-mini absolute right-[5px] top-[4px] grid min-h-4 min-w-4 place-items-center rounded-full bg-[#26c485] px-1 text-white">3</span>
          </button>
        </div>

        <div className="hynt-home-shell__sidebar-stack">
          {proSidebarItems.map(([key, label, Icon, kind]) => {
            const selected = isProNavSelected(key)
            return (
              <button
                key={key}
                type="button"
                aria-label={label}
                onClick={() => handleProNavSelect(key)}
                className={`hynt-home-shell__sidebar-button ${selected ? 'hynt-home-shell__sidebar-button--active' : ''}`}
              >
                {kind === 'hynt-ai' ? (
                  <img src="/hynt-home/door-and-star.svg" alt="" className={`size-5 ${selected ? 'brightness-0 saturate-0' : 'brightness-0 saturate-0 opacity-55'}`} />
                ) : (
                  <Icon size={22} weight={selected ? 'fill' : 'regular'} />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button type="button" aria-label="More" className="hynt-home-shell__utility-button">
            <DotsThreeVertical size={22} weight="bold" />
          </button>
        </div>
      </div>
    </aside>
  )

  if (isProjectsViewOpen) {
    if (isProSowOpen && selectedProject) {
      return <ProSowWorkspace project={selectedProject} onBack={() => setIsProSowOpen(false)} entry="existing" initialView={proSowInitialView} />
    }
    if (selectedProject && selectedProjectPage === 'updates') {
      return (
        <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
          <section className="mx-auto w-full max-w-[390px] pb-24 pt-16">
            <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between py-1">
                  <button type="button" onClick={() => setSelectedProjectPage('overview')} className="flex items-center gap-4">
                    <span className="grid size-6 place-items-center rounded">
                      <CaretLeft size={24} />
                    </span>
                    <span className="text-left">
                      <span className="typo-section-title block text-black">All updates</span>
                      <span className="typo-caption block text-[#999999]">{selectedProject.scope}</span>
                    </span>
                  </button>
                  <span className="typo-caption rounded-full border border-[#e1e1e1] bg-white px-3 py-1 uppercase text-[#6f6f6f]">
                    {selectedProject.alerts.length}
                  </span>
                </div>
              </div>
            </header>

            <div className="px-4 py-6">
              <div className="space-y-2">
                {selectedProject.alerts.length ? selectedProject.alerts.map((alert) => (
                  <button key={alert.id} type="button" onClick={() => openProjectAlert(alert)} className="flex w-full items-start justify-between gap-3 rounded-[22px] border border-[#e1e1e1] bg-white px-4 py-3 text-left">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="typo-caption rounded-full bg-[#f5f5f5] px-2 py-1 uppercase text-[#6f6f6f]">{alert.label}</span>
                      </div>
                      <p className="typo-body-strong mt-2 text-black">{alert.title}</p>
                    </div>
                    <span className="typo-caption shrink-0 uppercase text-[#999999]">{alert.time}</span>
                  </button>
                )) : (
                  <article className="rounded-2xl border border-[#e1e1e1] bg-white p-3">
                    <p className="typo-card-title text-black">No updates yet</p>
                  </article>
                )}
              </div>
            </div>
          </section>
        </main>
      )
    }
    if (!selectedProject && isCreateProjectOpen) {
      return (
        <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
          <section className="mx-auto w-full max-w-[390px] pb-24 pt-16">
            <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#ececec] bg-white/95 backdrop-blur">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between py-1">
                  <button type="button" onClick={() => setIsCreateProjectOpen(false)} className="flex items-center gap-4">
                    <span className="grid size-6 place-items-center rounded">
                      <CaretLeft size={24} />
                    </span>
                    <span className="text-left">
                      <span className="typo-section-title block text-black">New project</span>
                      <span className="typo-caption block text-[#999999]">Enter project details</span>
                    </span>
                  </button>
                </div>
              </div>
            </header>

            <div className="space-y-5 px-4 py-6">
              <section className="rounded-[20px] border border-[#e0e0e0] bg-white p-4">
                <h2 className="typo-section-title text-black">Client details</h2>
                <div className="mt-4 space-y-3">
                  {[
                    ['client', 'Client name', 'text', 'Aarav Mehta'],
                    ['phone', 'Mobile number', 'tel', '+91 98765 43210'],
                    ['email', 'Email', 'email', 'aarav@example.com'],
                    ['location', 'Location', 'text', 'Bengaluru'],
                  ].map(([key, label, type, placeholder]) => (
                    <label key={key} className="block">
                      <p className="typo-label mb-1 uppercase text-[#7b7b7b]">{label}</p>
                      <input
                        type={type}
                        value={newProjectForm[key]}
                        placeholder={placeholder}
                        onChange={(event) => setNewProjectForm((prev) => ({ ...prev, [key]: event.target.value }))}
                        className="typo-body h-11 w-full rounded-2xl border border-[#d7d7d7] px-3 outline-none"
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-[20px] border border-[#e0e0e0] bg-white p-4">
                <h2 className="typo-section-title text-black">Project details</h2>
                <div className="mt-4 space-y-3">
                  {[
                    ['scope', 'Project name', 'text', '3BHK Full Renovation'],
                    ['budgetL', 'Budget (L)', 'number', '28'],
                    ['dueDate', 'Due date', 'date', ''],
                  ].map(([key, label, type, placeholder]) => (
                    <label key={key} className="block">
                      <p className="typo-label mb-1 uppercase text-[#7b7b7b]">{label}</p>
                      <input
                        type={type}
                        value={newProjectForm[key]}
                        placeholder={placeholder}
                        onChange={(event) => setNewProjectForm((prev) => ({ ...prev, [key]: event.target.value }))}
                        className="typo-body h-11 w-full rounded-2xl border border-[#d7d7d7] px-3 outline-none"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <p className="typo-label mb-1 uppercase text-[#7b7b7b]">Project type</p>
                    <select
                      value={newProjectForm.projectType}
                      onChange={(event) => setNewProjectForm((prev) => ({ ...prev, projectType: event.target.value }))}
                      className="typo-body h-11 w-full rounded-2xl border border-[#d7d7d7] bg-white px-3 outline-none"
                    >
                      <option>Full renovation</option>
                      <option>Furniture only</option>
                      <option>Design consultation</option>
                      <option>Turnkey execution</option>
                    </select>
                  </label>
                  <label className="block">
                    <p className="typo-label mb-1 uppercase text-[#7b7b7b]">Status</p>
                    <select
                      value={newProjectForm.status}
                      onChange={(event) => setNewProjectForm((prev) => ({ ...prev, status: event.target.value }))}
                      className="typo-body h-11 w-full rounded-2xl border border-[#d7d7d7] bg-white px-3 outline-none"
                    >
                      <option>Active</option>
                      <option>Completed</option>
                    </select>
                  </label>
                </div>
              </section>
            </div>
          </section>

          <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
            <Button
              type="button"
              fullWidth
              className="h-12 rounded-[20px]"
              onClick={() => {
                if (!newProjectForm.client.trim() || !newProjectForm.scope.trim()) return
                const newProjectId = `p-${Date.now()}`
                sharedProjectActions.createProject({ ...newProjectForm, id: newProjectId })
                setSelectedProjectId(newProjectId)
                setSelectedProjectPage('overview')
                setNewProjectForm({
                  client: '',
                  phone: '',
                  email: '',
                  location: '',
                  scope: '',
                  projectType: 'Full renovation',
                  status: 'Active',
                  budgetL: '',
                  dueDate: '',
                })
                setIsCreateProjectOpen(false)
              }}
            >
              Create project
            </Button>
          </div>
        </main>
      )
    }

    if (selectedProject) {
      const projectDeadline = getDeadlineProgress(selectedProject)
      const projectDeadlineTone = getDeadlineTone(projectDeadline.daysLeft)
      const projectDueLabel = projectDeadline.daysLeft === null
        ? 'Schedule pending'
        : projectDeadline.daysLeft < 0
          ? `${Math.abs(projectDeadline.daysLeft)} day${Math.abs(projectDeadline.daysLeft) === 1 ? '' : 's'} overdue`
          : `${projectDeadline.daysLeft} day${projectDeadline.daysLeft === 1 ? '' : 's'} left`

      if (selectedProjectPage === 'boq') {
        return (
          <ProBoqWorkspace
            project={selectedProject}
            onBack={() => setSelectedProjectPage('overview')}
            onOpenFinance={() => setSelectedProjectPage('finance')}
          />
        )
      }

      if (selectedProjectPage === 'tasks') {
        return (
          <ProjectTasksWorkspace
            mode="pro"
            selectedProject={selectedProject}
            tasks={sharedProjectTasksPro}
            setTasks={sharedProjectActions.setProjectTasks}
            approvals={sharedTaskApprovalsPro}
            setApprovals={sharedProjectActions.setProjectTaskApprovals}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={setSelectedTaskId}
            taskStepCompletion={sharedTaskStepCompletionPro}
            setTaskStepCompletion={sharedProjectActions.setProjectTaskStepCompletion}
            onBack={() => setSelectedProjectPage('overview')}
          />
        )
      }

      if (selectedProjectPage === 'finance') {
        return (
          <ProFinanceWorkspace
            project={selectedProject}
            onBack={() => setSelectedProjectPage('overview')}
          />
        )
      }

      if (selectedProjectPage === 'site-diary') {
        return (
          <ProSiteDiaryWorkspace
            project={selectedProject}
            onBack={() => setSelectedProjectPage('overview')}
            onCreateTask={(payload) => {
              sharedProjectActions.setProjectTasks((prev) => [
                {
                  id: `t-${Date.now()}`,
                  projectId: selectedProject.id,
                  title: payload.title,
                  assignee: 'Site supervisor',
                  assignedBy: 'Riya Desai',
                  due: 'Today',
                  dueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                  dueTime: '06:00 PM',
                  status: 'todo',
                  steps: [payload.note || 'Resolve reported issue'],
                },
                ...prev,
              ])
            }}
          />
        )
      }

      if (selectedProjectPage === 'archive') {
        return (
          <ProArchiveWorkspace
            project={selectedProject}
            onBack={() => setSelectedProjectPage('overview')}
          />
        )
      }

      if (selectedProjectPage === 'timeline') {
        return (
          <ProTimelineWorkspace
            project={selectedProject}
            onBack={() => setSelectedProjectPage('overview')}
          />
        )
      }


      if (selectedProjectPage === 'team-directory') {
        const currentTeamPhones = new Set(projectTeamMembers.filter((member) => member.projectId === selectedProject.id).map((member) => member.phone))
        const availableFirmMembers = firmMembers.filter((member) => !currentTeamPhones.has(member.phone))

        return (
          <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
            <section className="mx-auto w-full max-w-[390px] pb-24 pt-16">
              <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between py-1">
                    <button type="button" onClick={() => setSelectedProjectPage('team')} className="flex items-center gap-4">
                      <span className="grid size-6 place-items-center rounded">
                        <CaretLeft size={24} />
                      </span>
                      <span className="text-left">
                        <span className="typo-section-title block text-black">Firm members</span>
                        <span className="typo-caption block text-[#999999]">Add existing members to projects</span>
                      </span>
                    </button>
                    <span className="typo-meta text-[#6f6f6f]">{availableFirmMembers.length} available</span>
                  </div>
                </div>
              </header>

              <div className="px-4 pb-6 pt-8">
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
                          <p className="typo-body-strong truncate">{member.name}</p>
                          <p className="typo-meta truncate text-[#6f6f6f]">{member.role}</p>
                          <p className="typo-meta truncate text-[#7b7b7b]">
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
              <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
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
                  className="typo-body-strong h-11 w-full rounded-full bg-black text-white"
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
            <section className="mx-auto w-full max-w-[390px] pb-24 pt-16">
              <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between py-1">
                    <button type="button" onClick={() => setSelectedProjectPage('team-directory')} className="flex items-center gap-4">
                      <span className="grid size-6 place-items-center rounded">
                        <CaretLeft size={24} />
                      </span>
                      <span className="text-left">
                        <span className="typo-section-title block text-black">Add to projects</span>
                        <span className="typo-caption block text-[#999999]">{firmMember.name}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </header>

              <div className="px-4 py-6">
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
                        <p className="typo-body-strong">{project.scope}</p>
                        <p className="typo-meta text-[#6f6f6f]">{project.client} - {project.location}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

              <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
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
                className="typo-body-strong h-11 w-full rounded-full bg-black text-white disabled:opacity-40"
                disabled={selectedMemberProjectIds.length === 0}
              >
                Add to selected projects
              </button>
            </div>
          </main>
        )
      }

      if (selectedProjectPage === 'team') {
        return <PeopleAccessWorkspace project={selectedProject} onBack={() => setSelectedProjectPage('overview')} />
      }

      return (
        <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
          <section className="mx-auto w-full max-w-[390px] pt-16">
            <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between py-1">
                  <button type="button" onClick={() => setSelectedProjectId(null)} className="flex items-center gap-4">
                    <span className="grid size-6 place-items-center rounded">
                      <CaretLeft size={24} />
                    </span>
                    <span className="text-left">
                      <span className="typo-section-title block text-black">Project details</span>
                      <span className="typo-caption block text-[#999999]">Back to projects</span>
                    </span>
                  </button>
                  <button type="button" onClick={() => setSelectedProjectPage('updates')} className="relative grid size-10 place-items-center" aria-label="Project updates">
                    <Bell size={22} />
                    {selectedProject.alerts.length ? (
                      <span className="typo-status-mini absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-[#26c485] px-1 text-white">
                        {selectedProject.alerts.length}
                      </span>
                    ) : null}
                  </button>
                </div>
              </div>
            </header>

            <div className="pb-20">
              <section className="px-4 py-5">
                <article className="rounded-[20px] border border-[#dce8df] bg-[#fbfffd] p-3 shadow-[0_10px_22px_rgba(16,36,24,0.06)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="typo-meta inline-flex h-[24px] w-fit items-center rounded-full bg-black px-2 py-1 text-[#26c485]">
                        {selectedProject.status}
                      </span>
                      <h1 className="typo-section-title mt-2 text-black">{selectedProject.scope}</h1>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <a href={`tel:${selectedProject.phone}`} aria-label="Call homeowner" className="grid size-9 place-items-center rounded-[16px] bg-[#e7f5ed] text-[#123d28]">
                        <Phone size={18} weight="bold" />
                      </a>
                      <a href={`sms:${selectedProject.phone}`} aria-label="Text homeowner" className="grid size-9 place-items-center rounded-[16px] bg-[#e7f5ed] text-[#123d28]">
                        <ChatCircleText size={18} weight="bold" />
                      </a>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <img src="/hynt-home/pro-1.png" alt="" className="size-12 rounded-[16px] border border-[#dce8df] object-cover" />
                    <div className="min-w-0">
                      <p className="typo-body-strong truncate text-black">{selectedProject.client}</p>
                      <p className="typo-meta mt-0.5 truncate text-[#607269]">{selectedProject.location}</p>
                      <p className="typo-caption mt-0.5 truncate text-[#525252]">{selectedProject.phone}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="typo-body-strong text-black">Due {selectedProject.dueDate}</p>
                      <span className={`typo-label rounded-full px-2 py-1 ${projectDeadlineTone.badge}`}>{projectDueLabel}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e2ebe6]">
                      <span className="block h-full rounded-full bg-[#5fc18a]" style={{ width: `${Math.max(6, Math.round(projectDeadline.progress * 100))}%` }} />
                    </div>
                  </div>
                </article>
              </section>

              <ProjectWorkspaceWidgets
                project={selectedProject}
                sow={sharedProjectSow}
                memberships={sharedProjectMemberships}
                archiveItems={sharedProjectArchiveItems}
                financeInvoices={sharedFinanceInvoices}
                financeExpenses={sharedFinanceExpenses}
                siteDiaryEntries={sharedSiteDiaryEntries}
                siteDiaryIssues={sharedSiteDiaryIssues}
                siteDiaryReferences={sharedSiteDiaryReferences}
                boqMeta={sharedProjectBoqMeta}
                boqItems={sharedProjectBoqItems}
                fallbackBoqItems={boqItems}
                projectTasks={sharedProjectTasksPro}
                taskApprovals={sharedTaskApprovalsPro}
                onOpenTool={openProjectTool}
              />

              <section className="px-4 pb-6 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  leadingIcon={Trash}
                  className="h-11 rounded-[18px] border-[#f0c9c9] bg-[#fffafa] !text-[#b42318] hover:border-[#b42318] hover:bg-[#fff5f5] [&_span]:!text-[#b42318] [&_svg]:!text-[#b42318]"
                  onClick={() => setIsDeleteProjectConfirmOpen(true)}
                >
                  Delete project
                </Button>
              </section>
            </div>
          </section>

          {isDeleteProjectConfirmOpen ? (
            <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/30 px-3 pb-3">
              <section className="w-full max-w-[390px] rounded-[28px] bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-[18px] bg-[#fff1f1] text-[#b42318]">
                    <Trash size={22} weight="bold" />
                  </span>
                  <div className="min-w-0">
                    <p className="typo-card-title text-black">Delete this project?</p>
                    <p className="typo-body mt-1 text-[#607269]">
                      {selectedProject.scope} and all linked tool data will be removed from this mock workspace.
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  <Button
                    type="button"
                    fullWidth
                    leadingIcon={Trash}
                    className="h-12 rounded-[20px] bg-[#b42318] text-white hover:bg-[#8f1d14] focus-visible:ring-[#b42318]"
                    onClick={deleteSelectedProject}
                  >
                    Delete project
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    className="h-12 rounded-[20px] border-[#e0e0e0] text-black"
                    onClick={() => setIsDeleteProjectConfirmOpen(false)}
                  >
                    Keep project
                  </Button>
                </div>
              </section>
            </div>
          ) : null}

        </main>
      )
    }

    return (
      <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
        <section className="mx-auto w-full max-w-[390px] pt-24">
          <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#ececec] bg-white/95 backdrop-blur">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between py-1">
                <button type="button" onClick={() => setIsProjectsViewOpen(false)} className="flex items-center gap-4">
                  <span className="grid size-6 place-items-center rounded">
                    <CaretLeft size={24} />
                  </span>
                  <span className="text-left">
                    <span className="typo-section-title block text-black">Projects</span>
                    <span className="typo-caption block text-[#999999]">Back to home</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateProjectOpen(true)
                    setSelectedProjectId(null)
                  }}
                  aria-label="Create project"
                  className="grid size-9 place-items-center"
                >
                  <Plus size={22} />
                </button>
              </div>
            </div>

            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
              {projectFilterChips.map((chip) => {
                const selected = projectStatusFilter === chip
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setProjectStatusFilter(chip)}
                    className={`flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-full py-2 pl-3 pr-2 ${selected ? 'bg-[#5fc18a]' : 'border border-[#d1d1d1] bg-white'}`}
                  >
                    <span className={`typo-body ${selected ? 'typo-weight-semibold text-white' : 'text-black'}`}>{chip}</span>
                    <span className="typo-badge grid size-6 place-items-center rounded-full bg-black text-white">{String(getProjectCount(chip)).padStart(2, '0')}</span>
                  </button>
                )
              })}
            </div>
          </header>

          <div className="px-4 py-6">
            {filteredProjects.length ? (
              <div className="space-y-3">
                {filteredProjects.map((project) => {
                  const { daysLeft, progress } = getDeadlineProgress(project)
                  const deadlineTone = getDeadlineTone(daysLeft)
                  const dueLabel = daysLeft === null
                    ? 'Schedule pending'
                    : daysLeft < 0
                      ? `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} overdue`
                      : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`

                  return (
                    <article
                      key={project.id}
                      className="-mx-4 cursor-pointer border-b border-[#e0e0e0] bg-white px-4 py-4 transition-colors active:bg-[#f6faf8]"
                      onClick={() => {
                        setSelectedProjectId(project.id)
                        setSelectedProjectPage('overview')
                      }}
                    >
                      <div>
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className={`size-2 shrink-0 rounded-full ${project.status === 'Active' ? 'bg-[#5fc18a]' : project.status === 'Pending' ? 'bg-[#efb24d]' : 'bg-[#6ea8ff]'}`} />
                            <p className="typo-section-title min-w-0 flex-1 truncate text-[#102418]">{project.scope}</p>
                            <span className={`typo-badge shrink-0 rounded-full px-2 py-1 ${project.status === 'Active' ? 'bg-[#eaf9f1] text-[#24754b]' : project.status === 'Pending' ? 'bg-[#fff3d9] text-[#9b6a00]' : 'bg-[#e9f2ff] text-[#2c67b4]'}`}>{project.status}</span>
                            <CaretRight size={16} className="shrink-0 text-[#6f8178]" />
                          </div>
                          <p className="typo-body mt-1 truncate text-[#607269]">{project.client} {'\u00b7'} {project.location}</p>
                          <span className={`typo-body-strong mt-3 inline-flex h-9 max-w-full items-center rounded-full px-3 ${deadlineTone.badge}`}>
                            <span className="mr-1 opacity-75">Due</span>
                            <span className="truncate">{project.dueDate}</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="flex min-h-[60dvh] flex-col items-center justify-center px-2 pb-12 pt-4 text-center">
                <img src="/empty-projects.svg" alt="" className="w-full max-w-[280px]" />
                <h2 className="typo-section-title mt-6 text-black">{projectEmptyState.title}</h2>
                <p className="typo-body mt-2 max-w-[290px] text-[#607269]">{projectEmptyState.body}</p>
                <div className="mt-6 w-full max-w-[220px]">
                  <Button
                    type="button"
                    fullWidth
                    leadingIcon={Plus}
                    className="h-12 rounded-[20px]"
                    onClick={() => {
                      setIsCreateProjectOpen(true)
                      setSelectedProjectId(null)
                    }}
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
    )
  }

  return (
    <main className="hynt-home hynt-home-shell min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <div className="hynt-home-shell__layout">
        {renderProDesktopNav()}
        <div className="hynt-home-shell__main">
      <section className="hynt-pro-home-canvas mx-auto w-full max-w-[390px] overflow-visible pb-[108px]">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <img src="/hynt-home/pro-1.png" alt="Profile" className="size-10 rounded-full border border-[#e0e0e0] object-cover" />
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Notifications" onClick={onOpenFlowSwitcher} className="relative grid size-[37px] place-items-center rounded-[10px]">
                <Bell size={20} />
                <span className="absolute right-0 top-0.5 size-2 rounded-full bg-[#26c485]" />
              </button>
              <button type="button" aria-label="Messages" className="relative grid size-[37px] place-items-center rounded-[10px]">
                <ChatsCircle size={24} />
                <span className="typo-status-mini absolute -right-px -top-[3.5px] grid size-4 place-items-center rounded-lg bg-[#26c485] text-white">3</span>
              </button>
            </div>
          </div>
        </header>

        <div className={`hynt-pro-topdock ${isProHomeDense ? 'hynt-pro-topdock--dense' : ''}`}>
        <div className={`hynt-pro-summary px-4 pb-5 pt-5 ${isProHomeDense ? 'hynt-pro-summary--dense' : ''}`}>
          <div className="hynt-pro-summary-card flex h-20 items-center justify-between rounded-2xl border border-[#d2d2d2] bg-white">
            <button type="button" onClick={() => setIsProjectsViewOpen(true)} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
              <p className="typo-title-20-strong text-black">05</p>
              <p className="typo-stat-label text-center text-[#888888]">Active projects</p>
            </button>
            <div className="h-full w-px bg-[#d2d2d2]" />
            <article className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
              <p className="typo-title-20-strong text-black">12</p>
              <p className="typo-stat-label text-center text-[#888888]">New Leads</p>
            </article>
            <div className="h-full w-px bg-[#d2d2d2]" />
            <article className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1">
              <p className="typo-title-20-strong flex items-center gap-1 text-black"><CurrencyInr size={22} weight="regular" />4.2L</p>
              <p className="typo-stat-label text-center text-[#888888]">This Month</p>
            </article>
          </div>
        </div>
        </div>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        {proHomeTab === 'protools' ? (
          <>
            <div className="h-[6px] w-full bg-[#e0e0e0]" />
            <ProToolsHome />
          </>
        ) : null}

        {proHomeTab === 'home' ? (
          <>
        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <form
            onSubmit={(event) => event.preventDefault()}
            className="h-28 overflow-hidden rounded-3xl border border-[rgba(95,193,138,0.24)] bg-black p-4"
          >
            <div className="flex h-6 items-center gap-2">
              <span className="grid size-6 place-items-center overflow-hidden">
                <img src="/hynt-home/door-and-star.svg" alt="" className="size-6" />
              </span>
              <p className="typo-body whitespace-nowrap text-white">
                Home planning with <span className="typo-weight-heavy">HYNT</span> <span className="typo-caption text-[#5fc18a]">AI</span>
              </p>
            </div>
            <div className="mt-2 flex h-12 items-center overflow-hidden rounded-2xl border border-[#5fc18a] bg-[#fbfbfb] py-[5px] pl-4 pr-1.5">
              <input
                value={proPrompt}
                onChange={(event) => setProPrompt(event.target.value)}
                placeholder="Ask anything"
                className="typo-input h-[24px] min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-[#808080]"
              />
              <button type="submit" aria-label="Send" className="grid h-9 w-6 shrink-0 place-items-center rounded-[10px] bg-[#26c485] text-black">
                <ArrowUp size={12} weight="bold" />
              </button>
            </div>
          </form>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="typo-section-title">Browse By Room</h2>
            <div className="typo-utility flex items-center gap-1">See all <ArrowRight size={16} /></div>
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto overflow-y-visible pb-1">
            {roomTags.map((tag) => (
              <div key={tag} className="typo-body flex h-10 shrink-0 items-center rounded-[20px] border border-[#9e9e9e] px-4">{tag}</div>
            ))}
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="typo-section-title">Ideas For You</h2>
            <div className="typo-utility flex items-center gap-1">Explore all <ArrowRight size={16} /></div>
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            {homepageIdeas.map((idea) => (
              <article key={idea.image} className="relative h-48 w-[175px] shrink-0 overflow-hidden rounded-2xl border border-[#e0e0e0]">
                <img src={idea.image} alt="" className="size-full object-cover" />
                {idea.badge ? <span className="typo-meta absolute right-2 top-2 rounded-lg bg-[#eee5d4] px-[11px] py-[3px] text-[#525252]">{idea.badge}</span> : null}
                <button type="button" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white"><BookmarkSimple size={16} /></button>
              </article>
            ))}
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="typo-section-title">Products</h2>
            <ArrowRight size={16} />
          </div>
          <div className="no-scrollbar mt-4 flex h-[249px] gap-3 overflow-x-auto overflow-y-hidden pb-1">
            {homepageProducts.map((product, index) => (
              <article key={`${product.title}-${index}`} className="h-[249px] w-[184px] shrink-0 rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] p-1">
                <div className="relative h-[139px] overflow-hidden rounded-[15px] border border-[#e0e0e0] bg-white">
                  <img src={product.image} alt={product.title} className="size-full object-cover" />
                  <span className="typo-meta absolute right-2 top-2 rounded-lg bg-white px-2 py-1">1/5</span>
                </div>
                <div className="px-2 pb-2 pt-3">
                  <p className="typo-body-strong truncate">{product.title}</p>
                  <p className="typo-meta mt-1 text-[#808080]">{product.category}</p>
                  <button type="button" className="typo-meta mt-2 text-[#808080] underline decoration-dotted">Get a quote</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="typo-section-title">Professionals</h2>
            <div className="typo-utility flex items-center gap-1">View all <ArrowRight size={16} /></div>
          </div>
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible pb-1">
            {homepagePros.map((pro) => (
              <article key={pro.name} className="h-[222px] w-[138px] shrink-0 rounded-2xl border border-[#e6e6e6] bg-white p-2">
                <img src={pro.image} alt={pro.name} className="h-[110px] w-[122px] rounded-xl object-cover" />
                <div className="mt-2 px-1">
                  <p className="typo-body-strong truncate text-black">{pro.name}</p>
                  <p className="typo-meta truncate text-[#5f5f5f]">{pro.role}</p>
                </div>
                <div className="typo-meta mt-2 flex h-[30px] items-center gap-2 px-0.5 text-[#808080]"><span className="flex items-center gap-1"><CheckSquareOffset size={16} />42</span><span className="h-3 w-px bg-[#d1d1d1]" /><span className="flex items-center gap-1"><IdentificationBadge size={16} />5 years</span></div>
              </article>
            ))}
          </div>
        </section>

        <div className="h-[6px] w-full bg-[#e0e0e0]" />

        <section className="px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="typo-section-title">Upcoming Events</h2>
            <div className="typo-utility flex items-center gap-1">View all <ArrowRight size={16} /></div>
          </div>
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto overflow-y-visible pb-1">
            {homepageEvents.map((event) => (
              <article key={event.title} className="h-[252px] w-[175px] shrink-0 rounded-3xl border border-[#e0e0e0] bg-[#fbfbfb] p-2">
                <div className="relative h-36 overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white">
                  <img src={event.image} alt={event.title} className="size-full object-cover" />
                  <span className="typo-meta absolute right-2 top-2 rounded-lg border border-[#333] bg-black/70 px-2 py-1 text-white backdrop-blur">{event.interested}</span>
                </div>
                <div className="px-1 pt-3">
                  <p className="typo-section-title truncate">{event.title}</p>
                  <p className="typo-meta mt-1 flex items-center gap-1 text-[#808080]"><CalendarDots size={16} />{event.date}</p>
                  <p className="typo-meta mt-1 flex items-center gap-1 text-[#808080]"><MapPinSimpleArea size={16} />{event.city}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="flex h-24 items-center justify-center py-5 opacity-30">
          <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-[58px] w-24 object-contain grayscale" />
        </div>
          </>
        ) : null}

        {proHomeTab === 'ai' ? (
          <>
            <div className="h-[6px] w-full bg-[#e0e0e0]" />
            <section className="px-4 py-5">
              <div className="rounded-2xl border border-[#e1e1e1] bg-white p-4">
                <p className="typo-title-16-strong text-black">HYNT AI</p>
                <p className="typo-meta mt-1 text-[#6f6f6f]">Professional assistant</p>
                <div className="mt-4 space-y-3">
                  {proAiMessages.map((message) => (
                    <div key={message.id} className={message.role === 'ai' ? '' : 'flex justify-end'}>
                      <div className={`typo-body max-w-[88%] rounded-2xl px-3 py-2 ${message.role === 'ai' ? 'bg-[#f4f4f4] text-black' : 'bg-[#e8f7ef] text-[#175c3e]'}`}>
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="h-[6px] w-full bg-[#e0e0e0]" />

            <section className="px-4 py-5">
              <p className="typo-body-strong mb-3">Quick options</p>
              <div className="grid gap-2">
                {proAiOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setProAiMessages((prev) => [
                        ...prev,
                        { id: `pro-ai-user-${Date.now()}-${option}`, role: 'user', text: option },
                        { id: `pro-ai-bot-${Date.now()}-${option}`, role: 'ai', text: `Sure. I'll help you with: ${option}.` },
                      ])
                    }}
                    className="typo-body-strong rounded-xl border border-[#d7d7d7] bg-white px-3 py-2 text-left"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </section>

      <nav className="hynt-home-shell__nav fixed bottom-0 left-1/2 z-30 flex h-[92px] w-full max-w-[390px] -translate-x-1/2 items-start justify-between border-t border-[#e6e6e6] bg-white/95 px-3 pb-5 pt-3 backdrop-blur">
        {proSidebarItems.map(([key, label, Icon, kind]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleProNavSelect(key)}
            className="typo-utility flex w-[70px] flex-col items-center justify-center gap-1.5 rounded-[20px] px-2 py-2 text-center text-black"
          >
            {kind === 'hynt-ai' ? (
              <img src="/hynt-home/door-and-star.svg" alt="" className="size-5 saturate-0 brightness-0" />
            ) : (
              <Icon size={20} weight={isProNavSelected(key) ? 'fill' : 'regular'} />
            )}
            {label === 'HYNT AI' ? (
              <span className={proHomeTab === 'ai' ? 'typo-nav-active hynt-nav-home' : 'typo-nav-idle hynt-nav-item'}>HYNT AI</span>
            ) : (
              <span className={isProNavSelected(key) ? 'typo-nav-active hynt-nav-home' : 'typo-nav-idle hynt-nav-item'}>{label}</span>
            )}
          </button>
        ))}
      </nav>
        </div>
      </div>
    </main>
  )
}

function HomeownerFlow({ activeFlow, onSelectFlow }) {
  const [prompt, setPrompt] = useState('')
  const [homeTab, setHomeTab] = useState('home')
  const [exploreTab, setExploreTab] = useState('Ideas')
  const [exploreFilter, setExploreFilter] = useState('Show all')
  const [exploreIdeaFeed, setExploreIdeaFeed] = useState(fallbackDesktopExploreIdeaCards)
  const [isExploreSearchOpen, setIsExploreSearchOpen] = useState(false)
  const [isHomeDockDense, setIsHomeDockDense] = useState(false)
  const [chatDraft, setChatDraft] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isBriefCollapsed, setIsBriefCollapsed] = useState(false)
  const [isFlowSwitcherOpen, setIsFlowSwitcherOpen] = useState(false)
  const [isHomeownerSowOpen, setIsHomeownerSowOpen] = useState(false)
  const [isHomeownerTasksOpen, setIsHomeownerTasksOpen] = useState(false)
  const [isHomeownerArchiveOpen, setIsHomeownerArchiveOpen] = useState(false)
  const [isHomeownerFinanceOpen, setIsHomeownerFinanceOpen] = useState(false)
  const [isHomeownerBoqOpen, setIsHomeownerBoqOpen] = useState(false)
  const [isHomeownerTimelineOpen, setIsHomeownerTimelineOpen] = useState(false)
  const [isHomeownerSiteDiaryOpen, setIsHomeownerSiteDiaryOpen] = useState(false)
  const [selectedHomeownerTaskId, setSelectedHomeownerTaskId] = useState(null)
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
  const {
    projectTasks: sharedProjectTasks,
    taskApprovals: sharedTaskApprovals,
    taskStepCompletion: sharedTaskStepCompletion,
    actions: sharedProjectActions,
  } = useSharedProject('p-1')

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
    const updateDenseState = () => {
      if (typeof window === 'undefined') return
      const isDesktop = window.innerWidth >= 1024
      setIsHomeDockDense(isDesktop && homeTab === 'home' && window.scrollY > 220)
    }

    updateDenseState()
    window.addEventListener('scroll', updateDenseState, { passive: true })
    window.addEventListener('resize', updateDenseState)

    return () => {
      window.removeEventListener('scroll', updateDenseState)
      window.removeEventListener('resize', updateDenseState)
    }
  }, [homeTab])

  useEffect(() => {
    if (!UNSPLASH_ACCESS_KEY) {
      return
    }

    const controller = new AbortController()
    const roomQuery = exploreFilter === 'Show all' ? 'interior design architecture home decor' : `${exploreFilter} interior design architecture home decor`

    const loadExploreImages = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(roomQuery)}&per_page=18&content_filter=high`,
          {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
              'Accept-Version': 'v1',
            },
            signal: controller.signal,
          },
        )

        if (!response.ok) {
          throw new Error(`Unsplash request failed: ${response.status}`)
        }

        const payload = await response.json()
        const cards = (payload.results ?? [])
          .filter((photo) => photo?.urls?.regular || photo?.urls?.small || photo?.urls?.thumb)
          .map(mapUnsplashPhotoToIdeaCard)

        if (cards.length > 0) {
          setExploreIdeaFeed(cards)
        } else {
          setExploreIdeaFeed(fallbackDesktopExploreIdeaCards)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setExploreIdeaFeed(fallbackDesktopExploreIdeaCards)
        }
      }
    }

    loadExploreImages()

    return () => {
      controller.abort()
    }
  }, [exploreFilter])

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
              <p className="typo-body text-slate-700">Pick images you naturally like. We will infer style tags from your choices.</p>
              <button type="button" onClick={() => setIsStyleAssistOpen(false)} className="typo-utility typo-weight-bold shrink-0 text-slate-700 underline">Back</button>
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
                  <span className="typo-body-12 mt-2 block px-1 pb-1 text-slate-900">{option.label}</span>
                  {selected ? <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-[#5FC18A] text-white"><Check size={14} weight="bold" /></span> : null}
                </button>
              )
            })}
          </div>
          <button type="button" onClick={() => setIsStyleAssistOpen(true)} className="w-full rounded-2xl border border-[#c8d9cf] bg-white px-4 py-3 text-left">
            <p className="typo-body-strong text-slate-900">I&apos;m not sure</p>
            <p className="typo-utility mt-1 text-slate-500">Show me references and infer styles for me.</p>
          </button>
        </div>
      )
    }

    if (activeModal.type === 'budget') {
      return (
        <div className="rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#f7fff9] to-white p-5 shadow-inner">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="typo-overline uppercase text-[#3c9d68]">Selected range</p>
              <p className="typo-title-20-strong mt-2 text-slate-950">{renderBudgetRangeWithIcon(draft)}</p>
            </div>
          </div>
          <div className="mb-5">
            <p className="typo-label mb-2 uppercase text-slate-500">Budget type</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setBudgetModeDraft('fixed')} className={`typo-body rounded-full border px-4 py-2 transition ${budgetModeDraft === 'fixed' ? 'border-[#2188ff] bg-[#d8eaff] text-[#244468]' : 'border-slate-200 bg-white text-slate-600'}`}>
                <span className="inline-flex items-center gap-1"><SlidersHorizontal size={14} />Fixed</span>
              </button>
              <button type="button" onClick={() => setBudgetModeDraft('flexible')} className={`typo-body rounded-full border px-4 py-2 transition ${budgetModeDraft === 'flexible' ? 'border-[#2188ff] bg-[#d8eaff] text-[#244468]' : 'border-slate-200 bg-white text-slate-600'}`}>
                <span className="inline-flex items-center gap-1"><SlidersHorizontal size={14} />Flexible</span>
              </button>
            </div>
          </div>
          <p className="typo-utility mb-4 flex items-center gap-1 text-slate-500">
            <CurrencyInr size={12} weight="bold" />{budgetModeDraft === 'fixed' ? 'Fixed means hard cap for spend.' : 'Flexible means you can stretch if value is clear.'}
          </p>
          <label className="typo-body-strong block text-slate-800" htmlFor="budget-min">Minimum budget</label>
          <input id="budget-min" type="range" min="1" max="20" value={draft[0]} onChange={(event) => updateBudgetDraft(0, event.target.value)} className="hynt-range mt-3 w-full" />
          <label className="typo-body-strong mt-7 block text-slate-800" htmlFor="budget-max">Maximum budget</label>
          <input id="budget-max" type="range" min="2" max="25" value={draft[1]} onChange={(event) => updateBudgetDraft(1, event.target.value)} className="hynt-range mt-3 w-full" />
          <div className="typo-label mt-5 flex justify-between text-slate-400"><span className="flex items-center gap-0.5"><CurrencyInr size={11} weight="bold" />1L</span><span className="flex items-center gap-0.5"><CurrencyInr size={11} weight="bold" />25L</span></div>
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
                className={`typo-body rounded-full border px-5 py-2.5 transition ${selected ? 'border-[#2188ff] bg-[#c8def9] text-[#244468]' : 'border-[#d0d8e0] bg-white text-[#384b63]'}`}
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
                  <span className="typo-body-strong block text-slate-950">{pro.name}</span>
                  <span className="typo-body mt-0.5 block text-slate-500">{pro.role}</span>
                  <span className="typo-meta mt-2 block text-slate-400">{pro.meta}</span>
                  <span className="typo-label mt-2 block text-[#267449]">{pro.tone}</span>
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
      className="typo-utility typo-weight-bold inline-flex items-center gap-1 text-slate-700 underline decoration-[#5FC18A] underline-offset-4"
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
          className="typo-body-strong mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5"
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
            <p className="typo-label uppercase text-[#267449]">Selected style direction</p>
            {renderInlineAction(message)}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {selectedStyles.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-[#cde8d8] bg-white shadow-sm">
                <img src={item.image} alt={item.label} className="h-[82px] w-full object-cover" />
                <p className="typo-label px-2 py-1.5 text-[#267449]">{item.label}</p>
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
            <p className="typo-label uppercase text-[#267449]">Selected professionals</p>
            {renderInlineAction(message)}
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {selectedPros.map((pro) => (
              <article key={pro.id} className="h-[222px] w-[138px] shrink-0 rounded-2xl border border-[#e6e6e6] bg-white p-2">
                <img src={pro.image} alt={pro.name} className="h-[110px] w-[122px] rounded-xl object-cover" />
                <div className="mt-2 px-1">
                  <p className="typo-body-strong truncate text-black">{pro.name}</p>
                  <p className="typo-meta truncate text-[#5f5f5f]">{pro.role}</p>
                </div>
                <div className="typo-meta mt-2 flex h-[30px] items-center gap-2 px-0.5 text-[#808080]">
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
      const budgetMatch = value.match(/ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹(\d+)L\s+ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“\s+ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹(\d+)L/)
      const min = budgetMatch?.[1] || '2'
      const max = budgetMatch?.[2] || '5'
      return (
        <div className="mt-4 rounded-2xl border border-[#5FC18A]/30 bg-[#f0fff6] p-3">
          <div className="mb-2 flex items-start justify-between gap-3">
            <p className="typo-label uppercase text-[#267449]">Budget preference</p>
            {renderInlineAction(message)}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#cde8d8] bg-white px-3 py-2">
            <p className="typo-title-16-strong inline-flex items-center gap-2 text-[#267449]">
              <span className="inline-flex items-center gap-0.5"><CurrencyInr size={16} weight="bold" />{min}L</span>
              <span>{RANGE_DASH}</span>
              <span className="inline-flex items-center gap-0.5"><CurrencyInr size={16} weight="bold" />{max}L</span>
            </p>
            <span className="typo-label rounded-full bg-[#e8f6ee] px-2.5 py-1 text-[#267449]">{message.value.mode === 'fixed' ? 'Fixed' : 'Flexible'}</span>
          </div>
        </div>
      )
    }

    return (
      <div className="mt-4 rounded-2xl border border-[#5FC18A]/30 bg-[#f0fff6] p-3">
        <div className="flex items-start justify-between gap-3">
          <p className="typo-body-strong text-[#267449]">{asSummary(message.value)}</p>
          {renderInlineAction(message)}
        </div>
      </div>
    )
  }

  const homeownerNavItems = [
    ['home', 'Home', House],
    ['project', 'Project', NotePencil],
    ['explore', 'Explore', Kanban],
    ['post', 'Post', Plus],
    ['profile', 'Profile', User],
  ]

  const desktopSidebarItems = [
    ['home', 'Home', House],
    ['project', 'Project', NotePencil],
    ['explore', 'Explore', Kanban],
    ['post', 'Post', Plus],
  ]

  const renderHomeNav = () => (
    <>
      <aside className="hynt-home-shell__sidebar">
        <div className="hynt-home-shell__sidebar-rail">
          <div className="flex flex-col items-center gap-4">
            <button type="button" aria-label="Open profile switcher" onClick={() => setIsFlowSwitcherOpen(true)} className="hynt-home-shell__utility-button">
              <img src="/hynt-home/pro-1.png" alt="" className="size-7 rounded-full object-cover" />
            </button>
            <button type="button" aria-label="Notifications" className="hynt-home-shell__utility-button relative">
              <Bell size={20} />
              <span className="absolute right-[7px] top-[7px] size-2 rounded-full bg-[#26c485]" />
            </button>
            <button type="button" aria-label="Messages" className="hynt-home-shell__utility-button relative">
              <ChatsCircle size={20} />
              <span className="typo-status-mini absolute right-[5px] top-[4px] grid min-h-4 min-w-4 place-items-center rounded-full bg-[#26c485] px-1 text-white">3</span>
            </button>
          </div>

          <div className="hynt-home-shell__sidebar-stack">
            {desktopSidebarItems.map(([key, label, Icon]) => {
              const selected = homeTab === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setHomeTab(key)}
                  aria-label={label}
                  className={`hynt-home-shell__sidebar-button ${selected ? 'hynt-home-shell__sidebar-button--active' : ''}`}
                >
                  <Icon size={22} weight={selected ? 'fill' : 'regular'} />
                </button>
              )
            })}
          </div>

          <div className="flex flex-col items-center gap-4">
            <button type="button" aria-label="More" className="hynt-home-shell__utility-button">
              <DotsThreeVertical size={22} weight="bold" />
            </button>
          </div>
        </div>
      </aside>

      <nav className="hynt-home-shell__nav fixed bottom-0 left-1/2 z-30 flex h-[92px] w-full max-w-[390px] -translate-x-1/2 items-start justify-between border-t border-[#e6e6e6] bg-white/95 px-3 pb-5 pt-3 backdrop-blur">
        {homeownerNavItems.map(([key, label, Icon]) => {
          const selected = homeTab === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setHomeTab(key)}
              className="typo-utility flex w-16 flex-col items-center justify-center gap-1.5 rounded-[20px] px-2.5 py-2 text-center text-black"
            >
              <Icon size={20} weight={selected ? 'fill' : 'regular'} />
              <span className={selected ? 'typo-nav-active hynt-nav-home' : 'typo-nav-idle hynt-nav-item'}>{label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )

  const renderExplorePage = () => (
    <section className="hynt-explore-canvas mx-auto w-full max-w-[1240px] overflow-visible bg-white">
      <div className="hynt-explore-sticky">
        <div className="mx-auto w-full px-4 pb-4 pt-4 md:px-6 lg:px-8 lg:pb-6 lg:pt-6">
          <div className="mx-auto w-full max-w-[760px]">
            <div className="flex items-center justify-between gap-4">
              <h1 className="typo-page-title text-black">Explore</h1>
              <button
                type="button"
                aria-label={isExploreSearchOpen ? 'Close search' : 'Open search'}
                onClick={() => setIsExploreSearchOpen((current) => !current)}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-[#d8d8d8] bg-white text-black transition hover:bg-[#f7f7f7]"
              >
                <MagnifyingGlass size={18} weight="bold" />
              </button>
            </div>
            <div className={`overflow-hidden transition-[max-height,opacity,margin] duration-200 ${isExploreSearchOpen ? 'mt-4 max-h-20 opacity-100' : 'mt-0 max-h-0 opacity-0'}`}>
              <div className="overflow-hidden rounded-2xl border border-[#9e9e9e] bg-[#fbfbfb] px-4 py-[14.5px]">
                <p className="typo-body text-[#808080]">Search inspiration, professionals and products</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-[rgba(0,0,0,0.08)]">
          <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-3 border-b border-[rgba(0,0,0,0.08)] lg:mx-auto lg:max-w-[760px]">
              {exploreTabs.map((tab) => {
                const selected = exploreTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setExploreTab(tab)}
                    className={`typo-body px-2 pb-[10px] pt-2 text-center capitalize ${selected ? 'border-b-2 border-[#26c485] typo-weight-bold text-[#26c485]' : 'text-black'}`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto py-2 lg:justify-center">
              {exploreFilters.map((filter) => {
                const selected = exploreFilter === filter
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setExploreFilter(filter)}
                    className={`typo-body shrink-0 rounded-[20px] px-4 py-2 ${selected ? 'bg-[#26c485] typo-weight-semibold text-white' : 'border border-[#ececec] bg-white text-black'}`}
                  >
                    {filter}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {exploreTab === 'Ideas' ? (
        <div className="hynt-explore-masonry px-2 pb-8 pt-4 md:px-6 lg:px-8">
          {exploreIdeaFeed.map((card, index) => (
            card.id === 'idea-g' || card.id === 'idea-h' ? (
              <article key={`${card.id}-${index}`} className="hynt-explore-masonry-item overflow-hidden rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb]">
                <div className={`relative overflow-hidden ${card.id === 'idea-g' ? 'h-[222px]' : 'h-[127px]'}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,#7738ff_0_13%,transparent_34%),radial-gradient(circle_at_25%_75%,#006dff_0_18%,transparent_44%),linear-gradient(135deg,#06091d_0%,#111b70_45%,#7a26ff_100%)]" />
                  <p className="typo-body absolute left-4 top-4 w-[110px] uppercase text-white">Showcase your brand here</p>
                </div>
                <div className="flex items-center justify-between px-3 pb-2 pt-1">
                  <p className="typo-utility text-black">Visit</p>
                  <ArrowRight size={14} className="rotate-[-45deg]" />
                </div>
              </article>
            ) : (
              <article key={`${card.id}-${index}`} className={`hynt-explore-masonry-item relative overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white ${card.height}`}>
                <img src={card.image} alt={card.photographer ? `Explore idea by ${card.photographer}` : `Explore idea ${index + 1}`} className="size-full object-cover" />
                {card.badge ? <span className="typo-label absolute right-2 top-2 rounded-lg bg-black/25 px-[10px] py-1 text-white backdrop-blur-[8px]">{card.badge}</span> : null}
                {card.type === 'video' ? (
                  <span className="absolute right-2 top-2 grid size-[28px] place-items-center rounded-full bg-black/25 text-white backdrop-blur-[8px]">
                    <CaretRight size={16} weight="fill" />
                  </span>
                ) : null}
                {card.sourceLabel === 'Unsplash' ? (
                  <a
                    href={card.photographerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="typo-status-mini absolute bottom-2 left-2 rounded-full bg-black/45 px-2.5 py-1 text-white backdrop-blur-[8px]"
                  >
                    {card.photographer}
                  </a>
                ) : null}
                <button type="button" aria-label="Save idea" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white">
                  <BookmarkSimple size={16} />
                </button>
              </article>
            )
          ))}
        </div>
      ) : null}

      {exploreTab === 'Professionals' ? (
        <div className="grid gap-3 px-4 pb-8 pt-4 md:grid-cols-2 md:px-6 lg:grid-cols-3 lg:px-8">
          {professionalOptions.map((pro) => (
            <article key={pro.id} className="flex items-start gap-4 rounded-3xl border border-[#d8e0ea] bg-white p-4 shadow-sm">
              <img src={pro.image} alt={pro.name} className="size-16 shrink-0 rounded-2xl object-cover" />
              <span className="min-w-0 flex-1">
                <span className="typo-body-strong block text-slate-950">{pro.name}</span>
                <span className="typo-body mt-0.5 block text-slate-500">{pro.role}</span>
                <span className="typo-meta mt-2 block text-slate-400">{pro.meta}</span>
                <span className="typo-label mt-2 block text-[#267449]">{pro.tone}</span>
              </span>
            </article>
          ))}
        </div>
      ) : null}

      {exploreTab === 'Products' ? (
        <div className="grid grid-cols-2 gap-3 px-4 pb-8 pt-4 md:grid-cols-3 md:px-6 lg:grid-cols-4 lg:px-8">
          {homepageProducts.concat(homepageProducts).map((product, index) => (
            <article key={`${product.title}-${index}`} className="rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] p-1">
              <div className="relative h-[139px] overflow-hidden rounded-[15px] border border-[#e0e0e0] bg-white">
                <img src={product.image} alt={product.title} className="size-full object-cover" />
                <span className="typo-meta absolute right-2 top-2 rounded-lg bg-white px-2 py-1">1/5</span>
                <button type="button" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white"><BookmarkSimple size={16} /></button>
              </div>
              <div className="px-2 pb-2 pt-3">
                <p className="typo-body-strong line-clamp-2">{product.title}</p>
                <p className="typo-meta mt-1 text-[#808080]">{product.category}</p>
                <button type="button" className="typo-meta mt-2 text-[#808080] underline decoration-dotted">Get a quote</button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )

  const renderPostPage = () => (
    <section className="hynt-desktop-page mx-auto w-full max-w-[1120px] px-4 pb-12 pt-6">
      <header className="mb-6">
        <p className="typo-label uppercase text-[#267449]">Post</p>
        <h1 className="typo-page-title mt-2 text-[#102418]">Draft a requirement in one place.</h1>
        <p className="typo-title-16 mt-2 max-w-[640px] text-[#5f6a63]">This desktop page keeps the same language as mobile, but spreads the form and selections into a more readable planning workspace.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-[#dce8e1] bg-white p-6 shadow-[0_20px_40px_rgba(18,24,21,0.06)]">
          <h2 className="typo-title-20-strong text-[#102418]">Project brief</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ['Style direction', 'Warm tones, Japandi, Modern Indian'],
              ['Budget range', `${INR}8L ${RANGE_DASH} ${INR}15L`],
              ['Rooms', 'Living room, Bedroom, Kitchen'],
              ['Timeline', 'Looking to start this month'],
            ].map(([label, value]) => (
              <article key={label} className="rounded-[22px] border border-[#d9e3dd] bg-[#f7faf8] p-4">
                <p className="typo-label uppercase text-[#7a8b83]">{label}</p>
                <p className="typo-title-16-strong mt-2 text-[#102418]">{value}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-[22px] border border-[#d9e3dd] bg-[#102418] p-5 text-white">
            <p className="typo-body-strong uppercase text-[#8fd5ae]">Your note</p>
            <p className="typo-title-16 mt-3 text-white/84">Looking for a clean, family-friendly renovation with better storage and warmer materials. Open to turnkey professionals and curated vendors.</p>
          </div>
        </section>

        <section className="space-y-6">
          <article className="rounded-[28px] border border-[#dce8e1] bg-white p-6 shadow-[0_20px_40px_rgba(18,24,21,0.06)]">
            <h2 className="typo-title-20-strong text-[#102418]">Suggested scope</h2>
            <div className="hynt-desktop-chip-wrap mt-4">
              {scopeOptions.map((option) => (
                <span key={option} className="typo-body rounded-full border border-[#cbd5cf] bg-[#f7faf8] px-4 py-2 text-[#173324]">{option}</span>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#dce8e1] bg-white p-6 shadow-[0_20px_40px_rgba(18,24,21,0.06)]">
            <h2 className="typo-title-20-strong text-[#102418]">Best-fit professionals</h2>
            <div className="mt-4 space-y-3">
              {professionalOptions.slice(0, 3).map((pro) => (
                <div key={pro.id} className="flex items-start gap-3 rounded-[22px] border border-[#e3e8e4] bg-[#fbfbfb] p-3">
                  <img src={pro.image} alt={pro.name} className="size-14 rounded-[18px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="typo-title-16-strong text-[#102418]">{pro.name}</p>
                    <p className="typo-body mt-1 text-[#647169]">{pro.role}</p>
                    <p className="typo-meta mt-2 text-[#267449]">{pro.tone}</p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="typo-title-16-strong mt-5 w-full rounded-[20px] bg-[#26c485] px-5 py-4 text-[#07140e]">Send requirement</button>
          </article>
        </section>
      </div>
    </section>
  )

  const renderEventsPage = () => (
    <section className="hynt-desktop-page mx-auto w-full max-w-[1120px] px-4 pb-12 pt-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="typo-label uppercase text-[#267449]">Events</p>
          <h1 className="typo-page-title mt-2 text-[#102418]">WhatÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢s coming up near you.</h1>
        </div>
        <button type="button" className="typo-body-strong rounded-full border border-[#cfe0d7] bg-white px-5 py-3 text-[#173324] shadow-sm">Filter by city</button>
      </header>
      <div className="hynt-desktop-card-grid hynt-desktop-card-grid--events">
        {homepageEvents.concat(homepageEvents).map((event, index) => (
          <article key={`${event.title}-${index}`} className="rounded-[28px] border border-[#e0e0e0] bg-white p-3 shadow-[0_20px_40px_rgba(18,24,21,0.06)]">
            <div className="relative overflow-hidden rounded-[22px] border border-[#e0e0e0] bg-[#f7faf8]">
              <img src={event.image} alt={event.title} className="h-[220px] w-full object-cover" />
              <span className="typo-meta absolute right-3 top-3 rounded-lg border border-[#333] bg-black/70 px-3 py-1 text-white backdrop-blur">{event.interested}</span>
            </div>
            <div className="px-1 pb-1 pt-4">
              <p className="typo-title-20 text-[#102418]">{event.title}</p>
              <p className="typo-body mt-2 flex items-center gap-2 text-[#808080]"><CalendarDots size={16} />{event.date}</p>
              <p className="typo-body mt-1 flex items-center gap-2 text-[#808080]"><MapPinSimpleArea size={16} />{event.city}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )

  const renderProfilePage = () => (
    <section className="hynt-desktop-page mx-auto w-full max-w-[1120px] px-4 pb-12 pt-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src="/hynt-home/pro-1.png" alt="Profile" className="size-20 rounded-[28px] object-cover" />
          <div>
            <p className="typo-label uppercase text-[#267449]">Profile</p>
            <h1 className="typo-page-title mt-2 text-[#102418]">AaravÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢s workspace</h1>
            <p className="typo-title-16 mt-2 text-[#5f6a63]">Saved ideas, preferences, and live requirement shortcuts.</p>
          </div>
        </div>
        <button type="button" className="typo-body-strong rounded-full border border-[#cfe0d7] bg-white px-5 py-3 text-[#173324] shadow-sm">Edit profile</button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[28px] border border-[#dce8e1] bg-white p-6 shadow-[0_20px_40px_rgba(18,24,21,0.06)]">
          <h2 className="typo-title-20-strong text-[#102418]">Saved shortcuts</h2>
          <div className="mt-5 grid gap-3">
            {quickActions.map(({ label, icon: Icon }, index) => (
              <article key={label} className="flex items-center gap-3 rounded-[22px] border border-[#e3e8e4] bg-[#fbfbfb] p-3">
                <span className={`grid size-12 place-items-center rounded-[18px] ${index === 0 ? 'bg-white' : 'bg-[#e8f7ef] text-[#26c485]'}`}>
                  {index === 0 ? <img src="/hynt-home/brand.png" alt="" className="size-full rounded-[18px] object-cover" /> : <Icon size={18} weight="fill" />}
                </span>
                <span className="typo-body-strong text-[#102418]">{label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#dce8e1] bg-white p-6 shadow-[0_20px_40px_rgba(18,24,21,0.06)]">
          <h2 className="typo-title-20-strong text-[#102418]">Saved inspirations</h2>
          <div className="hynt-desktop-card-grid hynt-desktop-card-grid--ideas mt-5">
            {homepageIdeas.concat(homepageIdeas).map((idea, index) => (
              <article key={`${idea.image}-${index}`} className="overflow-hidden rounded-[24px] border border-[#e0e0e0] bg-white">
                <img src={idea.image} alt={`Saved idea ${index + 1}`} className="h-[220px] w-full object-cover" />
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#dce8e1] bg-white p-6 shadow-[0_20px_40px_rgba(18,24,21,0.06)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="typo-label uppercase text-[#267449]">Project portal</p>
              <h2 className="typo-page-title mt-2 text-[#102418]">Live project workspace</h2>
              <p className="typo-body mt-2 max-w-[560px] text-[#627268]">Review active decisions, progress, payments, documents, and shared archive items in one homeowner-facing place.</p>
            </div>
            <button type="button" onClick={() => setHomeTab('project')} className="typo-body-strong shrink-0 rounded-full bg-[#173324] px-5 py-3 text-white shadow-sm">
              Open project
            </button>
          </div>
        </section>
      </div>
    </section>
  )

  const renderHome = () => {
    if (isHomeownerSowOpen) return <HomeownerSowReview onBack={() => setIsHomeownerSowOpen(false)} />
    if (isHomeownerFinanceOpen) return <HomeownerFinanceWorkspace onBack={() => setIsHomeownerFinanceOpen(false)} />
    if (isHomeownerTasksOpen) {
      return (
        <ProjectTasksWorkspace
          mode="homeowner"
          onBack={() => setIsHomeownerTasksOpen(false)}
          selectedProject={{ id: 'p-1', scope: '3BHK Full Renovation' }}
          tasks={sharedProjectTasks}
          setTasks={sharedProjectActions.setProjectTasks}
          approvals={sharedTaskApprovals}
          setApprovals={sharedProjectActions.setProjectTaskApprovals}
          selectedTaskId={selectedHomeownerTaskId}
          setSelectedTaskId={setSelectedHomeownerTaskId}
          taskStepCompletion={sharedTaskStepCompletion}
          setTaskStepCompletion={sharedProjectActions.setProjectTaskStepCompletion}
          homeownerClientName="Priya Sharma"
          homeownerProjectName="Sharma 3BHK"
          homeownerDesignerName="Riya Desai"
        />
      )
    }
    if (isHomeownerArchiveOpen) return <HomeownerArchiveWorkspace onBack={() => setIsHomeownerArchiveOpen(false)} />
    if (isHomeownerBoqOpen) return <HomeownerBoqWorkspace onBack={() => setIsHomeownerBoqOpen(false)} />
    if (isHomeownerTimelineOpen) return <HomeownerTimelineWorkspace onBack={() => setIsHomeownerTimelineOpen(false)} />
    if (isHomeownerSiteDiaryOpen) return <HomeownerSiteDiaryWorkspace onBack={() => setIsHomeownerSiteDiaryOpen(false)} />

    return (
    <main className="hynt-home hynt-home-shell min-h-dvh w-full bg-[#eef3f0] pb-[92px] font-['Urbanist'] text-black">
      <div className="hynt-home-shell__layout">
        {renderHomeNav()}
        <div className="hynt-home-shell__main">
          {homeTab === 'home' ? (
            <section className="hynt-home-mobile-canvas relative mx-auto w-full max-w-[390px] overflow-visible bg-white">
        <div className={`hynt-home-topdock ${isHomeDockDense ? 'hynt-home-topdock--dense' : ''}`}>
        <header className="h-[57px] overflow-hidden bg-gradient-to-b from-white to-white/0 backdrop-blur-[12px]">
          <div className="flex h-[57px] items-center justify-between pl-6 pr-4">
              <button type="button" className="typo-body-strong flex w-[119px] items-center text-[#26c485]">
              <span>Mumbai</span>
              <CaretDown className="ml-1" size={12} weight="bold" />
            </button>
            <img src="/hynt-home/logo-green.png" alt="HYNT" className="h-8 w-[53.152px] opacity-0" />
            <div className="flex items-center gap-1 lg:hidden">
              <button type="button" aria-label="Search" className="grid size-[37px] place-items-center rounded-[10px] opacity-0"><MagnifyingGlass size={20} /></button>
              <button type="button" aria-label="Notifications" onClick={() => setIsFlowSwitcherOpen(true)} className="relative grid size-[37px] place-items-center rounded-[10px]"><Bell size={24} /><span className="absolute right-0 top-0.5 size-2 rounded-full bg-[#26c485]" /></button>
              <button type="button" aria-label="Messages" className="relative grid size-[37px] place-items-center rounded-[10px]"><ChatsCircle size={24} /><span className="typo-status-mini absolute -right-px -top-[3.5px] grid size-4 place-items-center rounded-lg bg-[#26c485] text-center text-white">3</span></button>
            </div>
          </div>
        </header>

        <div className="bg-white pt-2">
          <section className={`hynt-home-quick-actions flex items-start justify-between px-4 ${isHomeDockDense ? 'hynt-home-quick-actions--dense' : ''}`}>
            {quickActions.map(({ label, icon: Icon }, index) => (
              <button key={label} type="button" className="hynt-home-quick-action-item flex w-[68px] shrink-0 flex-col items-center gap-3 overflow-hidden text-center">
                <span className={`hynt-home-quick-action-icon grid size-14 place-items-center overflow-hidden rounded-[28px] ${index === 0 ? 'border-[0.438px] border-[#e0e0e0] bg-[#fbfbfb]' : 'border-[0.875px] border-[#a3a3a3] bg-white text-[#26c485]'}`}>
                  {index === 0 ? <img src="/hynt-home/brand.png" alt="" className="size-full rounded-[28px] object-cover" /> : <Icon size={21} weight="fill" />}
                </span>
                <span className="typo-label hynt-home-quick-action-label w-[68px] whitespace-normal text-center text-black">{label}</span>
              </button>
            ))}
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />
        </div>
        </div>

        <div>
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
                <p className="typo-body whitespace-nowrap text-white">Home planning with <span className="typo-weight-heavy">HYNT</span> <span className="typo-caption text-[#5fc18a]">AI</span></p>
              </div>
              <div className="mt-2 flex h-12 items-center overflow-hidden rounded-2xl border border-[#5fc18a] bg-[#fbfbfb] py-[5px] pl-4 pr-1.5">
                <input
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Ask anything"
                  className="typo-input h-[24px] min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-[#808080] hynt-ai-input"
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
              <h2 className="typo-section-title capitalize">browse by room</h2>
              <button type="button" className="typo-utility flex h-5 items-center gap-1">See all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-10 gap-2 overflow-x-auto">
              {roomTags.map((tag) => (
                <button key={tag} type="button" className="typo-body h-10 shrink-0 overflow-hidden rounded-[20px] border border-[#9e9e9e] bg-white px-5 text-black hynt-room-chip">{tag}</button>
              ))}
            </div>
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-64 py-2">
            <div className="flex h-6 items-center justify-between px-4">
              <h2 className="typo-section-title capitalize">Ideas for you</h2>
              <button type="button" className="typo-utility flex h-5 items-center gap-1 hynt-section-link">Explore all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-[200px] gap-2 overflow-x-auto px-4 py-1">
              {homepageIdeas.map((idea, index) => (
                <article key={idea.image} className="relative h-48 w-[175px] shrink-0 overflow-hidden rounded-2xl border-[1.043px] border-[#e0e0e0] bg-white">
                  <img src={idea.image} alt={`Idea ${index + 1}`} className="size-full rounded-[10px] object-cover" />
                  {idea.badge ? <span className="typo-meta absolute right-2 top-2 rounded-lg bg-[#eee5d4] px-[11px] py-[3px] text-[#525252]">{idea.badge}</span> : null}
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
                <p className="typo-title-16-strong absolute left-4 top-4 w-[155px] uppercase text-white">Showcase your brand here</p>
                <button type="button" className="typo-meta absolute bottom-3 right-3 rounded-lg bg-black px-4 py-2 text-white">Learn more</button>
              </article>
            ))}
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-[286px] py-2">
            <div className="flex h-6 items-center justify-between px-4">
              <h2 className="typo-section-title">Professionals for you</h2>
              <button type="button" className="typo-utility flex h-5 items-center gap-1">View all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-[230px] gap-3 overflow-x-auto px-4 py-1">
              {homepagePros.map((pro) => (
                <article key={pro.name} className="h-[222px] w-[138px] shrink-0 rounded-2xl border border-[#e6e6e6] bg-white p-2">
                  <img src={pro.image} alt={pro.name} className="h-[110px] w-[122px] rounded-xl object-cover" />
                  <div className="mt-2 px-1">
                    <p className="typo-body-strong truncate text-black">{pro.name}</p>
                    <p className="typo-meta truncate text-[#5f5f5f]">{pro.role}</p>
                  </div>
                  <div className="typo-meta mt-2 flex h-[30px] items-center gap-2 px-0.5 text-[#808080]"><span className="flex items-center gap-1"><CheckSquareOffset size={16} />42</span><span className="h-3 w-px bg-[#d1d1d1]" /><span className="flex items-center gap-1"><IdentificationBadge size={16} />5 years</span></div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-[305px] py-2">
            <div className="flex h-6 items-center justify-between px-4">
              <h2 className="typo-section-title">Products you might like</h2>
              <button type="button" className="typo-utility flex h-5 items-center gap-1">View all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-[249px] gap-3 overflow-x-auto overflow-y-hidden px-4">
              {homepageProducts.map((product, index) => (
                <article key={`${product.title}-${index}`} className="h-[249px] w-[184px] shrink-0 rounded-2xl border border-[#e0e0e0] bg-[#fbfbfb] p-1">
                  <div className="relative h-[139px] overflow-hidden rounded-[15px] border border-[#e0e0e0] bg-white">
                    <img src={product.image} alt={product.title} className="size-full object-cover" />
                    <span className="typo-meta absolute right-2 top-2 rounded-lg bg-white px-2 py-1">1/5</span>
                    <button type="button" className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-lg bg-white"><BookmarkSimple size={16} /></button>
                  </div>
                  <div className="px-2 pb-2 pt-3">
                    <p className="typo-body-strong line-clamp-2">{product.title}</p>
                    <p className="typo-meta mt-1 text-[#808080]">{product.category}</p>
                    <button type="button" className="typo-meta mt-2 text-[#808080] underline decoration-dotted">Get a quote</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-5 h-px w-full bg-[#e0e0e0]" />

          <section className="mt-5 h-[292px]">
            <div className="flex h-6 items-center justify-between px-4">
              <h2 className="typo-section-title">Upcoming events</h2>
              <button type="button" className="typo-utility flex h-5 items-center gap-1">View all <ArrowRight size={20} /></button>
            </div>
            <div className="no-scrollbar mt-4 flex h-[252px] gap-3 overflow-x-auto px-4">
              {homepageEvents.map((event) => (
                <article key={event.title} className="h-[252px] w-[175px] shrink-0 rounded-3xl border border-[#e0e0e0] bg-[#fbfbfb] p-2">
                  <div className="relative h-36 overflow-hidden rounded-2xl border border-[#e0e0e0] bg-white">
                    <img src={event.image} alt={event.title} className="size-full object-cover" />
                    <span className="typo-meta absolute right-2 top-2 rounded-lg border border-[#333] bg-black/70 px-2 py-1 text-white backdrop-blur">{event.interested}</span>
                  </div>
                  <div className="px-1 pt-3">
                    <p className="typo-section-title truncate">{event.title}</p>
                    <p className="typo-meta mt-1 flex items-center gap-1 text-[#808080]"><CalendarDots size={16} />{event.date}</p>
                    <p className="typo-meta mt-1 flex items-center gap-1 text-[#808080]"><MapPinSimpleArea size={16} />{event.city}</p>
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
          ) : null}
          {homeTab === 'project' ? (
            <HomeownerProjectPortal
              onOpenSow={() => setIsHomeownerSowOpen(true)}
              onOpenFinance={() => setIsHomeownerFinanceOpen(true)}
              onOpenApprovals={() => setIsHomeownerTasksOpen(true)}
              onOpenArchive={() => setIsHomeownerArchiveOpen(true)}
              onOpenBoq={() => setIsHomeownerBoqOpen(true)}
              onOpenTimeline={() => setIsHomeownerTimelineOpen(true)}
              onOpenSiteDiary={() => setIsHomeownerSiteDiaryOpen(true)}
            />
          ) : null}
          {homeTab === 'explore' ? renderExplorePage() : null}
          {homeTab === 'post' ? renderPostPage() : null}
          {homeTab === 'events' ? renderEventsPage() : null}
          {homeTab === 'profile' ? renderProfilePage() : null}
        </div>
      </div>

      <div className="hynt-home-shell__toast fixed bottom-[-44px] left-1/2 z-40 flex h-10 w-[358px] max-w-[calc(100vw-32px)] -translate-x-1/2 items-center justify-between rounded-xl border border-[rgba(95,193,138,0.64)] bg-black/25 px-3 text-white backdrop-blur">
        <span className="typo-utility typo-weight-medium flex items-center gap-2"><PaperPlaneTilt size={16} />Requirement sent to all relevant professionals</span>
        <XCircle size={16} />
      </div>

      <div className={`fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/52 backdrop-blur-sm transition-opacity duration-300 ${isFlowSwitcherOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <section className={`w-full max-w-[390px] rounded-t-[2rem] bg-white p-5 transition-transform duration-300 ${isFlowSwitcherOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="typo-title-20-strong text-black">Switch profile</h2>
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
              <p className="typo-title-16-strong text-black">Homeowner</p>
              <p className="typo-body mt-1 text-[#6d6d6d]">Current homeowner journey</p>
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectFlow('professional')
                setIsFlowSwitcherOpen(false)
              }}
              className={`rounded-2xl border p-4 text-left ${activeFlow === 'professional' ? 'border-[#5FC18A] bg-[#effaf3]' : 'border-[#e4e4e4] bg-white'}`}
            >
              <p className="typo-title-16-strong text-black">Professional</p>
              <p className="typo-body mt-1 text-[#6d6d6d]">Dedicated pro journey</p>
            </button>
          </div>
        </section>
      </div>
    </main>
  )
  }

  if (!isChatOpen) return renderHome()

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#eef3f0] font-['Urbanist'] text-slate-950">
      <section className="mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-[#eef3f0]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
          <p className="typo-body-strong text-left uppercase text-[#267449]">HYNT AI</p>
          <button type="button" onClick={closeChat} aria-label="Close chat" className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-700">
            <X size={16} weight="bold" />
          </button>
        </header>
        <div className="border-b border-slate-200 bg-white px-4 pb-3 pt-3">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h1 className="typo-title-20-strong">Interactive brief</h1>
              <span className={`typo-badge mt-1 inline-flex rounded-full px-3 py-1 ${allIntentFilled ? 'bg-[#5FC18A] text-white' : 'bg-[#eaf1ec] text-slate-500'}`}>{allIntentFilled ? 'Complete' : 'In progress'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBriefCollapsed((previous) => !previous)}
                className="typo-body-strong inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-slate-700"
              >
                {isBriefCollapsed ? <><CaretDown size={12} weight="bold" />Show brief</> : <><CaretUp size={12} weight="bold" />Hide brief</>}
              </button>
            </div>
          </div>
          {!isBriefCollapsed ? (
            <div className="grid grid-cols-2 gap-2 rounded-[1.35rem] border border-slate-200 bg-white p-3">
              {[['Style', intent.style], ['Budget', intent.budget], ['Scope', intent.scope], ['Professional', intent.professional]].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/75 p-3">
                  <p className="typo-overline uppercase text-slate-400">{label}</p>
                  <p className="typo-body-strong mt-1 line-clamp-2 text-slate-900">{renderIntentValue(value)}</p>
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
                <span className="thinking-breathe typo-utility text-slate-600">Thinking</span>
              </div>
            ) : (
              <article key={message.id} className={`max-w-[86%] animate-[bubbleIn_240ms_ease-out_both] ${message.role === 'user' ? 'typo-body-strong ml-auto rounded-[1.3rem] rounded-br-md bg-[#5FC18A] px-4 py-3 text-right text-white shadow-lg shadow-[#5FC18A]/30' : 'typo-body mr-auto rounded-[1.5rem] rounded-bl-md border border-white/80 bg-white/82 px-4 py-3 text-left text-slate-800 shadow-sm backdrop-blur-xl'}`}>
                <p>{message.text}</p>
                {renderBubbleAction(message)}
                {message.summary ? (
                  <button
                    type="button"
                    onClick={() => setIsBriefDetailOpen(true)}
                    className="mt-4 w-full rounded-2xl bg-[linear-gradient(145deg,#071238,#0f2b56)] p-4 text-left text-white shadow-lg shadow-[#071238]/35"
                  >
                    <div className="flex items-center justify-between">
                      <p className="typo-body-strong">Project brief</p>
                      <span className="typo-label inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                        <Eye size={13} />
                        View
                      </span>
                    </div>
                    <p className="typo-body mt-3 line-clamp-2 text-white/80">Style: {renderIntentValue(intent.style)} | Budget: {renderIntentValue(intent.budget)}</p>
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
              className="typo-input h-6 min-w-0 flex-1 bg-transparent text-slate-700 outline-none placeholder:text-[#999]"
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
                  <p className="typo-label uppercase text-[#267449]">Selector</p>
                  <h2 className="typo-page-title mt-1 text-slate-950">{selectorMeta[activeModal.type].title}</h2>
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
                  className="typo-title-16-strong w-full rounded-2xl bg-slate-950 px-5 py-4 text-white shadow-xl shadow-slate-950/20 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
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
            <h3 className="typo-title-20-strong text-slate-950">Project brief</h3>
            <button type="button" onClick={() => setIsBriefDetailOpen(false)} className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700"><X size={18} weight="bold" /></button>
          </div>
          <div className="rounded-2xl bg-[linear-gradient(145deg,#071238,#0f2b56)] p-4 text-white">
            <p className="typo-label uppercase text-white/70">Your selections</p>
            <div className="mt-4 space-y-3">
              <p className="typo-body text-white/85"><span className="typo-weight-bold text-white">Style:</span> {renderIntentValue(intent.style)}</p>
              <p className="typo-body text-white/85"><span className="typo-weight-bold text-white">Budget:</span> {renderIntentValue(intent.budget)}</p>
              <p className="typo-body text-white/85"><span className="typo-weight-bold text-white">Scope:</span> {renderIntentValue(intent.scope)}</p>
              <p className="typo-body text-white/85"><span className="typo-weight-bold text-white">Professional:</span> {renderIntentValue(intent.professional)}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
    )
}

function App() {
  const [activeFlow, setActiveFlow] = useState(() => localStorage.getItem(FLOW_STORAGE_KEY))
  const { actions } = useSharedProject()

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
  return <FlowSelection onSelectFlow={handleSelectFlow} onResetToEmpty={actions.resetToEmpty} onResetDemo={actions.resetDemo} />
}

export default App
