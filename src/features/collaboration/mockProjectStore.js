import { useEffect, useState } from 'react'
import { createInitialSowDocument } from '../sow/sowData.js'

const STORAGE_KEY = 'hynt-mock-project-store-v1'
const CHANNEL_KEY = 'hynt-mock-project-store'

const nowIso = () => new Date().toISOString()
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

const demoProject = {
  id: 'p-1',
  name: 'Sharma 3BHK Renovation',
  clientName: 'Priya Sharma',
  homeownerName: 'Priya Sharma',
  designerName: 'Riya Desai',
  location: 'Bandra, Mumbai',
  scope: '3BHK Full Renovation',
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
  version: 1,
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
    { id: 'af-1', projectId: 'p-1', name: 'Moodboard', visibility: 'client-shared', itemCount: 12 },
    { id: 'af-2', projectId: 'p-1', name: 'Diagrams', visibility: 'team-only', itemCount: 4 },
    { id: 'af-3', projectId: 'p-1', name: 'Site Photos', visibility: 'client-shared', itemCount: 18 },
  ],
  activeViewerRoleId: 'principal-pro',
  activity: [],
}

const readState = () => {
  if (typeof window === 'undefined') return mockInitialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return mockInitialState
    const parsed = JSON.parse(raw)
    return { ...mockInitialState, ...parsed, roleTemplates }
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
  sentAt: null,
  clientSignedAt: null,
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
})

export function useSharedProject(projectId = 'p-1') {
  const [state, setState] = useState(readState)

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
          const normalized = { ...mockInitialState, ...remoteState, roleTemplates }
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

  const project = state.projects.find((item) => item.id === projectId) || demoProject
  const sow = state.sows[projectId] || null
  const projectActivity = (state.activity || []).filter((item) => item.projectId === projectId)
  const projectMemberships = (state.memberships || []).filter((membership) => membership.projectId === projectId)

  const actions = {
    resetDemo: () => {
      writeState(mockInitialState)
      pushRemoteState(mockInitialState)
      setState(mockInitialState)
    },
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
    signDesigner: () => update((current) => {
      const existing = current.sows[projectId]
      if (!existing) return current
      const next = {
        ...current,
        sows: {
          ...current.sows,
          [projectId]: { ...existing, designerSigned: true, updatedAt: nowIso() },
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
      const nextSow = {
        ...existing,
        status: 'revision-ready',
        revision: decision === 'approve' ? existing.revision + 1 : existing.revision,
        updatedAt: nowIso(),
        remarks: existing.remarks.map((remark) => (
          remark.id === remarkId ? { ...remark, status: decision === 'approve' ? 'accepted' : 'rejected' } : remark
        )),
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
    createInvite: ({ phone, roleId, grants }) => update((current) => {
      const cleanPhone = phone.trim()
      if (!cleanPhone) return current
      const inviteId = makeId('inv')
      const invite = {
        id: inviteId,
        projectId,
        phone: cleanPhone,
        roleId,
        grants,
        status: 'pending',
        inviteUrl: `https://hynt.local/invite/${inviteId}`,
        createdAt: nowIso(),
      }
      const next = {
        ...current,
        invites: [invite, ...(current.invites || [])],
      }
      return addActivity(next, projectId, project.designerName, `Invited ${cleanPhone} as ${roleTemplates.find((role) => role.id === roleId)?.label || 'Team member'}`)
    }),
    acceptInvite: (inviteId) => update((current) => {
      const invite = (current.invites || []).find((item) => item.id === inviteId)
      if (!invite) return current
      const userId = makeId('u')
      const role = roleTemplates.find((item) => item.id === invite.roleId)
      const user = {
        id: userId,
        name: `Invited ${invite.phone.slice(-4)}`,
        role: role?.label || 'Team member',
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
            ? { ...membership, roleId, grants: role?.grants || [] }
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
  }

  return {
    state,
    project,
    sow,
    activity: projectActivity,
    roleTemplates: state.roleTemplates,
    permissionGroups,
    memberships: projectMemberships.map((membership) => {
      const user = (state.users || []).find((item) => item.id === membership.userId)
      const role = roleTemplates.find((item) => item.id === membership.roleId)
      return {
        ...membership,
        user,
        role,
        grants: membership.grants || role?.grants || [],
      }
    }),
    activeViewerRoleId: state.activeViewerRoleId || 'principal-pro',
    invites: state.invites.filter((invite) => invite.projectId === projectId),
    archiveFolders: state.archiveFolders.filter((folder) => folder.projectId === projectId),
    actions,
  }
}
