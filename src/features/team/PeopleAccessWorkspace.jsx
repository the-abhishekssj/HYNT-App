import { useState } from 'react'
import {
  CalendarBlank,
  CaretRight,
  ChatCircleText,
  CheckCircle,
  ClipboardText,
  CurrencyInr,
  Eye,
  FileText,
  FolderOpen,
  Hammer,
  House,
  PaperPlaneTilt,
  Phone,
  ShieldCheck,
  Trash,
  UserCirclePlus,
  UsersThree,
  XCircle,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'

const teamRoleIds = ['site-supervisor', 'junior-designer', 'contractor', 'admin', 'accounts']

const accessTools = [
  {
    id: 'sow',
    label: 'SOW',
    icon: ClipboardText,
    edit: ['sow.edit', 'sow.send'],
    view: ['sow.view'],
    client: ['sow.review'],
  },
  {
    id: 'boq',
    label: 'BOQ',
    icon: CurrencyInr,
    edit: ['boq.edit', 'boq.approve'],
    view: ['boq.view', 'boq.measurements.view'],
    client: ['boq.client.view'],
  },
  {
    id: 'drive',
    label: 'Drive',
    icon: FolderOpen,
    edit: ['archive.create', 'archive.upload', 'moodboard.create'],
    view: ['archive.view'],
    client: ['archive.client.view'],
  },
  {
    id: 'site-diary',
    label: 'Site diary',
    icon: House,
    edit: ['siteDiary.create', 'siteDiary.share', 'siteDiary.convert'],
    view: ['siteDiary.view'],
    client: ['siteDiary.client.view'],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckCircle,
    edit: ['tasks.create', 'tasks.update', 'tasks.approve'],
    view: ['tasks.view'],
    client: ['tasks.client.view'],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: CurrencyInr,
    edit: ['finance.edit', 'finance.invoice.create', 'finance.expense.create'],
    view: ['finance.view'],
    client: ['finance.client.view'],
  },
  {
    id: 'contract',
    label: 'Contract',
    icon: FileText,
    edit: ['contract.edit', 'contract.send'],
    view: ['contract.view'],
    client: ['contract.sign'],
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: CalendarBlank,
    edit: ['timeline.edit', 'timeline.delay'],
    view: ['timeline.view'],
    client: ['timeline.client.view'],
  },
]

const roleDescriptions = {
  'site-supervisor': 'Diary, tasks, progress photos, BOQ visibility, and timeline follow-through.',
  'junior-designer': 'Design work, tasks, shared references, SOW/BOQ visibility, and Drive edits.',
  contractor: 'Site diary updates and own task execution without commercial controls.',
  admin: 'Broad project operations access except team management.',
  accounts: 'Commercial access for BOQ visibility, finance edits, and invoice preparation.',
  homeowner: 'Client-facing access to approvals, shared boards, finance summaries, and project remarks.',
}

const roleBadgeTone = {
  'principal-pro': 'bg-black text-white',
  homeowner: 'bg-[#e7f5ec] text-[#267449]',
  accounts: 'bg-[#f4f8ff] text-[#41658a]',
  'site-supervisor': 'bg-[#fff5e6] text-[#8b6423]',
  'junior-designer': 'bg-[#eef8f3] text-[#25764a]',
  contractor: 'bg-[#fff3e8] text-[#9a5a18]',
  admin: 'bg-[#f1edff] text-[#5d48b8]',
}

const roleIconMap = {
  'site-supervisor': House,
  'junior-designer': Eye,
  contractor: Hammer,
  admin: ShieldCheck,
  accounts: CurrencyInr,
  homeowner: House,
}

function hasAnyGrant(grants = [], grantList = []) {
  return grants.includes('all') || grantList.some((grant) => grants.includes(grant))
}

function getToolAccessLevel(grants = [], tool) {
  if (grants.includes('all') || hasAnyGrant(grants, tool.edit)) return 'edit'
  if (hasAnyGrant(grants, tool.view) || hasAnyGrant(grants, tool.client)) return 'view'
  return 'none'
}

function getAccessLabel(grants = [], tool) {
  if (grants.includes('all')) return { label: 'Full access', tone: 'text-black bg-[#eef8f3]' }
  if (hasAnyGrant(grants, tool.edit)) return { label: 'Can edit', tone: 'text-[#267449] bg-[#eef8f3]' }
  if (hasAnyGrant(grants, tool.client)) return { label: 'Client view', tone: 'text-[#5d48b8] bg-[#f1edff]' }
  if (hasAnyGrant(grants, tool.view)) return { label: 'Can view', tone: 'text-[#41658a] bg-[#eef5ff]' }
  return { label: 'No access', tone: 'text-[#8a8a8a] bg-[#f2f2f2]' }
}

function summarizeAccess(grants = []) {
  if (grants.includes('all')) return 'All project tools'
  const visibleTools = accessTools
    .filter((tool) => getAccessLabel(grants, tool).label !== 'No access')
    .map((tool) => tool.label)
  return visibleTools.length ? visibleTools.slice(0, 3).join(' / ') : 'Access not set'
}

function getAccessStats(grants = []) {
  const levels = accessTools.map((tool) => getToolAccessLevel(grants, tool))
  return {
    tools: levels.filter((level) => level !== 'none').length,
    edit: levels.filter((level) => level === 'edit').length,
    view: levels.filter((level) => level === 'view').length,
  }
}

function formatSeatFee(amount) {
  return amount ? `INR ${amount} one-time` : 'Included'
}

function ScreenShell({ title, subtitle, onBack, action, children, bottomAction = null, toast = '' }) {
  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className={`mx-auto w-full max-w-[390px] pt-16 ${bottomAction ? 'pb-32' : 'pb-8'}`}>
        <ProjectWorkspaceHeader
          title={title}
          subtitle={subtitle}
          onBack={onBack}
          actions={action}
        />
        {children}
      </section>
      {bottomAction ? (
        <div className="fixed bottom-0 left-1/2 z-[80] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
          {bottomAction}
        </div>
      ) : null}
      {toast ? (
        <div className="typo-label fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-black px-4 py-2 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
          {toast}
        </div>
      ) : null}
    </main>
  )
}

function SectionHeading({ title, meta, actionLabel, onAction }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="typo-section-title ui-section-title">{title}</h2>
      {actionLabel ? (
        <button type="button" onClick={onAction} className="typo-label shrink-0 text-[#267449]">
          {actionLabel}
        </button>
      ) : meta ? (
        <span className="typo-caption shrink-0 uppercase text-[#767676]">{meta}</span>
      ) : null}
    </div>
  )
}

function getAccessPreviewLabel(grants, tool, membership = null) {
  const level = getToolAccessLevel(grants, tool, membership)
  if (level === 'edit') {
    if (tool.id === 'tasks') return 'Edit own'
    if (tool.id === 'site-diary') return 'Full'
    return 'Edit'
  }
  if (level === 'view') return 'View'
  return 'None'
}

function getToolGrantScope(tool) {
  return Array.from(new Set([...(tool.edit || []), ...(tool.view || []), ...(tool.client || [])]))
}

function getToolViewGrants(tool, membership) {
  if (membership?.roleId === 'homeowner' && tool.client?.length) return tool.client
  if (tool.view?.length) return tool.view
  return tool.client || []
}

function getGrantsForToolLevel(tool, level, membership) {
  if (level === 'none') return []
  const viewGrants = getToolViewGrants(tool, membership)
  if (level === 'view') return viewGrants
  return Array.from(new Set([...viewGrants, ...(tool.edit || [])]))
}

function applyToolAccessLevel(currentGrants = [], tool, level, membership) {
  if (currentGrants.includes('all')) return currentGrants
  const scopedGrants = new Set(getToolGrantScope(tool))
  const nextGrants = currentGrants.filter((grant) => !scopedGrants.has(grant))
  return Array.from(new Set([...nextGrants, ...getGrantsForToolLevel(tool, level, membership)]))
}

function AccessPreviewTable({ grants, membership = null, clientMode = false }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#dbe6df] bg-white">
      <div className="grid grid-cols-[1fr_auto] bg-[#f4fbf7] px-3 py-2">
        <p className="typo-caption uppercase text-[#5f7467]">Tool</p>
        <p className="typo-caption uppercase text-[#5f7467]">{clientMode ? 'Client sees' : 'Access'}</p>
      </div>
      {accessTools.map((tool) => {
        const label = clientMode && tool.client?.length
          ? getAccessPreviewLabel(tool.client, tool, { roleId: 'homeowner' })
          : getAccessPreviewLabel(grants, tool, membership)
        const isNone = label === 'None'
        return (
          <div key={tool.id} className="grid grid-cols-[1fr_auto] items-center border-t border-[#edf2ee] px-3 py-2">
            <p className="typo-body text-black">{tool.label}</p>
            <span className={`typo-caption rounded-full px-2.5 py-1 uppercase ${isNone ? 'bg-[#f2f2f2] text-[#8a8a8a]' : 'bg-[#eef8f3] text-[#267449]'}`}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

function InviteAccessToggleTable({ grants, membership, clientMode = false, onChange }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#dbe6df] bg-white">
      <div className="grid grid-cols-[1fr_auto] bg-[#f4fbf7] px-3 py-2">
        <p className="typo-caption uppercase text-[#5f7467]">Tool</p>
        <p className="typo-caption uppercase text-[#5f7467]">{clientMode ? 'Client sees' : 'Access'}</p>
      </div>
      {accessTools.map((tool) => {
        const selectedLevel = getToolAccessLevel(grants, tool)
        const clientEnabled = clientMode ? selectedLevel !== 'none' : false
        return (
          <div key={tool.id} className="grid grid-cols-[1fr_auto] items-center border-t border-[#edf2ee] px-3 py-2">
            <p className="typo-body text-black">{tool.label}</p>
            {clientMode ? (
              <button
                type="button"
                onClick={() => onChange(applyToolAccessLevel(grants, tool, clientEnabled ? 'none' : 'view', membership))}
                className={`relative h-7 w-12 rounded-full transition ${clientEnabled ? 'bg-black' : 'bg-[#e5e5e5]'}`}
                aria-pressed={clientEnabled}
              >
                <span className={`absolute top-1 size-5 rounded-full bg-white transition ${clientEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-1 rounded-[14px] bg-[#f2f6f3] p-1">
                {[
                  ['edit', 'Edit'],
                  ['view', 'View'],
                  ['none', 'None'],
                ].map(([level, label]) => {
                  const isSelected = selectedLevel === level
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => onChange(applyToolAccessLevel(grants, tool, level, membership))}
                      className={`typo-caption h-8 min-w-14 rounded-[10px] px-2 uppercase ${isSelected ? 'bg-black text-white' : 'text-[#65766c]'}`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ReadOnlyAccessSummary({ grants, membership = null }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {accessTools.map((tool) => {
        const Icon = tool.icon
        const label = getAccessPreviewLabel(grants, tool, membership)
        const isNone = label === 'None'
        return (
          <article key={tool.id} className={`rounded-[16px] border p-3 ${isNone ? 'border-[#e5e5e5] bg-[#fafafa]' : 'border-[#dbe6df] bg-[#f7fbf8]'}`}>
            <div className="flex items-start gap-3">
              <span className={`grid size-9 shrink-0 place-items-center rounded-[14px] ${isNone ? 'bg-[#f0f0f0] text-[#8a8a8a]' : 'bg-[#eef8f3] text-[#173324]'}`}>
                <Icon size={17} />
              </span>
              <div className="min-w-0">
                <p className="typo-body-strong truncate text-black">{tool.label}</p>
                <p className={`typo-caption mt-1 uppercase ${isNone ? 'text-[#8a8a8a]' : 'text-[#267449]'}`}>{label}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function PersonCard({ membership, onOpen, compact = false, variant = 'card' }) {
  const roleId = membership.roleId
  const badgeTone = roleBadgeTone[roleId] || 'bg-[#f2f2f2] text-[#6f6f6f]'
  const accessSummary = roleId === 'homeowner'
    ? 'Homeowner app'
    : summarizeAccess(membership.grants || membership.role?.grants)
  const avatar = (
    <img
      src={membership.user?.avatar || '/hynt-home/pro-2.png'}
      alt={membership.user?.name || 'Team member'}
      className={`${variant === 'list' ? 'size-11 rounded-[16px]' : 'size-12 rounded-full'} border border-[#dbe6df] object-cover`}
    />
  )

  if (variant === 'list') {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="w-full border-b border-[#e6eee9] bg-white px-0 py-4 text-left last:border-b-0"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {avatar}
            <div className="min-w-0">
              <p className="typo-body-strong truncate text-black">{membership.user?.name || 'Team member'}</p>
              <p className="typo-meta mt-0.5 truncate text-[#65766c]">{membership.user?.phone || 'No phone added'}</p>
            </div>
          </div>
          <CaretRight size={17} className="shrink-0 text-[#7d8b82]" />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 pl-14">
          <span className={`typo-caption rounded-full px-2.5 py-1 uppercase ${badgeTone}`}>
            {membership.roleLabel || membership.role?.label || 'Custom role'}
          </span>
          <span className="typo-meta min-w-0 truncate text-right text-[#65766c]">{accessSummary}</span>
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-[24px] border border-[#dbe6df] bg-white p-4 text-left shadow-[0_18px_40px_rgba(20,55,35,0.05)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {avatar}
          <div className="min-w-0">
            <p className="typo-body-strong truncate text-black">{membership.user?.name || 'Team member'}</p>
            <p className="typo-meta mt-0.5 truncate text-[#65766c]">{membership.user?.phone || 'No phone added'}</p>
          </div>
        </div>
        <CaretRight size={17} className="mt-4 shrink-0 text-[#7d8b82]" />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className={`typo-caption rounded-full px-2.5 py-1 uppercase ${badgeTone}`}>
          {membership.roleLabel || membership.role?.label || 'Custom role'}
        </span>
        {!compact ? <span className="typo-meta min-w-0 truncate text-right text-[#65766c]">{accessSummary}</span> : null}
      </div>
    </button>
  )
}

function PendingInviteCard({ invite, roleTemplates, onAccept, onCancel, onRemind }) {
  const role = roleTemplates.find((item) => item.id === invite.roleId)
  return (
    <article className={`rounded-[18px] border p-3 ${invite.inviteType === 'client' || invite.roleId === 'homeowner' ? 'border-[#dce7f3] bg-[#f5f9ff]' : 'border-[#efe2c8] bg-[#fff9ef]'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="typo-body-strong truncate text-black">{invite.name || invite.phone}</p>
          <p className="typo-meta mt-1 truncate text-[#65766c]">{invite.roleLabel || role?.label || 'Team member'} / {invite.phone}</p>
        </div>
        <span className="typo-caption rounded-full bg-[#fff9ef] px-2.5 py-1 uppercase text-[#9f8350]">Pending</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="typo-caption uppercase text-[#7d8b82]">Invite link</p>
          <p className="typo-meta max-w-[180px] truncate text-[#65766c]">{invite.inviteUrl}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="small" variant="outline" icon={PaperPlaneTilt} onClick={onRemind} aria-label="Send reminder" className="size-10 rounded-[14px]" />
          <Button type="button" size="small" variant="outline" icon={CheckCircle} onClick={onAccept} aria-label="Mock accept invite" className="size-10 rounded-[14px]" />
          <Button type="button" size="small" variant="outline" icon={XCircle} onClick={onCancel} aria-label="Cancel invite" className="size-10 rounded-[14px] text-[#c34545]" />
        </div>
      </div>
      {invite.seatFee ? <p className="typo-meta mt-2 text-[#9f8350]">{formatSeatFee(invite.seatFee)} / {invite.seatPayer === 'client' ? 'Pay on joining' : 'Designer pays'}</p> : null}
    </article>
  )
}

function EmptyBlock({ title, body, actionLabel, onAction }) {
  return (
    <div className="rounded-[28px] border border-[#dbe6df] bg-[#fbfdfb] px-5 py-6 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-[22px] bg-[#eef8f3] text-[#173324]">
        <UserCirclePlus size={24} />
      </span>
      <p className="typo-card-title mt-4 text-black">{title}</p>
      <p className="typo-body mt-1 text-[#65766c]">{body}</p>
      {actionLabel ? (
        <Button type="button" className="mt-4" size="small" variant="outline" leadingIcon={UserCirclePlus} onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

function TeamHome({
  project,
  memberships,
  invites,
  roleTemplates,
  actions,
  onBack,
  onAddTeam,
  onAddClient,
  onOpenMember,
  onToast,
  toast,
}) {
  const acceptedMembers = memberships.filter((membership) => membership.status === 'accepted')
  const owner = acceptedMembers.find((membership) => membership.roleId === 'principal-pro')
  const clients = acceptedMembers.filter((membership) => membership.roleId === 'homeowner')
  const teamMembers = acceptedMembers.filter((membership) => !['principal-pro', 'homeowner'].includes(membership.roleId))
  const pendingInvites = invites.filter((invite) => invite.status === 'pending')
  const pendingTeamInvites = pendingInvites.filter((invite) => invite.inviteType !== 'client' && invite.roleId !== 'homeowner')
  const pendingClientInvites = pendingInvites.filter((invite) => invite.inviteType === 'client' || invite.roleId === 'homeowner')
  const billableInvites = pendingTeamInvites.filter((invite) => invite.seatFee)
  const totalSeatFee = billableInvites.reduce((sum, invite) => sum + (Number(invite.seatFee) || 0), 0)

  return (
    <ScreenShell
      title="Team"
      subtitle={project?.scope || project?.name || 'Project access'}
      onBack={onBack}
      action={<Button type="button" variant="outline" icon={UserCirclePlus} aria-label="Add team member" onClick={onAddTeam} />}
      toast={toast}
    >
      <div className="ui-screen-content pt-6">
        <section className="rounded-[18px] border border-[#dbe6df] bg-[#f4fbf7] px-4 py-3">
          <p className="typo-section-title text-[#173324]">{project?.name || 'Project'}</p>
          <p className="typo-body mt-1 text-[#5f7467]">{project?.homeownerName || 'Client'} / {project?.location || 'Location not set'}</p>
        </section>

        <section className="mt-6">
          <SectionHeading title={`Team members (${teamMembers.length + (owner ? 1 : 0) + pendingTeamInvites.length})`} actionLabel="+ Add member" onAction={onAddTeam} />
          {owner || teamMembers.length ? (
            <div className="border-y border-[#dbe6df]">
              {owner ? <PersonCard membership={owner} onOpen={() => onOpenMember(owner.id)} variant="list" /> : null}
              {teamMembers.map((membership) => (
                <PersonCard key={membership.id} membership={membership} variant="list" onOpen={() => onOpenMember(membership.id)} />
              ))}
            </div>
          ) : (
            <div>
              <EmptyBlock title="No team members yet" body="Invite designers, site supervisors, or accounts only when they need project access." actionLabel="Add team member" onAction={onAddTeam} />
            </div>
          )}
          <div className="mt-3 space-y-3">
            {pendingTeamInvites.map((invite) => (
              <PendingInviteCard
                key={invite.id}
                invite={invite}
                roleTemplates={roleTemplates}
                onAccept={() => actions.acceptInvite(invite.id)}
                onCancel={() => actions.cancelInvite(invite.id)}
                onRemind={() => onToast(`Reminder sent to ${invite.name || invite.phone}`)}
              />
            ))}
          </div>
        </section>

        <section className="mt-6">
          <SectionHeading title="Client" actionLabel="+ Add client" onAction={onAddClient} />
          {clients.length ? (
            <div className="border-y border-[#dbe6df]">
              {clients.map((membership) => (
                <PersonCard key={membership.id} membership={membership} variant="list" onOpen={() => onOpenMember(membership.id)} />
              ))}
            </div>
          ) : (
            <div>
              <EmptyBlock title="No client connected" body="Add the homeowner when approvals, comments, or shared boards are ready." actionLabel="Add client" onAction={onAddClient} />
            </div>
          )}
          <div className="mt-3 space-y-3">
            {pendingClientInvites.map((invite) => (
              <PendingInviteCard
                key={invite.id}
                invite={invite}
                roleTemplates={roleTemplates}
                onAccept={() => actions.acceptInvite(invite.id)}
                onCancel={() => actions.cancelInvite(invite.id)}
                onRemind={() => onToast(`Reminder sent to ${invite.name || invite.phone}`)}
              />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[18px] border border-[#dbe6df] bg-[#f4fbf7] p-4">
          <p className="typo-section-title text-black">Seat summary</p>
          <div className="mt-3 divide-y divide-[#dbe6df]">
            {teamMembers.map((membership) => (
              <div key={membership.id} className="flex items-center justify-between gap-3 py-2">
                <span className="typo-meta text-[#65766c]">{membership.user?.name || 'Team member'}</span>
                <span className="typo-caption rounded-full bg-[#eef8f3] px-2.5 py-1 uppercase text-[#267449]">Hynt Pro / Free</span>
              </div>
            ))}
            {pendingTeamInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between gap-3 py-2">
                <span className="typo-meta text-[#65766c]">{invite.name || invite.phone}</span>
                <span className={`typo-caption rounded-full px-2.5 py-1 uppercase ${invite.seatFee ? 'bg-[#fff3dd] text-[#9f8350]' : 'bg-[#eef8f3] text-[#267449]'}`}>
                  {invite.seatFee ? `INR ${invite.seatFee} / Pending` : 'Hynt Pro / Free'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#dbe6df] pt-3">
            <span className="typo-body-strong text-black">Total seats cost</span>
            <span className="typo-card-title text-[#267449]">INR {totalSeatFee}</span>
          </div>
        </section>
      </div>
    </ScreenShell>
  )
}

function InviteScreen({ type, project, roleTemplates, actions, onBack }) {
  const isClientInvite = type === 'client'
  const availableRoles = isClientInvite
    ? roleTemplates.filter((role) => role.id === 'homeowner')
    : teamRoleIds.map((roleId) => roleTemplates.find((role) => role.id === roleId)).filter(Boolean)
  const [name, setName] = useState(isClientInvite ? project?.homeownerName || '' : '')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState(availableRoles[0]?.id || 'junior-designer')
  const [customRole, setCustomRole] = useState('')
  const [isHyntProMember, setIsHyntProMember] = useState(isClientInvite)
  const [seatPayer, setSeatPayer] = useState('designer')
  const [customGrantsByRole, setCustomGrantsByRole] = useState({})

  const selectedRole = availableRoles.find((role) => role.id === selectedRoleId) || availableRoles[0] || roleTemplates[0]
  const roleLabel = customRole.trim() || selectedRole?.label || 'Team member'
  const grants = customGrantsByRole[selectedRoleId] || selectedRole?.grants || []
  const seatFee = !isClientInvite && !isHyntProMember ? 500 : 0
  const canSend = phone.trim() && (!isClientInvite || name.trim())
  const inviteMembershipContext = { roleId: isClientInvite ? 'homeowner' : selectedRoleId }

  const updateInviteGrants = (nextGrants) => {
    setCustomGrantsByRole((current) => ({
      ...current,
      [selectedRoleId]: nextGrants,
    }))
  }

  const sendInvite = () => {
    if (!canSend) return
    actions.createInvite({
      name,
      phone,
      roleId: isClientInvite ? 'homeowner' : selectedRoleId,
      roleLabel,
      grants,
      inviteType: isClientInvite ? 'client' : 'team',
      seatFee,
      seatPayer,
    })
    onBack()
  }

  return (
    <ScreenShell
      title={isClientInvite ? 'Add client' : 'Add team member'}
      subtitle={project?.scope || 'Project access'}
      onBack={onBack}
      bottomAction={(
        <Button type="button" fullWidth leadingIcon={PaperPlaneTilt} disabled={!canSend} onClick={sendInvite}>
          Send WhatsApp Invite
        </Button>
      )}
    >
      <div className="ui-screen-content pt-6">
        {isClientInvite ? (
          <section className="rounded-[18px] border border-[#dbe6df] bg-[#f4fbf7] p-4">
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[16px] bg-white text-[#173324]">
                <House size={18} />
              </span>
              <p className="typo-body text-[#5f7467]">Client signs up on the Hynt homeowner app. Enter their mobile and this project appears in their app automatically.</p>
            </div>
          </section>
        ) : null}

        <section className="mt-5 space-y-4">
          <label className="block">
            <span className="typo-label uppercase text-[#7d8b82]">{isClientInvite ? 'Client name' : 'Name'}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={isClientInvite ? 'Homeowner name' : 'Team member name'}
              className="typo-body mt-2 h-12 w-full rounded-[18px] border border-[#dbe6df] bg-white px-4 text-black outline-none"
            />
          </label>
          <label className="block">
            <span className="typo-label uppercase text-[#7d8b82]">Mobile number</span>
            <div className="mt-2 flex h-12 items-center gap-3 rounded-[18px] border border-[#dbe6df] bg-white px-4">
              <Phone size={17} className="shrink-0 text-[#65766c]" />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 98765 43210"
                className="typo-body min-w-0 flex-1 bg-transparent text-black outline-none"
              />
            </div>
          </label>
          {isClientInvite ? (
            <label className="block">
              <span className="typo-label uppercase text-[#7d8b82]">Email (optional)</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="client@email.com"
                className="typo-body mt-2 h-12 w-full rounded-[18px] border border-[#dbe6df] bg-white px-4 text-black outline-none"
              />
            </label>
          ) : null}
        </section>

        <section className="mt-6">
          <SectionHeading title={isClientInvite ? 'Client access' : 'Role'} />
          <div className={isClientInvite ? 'space-y-3' : 'grid grid-cols-2 gap-2'}>
            {availableRoles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full rounded-[18px] border p-3 text-left transition ${selectedRoleId === role.id ? 'border-black bg-[#f7fbf8]' : 'border-[#dbe6df] bg-white'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {(() => {
                      const RoleIcon = roleIconMap[role.id] || UsersThree
                      return (
                        <span className="mb-3 grid size-9 place-items-center rounded-[14px] bg-[#eef8f3] text-[#173324]">
                          <RoleIcon size={17} />
                        </span>
                      )
                    })()}
                    <p className="typo-card-title text-black">{role.label}</p>
                    <p className="typo-body mt-1 text-[#65766c]">{roleDescriptions[role.id] || 'Project-specific access.'}</p>
                  </div>
                  <span className={`mt-1 grid size-7 place-items-center rounded-full border ${selectedRoleId === role.id ? 'border-black bg-black text-white' : 'border-[#dbe6df] bg-white text-transparent'}`}>
                    <CheckCircle size={15} weight="fill" />
                  </span>
                </div>
              </button>
            ))}
          </div>
          {!isClientInvite ? (
            <label className="mt-4 block">
              <span className="typo-label uppercase text-[#7d8b82]">Custom title, same selected access</span>
              <input
                value={customRole}
                onChange={(event) => setCustomRole(event.target.value)}
                placeholder={`Optional, e.g. ${selectedRole?.label || 'Lead designer'}`}
                className="typo-body mt-2 h-12 w-full rounded-[18px] border border-[#dbe6df] bg-white px-4 text-black outline-none"
              />
            </label>
          ) : null}
        </section>

        <section className="mt-6">
          <SectionHeading title={isClientInvite ? 'Client Access - Pre-set' : `Access Level - ${roleLabel}`} />
          <InviteAccessToggleTable
            grants={grants}
            membership={inviteMembershipContext}
            clientMode={isClientInvite}
            onChange={updateInviteGrants}
          />
        </section>

        {!isClientInvite ? (
          <section className={`mt-6 rounded-[18px] border p-4 ${isHyntProMember ? 'border-[#dbe6df] bg-[#f4fbf7]' : 'border-[#efe2c8] bg-[#fff9ef]'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="typo-caption uppercase text-[#5f7467]">Seat fee</p>
                <p className="typo-card-title mt-2 text-black">{isHyntProMember ? 'Free seat' : 'Seat Fee - INR 500'}</p>
                <p className="typo-body mt-1 text-[#65766c]">{isHyntProMember ? 'This member is an existing Hynt Pro subscriber. No seat fee required.' : `${name.trim() || 'This member'} is not a Hynt Pro subscriber. A one-time seat fee applies for this project.`}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsHyntProMember((current) => !current)}
                className={`relative mt-1 h-7 w-12 rounded-full transition ${isHyntProMember ? 'bg-black' : 'bg-[#d9d9d9]'}`}
                aria-pressed={isHyntProMember}
              >
                <span className={`absolute top-1 size-5 rounded-full bg-white transition ${isHyntProMember ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            {!isHyntProMember ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ['designer', "I'll pay (INR 500)"],
                  ['client', 'They pay on joining'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSeatPayer(value)}
                    className={`typo-label h-10 rounded-[14px] border ${seatPayer === value ? 'border-black bg-black text-white' : 'border-[#dbe6df] bg-white text-black'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="mt-6 rounded-[18px] border border-[#dbe6df] bg-[#f7fbf8] p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[16px] bg-white text-[#173324]">
              <ChatCircleText size={18} />
            </span>
            <div>
              <p className="typo-card-title text-black">Invite preview (WhatsApp)</p>
              <p className="typo-meta text-[#65766c]">Hynt Pro / Project invite</p>
            </div>
          </div>
          <div className="mt-4 rounded-[20px] bg-white p-4">
            {isClientInvite ? (
              <>
                <p className="typo-body text-black">Hi {name.trim() || 'there'}, {project?.designerName || 'Riya Desai'} has set up your project on Hynt.</p>
                <p className="typo-body mt-2 text-[#65766c]">Track progress, approve designs, view invoices and more. Download Hynt and sign in with this number to get started.</p>
              </>
            ) : (
              <>
                <p className="typo-body text-black">Hey {name.trim() || 'there'}, {project?.designerName || 'Riya Desai'} has added you to {project?.name || 'this project'} on Hynt Pro as {roleLabel}.</p>
                <p className="typo-body mt-2 text-[#65766c]">Tap to join the project and get started. Seat: {formatSeatFee(seatFee)}.</p>
              </>
            )}
            <p className="typo-meta mt-3 text-[#41658a]">{isClientInvite ? 'hynt.app/download' : 'hynt.app/join/abc123'}</p>
          </div>
        </section>
      </div>
    </ScreenShell>
  )
}

function MemberDetail({ project, membership, roleTemplates, actions, onBack }) {
  const role = roleTemplates.find((item) => item.id === membership.roleId) || membership.role
  const [selectedRoleId, setSelectedRoleId] = useState(membership.roleId)
  const grants = membership.grants || role?.grants || []
  const accessStats = getAccessStats(grants)
  const canRemove = membership.roleId !== 'principal-pro'
  const canEditAccess = membership.roleId !== 'principal-pro'
  const isClient = membership.roleId === 'homeowner'
  const displayedAccessStats = isClient
    ? { tools: accessTools.filter((tool) => tool.client?.length).length, edit: 0, view: accessTools.filter((tool) => tool.client?.length).length }
    : accessStats

  const changeRole = (nextRoleId) => {
    setSelectedRoleId(nextRoleId)
    actions.updateMembershipRole(membership.id, nextRoleId)
  }

  const removeMember = () => {
    const confirmed = window.confirm(`Remove ${membership.user?.name || 'this person'} from this project?`)
    if (!confirmed) return
    actions.removeMembership(membership.id)
    onBack()
  }

  return (
    <ScreenShell
      title={membership.user?.name || 'Team member'}
      subtitle={membership.roleLabel || role?.label || project?.scope || 'Project access'}
      onBack={onBack}
      bottomAction={canRemove && !isClient ? (
        <Button type="button" variant="outline" fullWidth leadingIcon={Trash} onClick={removeMember} className="text-[#c34545]">
          Remove from project
        </Button>
      ) : null}
    >
      <div className="ui-screen-content pt-6">
        <section className="rounded-[24px] border border-[#dbe6df] bg-[#fbfdfb] p-4">
          <div className="flex items-start gap-4">
            <img
              src={membership.user?.avatar || '/hynt-home/pro-2.png'}
              alt={membership.user?.name || 'Team member'}
              className="size-14 rounded-[20px] border border-[#dbe6df] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="typo-card-title truncate text-black">{membership.user?.name || 'Team member'}</p>
              <p className="typo-body mt-1 text-[#65766c]">{membership.user?.phone || 'No phone added'}</p>
              <span className={`typo-caption mt-3 inline-flex rounded-full px-2.5 py-1 uppercase ${roleBadgeTone[membership.roleId] || 'bg-[#f2f2f2] text-[#6f6f6f]'}`}>
                {membership.roleLabel || role?.label || 'Custom role'}
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-[18px] border border-[#dbe6df] bg-white">
            <div className="border-r border-[#dbe6df] p-3">
              <p className="typo-caption uppercase text-[#7d8b82]">Tools</p>
              <p className="typo-card-title text-black">{String(displayedAccessStats.tools).padStart(2, '0')}</p>
            </div>
            <div className="border-r border-[#dbe6df] p-3">
              <p className="typo-caption uppercase text-[#7d8b82]">Edit</p>
              <p className="typo-card-title text-black">{String(displayedAccessStats.edit).padStart(2, '0')}</p>
            </div>
            <div className="p-3">
              <p className="typo-caption uppercase text-[#7d8b82]">View</p>
              <p className="typo-card-title text-black">{String(displayedAccessStats.view).padStart(2, '0')}</p>
            </div>
          </div>
        </section>

        {membership.roleId !== 'principal-pro' && !isClient ? (
          <section className="mt-5">
            <SectionHeading title="Role preset" />
            <select
              value={selectedRoleId}
              onChange={(event) => changeRole(event.target.value)}
              className="typo-body-strong h-12 w-full rounded-[18px] border border-[#dbe6df] bg-[#f7fbf8] px-4 text-black outline-none"
            >
              {teamRoleIds.map((roleId) => roleTemplates.find((template) => template.id === roleId)).filter(Boolean).map((template) => (
                <option key={template.id} value={template.id}>{template.label}</option>
              ))}
            </select>
          </section>
        ) : null}

        <section className="mt-5">
          <SectionHeading title={isClient ? 'Client access' : 'Tool access'} meta={canEditAccess && !isClient ? 'Role controlled' : 'Locked'} />
          {isClient ? (
            <AccessPreviewTable grants={grants} membership={membership} clientMode />
          ) : (
            <ReadOnlyAccessSummary grants={grants} membership={membership} />
          )}
        </section>

        {!isClient && membership.roleId !== 'principal-pro' ? (
          <section className="mt-5 rounded-[18px] border border-[#dbe6df] bg-[#fbfdfb] p-4">
            <SectionHeading title="Activity" />
            <div className="typo-body space-y-2 text-[#65766c]">
              <p>Last active: Today, 9:15 AM</p>
              <p>Tasks completed: {accessStats.edit + 2}</p>
              <p>Log entries: {getToolAccessLevel(grants, accessTools.find((tool) => tool.id === 'site-diary')) !== 'none' ? 12 : 0}</p>
            </div>
          </section>
        ) : null}

      </div>
    </ScreenShell>
  )
}

function PeopleAccessWorkspace({ project, onBack }) {
  const projectId = project?.id || 'p-1'
  const {
    memberships,
    invites,
    roleTemplates,
    actions,
  } = useSharedProject(projectId)
  const [screen, setScreen] = useState({ name: 'home' })
  const [toast, setToast] = useState('')

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  const selectedMembership = screen.membershipId
    ? memberships.find((membership) => membership.id === screen.membershipId)
    : null

  if (screen.name === 'add-team') {
    return (
      <InviteScreen
        type="team"
        project={project}
        roleTemplates={roleTemplates}
        actions={actions}
        onBack={() => setScreen({ name: 'home' })}
      />
    )
  }

  if (screen.name === 'add-client') {
    return (
      <InviteScreen
        type="client"
        project={project}
        roleTemplates={roleTemplates}
        actions={actions}
        onBack={() => setScreen({ name: 'home' })}
      />
    )
  }

  if (screen.name === 'member-detail' && selectedMembership) {
    return (
      <MemberDetail
        project={project}
        membership={selectedMembership}
        roleTemplates={roleTemplates}
        actions={actions}
        onBack={() => setScreen({ name: 'home' })}
      />
    )
  }

  return (
    <TeamHome
      project={project}
      memberships={memberships}
      invites={invites}
      roleTemplates={roleTemplates}
      actions={actions}
      onBack={onBack}
      onAddTeam={() => setScreen({ name: 'add-team' })}
      onAddClient={() => setScreen({ name: 'add-client' })}
      onOpenMember={(membershipId) => setScreen({ name: 'member-detail', membershipId })}
      onToast={showToast}
      toast={toast}
    />
  )
}

export default PeopleAccessWorkspace
