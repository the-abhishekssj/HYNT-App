import { useEffect, useState } from 'react'
import { createInitialSowDocument } from '../sow/sowData.js'
import { applySowAmendmentPatchToDocument, cloneSowDocument } from '../sow/sowFlowUtils.js'
import {
  boqImportPreviewRows,
  getBoqItemAmount,
  getUniqueBoqRoomsFromItems,
  toBoqRoomId,
} from '../boq/boqUtils.js'

const STORAGE_KEY = 'hynt-mock-project-store-v1'
const CHANNEL_KEY = 'hynt-mock-project-store'

const nowIso = () => new Date().toISOString()
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
const cloneBoqQuestions = (questions = []) => questions.map((question) => ({
  status: 'open',
  designerReply: '',
  repliedAt: null,
  ...question,
}))
const cloneBoqItemSnapshot = (item = {}) => ({
  ...item,
  clientQuestions: cloneBoqQuestions(item.clientQuestions || []),
})
const normalizeProjectTask = (task = {}, fallbackProjectId = 'p-1') => ({
  projectId: fallbackProjectId,
  due: 'Today',
  dueDate: '20 May 2026',
  dueTime: '06:00 PM',
  status: 'todo',
  steps: [],
  priority: 'High',
  linkedTo: null,
  sourceEntryId: null,
  sourceIssueId: null,
  sourceLabel: '',
  note: '',
  ...task,
})
const normalizeTaskApproval = (approval = {}, fallbackProjectId = 'p-1') => ({
  projectId: fallbackProjectId,
  type: 'Design approval',
  status: 'pending',
  description: '',
  dueDate: 'TBD',
  sentAt: '',
  sentBy: '',
  homeownerName: '',
  image: '/hynt-home/product.png',
  clientQuestion: '',
  respondedAt: null,
  ...approval,
})
const normalizeBoqHistoryEntry = (projectId, entry = {}) => {
  const itemsSnapshot = (entry.itemsSnapshot || []).map((item) => ({
    space: 'General',
    category: 'General',
    quantity: item.area ?? 1,
    clientQuestions: [],
    vendor: '',
    vendorRate: item.rate ?? 0,
    markupPercent: 0,
    type: 'Custom',
    notes: '',
    ...cloneBoqItemSnapshot(item),
  }))
  const subtotal = entry.subtotal ?? itemsSnapshot.reduce((sum, item) => sum + getBoqItemAmount(item), 0)
  const gstEnabled = entry.gstEnabled ?? true
  const gstAmount = entry.gstAmount ?? (gstEnabled ? Math.round(subtotal * 0.18) : 0)
  return {
    id: entry.id || `boq-history-${projectId}-v${entry.version || 1}`,
    projectId,
    version: 1,
    title: `BOQ v${entry.version || 1}`,
    status: 'approved',
    approvedAt: null,
    subtotal,
    gstEnabled,
    gstAmount,
    grandTotal: entry.grandTotal ?? subtotal + gstAmount,
    clientFeedback: null,
    itemsSnapshot,
    ...entry,
  }
}
const upsertBoqHistoryEntry = (history = [], nextEntry) => (
  [nextEntry, ...(history || []).filter((entry) => entry.version !== nextEntry.version)]
    .sort((left, right) => (right.version || 0) - (left.version || 0))
)
const buildBoqHistoryEntry = ({ projectId, meta, items, approvedAt }) => normalizeBoqHistoryEntry(projectId, {
  id: `boq-history-${projectId}-v${meta.version || 1}`,
  version: meta.version || 1,
  title: `BOQ v${meta.version || 1}`,
  status: 'approved',
  approvedAt,
  gstEnabled: meta.gstEnabled ?? true,
  clientFeedback: meta.clientFeedback ? { ...meta.clientFeedback } : null,
  itemsSnapshot: (items || []).map((item) => cloneBoqItemSnapshot(item)),
})

const demoProject = {
  id: 'p-1',
  name: 'Sharma 3BHK Renovation',
  client: 'Priya Sharma',
  clientName: 'Priya Sharma',
  homeownerName: 'Priya Sharma',
  designerName: 'Riya Desai',
  location: 'Bandra, Mumbai',
  scope: '3BHK Full Renovation',
  status: 'Active',
  progress: 72,
  kickoffDate: '2026-04-01',
  budgetL: 28,
  spentL: 19.8,
  receivedL: 21.2,
  dueDate: '30 Sep 2026',
  avatar: '/hynt-home/pro-2.png',
  phone: '+91 98989 12121',
  email: 'priya.sharma@example.com',
  alerts: [
    {
      id: 'a-1',
      label: 'New remark',
      title: 'Priya asked for an update on the kitchen scope',
      detail: 'Client wants to confirm whether chimney provision is already included before approving the next step.',
      time: '12m ago',
      target: 'sow',
      sowView: 'remarks',
    },
  ],
}

const roleTemplates = [
  {
    id: 'principal-pro',
    label: 'Principal Pro',
    grants: ['all'],
  },
  {
    id: 'junior-designer',
    label: 'Junior Designer',
    grants: ['sow.view', 'tasks.update', 'archive.create', 'moodboard.create', 'finance.expense.create'],
  },
  {
    id: 'site-supervisor',
    label: 'Site Supervisor',
    grants: ['tasks.update', 'siteDiary.create', 'archive.upload', 'boq.measurements.view'],
  },
  {
    id: 'accounts',
    label: 'Accounts',
    grants: ['finance.view', 'finance.edit', 'finance.invoice.create', 'boq.view'],
  },
  {
    id: 'homeowner',
    label: 'Homeowner',
    grants: ['sow.review', 'tasks.client.view', 'archive.client.view', 'finance.client.view'],
  },
]

export const permissionGroups = [
  {
    id: 'sow',
    label: 'SOW',
    grants: [
      ['sow.view', 'View drafts'],
      ['sow.edit', 'Edit SOW'],
      ['sow.send', 'Send to client'],
      ['sow.review', 'Client review'],
    ],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    grants: [
      ['tasks.view', 'View'],
      ['tasks.create', 'Create'],
      ['tasks.update', 'Update'],
      ['tasks.approve', 'Approve'],
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    grants: [
      ['finance.view', 'View totals'],
      ['finance.expense.create', 'Add expenses'],
      ['finance.edit', 'Edit finance'],
      ['finance.invoice.create', 'Create invoice'],
    ],
  },
  {
    id: 'archive',
    label: 'Archive',
    grants: [
      ['archive.view', 'View internal'],
      ['archive.create', 'Add items'],
      ['archive.upload', 'Upload files'],
      ['archive.client.view', 'Client shared'],
    ],
  },
  {
    id: 'boq',
    label: 'BOQ',
    grants: [
      ['boq.view', 'View'],
      ['boq.edit', 'Edit'],
      ['boq.measurements.view', 'Measurements'],
      ['boq.approve', 'Approve'],
    ],
  },
  {
    id: 'siteDiary',
    label: 'Site diary',
    grants: [
      ['siteDiary.view', 'View'],
      ['siteDiary.create', 'Post entry'],
      ['siteDiary.share', 'Share update'],
      ['siteDiary.convert', 'Create task/expense'],
    ],
  },
]

export const mockInitialState = {
  version: 9,
  users: [
    { id: 'u-pro-1', name: 'Riya Desai', role: 'Principal Pro', phone: '+91 98765 43210', avatar: '/hynt-home/pro-1.png' },
    { id: 'u-client-1', name: 'Priya Sharma', role: 'Homeowner', phone: '+91 98989 12121', avatar: '/hynt-home/pro-2.png' },
    { id: 'u-junior-1', name: 'Aanya Rao', role: 'Junior Designer', phone: '+91 98111 22001', avatar: '/hynt-home/pro-2.png' },
    { id: 'u-site-1', name: 'Nisha Reddy', role: 'Site Supervisor', phone: '+91 98220 44556', avatar: '/hynt-home/pro-2.png' },
  ],
  projects: [demoProject],
  memberships: [
    { id: 'm-pro-1', projectId: 'p-1', userId: 'u-pro-1', roleId: 'principal-pro', status: 'accepted', grants: ['all'] },
    { id: 'm-client-1', projectId: 'p-1', userId: 'u-client-1', roleId: 'homeowner', status: 'accepted', grants: ['sow.review', 'tasks.client.view', 'archive.client.view', 'finance.client.view'] },
    { id: 'm-junior-1', projectId: 'p-1', userId: 'u-junior-1', roleId: 'junior-designer', status: 'accepted', grants: ['sow.view', 'tasks.update', 'archive.create', 'moodboard.create', 'finance.expense.create'] },
    { id: 'm-site-1', projectId: 'p-1', userId: 'u-site-1', roleId: 'site-supervisor', status: 'accepted', grants: ['tasks.update', 'siteDiary.create', 'archive.upload', 'boq.measurements.view'] },
  ],
  invites: [
    {
      id: 'inv-1',
      projectId: 'p-1',
      phone: '+91 90000 11223',
      roleId: 'junior-designer',
      status: 'pending',
      inviteUrl: 'https://hynt.local/invite/inv-1',
      createdAt: nowIso(),
    },
  ],
  roleTemplates,
  sows: {},
  archiveFolders: [
    { id: 'af-1', projectId: 'p-1', name: 'Moodboard', type: 'moodboard', visibility: 'client-shared', editAccess: 'team-can-add' },
    { id: 'af-2', projectId: 'p-1', name: 'Sketches', type: 'sketches', visibility: 'team-only', editAccess: 'pro-only' },
    { id: 'af-3', projectId: 'p-1', name: 'Renders', type: 'renders', visibility: 'client-shared', editAccess: 'team-can-add' },
  ],
  archiveItems: [
    {
      id: 'ai-1',
      projectId: 'p-1',
      folderId: 'af-1',
      title: 'Warm neutral living reference',
      type: 'image',
      src: '/hynt-home/idea-1.png',
      status: 'pending',
      linkedTo: 'SOW / Living Room',
      comments: ['Can we explore a slightly darker fabric tone here?'],
    },
    {
      id: 'ai-2',
      projectId: 'p-1',
      folderId: 'af-1',
      title: 'Kitchen material direction',
      type: 'image',
      src: '/hynt-home/idea-2.png',
      status: 'approved',
      linkedTo: 'BOQ / Kitchen finishes',
      comments: ['Looks good for the kitchen palette.'],
    },
    {
      id: 'ai-3',
      projectId: 'p-1',
      folderId: 'af-2',
      title: 'Ceiling wiring sketch',
      type: 'note',
      src: null,
      status: 'internal',
      linkedTo: 'Tasks / Electrical coordination',
      comments: [],
    },
    {
      id: 'ai-5',
      projectId: 'p-1',
      folderId: 'af-1',
      title: 'Brushed brass handle direction',
      type: 'image',
      src: '/hynt-home/product.png',
      status: 'pending',
      linkedTo: 'BOQ / Kitchen hardware',
      comments: ['Would like to compare this against a warmer brass option.'],
    },
    {
      id: 'ai-6',
      projectId: 'p-1',
      folderId: 'af-1',
      title: 'Muted material palette',
      type: 'image',
      src: '/hynt-home/idea-2.png',
      status: 'approved',
      linkedTo: 'Mood direction / Common areas',
      comments: [],
    },
    {
      id: 'ai-4',
      projectId: 'p-1',
      folderId: 'af-3',
      title: 'Living room 3D render',
      type: 'image',
      src: '/hynt-home/idea-2.png',
      status: 'shared',
      linkedTo: 'Concept / Common areas',
      comments: [],
    },
    {
      id: 'ai-7',
      projectId: 'p-1',
      folderId: 'af-3',
      title: 'Foyer ceiling render',
      type: 'image',
      src: '/hynt-home/idea-1.png',
      status: 'shared',
      linkedTo: 'Concept / Common areas',
      comments: ['Please confirm if this section is before the final gypsum layer.'],
    },
  ],
  financeInvoices: [
    {
      id: 'fi-1',
      projectId: 'p-1',
      number: 'INV-001',
      title: 'Advance',
      stageLabel: 'Advance (30%)',
      summary: 'Booking amount to lock the project team, kickoff, and initial site work.',
      amountL: 2.70527,
      status: 'paid',
      dueDate: '03 Jun 2026',
      issuedAt: '01 Jun 2026',
      paidAt: '03 Jun 2026',
      method: 'NEFT',
      transactionId: 'NEFT0306A1',
      clientNote: 'This invoice covers mobilisation, site measurement, and concept freeze.',
      reminderCount: 0,
      lastReminderAt: null,
    },
    {
      id: 'fi-2',
      projectId: 'p-1',
      number: 'INV-002',
      title: 'Milestone 1',
      stageLabel: 'Design & approvals (30%)',
      summary: 'Covers design sign-off, BOQ closure, and vendor alignment before execution.',
      amountL: 2.70527,
      status: 'paid',
      dueDate: '18 Aug 2026',
      issuedAt: '15 Aug 2026',
      paidAt: '18 Aug 2026',
      method: 'UPI',
      transactionId: 'UPI1808M1',
      clientNote: 'Raised after layouts, materials, and BOQ were approved.',
      reminderCount: 0,
      lastReminderAt: null,
    },
    {
      id: 'fi-3',
      projectId: 'p-1',
      number: 'INV-003',
      title: 'Milestone 2',
      stageLabel: 'Civil & false ceiling (24%)',
      summary: 'Raised as execution moves through ceiling, civil corrections, and service coordination.',
      amountL: 2.16421,
      status: 'due',
      dueDate: '30 Oct 2026',
      issuedAt: '20 Oct 2026',
      paidAt: null,
      method: null,
      transactionId: null,
      clientNote: 'Due when false ceiling and electrical rough-ins reach the agreed checkpoint.',
      reminderCount: 1,
      lastReminderAt: '26 Oct 2026',
    },
    {
      id: 'fi-4',
      projectId: 'p-1',
      number: 'INV-004',
      title: 'Final',
      stageLabel: 'Handover (10%)',
      summary: 'Final closeout milestone for snagging, touch-ups, and handover.',
      amountL: 0.90176,
      status: 'upcoming',
      dueDate: 'On completion',
      issuedAt: null,
      paidAt: null,
      method: null,
      transactionId: null,
      clientNote: 'Raised only once snag closure and handover are complete.',
      reminderCount: 0,
      lastReminderAt: null,
    },
  ],
  financeExpenses: [
    {
      id: 'fexp-1',
      projectId: 'p-1',
      category: 'Vendor payment',
      title: 'Sleek Kitchens - kitchen advance',
      amount: 150000,
      expenseDate: '20 Sep 2026',
      payee: 'Sleek Kitchens',
      mode: 'NEFT',
      gstRate: 18,
      hasBill: true,
      note: 'Advance released after carcass drawings were approved.',
      submittedBy: 'Riya Desai',
    },
    {
      id: 'fexp-2',
      projectId: 'p-1',
      category: 'Materials',
      title: 'Tiles - living + bedrooms',
      amount: 28500,
      expenseDate: '15 Aug 2026',
      payee: 'Marble House',
      mode: 'Cash',
      gstRate: 12,
      hasBill: true,
      note: 'Balance amount after final shade selection.',
      submittedBy: 'Aanya Rao',
    },
    {
      id: 'fexp-3',
      projectId: 'p-1',
      category: 'Labour',
      title: 'Civil labour - July batch',
      amount: 42000,
      expenseDate: '31 Jul 2026',
      payee: 'On-site team',
      mode: 'Cash',
      gstRate: 0,
      hasBill: false,
      note: 'Weekly site labour settlement.',
      submittedBy: 'Nisha Reddy',
    },
    {
      id: 'fexp-4',
      projectId: 'p-1',
      category: 'Travel',
      title: 'Site visits - August',
      amount: 3200,
      expenseDate: '30 Aug 2026',
      payee: 'Local transport',
      mode: 'UPI',
      gstRate: 0,
      hasBill: false,
      note: 'Auto and fuel reimbursements.',
      submittedBy: 'Riya Desai',
    },
  ],
  boqRooms: [
    { id: 'boq-room-living-room', projectId: 'p-1', name: 'Living Room', note: 'Shared living, dining, and entry detailing.', order: 0 },
    { id: 'boq-room-kitchen', projectId: 'p-1', name: 'Kitchen', note: 'Execution BOQ for modular, counter, and utility specifics.', order: 1 },
    { id: 'boq-room-master-bedroom', projectId: 'p-1', name: 'Master Bedroom', note: 'Wardrobe, bed-back, and storage joinery.', order: 2 },
  ],
  boqMeta: {
    'p-1': {
      status: 'shared',
      version: 2,
      gstEnabled: true,
      importFileName: null,
      pendingImportRows: [],
      importedAt: null,
      clientFeedback: null,
      financeScheduleMode: 'auto',
      financeScheduleCreated: false,
      approvedAt: null,
      history: [
        normalizeBoqHistoryEntry('p-1', {
          version: 1,
          title: 'BOQ v1',
          approvedAt: '2026-05-24T17:30:00+05:30',
          gstEnabled: true,
          itemsSnapshot: [
            {
              id: 'boq-history-1',
              projectId: 'p-1',
              roomId: 'boq-room-living-room',
              space: 'Living Room',
              category: 'Civil',
              item: 'False Ceiling - Cove lighting',
              quantity: '320',
              area: '320 sqft',
              rate: 90,
              unit: 'sqft',
              vendor: 'ABC Contractors',
              vendorRate: 75,
              markupPercent: 10,
              type: 'Custom',
              notes: '',
              clientQuestions: [],
            },
            {
              id: 'boq-history-2',
              projectId: 'p-1',
              roomId: 'boq-room-living-room',
              space: 'Living Room',
              category: 'Carpentry',
              item: 'TV Unit with storage',
              quantity: '1',
              area: 1,
              rate: 55000,
              unit: 'unit',
              vendor: 'Raj Furniture',
              vendorRate: 47000,
              markupPercent: 7,
              type: 'Custom',
              notes: '',
              clientQuestions: [],
            },
            {
              id: 'boq-history-3',
              projectId: 'p-1',
              roomId: 'boq-room-kitchen',
              space: 'Kitchen',
              category: 'Modular',
              item: 'Modular kitchen - premium finish, granite top',
              quantity: '1',
              area: 1,
              rate: 240000,
              unit: 'unit',
              vendor: 'Sleek Kitchens',
              vendorRate: 221000,
              markupPercent: 8,
              type: 'Custom',
              notes: 'Original signed option before cost revision.',
              clientQuestions: [],
            },
            {
              id: 'boq-history-4',
              projectId: 'p-1',
              roomId: 'boq-room-master-bedroom',
              space: 'Master Bedroom',
              category: 'Carpentry',
              item: 'Wardrobe - 8ft sliding mirror',
              quantity: '1',
              area: 1,
              rate: 95000,
              unit: 'unit',
              vendor: 'Modi Interiors',
              vendorRate: 87000,
              markupPercent: 9,
              type: 'Custom',
              notes: '',
              clientQuestions: [],
            },
          ],
        }),
      ],
    },
  },
  boqItems: [
    {
      id: 'boq-1',
      projectId: 'p-1',
      roomId: 'boq-room-living-room',
      space: 'Living Room',
      category: 'Civil',
      item: 'False Ceiling - Cove lighting',
      quantity: '320',
      area: '320 sqft',
      rate: 90,
      unit: 'sqft',
      vendor: 'ABC Contractors',
      vendorRate: 75,
      markupPercent: 10,
      type: 'Custom',
      notes: '',
      clientQuestions: [],
    },
    {
      id: 'boq-2',
      projectId: 'p-1',
      roomId: 'boq-room-living-room',
      space: 'Living Room',
      category: 'Carpentry',
      item: 'TV Unit with storage',
      quantity: '1',
      area: 1,
      rate: 55000,
      unit: 'unit',
      vendor: 'Raj Furniture',
      vendorRate: 47000,
      markupPercent: 7,
      type: 'Custom',
      notes: '',
      clientQuestions: [],
    },
    {
      id: 'boq-3',
      projectId: 'p-1',
      roomId: 'boq-room-kitchen',
      space: 'Kitchen',
      category: 'Modular',
      item: 'Modular kitchen - L-shape, granite top',
      quantity: '1',
      area: 1,
      rate: 220000,
      unit: 'unit',
      vendor: 'Sleek Kitchens',
      vendorRate: 203000,
      markupPercent: 8,
      type: 'Custom',
      notes: 'Granite top included.',
      clientQuestions: [
        {
          id: 'boq-question-1',
          body: 'Can you clarify whether the countertop and hardware are part of this line item or handled separately?',
          createdBy: 'Priya Sharma',
          createdAt: '2026-05-22T11:05:00+05:30',
        },
      ],
    },
    {
      id: 'boq-4',
      projectId: 'p-1',
      roomId: 'boq-room-master-bedroom',
      space: 'Master Bedroom',
      category: 'Carpentry',
      item: 'Wardrobe - 8ft sliding mirror',
      quantity: '1',
      area: 1,
      rate: 95000,
      unit: 'unit',
      vendor: 'Modi Interiors',
      vendorRate: 87000,
      markupPercent: 9,
      type: 'Custom',
      notes: '',
      clientQuestions: [],
    },
  ],
  projectTasks: [
    {
      id: 'task-shared-1',
      projectId: 'p-1',
      title: 'Close AC duct clash before gypsum work',
      assignee: 'Nisha Reddy',
      assignedBy: 'Riya Desai',
      due: 'Today',
      dueDate: '21 May 2026',
      dueTime: '06:00 PM',
      status: 'inprogress',
      steps: ['Inspect ceiling line on site', 'Coordinate correction with AC team', 'Confirm ready for gypsum close-up'],
      priority: 'High',
      linkedTo: 'Site diary',
      sourceEntryId: 'diary-1',
      sourceIssueId: 'issue-1',
      sourceLabel: 'Master bedroom ceiling update',
      note: 'Ceiling channel needs 20mm correction before gypsum close-up.',
    },
    {
      id: 'task-shared-2',
      projectId: 'p-1',
      title: 'Recheck kitchen handle procurement sample',
      assignee: 'Aanya Rao',
      assignedBy: 'Riya Desai',
      due: 'This week',
      dueDate: '23 May 2026',
      dueTime: '03:30 PM',
      status: 'todo',
      steps: ['Collect final sample from vendor', 'Confirm finish against approved reference', 'Share update in sourcing log'],
      priority: 'Medium',
      linkedTo: 'Site diary',
      sourceEntryId: 'diary-3',
      sourceLabel: 'Kitchen handle procurement',
    },
    {
      id: 'task-shared-3',
      projectId: 'p-1',
      title: 'Reply to homeowner ceiling question',
      assignee: 'Riya Desai',
      assignedBy: 'Priya Sharma',
      due: 'Today',
      dueDate: '21 May 2026',
      dueTime: '04:00 PM',
      status: 'done',
      steps: ['Review the shared progress photo', 'Confirm gypsum layer status', 'Post reply on the diary entry'],
      priority: 'High',
      linkedTo: 'Site diary',
      sourceEntryId: 'diary-2',
      sourceLabel: 'Ceiling progress photos',
    },
  ],
  taskApprovals: [
    {
      id: 'apr-1',
      projectId: 'p-1',
      title: 'Kitchen countertop - Granite vs Marble',
      type: 'Material selection',
      status: 'pending',
      description: 'Please select your preferred countertop material. Granite is more durable, marble feels more premium.',
      dueDate: '28 Oct',
      sentAt: '22 Oct',
      sentBy: 'Riya Desai',
      homeownerName: 'Priya Sharma',
      image: '/hynt-home/product.png',
      clientQuestion: '',
    },
    {
      id: 'apr-2',
      projectId: 'p-1',
      title: 'Wall colour - Sage green vs Warm grey',
      type: 'Design selection',
      status: 'question',
      description: 'This room can go calmer or warmer depending on the finish you want for the sofa wall.',
      dueDate: '30 Oct',
      sentAt: '20 Oct',
      sentBy: 'Riya Desai',
      homeownerName: 'Priya Sharma',
      image: '/hynt-home/idea-1.png',
      clientQuestion: 'Can I see the sage green with the existing sofa colour first?',
    },
    {
      id: 'apr-3',
      projectId: 'p-1',
      title: 'False ceiling layout - Cove lighting',
      type: 'Design approval',
      status: 'approved',
      description: 'Cove layout aligned with the lighting and AC coordination plan.',
      dueDate: '21 Oct',
      sentAt: '18 Oct',
      sentBy: 'Riya Desai',
      homeownerName: 'Priya Sharma',
      image: '/hynt-home/idea-2.png',
      clientQuestion: '',
    },
    {
      id: 'apr-4',
      projectId: 'p-1',
      title: 'Kids room theme - Jungle vs Space',
      type: 'Theme review',
      status: 'rejected',
      description: 'Two directions for the kids room accent palette and graphic wall.',
      dueDate: '20 Oct',
      sentAt: '17 Oct',
      sentBy: 'Riya Desai',
      homeownerName: 'Priya Sharma',
      image: '/hynt-home/brand.png',
      clientQuestion: 'Neither. Please explore an ocean theme instead.',
    },
  ],
  taskStepCompletion: {
    'task-shared-1': {
      0: '10:10',
    },
    'task-shared-3': {
      0: '09:15',
      1: '09:24',
      2: '09:32',
    },
  },
  siteDiaryEntries: [
    {
      id: 'diary-1',
      projectId: 'p-1',
      type: 'daily-log',
      title: 'Master bedroom ceiling channels corrected',
      createdAt: '2026-05-21T14:45:00+05:30',
      createdBy: 'Riya Desai',
      weather: 'Sunny',
      workerCount: 4,
      tags: ['False ceiling', 'Electrical'],
      note: 'Ceiling channels installed in master bedroom. Need one correction near AC duct.',
      photos: ['/hynt-home/idea-1.png'],
      linkedTaskLabel: 'Electrical coordination',
      linkedExpenseLabel: null,
      issueId: 'issue-1',
      clientComments: [],
      clientReviewedAt: null,
    },
    {
      id: 'diary-2',
      projectId: 'p-1',
      type: 'progress-photo',
      title: 'False ceiling layer check',
      createdAt: '2026-05-21T11:10:00+05:30',
      createdBy: 'Arjun Kumar',
      weather: 'Cloudy',
      workerCount: 3,
      tags: ['Ceiling', 'Photo update'],
      note: '',
      photos: ['/hynt-home/idea-2.png', '/hynt-home/product.png'],
      linkedTaskLabel: null,
      linkedExpenseLabel: null,
      issueId: null,
      clientComments: [
        {
          id: 'diary-comment-1',
          body: 'Please confirm whether this ceiling section is before the final gypsum layer.',
          createdBy: 'Priya Sharma',
          createdAt: '2026-05-21T13:00:00+05:30',
        },
      ],
      clientReviewedAt: '2026-05-21T18:25:00+05:30',
    },
    {
      id: 'diary-3',
      projectId: 'p-1',
      type: 'sourcing',
      title: 'Kitchen handle approval logged',
      createdAt: '2026-05-20T18:20:00+05:30',
      createdBy: 'Aanya Rao',
      weather: 'Indoor',
      workerCount: 2,
      tags: ['Procurement', 'Kitchen'],
      note: 'Client approved revised kitchen handle profile. Proceeding with procurement.',
      photos: [],
      linkedTaskLabel: null,
      linkedExpenseLabel: 'Vendor follow-up',
      issueId: null,
      clientComments: [],
      clientReviewedAt: null,
    },
  ],
  siteDiaryIssues: [
    {
      id: 'issue-1',
      projectId: 'p-1',
      title: 'AC duct clash in master bedroom ceiling',
      status: 'open',
      createdAt: '2026-05-21T14:50:00+05:30',
      reportedBy: 'Riya Desai',
      entryId: 'diary-1',
      linkedTaskLabel: 'Electrical coordination',
      note: 'Ceiling channel needs 20mm correction before gypsum close-up.',
    },
    {
      id: 'issue-2',
      projectId: 'p-1',
      title: 'Paint bleed on master ceiling edge',
      status: 'in-progress',
      createdAt: '2026-05-20T12:20:00+05:30',
      reportedBy: 'Arjun Kumar',
      entryId: null,
      linkedTaskLabel: 'Touch-up before handover',
      note: 'Painter team already briefed to correct this in the next visit.',
    },
  ],
  siteDiaryReferences: [
    {
      id: 'ref-1',
      projectId: 'p-1',
      title: 'Warm brass pendant direction',
      image: '/hynt-home/idea-1.png',
      note: 'Can we get something with this warmth for the dining area?',
      createdAt: '2026-05-21T16:10:00+05:30',
      createdBy: 'Priya Sharma',
      status: 'new',
      designerReply: '',
    },
    {
      id: 'ref-2',
      projectId: 'p-1',
      title: 'Muted stone counter edge',
      image: '/hynt-home/idea-2.png',
      note: 'Sharing this because I like the softer edge treatment.',
      createdAt: '2026-05-20T10:00:00+05:30',
      createdBy: 'Priya Sharma',
      status: 'reviewed',
      designerReply: 'Noted. We can align this with the revised kitchen stone options.',
    },
  ],
  timelinePhases: [
    {
      id: 'phase-1',
      projectId: 'p-1',
      name: 'Kickoff & Site Visit',
      startDate: '2025-06-01',
      endDate: '2025-06-07',
      status: 'done',
      progress: 100,
      assignedTo: ['Riya Desai'],
      note: 'Site measured. Photos taken. Brief confirmed with Priya.',
      clientNotified: false,
      delay: null,
    },
    {
      id: 'phase-2',
      projectId: 'p-1',
      name: 'Design & Approvals',
      startDate: '2025-06-08',
      endDate: '2025-06-30',
      status: 'done',
      progress: 100,
      assignedTo: ['Riya Desai', 'Sneha Malhotra'],
      note: 'All layouts approved. BOQ finalised. SOW signed.',
      clientNotified: false,
      delay: null,
    },
    {
      id: 'phase-3',
      projectId: 'p-1',
      name: 'Civil & False Ceiling',
      startDate: '2025-07-01',
      endDate: '2025-08-31',
      status: 'active',
      progress: 60,
      assignedTo: ['Arjun Kumar'],
      note: 'False ceiling living room done. Bedrooms pending. Kitchen in progress.',
      clientNotified: false,
      delay: null,
    },
    {
      id: 'phase-4',
      projectId: 'p-1',
      name: 'Modular & Carpentry',
      startDate: '2025-09-01',
      endDate: '2025-10-15',
      status: 'upcoming',
      progress: 0,
      assignedTo: ['Arjun Kumar', 'Sneha Malhotra'],
      note: 'Modular kitchen, wardrobes and TV unit.',
      clientNotified: false,
      delay: null,
    },
    {
      id: 'phase-5',
      projectId: 'p-1',
      name: 'Painting & Finishing',
      startDate: '2025-10-16',
      endDate: '2025-11-15',
      status: 'upcoming',
      progress: 0,
      assignedTo: ['TBD'],
      note: 'Painting, electrical finishing and plumbing finishing.',
      clientNotified: false,
      delay: null,
    },
    {
      id: 'phase-6',
      projectId: 'p-1',
      name: 'Handover',
      startDate: '2025-11-16',
      endDate: '2026-01-10',
      status: 'upcoming',
      progress: 0,
      assignedTo: ['Riya Desai'],
      note: 'Snagging, touch-ups and final walkthrough with client.',
      clientNotified: false,
      delay: null,
    },
  ],
  activeViewerRoleId: 'principal-pro',
  activity: [],
}

const normalizeState = (rawState = {}) => {
  const projects = (rawState.projects || mockInitialState.projects).map((project) => ({
    client: project.clientName || project.client || 'Client',
    clientName: project.clientName || project.client || 'Client',
    homeownerName: project.homeownerName || project.client || 'Client',
    designerName: project.designerName || 'Riya Desai',
    location: project.location || 'Mumbai',
    scope: project.scope || 'Renovation',
    status: project.status || 'Active',
    progress: project.progress ?? 10,
    kickoffDate: project.kickoffDate || new Date().toISOString().slice(0, 10),
    budgetL: Number(project.budgetL || 0),
    spentL: Number(project.spentL || 0),
    receivedL: Number(project.receivedL || 0),
    dueDate: project.dueDate || 'TBD',
    avatar: project.avatar || '/hynt-home/pro-2.png',
    phone: project.phone || '+91 98765 43210',
    email: project.email || 'client@example.com',
    alerts: project.alerts || [],
    ...project,
  }))
  const sows = Object.fromEntries(Object.entries(rawState.sows || mockInitialState.sows).map(([projectId, sow]) => [
    projectId,
    {
      designerSignedAt: null,
      clientSignedAt: null,
      aiGeneratedAt: null,
      ...sow,
      document: sow?.document ? cloneSowDocument(sow.document) : sow?.document,
      remarks: (sow?.remarks || []).map((remark) => ({
        status: 'open',
        targetId: null,
        ...remark,
      })),
      responses: (sow?.responses || []).map((response) => ({
        body: '',
        ...response,
      })),
      amendments: (sow?.amendments || []).map((amendment, index) => ({
        version: index + 1,
        responseText: '',
        approvedAt: null,
        rejectedAt: null,
        ...amendment,
      })),
    },
  ]))
  const boqMeta = Object.fromEntries(Object.entries(rawState.boqMeta || mockInitialState.boqMeta).map(([key, meta]) => [
    key,
    {
      status: 'draft',
      version: 1,
      gstEnabled: true,
      importFileName: null,
      pendingImportRows: [],
      importedAt: null,
      clientFeedback: null,
      financeScheduleMode: 'auto',
      financeScheduleCreated: false,
      approvedAt: null,
      ...meta,
      history: (meta?.history || []).map((entry) => normalizeBoqHistoryEntry(key, entry)),
    },
  ]))
  const boqRooms = (rawState.boqRooms || mockInitialState.boqRooms).map((room, index) => ({
    note: '',
    order: index,
    ...room,
    id: room.id || toBoqRoomId(room.name || 'General'),
  }))
  const roomById = new Map(boqRooms.map((room) => [room.id, room]))
  const roomByName = new Map(boqRooms.map((room) => [String(room.name || 'General').toLowerCase(), room]))
  const archiveFolders = (rawState.archiveFolders || mockInitialState.archiveFolders).map((folder) => ({
    editAccess: 'team-can-add',
    ...folder,
  }))
  const boqItems = (rawState.boqItems || mockInitialState.boqItems).map((item) => {
    const matchedRoom = roomById.get(item.roomId) || roomByName.get(String(item.space || 'General').toLowerCase())
    const roomName = matchedRoom?.name || item.space || 'General'
    return {
      roomId: matchedRoom?.id || item.roomId || toBoqRoomId(roomName),
      category: 'General',
      quantity: item.area ?? 1,
      clientQuestions: (item.clientQuestions || []).map((question) => ({
        status: 'open',
        designerReply: '',
        repliedAt: null,
        ...question,
      })),
      vendor: '',
      vendorRate: item.rate ?? 0,
      markupPercent: 0,
      type: 'Custom',
      notes: '',
      ...item,
      space: roomName,
    }
  })
  const derivedBoqRooms = getUniqueBoqRoomsFromItems(boqItems).filter((room) => !roomById.has(room.id))
  const normalizedBoqRooms = [...boqRooms, ...derivedBoqRooms]
  const financeInvoices = (rawState.financeInvoices || mockInitialState.financeInvoices).map((invoice) => ({
    stageLabel: invoice.title,
    summary: '',
    clientNote: '',
    reminderCount: 0,
    lastReminderAt: null,
    ...invoice,
  }))
  const financeExpenses = (rawState.financeExpenses || mockInitialState.financeExpenses).map((expense) => ({
    category: 'Miscellaneous',
    payee: '',
    mode: 'Cash',
    gstRate: 0,
    hasBill: false,
    note: '',
    submittedBy: demoProject.designerName,
    ...expense,
  }))
  const siteDiaryEntries = (rawState.siteDiaryEntries || mockInitialState.siteDiaryEntries).map((entry) => ({
    type: 'daily-log',
    title: '',
    createdBy: demoProject.designerName,
    weather: 'Indoor',
    workerCount: 0,
    tags: [],
    linkedTaskLabel: null,
    linkedExpenseLabel: null,
    issueId: null,
    clientReviewedAt: null,
    shareWithClient: true,
    ...entry,
    clientComments: (entry.clientComments || []).map((comment) => ({
      designerReply: '',
      repliedAt: null,
      ...comment,
    })),
  }))
  const siteDiaryIssues = (rawState.siteDiaryIssues || mockInitialState.siteDiaryIssues).map((issue) => ({
    linkedTaskLabel: null,
    note: '',
    ...issue,
  }))
  const siteDiaryReferences = (rawState.siteDiaryReferences || mockInitialState.siteDiaryReferences).map((reference) => ({
    designerReply: '',
    status: 'new',
    ...reference,
  }))
  const projectTasks = (rawState.projectTasks || mockInitialState.projectTasks).map((task) => normalizeProjectTask(task, task.projectId || 'p-1'))
  const taskApprovals = (rawState.taskApprovals || mockInitialState.taskApprovals).map((approval) => normalizeTaskApproval(approval, approval.projectId || 'p-1'))
  const taskStepCompletion = {
    ...(mockInitialState.taskStepCompletion || {}),
    ...(rawState.taskStepCompletion || {}),
  }
  const timelinePhases = (rawState.timelinePhases || mockInitialState.timelinePhases).map((phase) => ({
    clientNotified: false,
    delay: null,
    ...phase,
  }))
  return { ...mockInitialState, ...rawState, projects, sows, boqMeta, boqRooms: normalizedBoqRooms, archiveFolders, boqItems, financeInvoices, financeExpenses, projectTasks, taskApprovals, taskStepCompletion, siteDiaryEntries, siteDiaryIssues, siteDiaryReferences, timelinePhases, roleTemplates }
}

const readState = () => {
  if (typeof window === 'undefined') return mockInitialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return mockInitialState
    return normalizeState(JSON.parse(raw))
  } catch {
    return mockInitialState
  }
}

const getApiBase = () => {
  if (typeof window === 'undefined') return null
  return `http://${window.location.hostname}:8787`
}

const pullRemoteState = async () => {
  const apiBase = getApiBase()
  if (!apiBase) return null
  const response = await fetch(`${apiBase}/state`, { cache: 'no-store' })
  if (!response.ok) return null
  return response.json()
}

const pushRemoteState = (state) => {
  const apiBase = getApiBase()
  if (!apiBase) return
  fetch(`${apiBase}/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  }).catch(() => {})
}

const writeState = (state) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(CHANNEL_KEY, { detail: state }))
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(CHANNEL_KEY)
    channel.postMessage(state)
    channel.close()
  }
}

const addActivity = (state, projectId, actor, text) => ({
  ...state,
  activity: [
    { id: makeId('act'), projectId, actor, text, createdAt: nowIso() },
    ...(state.activity || []),
  ].slice(0, 40),
})

const createCustomSowDocument = (project) => ({
  ...createInitialSowDocument({
    scope: project.scope,
    client: project.clientName,
    location: project.location,
  }),
  projectType: 'Custom project',
  rooms: [
    { id: 'custom-scope', name: 'Custom scope', scope: 'Describe the exact scope, rooms, deliverables or consultation areas for this project.' },
  ],
  exclusions: [
    'Items outside the agreed written custom scope',
    'Procurement, site supervision or execution unless added by the designer',
  ],
  paymentStructure: 'Custom milestone plan',
  termsNotes: [
    'Custom scope to be frozen before execution begins',
    'Additional deliverables require written approval',
    'Timeline and billing milestones depend on final custom scope',
  ],
})

const createSowDraft = (project, templateId = 'residential') => ({
  id: makeId('sow'),
  projectId: project.id,
  revision: 1,
  templateId,
  status: 'draft',
  designerSigned: false,
  clientSigned: false,
  designerSignedAt: null,
  sentAt: null,
  clientSignedAt: null,
  aiGeneratedAt: null,
  updatedAt: nowIso(),
  document: templateId === 'custom'
    ? createCustomSowDocument(project)
    : createInitialSowDocument({
      scope: project.scope,
      client: project.clientName,
      location: project.location,
  }),
  remarks: [],
  responses: [],
  amendments: [],
})

const includesGrant = (grants = [], grant) => grants.includes('all') || grants.includes(grant)
const includesAnyGrant = (grants = [], candidates = []) => grants.includes('all') || candidates.some((grant) => grants.includes(grant))

const buildViewerPermissions = ({ roleId, grants = [] }) => ({
  isPrincipalPro: roleId === 'principal-pro' || grants.includes('all'),
  isHomeowner: roleId === 'homeowner',
  canViewSow: includesAnyGrant(grants, ['sow.view', 'sow.edit', 'sow.send', 'sow.review']),
  canEditSow: includesAnyGrant(grants, ['sow.edit', 'sow.send']),
  canSendSow: includesGrant(grants, 'sow.send'),
  canReviewSow: includesGrant(grants, 'sow.review'),
  canViewTasks: includesAnyGrant(grants, ['tasks.view', 'tasks.update', 'tasks.create', 'tasks.approve', 'tasks.client.view']),
  canCreateTasks: includesAnyGrant(grants, ['tasks.create', 'tasks.approve']),
  canUpdateTasks: includesAnyGrant(grants, ['tasks.update', 'tasks.approve']),
  canApproveTasks: includesGrant(grants, 'tasks.approve'),
  canViewTeamTasks: includesAnyGrant(grants, ['tasks.view', 'tasks.approve']),
  canViewFinanceTotals: includesAnyGrant(grants, ['finance.view', 'finance.edit', 'finance.invoice.create', 'finance.client.view']),
  canAddExpenses: includesAnyGrant(grants, ['finance.expense.create', 'finance.edit']),
  canEditFinance: includesGrant(grants, 'finance.edit'),
  canCreateInvoices: includesAnyGrant(grants, ['finance.invoice.create', 'finance.edit']),
  canViewArchive: includesAnyGrant(grants, ['archive.view', 'archive.client.view', 'archive.create', 'archive.upload']),
  canViewInternalArchive: includesAnyGrant(grants, ['archive.view', 'archive.create', 'archive.upload']),
  canViewSharedArchive: includesAnyGrant(grants, ['archive.client.view', 'archive.view', 'archive.create', 'archive.upload']),
  canManageArchiveSettings: roleId === 'principal-pro' || grants.includes('all'),
  canCreateArchiveFolder: roleId === 'principal-pro' || grants.includes('all'),
  canAddArchiveItems: includesAnyGrant(grants, ['archive.create', 'archive.upload']),
  canViewBoq: includesAnyGrant(grants, ['boq.view', 'boq.edit', 'boq.measurements.view', 'boq.approve']),
  canEditBoq: includesAnyGrant(grants, ['boq.edit', 'boq.approve']),
  canViewSiteDiary: includesAnyGrant(grants, ['siteDiary.view', 'siteDiary.create', 'siteDiary.share', 'siteDiary.convert']),
  canCreateSiteDiary: includesAnyGrant(grants, ['siteDiary.create', 'siteDiary.share', 'siteDiary.convert']),
  canManageTeamAccess: roleId === 'principal-pro' || grants.includes('all'),
})

export function useSharedProject(rawProjectId = 'p-1') {
  const [state, setState] = useState(readState)

  const activeProjectId = state.activeProjectId || (state.projects && state.projects.length > 0 ? state.projects[0].id : null)
  const projectId = rawProjectId === 'p-1' ? activeProjectId : (rawProjectId || activeProjectId)

  useEffect(() => {
    const handleLocal = (event) => setState(event.detail || readState())
    window.addEventListener(CHANNEL_KEY, handleLocal)

    let channel
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(CHANNEL_KEY)
      channel.onmessage = (event) => setState(event.data || readState())
    }

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) setState(readState())
    }
    window.addEventListener('storage', handleStorage)

    let mounted = true
    const refreshRemote = () => {
      pullRemoteState()
        .then((remoteState) => {
          if (!mounted || !remoteState) return
          const normalized = normalizeState(remoteState)
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
          setState(normalized)
        })
        .catch(() => {})
    }
    refreshRemote()
    const remoteInterval = window.setInterval(refreshRemote, 1200)

    return () => {
      mounted = false
      window.removeEventListener(CHANNEL_KEY, handleLocal)
      window.removeEventListener('storage', handleStorage)
      window.clearInterval(remoteInterval)
      channel?.close()
    }
  }, [])

  const update = (producer) => {
    const current = readState()
    const next = producer(current)
    writeState(next)
    pushRemoteState(next)
    setState(next)
  }

  const project = state.projects.find((item) => item.id === projectId) || null
  const sow = state.sows[projectId] || null
  const projectActivity = (state.activity || []).filter((item) => item.projectId === projectId)
  const projectMemberships = (state.memberships || []).filter((membership) => membership.projectId === projectId)
  const projectFinanceInvoices = (state.financeInvoices || []).filter((invoice) => invoice.projectId === projectId)
  const projectFinanceExpenses = (state.financeExpenses || []).filter((expense) => expense.projectId === projectId)
  const projectBoqMeta = state.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]
  const projectBoqRooms = (state.boqRooms || []).filter((room) => room.projectId === projectId)
  const projectBoqItems = (state.boqItems || []).filter((item) => item.projectId === projectId)
  const projectTasks = (state.projectTasks || []).filter((task) => task.projectId === projectId)
  const projectTaskApprovals = (state.taskApprovals || []).filter((approval) => approval.projectId === projectId)
  const projectSiteDiaryEntries = (state.siteDiaryEntries || []).filter((entry) => entry.projectId === projectId)
  const projectSiteDiaryIssues = (state.siteDiaryIssues || []).filter((issue) => issue.projectId === projectId)
  const projectSiteDiaryReferences = (state.siteDiaryReferences || []).filter((reference) => reference.projectId === projectId)
  const projectTimelinePhases = (state.timelinePhases || []).filter((phase) => phase.projectId === projectId)
  const membershipsWithUsers = projectMemberships.map((membership) => {
    const user = (state.users || []).find((item) => item.id === membership.userId)
    const role = roleTemplates.find((item) => item.id === membership.roleId)
    return {
      ...membership,
      user,
      role,
      grants: membership.grants || role?.grants || [],
    }
  })
  const activeViewerMembership = membershipsWithUsers.find((membership) => membership.roleId === (state.activeViewerRoleId || 'principal-pro'))
    || membershipsWithUsers.find((membership) => membership.roleId === 'principal-pro')
    || membershipsWithUsers[0]
  const activeViewerRole = activeViewerMembership?.role || roleTemplates.find((item) => item.id === (state.activeViewerRoleId || 'principal-pro')) || roleTemplates[0]
  const activeViewerGrants = activeViewerMembership?.grants || activeViewerRole?.grants || []
  const permissions = buildViewerPermissions({
    roleId: activeViewerRole?.id || 'principal-pro',
    grants: activeViewerGrants,
  })

  const actions = {
    resetDemo: () => {
      writeState(mockInitialState)
      pushRemoteState(mockInitialState)
      setState(mockInitialState)
    },
    resetToEmpty: () => {
      const emptyState = {
        ...mockInitialState,
        projects: [],
        memberships: [],
        sows: {},
        archiveItems: [],
        financeInvoices: [],
        financeExpenses: [],
        boqRooms: [],
        boqItems: [],
        projectTasks: [],
        taskApprovals: [],
        siteDiaryEntries: [],
        siteDiaryIssues: [],
        siteDiaryReferences: [],
        timelinePhases: [],
        activeProjectId: null,
      }
      writeState(emptyState)
      pushRemoteState(emptyState)
      setState(emptyState)
    },
    createProject: (projectForm) => update((current) => {
      const newProjectId = projectForm.id || `p-${Date.now()}`
      const clientVal = (projectForm.client || '').trim()
      const newProject = {
        id: newProjectId,
        name: `${clientVal}'s Home Renovation`,
        client: clientVal,
        clientName: clientVal,
        homeownerName: clientVal,
        designerName: 'Riya Desai', // principal designer
        location: (projectForm.location || '').trim() || 'Mumbai',
        scope: (projectForm.scope || '').trim(),
        status: projectForm.status || 'Active',
        progress: projectForm.status === 'Done' ? 100 : projectForm.status === 'Pending' ? 20 : 10,
        kickoffDate: new Date().toISOString().slice(0, 10),
        budgetL: Number(projectForm.budgetL || 0),
        spentL: 0,
        receivedL: 0,
        dueDate: projectForm.dueDate ? new Date(projectForm.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD',
        avatar: '/hynt-home/pro-2.png',
        phone: (projectForm.phone || '').trim() || '+91 98765 43210',
        email: (projectForm.email || '').trim() || `${clientVal.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        alerts: [],
      }

      // Add default memberships
      const nextMemberships = [
        ...(current.memberships || []),
        { id: `m-pro-${newProjectId}`, projectId: newProjectId, userId: 'u-pro-1', roleId: 'principal-pro', status: 'accepted', grants: ['all'] },
        { id: `m-client-${newProjectId}`, projectId: newProjectId, userId: 'u-client-1', roleId: 'homeowner', status: 'accepted', grants: ['sow.review', 'tasks.client.view', 'archive.client.view', 'finance.client.view'] },
        { id: `m-junior-${newProjectId}`, projectId: newProjectId, userId: 'u-junior-1', roleId: 'junior-designer', status: 'accepted', grants: ['sow.view', 'tasks.update', 'archive.create', 'moodboard.create', 'finance.expense.create'] },
        { id: `m-site-${newProjectId}`, projectId: newProjectId, userId: 'u-site-1', roleId: 'site-supervisor', status: 'accepted', grants: ['tasks.update', 'siteDiary.create', 'archive.upload', 'boq.measurements.view'] },
      ]

      // Initialize empty/default data for folders
      const nextArchiveFolders = [
        ...(current.archiveFolders || []),
        { id: `af-moodboard-${newProjectId}`, projectId: newProjectId, name: 'Moodboard', type: 'moodboard', visibility: 'client-shared', editAccess: 'team-can-add' },
        { id: `af-sketches-${newProjectId}`, projectId: newProjectId, name: 'Sketches', type: 'sketches', visibility: 'team-only', editAccess: 'pro-only' },
        { id: `af-renders-${newProjectId}`, projectId: newProjectId, name: 'Renders', type: 'renders', visibility: 'client-shared', editAccess: 'team-can-add' },
      ]

      const nextBoqMeta = {
        ...(current.boqMeta || {}),
        [newProjectId]: {
          status: 'draft',
          version: 1,
          gstEnabled: true,
          importFileName: null,
          pendingImportRows: [],
          importedAt: null,
          clientFeedback: null,
          financeScheduleMode: 'auto',
          financeScheduleCreated: false,
          approvedAt: null,
          history: [],
        }
      }

      const defaultPhases = [
        {
          id: `phase-1-${newProjectId}`,
          projectId: newProjectId,
          name: 'Kickoff & Site Visit',
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          status: 'done',
          progress: 100,
          assignedTo: ['Riya Desai'],
          note: 'Kickoff meeting and site measurements completed.',
          clientNotified: false,
          delay: null,
        },
        {
          id: `phase-2-${newProjectId}`,
          projectId: newProjectId,
          name: 'Design & Approvals',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          status: 'active',
          progress: 30,
          assignedTo: ['Riya Desai', 'Aanya Rao'],
          note: 'Space planning and concept designs in progress.',
          clientNotified: false,
          delay: null,
        },
        {
          id: `phase-3-${newProjectId}`,
          projectId: newProjectId,
          name: 'Civil & Services',
          startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          endDate: new Date(Date.now() + 88 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          status: 'upcoming',
          progress: 0,
          assignedTo: ['Nisha Reddy'],
          note: 'Civil alterations, electrical, and plumbing execution.',
          clientNotified: false,
          delay: null,
        },
        {
          id: `phase-4-${newProjectId}`,
          projectId: newProjectId,
          name: 'Handover & Snagging',
          startDate: new Date(Date.now() + 88 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          endDate: new Date(Date.now() + 103 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          status: 'upcoming',
          progress: 0,
          assignedTo: ['Riya Desai'],
          note: 'Final walkthrough, cleaning, and keys handover.',
          clientNotified: false,
          delay: null,
        }
      ]

      const nextState = {
        ...current,
        projects: [...(current.projects || []), newProject],
        memberships: nextMemberships,
        archiveFolders: nextArchiveFolders,
        boqMeta: nextBoqMeta,
        timelinePhases: [...(current.timelinePhases || []), ...defaultPhases],
        activeProjectId: newProjectId,
      }

      return addActivity(nextState, newProjectId, 'Riya Desai', `Created a new project for ${projectForm.client.trim()}`)
    }),
    setActiveProjectId: (id) => update((current) => ({
      ...current,
      activeProjectId: id,
    })),
    createSow: (templateId) => update((current) => {
      const currentProject = current.projects.find((item) => item.id === projectId) || demoProject
      const draft = createSowDraft(currentProject, templateId)
      return addActivity({
        ...current,
        sows: { ...current.sows, [projectId]: draft },
      }, projectId, currentProject.designerName, `Created a ${templateId === 'custom' ? 'custom' : 'template'} SOW draft`)
    }),
    updateSowDocument: (patch) => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      return {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: {
            ...existing,
            document: { ...existing.document, ...patch },
            updatedAt: nowIso(),
          },
        },
      }
    }),
    updateRoomScope: (roomId, scope) => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      return {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: {
            ...existing,
            updatedAt: nowIso(),
            document: {
              ...existing.document,
              rooms: existing.document.rooms.map((room) => (
                room.id === roomId ? { ...room, scope } : room
              )),
            },
          },
        },
      }
    }),
    applyGeneratedSowDocument: (documentPatch, source = 'AI updated the SOW draft') => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      const next = {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: {
            ...existing,
            document: cloneSowDocument(documentPatch),
            aiGeneratedAt: nowIso(),
            updatedAt: nowIso(),
          },
        },
      }
      return addActivity(next, projectId, project.designerName, source)
    }),
    signDesigner: () => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      const next = {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: { ...existing, designerSigned: true, designerSignedAt: nowIso(), updatedAt: nowIso() },
        },
      }
      return addActivity(next, projectId, project.designerName, 'Signed the SOW on the professional side')
    }),
    sendSow: () => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      const next = {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: {
            ...existing,
            status: 'client-review',
            sentAt: nowIso(),
            updatedAt: nowIso(),
          },
        },
      }
      return addActivity(next, projectId, project.designerName, `Sent SOW revision ${existing.revision} to homeowner`)
    }),
    addClientRemark: (sectionKey, sectionTitle, body, targetId = null) => update((current) => {
      const existing = current.sows[projectId]
      const cleanBody = body.trim()
      if (!existing || !cleanBody) return current
      const nextRemark = {
        id: makeId('remark'),
        sectionKey,
        sectionTitle,
        targetId,
        body: cleanBody,
        status: 'open',
        createdBy: project.homeownerName,
        createdAt: nowIso(),
      }
      const next = {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: {
            ...existing,
            status: 'remarks',
            remarks: [...existing.remarks, nextRemark],
            updatedAt: nowIso(),
          },
        },
      }
      return addActivity(next, projectId, project.homeownerName, `Added a remark on ${sectionTitle}`)
    }),
    respondToRemark: (remarkId, decision, responseText) => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      const nextRemarks = existing.remarks.map((remark) => (
        remark.id === remarkId ? { ...remark, status: decision === 'approve' ? 'accepted' : 'rejected' } : remark
      ))
      const remainingOpen = nextRemarks.filter((remark) => remark.status === 'open').length
      const nextSow = {
        ...existing,
        status: remainingOpen ? 'remarks' : 'revision-ready',
        revision: remainingOpen ? existing.revision : existing.revision + 1,
        updatedAt: nowIso(),
        remarks: nextRemarks,
        responses: [
          ...existing.responses,
          {
            id: makeId('response'),
            remarkId,
            decision,
            body: responseText,
            createdBy: project.designerName,
            createdAt: nowIso(),
          },
        ],
      }
      const next = {
        ...current,
        sows: { ...current.sows, [projectId]: nextSow },
      }
      return addActivity(next, projectId, project.designerName, `${decision === 'approve' ? 'Accepted' : 'Rejected'} a homeowner remark`)
    }),
    clientSignSow: () => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      const next = {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: {
            ...existing,
            status: 'executed',
            clientSigned: true,
            clientSignedAt: nowIso(),
            updatedAt: nowIso(),
          },
        },
      }
      return addActivity(next, projectId, project.homeownerName, 'Approved and signed the SOW')
    }),
    createSowAmendment: (payload = {}) => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      const cleanValue = payload.newValue?.trim()
      const cleanReason = payload.reason?.trim()
      if (!cleanValue || !cleanReason) return current
      const amendment = {
        id: makeId('amend'),
        version: (existing.amendments || []).length + 1,
        sectionKey: payload.sectionKey || 'terms',
        sectionTitle: payload.sectionTitle || 'Amendment',
        targetId: payload.targetId || null,
        patch: payload.patch || null,
        oldValue: payload.oldValue || '',
        newValue: cleanValue,
        reason: cleanReason,
        status: 'pending',
        responseText: '',
        createdBy: project.designerName,
        createdAt: nowIso(),
        approvedAt: null,
        rejectedAt: null,
      }
      const next = {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: {
            ...existing,
            amendments: [amendment, ...(existing.amendments || [])],
            updatedAt: nowIso(),
          },
        },
      }
      return addActivity(next, projectId, project.designerName, `Raised amendment ${amendment.version} for homeowner approval`)
    }),
    approveSowAmendment: (amendmentId) => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      const target = (existing.amendments || []).find((amendment) => amendment.id === amendmentId)
      if (!target) return current
      const nextDocument = applySowAmendmentPatchToDocument(existing.document, target)
      const next = {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: {
            ...existing,
            revision: existing.revision + 1,
            document: nextDocument,
            updatedAt: nowIso(),
            amendments: (existing.amendments || []).map((amendment) => (
              amendment.id === amendmentId
                ? { ...amendment, status: 'approved', approvedAt: nowIso(), responseText: 'Approved by homeowner' }
                : amendment
            )),
          },
        },
      }
      return addActivity(next, projectId, project.homeownerName, `Approved amendment ${target.version}`)
    }),
    rejectSowAmendment: (amendmentId, responseText = '') => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      const target = (existing.amendments || []).find((amendment) => amendment.id === amendmentId)
      if (!target) return current
      const next = {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: {
            ...existing,
            updatedAt: nowIso(),
            amendments: (existing.amendments || []).map((amendment) => (
              amendment.id === amendmentId
                ? { ...amendment, status: 'rejected', rejectedAt: nowIso(), responseText: responseText.trim() || 'Not approved by homeowner' }
                : amendment
            )),
          },
        },
      }
      return addActivity(next, projectId, project.homeownerName, `Rejected amendment ${target.version}`)
    }),
    createInvite: ({ phone, roleId, roleLabel = '', grants }) => update((current) => {
      const cleanPhone = phone.trim()
      if (!cleanPhone) return current
      const inviteId = makeId('inv')
      const invite = {
        id: inviteId,
        projectId,
        phone: cleanPhone,
        roleId,
        roleLabel: roleLabel.trim() || roleTemplates.find((role) => role.id === roleId)?.label || 'Team member',
        grants,
        status: 'pending',
        inviteUrl: `https://hynt.local/invite/${inviteId}`,
        createdAt: nowIso(),
      }
      const next = {
        ...current,
        invites: [invite, ...(current.invites || [])],
      }
      return addActivity(next, projectId, project.designerName, `Invited ${cleanPhone} as ${invite.roleLabel}`)
    }),
    acceptInvite: (inviteId) => update((current) => {
      const invite = (current.invites || []).find((item) => item.id === inviteId)
      if (!invite) return current
      const userId = makeId('u')
      const role = roleTemplates.find((item) => item.id === invite.roleId)
      const user = {
        id: userId,
        name: `Invited ${invite.phone.slice(-4)}`,
        role: invite.roleLabel || role?.label || 'Team member',
        phone: invite.phone,
        avatar: '/hynt-home/pro-2.png',
      }
      const next = {
        ...current,
        users: [user, ...(current.users || [])],
        memberships: [
          {
            id: makeId('m'),
            projectId,
            userId,
            roleId: invite.roleId,
            roleLabel: invite.roleLabel || role?.label || 'Team member',
            status: 'accepted',
            grants: invite.grants || role?.grants || [],
          },
          ...(current.memberships || []),
        ],
        invites: current.invites.map((item) => (
          item.id === inviteId ? { ...item, status: 'accepted' } : item
        )),
      }
      return addActivity(next, projectId, project.designerName, `${invite.phone} accepted the project invite`)
    }),
    cancelInvite: (inviteId) => update((current) => ({
      ...current,
      invites: (current.invites || []).filter((invite) => invite.id !== inviteId),
    })),
    updateMembershipRole: (membershipId, roleId) => update((current) => {
      const role = roleTemplates.find((item) => item.id === roleId)
      return addActivity({
        ...current,
        memberships: (current.memberships || []).map((membership) => (
          membership.id === membershipId
            ? { ...membership, roleId, roleLabel: role?.label || 'Custom role', grants: role?.grants || [] }
            : membership
        )),
      }, projectId, project.designerName, `Updated access role to ${role?.label || 'custom role'}`)
    }),
    toggleMembershipGrant: (membershipId, grant) => update((current) => ({
      ...current,
      memberships: (current.memberships || []).map((membership) => {
        if (membership.id !== membershipId) return membership
        const grants = membership.grants || roleTemplates.find((role) => role.id === membership.roleId)?.grants || []
        if (grants.includes('all')) return membership
        return {
          ...membership,
          grants: grants.includes(grant)
            ? grants.filter((item) => item !== grant)
            : [...grants, grant],
        }
      }),
    })),
    setActiveViewerRole: (roleId) => update((current) => ({
      ...current,
      activeViewerRoleId: roleId,
    })),
    createArchiveFolder: (name) => update((current) => {
      const cleanName = name.trim()
      if (!cleanName) return current
      const folder = {
        id: makeId('af'),
        projectId,
        name: cleanName,
        type: 'custom',
        visibility: 'team-only',
        editAccess: 'pro-only',
      }
      const next = {
        ...current,
        archiveFolders: [folder, ...(current.archiveFolders || [])],
      }
      return addActivity(next, projectId, project.designerName, `Created archive folder: ${cleanName}`)
    }),
    updateArchiveFolderVisibility: (folderId, visibility) => update((current) => {
      const next = {
        ...current,
        archiveFolders: (current.archiveFolders || []).map((folder) => (
          folder.id === folderId ? { ...folder, visibility } : folder
        )),
        archiveItems: (current.archiveItems || []).map((item) => {
          if (item.folderId !== folderId) return item
          if (visibility === 'client-shared' && item.status === 'internal') {
            return { ...item, status: 'pending' }
          }
          if (visibility !== 'client-shared' && ['pending', 'approved', 'rejected'].includes(item.status)) {
            return { ...item, status: 'internal' }
          }
          return item
        }),
      }
      return addActivity(next, projectId, project.designerName, 'Updated archive folder visibility')
    }),
    updateArchiveFolderEditAccess: (folderId, editAccess) => update((current) => {
      const next = {
        ...current,
        archiveFolders: (current.archiveFolders || []).map((folder) => (
          folder.id === folderId ? { ...folder, editAccess } : folder
        )),
      }
      return addActivity(next, projectId, project.designerName, 'Updated archive folder contribution access')
    }),
    addArchiveItem: (folderId, title, src = null) => update((current) => {
      const cleanTitle = title.trim()
      if (!cleanTitle) return current
      const folder = (current.archiveFolders || []).find((item) => item.id === folderId)
      const item = {
        id: makeId('ai'),
        projectId,
        folderId,
        title: cleanTitle,
        type: src ? 'image' : (folder?.type === 'moodboard' || folder?.type === 'renders' || folder?.type === 'sketches' ? 'image' : 'note'),
        src: src || (folder?.type === 'moodboard' || folder?.type === 'renders' || folder?.type === 'sketches' ? '/hynt-home/idea-1.png' : null),
        status: folder?.visibility === 'client-shared' ? 'pending' : 'internal',
        linkedTo: 'Unlinked',
        comments: [],
      }
      const next = {
        ...current,
        archiveItems: [item, ...(current.archiveItems || [])],
      }
      return addActivity(next, projectId, project.designerName, `Added archive item: ${cleanTitle}`)
    }),
    setArchiveItemStatus: (itemId, status) => update((current) => {
      const next = {
        ...current,
        archiveItems: (current.archiveItems || []).map((item) => (
          item.id === itemId ? { ...item, status } : item
        )),
      }
      return addActivity(next, projectId, project.homeownerName, `Marked archive item ${status}`)
    }),
    addArchiveComment: (itemId, comment, sender = 'homeowner', senderName = null) => update((current) => {
      const cleanComment = comment.trim()
      if (!cleanComment) return current
      const name = senderName || (sender === 'homeowner' ? project.homeownerName : project.designerName)
      const commentObj = {
        sender,
        senderName: name,
        text: cleanComment,
        sentAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      }
      const next = {
        ...current,
        archiveItems: (current.archiveItems || []).map((item) => (
          item.id === itemId ? { ...item, comments: [...(item.comments || []), commentObj] } : item
        )),
      }
      return addActivity(next, projectId, sender === 'homeowner' ? project.homeownerName : project.designerName, `Commented on archive item`)
    }),
    payFinanceInvoice: (invoiceId, method = 'UPI') => update((current) => {
      const invoice = (current.financeInvoices || []).find((item) => item.id === invoiceId)
      if (!invoice) return current
      const next = {
        ...current,
        financeInvoices: (current.financeInvoices || []).map((item) => (
          item.id === invoiceId
            ? {
              ...item,
              status: 'paid',
              paidAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              method,
              transactionId: `RZP-${Date.now().toString().slice(-6)}`,
            }
            : item
        )),
      }
      return addActivity(next, projectId, project.homeownerName, `Paid ${invoice.number} via ${method}`)
    }),
    createFinanceInvoice: (payload = {}) => update((current) => {
      const title = payload.title?.trim()
      const amountL = Number.parseFloat(payload.amountL)
      if (!title || !Number.isFinite(amountL) || amountL <= 0) return current
      const projectInvoices = (current.financeInvoices || []).filter((invoice) => invoice.projectId === projectId)
      const nextNumber = `INV-${String(projectInvoices.length + 1).padStart(3, '0')}`
      const invoice = {
        id: makeId('fi'),
        projectId,
        number: nextNumber,
        title,
        stageLabel: payload.stageLabel?.trim() || title,
        summary: payload.summary?.trim() || 'Custom invoice created from the finance workspace.',
        amountL,
        status: payload.status || 'due',
        dueDate: payload.dueDate?.trim() || 'TBD',
        issuedAt: payload.issuedAt || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        paidAt: null,
        method: null,
        transactionId: null,
        clientNote: payload.clientNote?.trim() || '',
        reminderCount: 0,
        lastReminderAt: null,
      }
      const next = {
        ...current,
        financeInvoices: [...(current.financeInvoices || []), invoice],
      }
      return addActivity(next, projectId, project.designerName, `Created invoice ${invoice.number}`)
    }),
    updateFinanceInvoice: (invoiceId, patch = {}) => update((current) => {
      const target = (current.financeInvoices || []).find((invoice) => invoice.id === invoiceId)
      if (!target) return current
      const next = {
        ...current,
        financeInvoices: (current.financeInvoices || []).map((invoice) => (
          invoice.id === invoiceId ? { ...invoice, ...patch } : invoice
        )),
      }
      return addActivity(next, projectId, project.designerName, `Updated invoice ${target.number}`)
    }),
    recordFinancePayment: (invoiceId, payment = {}) => update((current) => {
      const target = (current.financeInvoices || []).find((invoice) => invoice.id === invoiceId)
      if (!target) return current
      const paidAt = payment.paidAt || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      const next = {
        ...current,
        financeInvoices: (current.financeInvoices || []).map((invoice) => (
          invoice.id === invoiceId
            ? {
              ...invoice,
              status: 'paid',
              paidAt,
              issuedAt: invoice.issuedAt || paidAt,
              method: payment.method || invoice.method || 'NEFT',
              transactionId: payment.transactionId?.trim() || invoice.transactionId || `REC-${Date.now().toString().slice(-6)}`,
            }
            : invoice
        )),
      }
      return addActivity(next, projectId, project.designerName, `Recorded payment for ${target.number}`)
    }),
    sendFinanceReminder: (invoiceId) => update((current) => {
      const target = (current.financeInvoices || []).find((invoice) => invoice.id === invoiceId)
      if (!target) return current
      const reminderDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      const next = {
        ...current,
        financeInvoices: (current.financeInvoices || []).map((invoice) => (
          invoice.id === invoiceId
            ? { ...invoice, reminderCount: (invoice.reminderCount || 0) + 1, lastReminderAt: reminderDate }
            : invoice
        )),
      }
      return addActivity(next, projectId, project.designerName, `Sent a payment reminder for ${target.number}`)
    }),
    addFinanceExpense: (payload = {}) => update((current) => {
      const title = payload.title?.trim()
      const amount = Number.parseFloat(payload.amount)
      if (!title || !Number.isFinite(amount) || amount <= 0) return current
      const expense = {
        id: makeId('fexp'),
        projectId,
        category: payload.category || 'Miscellaneous',
        title,
        amount,
        expenseDate: payload.expenseDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        payee: payload.payee?.trim() || '',
        mode: payload.mode || 'Cash',
        gstRate: Number.isFinite(Number(payload.gstRate)) ? Number(payload.gstRate) : 0,
        hasBill: Boolean(payload.hasBill),
        note: payload.note?.trim() || '',
        submittedBy: payload.submittedBy || project.designerName,
      }
      const next = {
        ...current,
        financeExpenses: [expense, ...(current.financeExpenses || [])],
      }
      return addActivity(next, projectId, project.designerName, `Logged expense: ${expense.title}`)
    }),
    addBoqRoom: (payload = {}) => update((current) => {
      const name = payload.name?.trim()
      if (!name) return current
      const projectRooms = (current.boqRooms || []).filter((room) => room.projectId === projectId)
      const room = {
        id: makeId('boq-room'),
        projectId,
        name,
        note: payload.note?.trim() || '',
        order: projectRooms.length,
      }
      const next = {
        ...current,
        boqRooms: [...(current.boqRooms || []), room],
      }
      return addActivity(next, projectId, project.designerName, `Added room BOQ: ${room.name}`)
    }),
    duplicateBoqRoom: (roomId) => update((current) => {
      const targetRoom = (current.boqRooms || []).find((room) => room.id === roomId)
      if (!targetRoom) return current
      const projectRooms = (current.boqRooms || []).filter((room) => room.projectId === projectId)
      const duplicateRoomId = makeId('boq-room')
      const duplicateRoom = {
        ...targetRoom,
        id: duplicateRoomId,
        name: `${targetRoom.name} Copy`,
        order: projectRooms.length,
      }
      const duplicatedItems = (current.boqItems || [])
        .filter((item) => item.projectId === projectId && item.roomId === roomId)
        .map((item) => ({
          ...cloneBoqItemSnapshot(item),
          id: makeId('boq'),
          roomId: duplicateRoomId,
          space: duplicateRoom.name,
          clientQuestions: [],
        }))
      const next = {
        ...current,
        boqRooms: [...(current.boqRooms || []), duplicateRoom],
        boqItems: [...duplicatedItems, ...(current.boqItems || [])],
      }
      return addActivity(next, projectId, project.designerName, `Duplicated room BOQ: ${targetRoom.name}`)
    }),
    moveBoqRoom: (roomId, direction) => update((current) => {
      const projectRooms = (current.boqRooms || [])
        .filter((room) => room.projectId === projectId)
        .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
      const currentIndex = projectRooms.findIndex((room) => room.id === roomId)
      if (currentIndex === -1) return current
      const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (nextIndex < 0 || nextIndex >= projectRooms.length) return current
      const reordered = [...projectRooms]
      const [movedRoom] = reordered.splice(currentIndex, 1)
      reordered.splice(nextIndex, 0, movedRoom)
      const reorderedWithOrder = reordered.map((room, index) => ({ ...room, order: index }))
      const otherRooms = (current.boqRooms || []).filter((room) => room.projectId !== projectId)
      const next = {
        ...current,
        boqRooms: [...otherRooms, ...reorderedWithOrder],
      }
      return addActivity(next, projectId, project.designerName, `Reordered room BOQ: ${movedRoom.name}`)
    }),
    addBoqItem: (payload = {}) => update((current) => {
      const matchedRoom = (current.boqRooms || []).find((room) => room.id === payload.roomId)
      const roomName = matchedRoom?.name || payload.space || 'General'
      const nextItem = {
        id: makeId('boq'),
        projectId,
        roomId: matchedRoom?.id || payload.roomId || toBoqRoomId(roomName),
        space: roomName,
        category: payload.category || 'General',
        item: payload.item || 'New line item',
        quantity: payload.quantity ?? payload.area ?? 1,
        area: payload.area ?? 1,
        rate: payload.rate ?? 1000,
        unit: payload.unit || 'unit',
        vendor: payload.vendor || '',
        vendorQuantity: payload.vendorQuantity ?? payload.quantity ?? payload.area ?? 1,
        vendorUnit: payload.vendorUnit || payload.unit || 'unit',
        vendorRate: payload.vendorRate ?? payload.rate ?? 1000,
        markupPercent: payload.markupPercent ?? 0,
        type: payload.type || 'Custom',
        notes: payload.notes || '',
        clientQuestions: [],
      }
      const next = {
        ...current,
        boqItems: [nextItem, ...(current.boqItems || [])],
      }
      return addActivity(next, projectId, project.designerName, `Added BOQ line item: ${nextItem.item}`)
    }),
    updateBoqRoom: (roomId, patch = {}) => update((current) => {
      const targetRoom = (current.boqRooms || []).find((room) => room.id === roomId)
      if (!targetRoom) return current
      const nextName = patch.name?.trim() || targetRoom.name
      const nextRoom = {
        ...targetRoom,
        ...patch,
        name: nextName,
        note: typeof patch.note === 'string' ? patch.note.trim() : targetRoom.note,
      }
      const next = {
        ...current,
        boqRooms: (current.boqRooms || []).map((room) => (
          room.id === roomId ? nextRoom : room
        )),
        boqItems: (current.boqItems || []).map((item) => (
          item.roomId === roomId ? { ...item, space: nextName } : item
        )),
      }
      return addActivity(next, projectId, project.designerName, `Updated room BOQ: ${nextName}`)
    }),
    updateBoqItem: (itemId, patch = {}) => update((current) => {
      const nextRoom = patch.roomId
        ? (current.boqRooms || []).find((room) => room.id === patch.roomId)
        : null
      const next = {
        ...current,
        boqItems: (current.boqItems || []).map((item) => (
          item.id === itemId
            ? {
                ...item,
                ...patch,
                roomId: nextRoom?.id || patch.roomId || item.roomId,
                space: nextRoom?.name || patch.space || item.space,
              }
            : item
        )),
      }
      return addActivity(next, projectId, project.designerName, 'Updated a BOQ line item')
    }),
    deleteBoqItem: (itemId) => update((current) => {
      const targetItem = (current.boqItems || []).find((item) => item.id === itemId && item.projectId === projectId)
      if (!targetItem) return current
      const next = {
        ...current,
        boqItems: (current.boqItems || []).filter((item) => item.id !== itemId),
      }
      return addActivity(next, projectId, project.designerName, `Deleted BOQ line item: ${targetItem.item}`)
    }),
    stageBoqImport: ({ fileName = 'BOQ_Sharma_v2.xlsx', rows = boqImportPreviewRows } = {}) => update((current) => ({
      ...current,
      boqMeta: {
        ...(current.boqMeta || {}),
        [projectId]: {
          ...(current.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]),
          importFileName: fileName,
          pendingImportRows: rows,
        },
      },
    })),
    clearBoqImport: () => update((current) => ({
      ...current,
      boqMeta: {
        ...(current.boqMeta || {}),
        [projectId]: {
          ...(current.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]),
          importFileName: null,
          pendingImportRows: [],
        },
      },
    })),
    confirmBoqImport: () => update((current) => {
      const meta = current.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]
      const rows = meta.pendingImportRows || []
      if (!rows.length) return current
      const nextVersion = meta.status === 'approved' ? (meta.version || 1) + 1 : (meta.version || 1)
      const importedRooms = getUniqueBoqRoomsFromItems(rows.map((row) => ({
        projectId,
        roomId: toBoqRoomId(row.space),
        space: row.space,
      })), projectId)
      const nextItems = rows.map((row) => ({
        id: makeId('boq'),
        projectId,
        roomId: toBoqRoomId(row.space),
        space: row.space,
        category: row.category,
        item: row.item,
        quantity: row.quantity,
        area: row.quantity,
        rate: row.rate,
        unit: row.unit,
        vendor: row.vendor || '',
        vendorRate: row.vendorRate ?? row.rate,
        markupPercent: row.markupPercent ?? 0,
        type: 'Imported',
        notes: row.warning || '',
        clientQuestions: [],
      }))
      const next = {
        ...current,
        boqRooms: [
          ...(current.boqRooms || []).filter((room) => room.projectId !== projectId),
          ...importedRooms,
        ],
        boqItems: nextItems,
        boqMeta: {
          ...(current.boqMeta || {}),
          [projectId]: {
            ...meta,
            status: 'draft',
            version: nextVersion,
            importFileName: meta.importFileName,
            pendingImportRows: [],
            importedAt: nowIso(),
            approvedAt: null,
            clientFeedback: null,
            financeScheduleCreated: false,
          },
        },
      }
      return addActivity(next, projectId, project.designerName, `Imported ${nextItems.length} BOQ rows from Excel`)
    }),
    shareBoqQuotation: () => update((current) => {
      const meta = current.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]
      const next = {
        ...current,
        boqMeta: {
          ...(current.boqMeta || {}),
          [projectId]: {
            ...meta,
            status: 'shared',
            clientFeedback: null,
          },
        },
      }
      return addActivity(next, projectId, project.designerName, 'Shared BOQ quotation with homeowner')
    }),
    addBoqQuestion: (itemId, body) => update((current) => {
      const cleanBody = body.trim()
      if (!cleanBody) return current
      const next = {
        ...current,
        boqItems: (current.boqItems || []).map((item) => (
          item.id === itemId
            ? {
                ...item,
                clientQuestions: [
                  ...(item.clientQuestions || []),
                  {
                    id: makeId('boq-question'),
                    body: cleanBody,
                    createdBy: project.homeownerName,
                    createdAt: nowIso(),
                    status: 'open',
                    designerReply: '',
                    repliedAt: null,
                  },
                ],
              }
            : item
        )),
      }
      return addActivity(next, projectId, project.homeownerName, 'Asked a question on a BOQ line item')
    }),
    replyBoqQuestion: (itemId, questionId, body) => update((current) => {
      const cleanBody = body.trim()
      if (!cleanBody) return current
      const next = {
        ...current,
        boqItems: (current.boqItems || []).map((item) => (
          item.id === itemId
            ? {
                ...item,
                clientQuestions: (item.clientQuestions || []).map((question) => (
                  question.id === questionId
                    ? {
                        ...question,
                        designerReply: cleanBody,
                        repliedAt: nowIso(),
                      }
                    : question
                )),
              }
            : item
        )),
      }
      return addActivity(next, projectId, project.designerName, 'Replied to a BOQ line item remark')
    }),
    requestBoqChanges: (body) => update((current) => {
      const cleanBody = body.trim()
      if (!cleanBody) return current
      const meta = current.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]
      const next = {
        ...current,
        boqMeta: {
          ...(current.boqMeta || {}),
          [projectId]: {
            ...meta,
            status: 'changesRequested',
            clientFeedback: {
              body: cleanBody,
              createdAt: nowIso(),
              status: 'open',
            },
          },
        },
      }
      return addActivity(next, projectId, project.homeownerName, 'Requested changes on the quotation')
    }),
    requestBoqChangesFromQuestions: () => update((current) => {
      const openQuestions = (current.boqItems || [])
        .filter((item) => item.projectId === projectId)
        .flatMap((item) => (item.clientQuestions || [])
          .filter((question) => question.status !== 'resolved')
          .map((question) => `${item.space} / ${item.item}: ${question.body}`))
      if (!openQuestions.length) return current
      const meta = current.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]
      const next = {
        ...current,
        boqMeta: {
          ...(current.boqMeta || {}),
          [projectId]: {
            ...meta,
            status: 'changesRequested',
            clientFeedback: {
              body: openQuestions.join('\n'),
              createdAt: nowIso(),
              status: 'open',
            },
          },
        },
      }
      return addActivity(next, projectId, project.homeownerName, 'Sent marked BOQ particulars for revision')
    }),
    resubmitBoqQuotation: () => update((current) => {
      const meta = current.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]
      const next = {
        ...current,
        boqItems: (current.boqItems || []).map((item) => (
          item.projectId === projectId
            ? {
                ...item,
                clientQuestions: (item.clientQuestions || []).map((question) => ({
                  ...question,
                  status: 'resolved',
                })),
              }
            : item
        )),
        boqMeta: {
          ...(current.boqMeta || {}),
          [projectId]: {
            ...meta,
            status: 'revised',
            version: (meta.version || 1) + 1,
            approvedAt: null,
            clientFeedback: meta.clientFeedback
              ? { ...meta.clientFeedback, status: 'resolved' }
              : null,
          },
        },
      }
      return addActivity(next, projectId, project.designerName, 'Resubmitted the revised quotation')
    }),
    approveBoqQuotation: () => update((current) => {
      const meta = current.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]
      const approvedAt = nowIso()
      const projectItems = (current.boqItems || []).filter((item) => item.projectId === projectId)
      const nextHistoryEntry = buildBoqHistoryEntry({
        projectId,
        meta,
        items: projectItems,
        approvedAt,
      })
      const next = {
        ...current,
        boqMeta: {
          ...(current.boqMeta || {}),
          [projectId]: {
            ...meta,
            status: 'approved',
            approvedAt,
            history: upsertBoqHistoryEntry(meta.history || [], nextHistoryEntry),
          },
        },
      }
      return addActivity(next, projectId, project.homeownerName, 'Approved the BOQ quotation')
    }),
    createFinanceScheduleFromBoq: (mode = 'auto') => update((current) => {
      const meta = current.boqMeta?.[projectId] || mockInitialState.boqMeta[projectId]
      const projectItems = (current.boqItems || []).filter((item) => item.projectId === projectId)
      const totalAmount = projectItems.reduce((sum, item) => sum + getBoqItemAmount(item), 0)
      const totalL = totalAmount / 100000
      let nextInvoices = current.financeInvoices || []
      if (mode === 'auto') {
        const existingOtherProjectInvoices = (current.financeInvoices || []).filter((invoice) => invoice.projectId !== projectId)
        nextInvoices = [
          ...existingOtherProjectInvoices,
          {
            id: makeId('finv'),
            projectId,
            number: 'INV-BOQ-01',
            title: 'Advance',
            stageLabel: 'Advance',
            amountL: Number((totalL * 0.3).toFixed(1)),
            status: 'due',
            dueDate: '30 Oct 2026',
            issuedAt: '30 Oct 2026',
            summary: 'Created automatically from the approved BOQ and SOW billing structure.',
            clientNote: 'Advance against approved quotation.',
            reminderCount: 0,
            lastReminderAt: null,
          },
          {
            id: makeId('finv'),
            projectId,
            number: 'INV-BOQ-02',
            title: 'Milestone 1',
            stageLabel: 'Milestone 1',
            amountL: Number((totalL * 0.3).toFixed(1)),
            status: 'upcoming',
            dueDate: '18 Nov 2026',
            issuedAt: null,
            summary: 'Created automatically from the approved BOQ and SOW billing structure.',
            clientNote: '',
            reminderCount: 0,
            lastReminderAt: null,
          },
          {
            id: makeId('finv'),
            projectId,
            number: 'INV-BOQ-03',
            title: 'Milestone 2',
            stageLabel: 'Milestone 2',
            amountL: Number((totalL * 0.24).toFixed(1)),
            status: 'upcoming',
            dueDate: '05 Dec 2026',
            issuedAt: null,
            summary: 'Created automatically from the approved BOQ and SOW billing structure.',
            clientNote: '',
            reminderCount: 0,
            lastReminderAt: null,
          },
          {
            id: makeId('finv'),
            projectId,
            number: 'INV-BOQ-04',
            title: 'Final',
            stageLabel: 'Final',
            amountL: Number((totalL * 0.1).toFixed(1)),
            status: 'upcoming',
            dueDate: '20 Dec 2026',
            issuedAt: null,
            summary: 'Created automatically from the approved BOQ and SOW billing structure.',
            clientNote: '',
            reminderCount: 0,
            lastReminderAt: null,
          },
        ]
      }
      const next = {
        ...current,
        financeInvoices: nextInvoices,
        boqMeta: {
          ...(current.boqMeta || {}),
          [projectId]: {
            ...meta,
            financeScheduleMode: mode,
            financeScheduleCreated: true,
          },
        },
      }
      return addActivity(next, projectId, project.designerName, mode === 'auto' ? 'Created invoice schedule in Finance from the approved BOQ' : 'Marked BOQ as ready for manual invoice creation in Finance')
    }),
    setProjectTasks: (updater) => update((current) => {
      const currentProjectTasks = (current.projectTasks || []).filter((task) => task.projectId === projectId)
      const otherProjectTasks = (current.projectTasks || []).filter((task) => task.projectId !== projectId)
      const nextProjectTasks = typeof updater === 'function' ? updater(currentProjectTasks) : updater
      return {
        ...current,
        projectTasks: [
          ...(nextProjectTasks || []).map((task) => normalizeProjectTask(task, projectId)),
          ...otherProjectTasks,
        ],
      }
    }),
    setProjectTaskStepCompletion: (updater) => update((current) => ({
      ...current,
      taskStepCompletion: typeof updater === 'function'
        ? updater(current.taskStepCompletion || {})
        : (updater || {}),
    })),
    setProjectTaskApprovals: (updater) => update((current) => {
      const currentApprovals = (current.taskApprovals || []).filter((approval) => approval.projectId === projectId)
      const otherApprovals = (current.taskApprovals || []).filter((approval) => approval.projectId !== projectId)
      const nextApprovals = typeof updater === 'function' ? updater(currentApprovals) : updater
      return {
        ...current,
        taskApprovals: [
          ...(nextApprovals || []).map((approval) => normalizeTaskApproval(approval, projectId)),
          ...otherApprovals,
        ],
      }
    }),
    addSiteDiaryEntry: ({ id = null, note = '', photos = [], title = '', type = 'daily-log', weather = 'Indoor', workerCount = 0, tags = [], linkedTaskLabel = null, linkedExpenseLabel = null, issue = null, createdBy = project.designerName, shareWithClient = true }) => update((current) => {
      const cleanNote = note.trim()
      const cleanTitle = title.trim()
      if (!cleanNote && !cleanTitle && photos.length === 0) return current
      const entryId = id || makeId('diary')
      const cleanIssueTitle = issue?.title?.trim() || ''
      const issueId = cleanIssueTitle ? (issue.id || makeId('issue')) : null
      const entry = {
        id: entryId,
        projectId,
        createdAt: nowIso(),
        type,
        title: cleanTitle || 'Site update',
        createdBy,
        weather,
        workerCount,
        tags,
        note: cleanNote,
        photos,
        linkedTaskLabel,
        linkedExpenseLabel,
        issueId,
        clientComments: [],
        clientReviewedAt: null,
        shareWithClient,
      }
      const next = {
        ...current,
        siteDiaryEntries: [entry, ...(current.siteDiaryEntries || [])],
        siteDiaryIssues: issueId
          ? [{
              id: issueId,
              projectId,
              title: cleanIssueTitle,
              status: 'open',
              createdAt: nowIso(),
              reportedBy: createdBy,
              entryId,
              linkedTaskLabel: issue.linkedTaskLabel || linkedTaskLabel,
              note: issue.note?.trim() || '',
            }, ...(current.siteDiaryIssues || [])]
          : current.siteDiaryIssues,
      }
      return addActivity(next, projectId, project.designerName, 'Posted a new site diary update')
    }),
    updateSiteDiaryEntry: (entryId, patch) => update((current) => {
      const next = {
        ...current,
        siteDiaryEntries: (current.siteDiaryEntries || []).map((entry) => (
          entry.id === entryId
            ? {
                ...entry,
                ...patch,
                note: typeof patch.note === 'string' ? patch.note.trim() : entry.note,
              }
            : entry
        )),
      }
      return addActivity(next, projectId, project.designerName, 'Updated a site diary entry')
    }),
    deleteSiteDiaryEntry: (entryId) => update((current) => {
      const next = {
        ...current,
        siteDiaryEntries: (current.siteDiaryEntries || []).filter((entry) => entry.id !== entryId),
      }
      return addActivity(next, projectId, project.designerName, 'Deleted a site diary entry')
    }),
    addSiteDiaryComment: (entryId, body) => update((current) => {
      const cleanBody = body.trim()
      if (!cleanBody) return current
      const next = {
        ...current,
        siteDiaryEntries: (current.siteDiaryEntries || []).map((entry) => (
          entry.id === entryId
            ? {
                ...entry,
                clientComments: [
                  ...(entry.clientComments || []),
                  {
                    id: makeId('diary-comment'),
                    body: cleanBody,
                    createdBy: project.homeownerName,
                    createdAt: nowIso(),
                    designerReply: '',
                    repliedAt: null,
                  },
                ],
              }
            : entry
        )),
      }
      return addActivity(next, projectId, project.homeownerName, 'Commented on a site diary update')
    }),
    replyToSiteDiaryComment: (entryId, commentId, reply) => update((current) => {
      const cleanReply = reply.trim()
      if (!cleanReply) return current
      const next = {
        ...current,
        siteDiaryEntries: (current.siteDiaryEntries || []).map((entry) => (
          entry.id === entryId
            ? {
                ...entry,
                clientComments: (entry.clientComments || []).map((comment) => (
                  comment.id === commentId
                    ? { ...comment, designerReply: cleanReply, repliedAt: nowIso() }
                    : comment
                )),
              }
            : entry
        )),
      }
      return addActivity(next, projectId, project.designerName, 'Replied to a homeowner site diary question')
    }),
    addSiteDiaryIssue: ({ title = '', note = '', entryId = null, linkedTaskLabel = null, reportedBy = project.designerName }) => update((current) => {
      const cleanTitle = title.trim()
      if (!cleanTitle) return current
      const issue = {
        id: makeId('issue'),
        projectId,
        title: cleanTitle,
        status: 'open',
        createdAt: nowIso(),
        reportedBy,
        entryId,
        linkedTaskLabel,
        note: note.trim(),
      }
      const next = {
        ...current,
        siteDiaryIssues: [issue, ...(current.siteDiaryIssues || [])],
      }
      return addActivity(next, projectId, project.designerName, `Logged site issue: ${issue.title}`)
    }),
    updateSiteDiaryIssueStatus: (issueId, status) => update((current) => {
      const next = {
        ...current,
        siteDiaryIssues: (current.siteDiaryIssues || []).map((issue) => (
          issue.id === issueId ? { ...issue, status } : issue
        )),
      }
      return addActivity(next, projectId, project.designerName, `Updated site issue to ${status}`)
    }),
    addSiteDiaryReference: ({ title = '', note = '', image = '/hynt-home/idea-1.png' }) => update((current) => {
      const cleanTitle = title.trim()
      const cleanNote = note.trim()
      if (!cleanTitle && !cleanNote) return current
      const reference = {
        id: makeId('ref'),
        projectId,
        title: cleanTitle || 'New reference',
        image,
        note: cleanNote,
        createdAt: nowIso(),
        createdBy: project.homeownerName,
        status: 'new',
        designerReply: '',
      }
      const next = {
        ...current,
        siteDiaryReferences: [reference, ...(current.siteDiaryReferences || [])],
      }
      return addActivity(next, projectId, project.homeownerName, 'Shared a site diary reference')
    }),
    replyToSiteDiaryReference: (referenceId, reply) => update((current) => {
      const cleanReply = reply.trim()
      if (!cleanReply) return current
      const next = {
        ...current,
        siteDiaryReferences: (current.siteDiaryReferences || []).map((reference) => (
          reference.id === referenceId ? { ...reference, designerReply: cleanReply, status: 'reviewed' } : reference
        )),
      }
      return addActivity(next, projectId, project.designerName, 'Replied to a homeowner reference')
    }),
    toggleSiteDiaryReviewed: (entryId) => update((current) => {
      const target = (current.siteDiaryEntries || []).find((entry) => entry.id === entryId)
      if (!target) return current
      const nextReviewedAt = target.clientReviewedAt ? null : nowIso()
      const next = {
        ...current,
        siteDiaryEntries: (current.siteDiaryEntries || []).map((entry) => (
          entry.id === entryId
            ? { ...entry, clientReviewedAt: nextReviewedAt }
            : entry
        )),
      }
      return addActivity(next, projectId, project.homeownerName, nextReviewedAt ? 'Marked a site diary update as reviewed' : 'Removed reviewed mark from a site diary update')
    }),
    addTimelinePhase: (payload = {}) => update((current) => {
      const phase = {
        id: makeId('phase'),
        projectId,
        name: payload.name || 'New phase',
        startDate: payload.startDate || '2025-12-01',
        endDate: payload.endDate || '2025-12-15',
        status: payload.status || 'upcoming',
        progress: payload.progress ?? 0,
        assignedTo: payload.assignedTo || ['Riya Desai'],
        note: payload.note || 'Custom phase added.',
        clientNotified: false,
        delay: null,
      }
      const next = {
        ...current,
        timelinePhases: [...(current.timelinePhases || []), phase],
      }
      return addActivity(next, projectId, project.designerName, `Added timeline phase: ${phase.name}`)
    }),
    updateTimelinePhase: (phaseId, patch) => update((current) => {
      const next = {
        ...current,
        timelinePhases: (current.timelinePhases || []).map((phase) => (
          phase.id === phaseId ? { ...phase, ...patch } : phase
        )),
      }
      return addActivity(next, projectId, project.designerName, 'Updated a timeline phase')
    }),
    markTimelinePhaseDone: (phaseId) => update((current) => {
      const next = {
        ...current,
        timelinePhases: (current.timelinePhases || []).map((phase) => (
          phase.id === phaseId
            ? { ...phase, status: 'done', progress: 100, delay: null }
            : phase.status === 'upcoming'
              ? { ...phase, status: 'active' }
              : phase
        )),
      }
      return addActivity(next, projectId, project.designerName, 'Marked a timeline phase done')
    }),
    delayTimelinePhase: (phaseId, delay) => update((current) => {
      const next = {
        ...current,
        timelinePhases: (current.timelinePhases || []).map((phase) => (
          phase.id === phaseId
            ? { ...phase, delay, clientNotified: Boolean(delay?.notifyClient) }
            : phase
        )),
      }
      return addActivity(next, projectId, project.designerName, `Logged a timeline delay${delay?.notifyClient ? ' and notified homeowner' : ''}`)
    }),
  }

  const financeSummary = {
    totalL: projectFinanceInvoices.reduce((sum, invoice) => sum + invoice.amountL, 0),
    paidL: projectFinanceInvoices.filter((invoice) => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.amountL, 0),
    dueL: projectFinanceInvoices.filter((invoice) => invoice.status === 'due').reduce((sum, invoice) => sum + invoice.amountL, 0),
    upcomingL: projectFinanceInvoices.filter((invoice) => invoice.status === 'upcoming').reduce((sum, invoice) => sum + invoice.amountL, 0),
    expenseTotalL: projectFinanceExpenses.reduce((sum, expense) => sum + (expense.amount / 100000), 0),
  }
  const financeExpenseBreakdown = projectFinanceExpenses.reduce((acc, expense) => {
    const key = expense.category || 'Miscellaneous'
    acc[key] = (acc[key] || 0) + expense.amount
    return acc
  }, {})

  return {
    state,
    projects: state.projects || [],
    project,
    sow,
    activity: projectActivity,
    roleTemplates: state.roleTemplates,
    permissionGroups,
    memberships: membershipsWithUsers,
    activeViewer: {
      membership: activeViewerMembership || null,
      role: activeViewerRole,
      user: activeViewerMembership?.user || null,
      grants: activeViewerGrants,
    },
    activeViewerRoleId: state.activeViewerRoleId || 'principal-pro',
    permissions,
    hasGrant: (grant) => includesGrant(activeViewerGrants, grant),
    hasAnyGrant: (candidates) => includesAnyGrant(activeViewerGrants, candidates),
    invites: state.invites.filter((invite) => invite.projectId === projectId),
    archiveFolders: state.archiveFolders
      .filter((folder) => folder.projectId === projectId)
      .map((folder) => ({
        ...folder,
        itemCount: (state.archiveItems || []).filter((item) => item.folderId === folder.id).length,
      })),
    archiveItems: (state.archiveItems || []).filter((item) => item.projectId === projectId),
    financeInvoices: projectFinanceInvoices,
    financeExpenses: projectFinanceExpenses,
    financeSummary,
    financeExpenseBreakdown,
    boqMeta: projectBoqMeta,
    boqRooms: projectBoqRooms,
    boqItems: projectBoqItems,
    projectTasks,
    taskApprovals: projectTaskApprovals,
    taskStepCompletion: state.taskStepCompletion || {},
    siteDiaryEntries: projectSiteDiaryEntries,
    siteDiaryIssues: projectSiteDiaryIssues,
    siteDiaryReferences: projectSiteDiaryReferences,
    timelinePhases: projectTimelinePhases,
    actions,
  }
}
