import { useMemo, useState } from 'react'
import {
  CaretDown,
  CaretLeft,
  CheckCircle,
  Eye,
  LinkSimple,
  PaperPlaneTilt,
  UserCirclePlus,
  XCircle,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'

const roleTone = {
  'principal-pro': 'bg-black text-white',
  homeowner: 'bg-[#e7f5ec] text-[#267449]',
  accounts: 'bg-[#f4f8ff] text-[#41658a]',
}

function AccessToggle({ enabled, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition ${enabled ? 'bg-black' : 'bg-[#d9d9d9]'} disabled:opacity-45`}
      aria-pressed={enabled}
    >
      <span className={`absolute top-1 size-4 rounded-full bg-white transition ${enabled ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

function SectionHeader({ title, meta }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="type-section-title text-black">{title}</h2>
      {meta ? <span className="type-caption shrink-0 rounded-full border border-[#e0e0e0] bg-white px-3 py-1 uppercase text-[#6f6f6f]">{meta}</span> : null}
    </div>
  )
}

function PeopleAccessWorkspace({ project, onBack }) {
  const projectId = project?.id || 'p-1'
  const {
    memberships,
    invites,
    roleTemplates,
    permissionGroups,
    activeViewerRoleId,
    actions,
  } = useSharedProject(projectId)
  const [invitePhone, setInvitePhone] = useState('')
  const [inviteRoleId, setInviteRoleId] = useState('junior-designer')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [openMemberId, setOpenMemberId] = useState(memberships.find((membership) => membership.roleId !== 'principal-pro')?.id || null)

  const selectedInviteRole = roleTemplates.find((role) => role.id === inviteRoleId) || roleTemplates[0]
  const activeViewerRole = roleTemplates.find((role) => role.id === activeViewerRoleId) || roleTemplates[0]
  const acceptedMembers = memberships.filter((membership) => membership.status === 'accepted')
  const pendingInvites = invites.filter((invite) => invite.status === 'pending')

  const viewerSummary = useMemo(() => {
    if (activeViewerRole?.grants?.includes('all')) return 'Full project access'
    return `${activeViewerRole?.grants?.length || 0} grants active`
  }, [activeViewerRole])

  const sendInvite = () => {
    actions.createInvite({
      phone: invitePhone,
      roleId: inviteRoleId,
      grants: selectedInviteRole.grants,
    })
    setInvitePhone('')
    setIsInviteOpen(false)
  }

  const hasGrant = (membership, grant) => {
    const grants = membership.grants || membership.role?.grants || []
    return grants.includes('all') || grants.includes(grant)
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-32 pt-16">
        <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.82)] backdrop-blur-[16px]">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between py-1">
              <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4">
                <span className="grid size-6 shrink-0 place-items-center rounded">
                  <CaretLeft size={24} />
                </span>
                <span className="min-w-0 text-left">
                  <span className="type-section-title block truncate text-black">People & Access</span>
                  <span className="type-caption block truncate text-[#999999]">{project?.scope || 'Project workspace'}</span>
                </span>
              </button>
              <button type="button" onClick={() => setIsInviteOpen(true)} className="grid size-9 place-items-center rounded-xl border border-[#e0e0e0] bg-white" aria-label="Invite people">
                <UserCirclePlus size={19} />
              </button>
            </div>
          </div>
        </header>

        <div className="py-5">
          <section className="border-b border-[#e5e5e5] px-4 pb-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#dbe6df] bg-[#f7fbf8] text-black">
                <Eye size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="type-label uppercase text-[#5f7467]">Demo view as</p>
                <p className="type-card-title mt-1 text-black">{activeViewerRole?.label}</p>
                <p className="type-meta mt-1 text-[#5f7467]">{viewerSummary}</p>
              </div>
            </div>
            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
              {roleTemplates.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => actions.setActiveViewerRole(role.id)}
                  className={`type-caption shrink-0 rounded-full border px-3 py-2 uppercase ${activeViewerRoleId === role.id ? 'border-black bg-black text-white' : 'border-[#dbe6df] bg-white text-[#5f7467]'}`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </section>

          <section className="px-4 py-5">
            <SectionHeader title="Current people" meta={`${acceptedMembers.length} active`} />
            <div className="border-y border-[#e5e5e5]">
              {acceptedMembers.map((membership) => {
                const isOpen = openMemberId === membership.id
                const role = membership.role || roleTemplates.find((item) => item.id === membership.roleId)
                const canEditGrants = !hasGrant(membership, 'all')
                return (
                  <article key={membership.id} className="border-b border-[#e5e5e5] last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenMemberId(isOpen ? null : membership.id)}
                      className="flex w-full items-center justify-between gap-3 py-4 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img src={membership.user?.avatar || '/hynt-home/pro-2.png'} alt={membership.user?.name || 'Team member'} className="size-11 rounded-full border border-[#e0e0e0] object-cover" />
                        <div className="min-w-0">
                          <p className="type-body-strong truncate text-black">{membership.user?.name || 'Team member'}</p>
                          <p className="type-meta truncate text-[#6f6f6f]">{membership.user?.phone}</p>
                        </div>
                      </div>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className={`type-caption rounded-full px-2 py-1 uppercase ${roleTone[role?.id] || 'bg-[#f2f2f2] text-[#6f6f6f]'}`}>{role?.label}</span>
                        <CaretDown size={14} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="pb-5">
                        <label className="block">
                          <span className="type-label uppercase text-[#7b7b7b]">Role preset</span>
                          <select
                            value={membership.roleId}
                            onChange={(event) => actions.updateMembershipRole(membership.id, event.target.value)}
                            className="type-body-strong mt-2 h-11 w-full rounded-xl border border-[#dbe6df] bg-[#f7fbf8] px-3 text-black outline-none"
                            disabled={membership.roleId === 'principal-pro'}
                          >
                            {roleTemplates.map((template) => (
                              <option key={template.id} value={template.id}>{template.label}</option>
                            ))}
                          </select>
                        </label>

                        <div className="mt-4 space-y-4">
                          {permissionGroups.map((group) => (
                            <section key={group.id}>
                              <p className="type-label uppercase text-[#5f7467]">{group.label}</p>
                              <div className="mt-2 space-y-2">
                                {group.grants.map(([grant, label]) => (
                                  <div key={grant} className="flex items-center justify-between gap-3 rounded-xl border border-[#ededed] bg-[#fbfbfb] px-3 py-2">
                                    <span className="type-body text-black">{label}</span>
                                    <AccessToggle
                                      enabled={hasGrant(membership, grant)}
                                      disabled={!canEditGrants}
                                      onClick={() => actions.toggleMembershipGrant(membership.id, grant)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </section>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </section>

          <section className="px-4 pb-6">
            <SectionHeader title="Pending invites" meta={`${pendingInvites.length} pending`} />
            <div className="border-y border-[#e5e5e5]">
              {pendingInvites.length ? pendingInvites.map((invite) => {
                const role = roleTemplates.find((item) => item.id === invite.roleId)
                return (
                  <article key={invite.id} className="border-b border-[#e5e5e5] py-4 last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="type-body-strong truncate text-black">{invite.phone}</p>
                        <p className="type-meta mt-1 text-[#6f6f6f]">{role?.label} invite</p>
                      </div>
                      <span className="type-caption rounded-full bg-[#fff9ef] px-2 py-1 uppercase text-[#9f8350]">Pending</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#dbe6df] bg-[#f7fbf8] px-3 py-2">
                      <LinkSimple size={15} className="shrink-0" />
                      <p className="type-meta min-w-0 flex-1 truncate text-[#5f7467]">{invite.inviteUrl}</p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => actions.acceptInvite(invite.id)} className="type-label flex h-10 items-center justify-center gap-2 rounded-xl bg-black text-white">
                        <CheckCircle size={15} />
                        Mock accept
                      </button>
                      <button type="button" onClick={() => actions.cancelInvite(invite.id)} className="type-label flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e1b8b8] bg-white text-[#c34545]">
                        <XCircle size={15} />
                        Cancel
                      </button>
                    </div>
                  </article>
                )
              }) : (
                <article className="py-6 text-center">
                  <UserCirclePlus size={24} className="mx-auto text-[#5f7467]" />
                  <p className="type-card-title mt-3 text-black">No pending invites</p>
                  <p className="type-body mt-1 text-[#5f7467]">New invite links will appear here for demo approval.</p>
                </article>
              )}
            </div>
          </section>
        </div>
      </section>

      <div className={`fixed inset-0 z-[110] flex items-end justify-center bg-black/30 transition-opacity ${isInviteOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className={`w-full max-w-[390px] border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-transform ${isInviteOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="type-section-title text-black">Invite person</p>
            <button type="button" onClick={() => setIsInviteOpen(false)} className="grid size-8 place-items-center rounded-full bg-[#f2f2f2]" aria-label="Close invite">
              <XCircle size={17} />
            </button>
          </div>
          <p className="type-label mt-4 uppercase text-[#7b7b7b]">Mobile number</p>
          <div className="mt-2 flex items-center gap-2">
            <input
              value={invitePhone}
              onChange={(event) => setInvitePhone(event.target.value)}
              placeholder="+91 98765 43210"
              className="type-body h-10 min-w-0 flex-1 rounded-xl border border-[#d7d7d7] px-3 outline-none"
            />
            <select
              value={inviteRoleId}
              onChange={(event) => setInviteRoleId(event.target.value)}
              aria-label="Invite role"
              className="type-meta h-10 w-[132px] rounded-xl border border-[#d7d7d7] bg-white px-2 text-black outline-none"
            >
              {roleTemplates.filter((role) => role.id !== 'principal-pro').map((role) => (
                <option key={role.id} value={role.id}>{role.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={sendInvite}
              disabled={!invitePhone.trim()}
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-black text-white disabled:bg-[#d9d9d9]"
              aria-label="Send invite"
            >
              <PaperPlaneTilt size={17} weight="fill" />
            </button>
          </div>
          <p className="type-meta mt-2 text-[#7b7b7b]">Invite links carry a role preset and feature permissions.</p>
        </div>
      </div>
    </main>
  )
}

export default PeopleAccessWorkspace
