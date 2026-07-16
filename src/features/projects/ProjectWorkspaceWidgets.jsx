import {
  CaretRight,
  CheckCircle,
  CheckSquareOffset,
  CurrencyInr,
  Handshake,
  House,
  ImagesSquare,
  NotePencil,
  PencilSimpleLine,
  Scroll,
  User,
} from '@phosphor-icons/react'

const projectWorkspaceTools = [
  { label: 'SOW', icon: NotePencil },
  { label: 'Moodboard', icon: ImagesSquare },
  { label: 'BOQ', icon: Scroll },
  { label: 'Tasks', icon: CheckSquareOffset },
  { label: 'Finance', icon: CurrencyInr },
  { label: 'Contract', icon: Handshake },
  { label: 'Team', icon: User },
  { label: 'Floor plan', icon: House },
  { label: 'Site diary', icon: PencilSimpleLine },
]

const toolAlertTargets = {
  SOW: ['sow'],
  Moodboard: ['archive', 'moodboard'],
  BOQ: ['boq'],
  Tasks: ['tasks'],
  Finance: ['finance'],
  Contract: ['contract'],
  Team: ['team'],
  'Floor plan': ['floor-plan'],
  'Site diary': ['site-diary'],
}

const parseAreaValue = (area) => {
  if (typeof area === 'number') return area
  const numeric = Number.parseFloat(String(area).replace(/[^0-9.]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

const formatLakhs = (value) => `${value.toFixed(1)}L`
const formatRupees = (value) => `${Math.round(value).toLocaleString('en-IN')}`

function getEmptyWidgetCopy(label) {
  if (label === 'SOW') return ['No SOW yet', 'Choose template']
  if (label === 'Moodboard') return ['No items yet', 'Open moodboard']
  if (label === 'BOQ') return ['No BOQ yet', 'Import or price']
  if (label === 'Tasks') return ['No tasks yet', 'Create task']
  if (label === 'Finance') return ['No invoices yet', 'Build schedule']
  if (label === 'Contract') return ['No agreement yet', 'After SOW sign-off']
  if (label === 'Team') return ['No collaborators', 'Invite team']
  if (label === 'Floor plan') return ['Not uploaded', 'Upload floor plan']
  if (label === 'Site diary') return ['No updates yet', 'Add site log']
  return ['Not started', 'Open workspace']
}

function EmptyWidgetPreview({ label }) {
  if (label === 'SOW') {
    return (
      <div className="space-y-2">
        <div className="grid h-[44px] grid-cols-[1fr_34px] gap-2 rounded-[12px] border border-[#d7e5dc] bg-white p-2">
          <div className="space-y-1.5">
            <span className="block h-1.5 w-3/4 rounded-full bg-[#dfeae4]" />
            <span className="block h-1.5 w-1/2 rounded-full bg-[#edf4f0]" />
          </div>
          <span className="rounded-[9px] border border-dashed border-[#bdd0c5]" />
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((step) => <span key={step} className="h-1.5 flex-1 rounded-full bg-[#dce8df]" />)}
        </div>
      </div>
    )
  }

  if (label === 'Moodboard') {
    return (
      <div className="grid h-[52px] grid-cols-3 gap-2">
        {['Concept', 'Materials', 'Products'].map((folder) => (
          <span key={folder} className="relative rounded-[10px] border border-dashed border-[#c8d8cf] bg-white">
            <span className="absolute left-2 top-2 h-1.5 w-5 rounded-full bg-[#e3ede7]" />
            <span className="absolute bottom-2 left-2 right-2 h-1 rounded-full bg-[#eef5f1]" />
          </span>
        ))}
      </div>
    )
  }

  if (label === 'BOQ') {
    return (
      <div className="overflow-hidden rounded-[12px] border border-[#d7e5dc] bg-white">
        <div className="grid grid-cols-[1fr_34px] gap-2 border-b border-[#e7efe9] bg-[#f5faf7] px-2 py-1.5">
          <span className="h-1.5 rounded-full bg-[#cfded5]" />
          <span className="h-1.5 rounded-full bg-[#dfeae4]" />
        </div>
        {[0, 1].map((row) => (
          <div key={row} className="grid grid-cols-[1fr_34px] gap-2 px-2 py-1.5">
            <span className="h-1.5 rounded-full bg-[#e6f0ea]" />
            <span className="h-1.5 rounded-full bg-[#eef5f1]" />
          </div>
        ))}
      </div>
    )
  }

  if (label === 'Tasks') {
    return (
      <div className="space-y-2 rounded-[12px] border border-[#d7e5dc] bg-white p-2">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="size-3 rounded-full border border-[#c8d8cf]" />
            <span className={`h-1.5 rounded-full bg-[#e2ece6] ${row === 0 ? 'w-16' : row === 1 ? 'w-12' : 'w-20'}`} />
          </div>
        ))}
      </div>
    )
  }

  if (label === 'Finance') {
    return (
      <div className="rounded-[12px] border border-[#d7e5dc] bg-white px-3 py-3">
        <div className="relative flex items-center justify-between">
          <span className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-[#dfeae4]" />
          {[0, 1, 2].map((dot) => <span key={dot} className="relative size-4 rounded-full border border-[#c8d8cf] bg-white" />)}
        </div>
        <div className="mt-3 h-1.5 w-2/3 rounded-full bg-[#e8f1ec]" />
      </div>
    )
  }

  if (label === 'Contract') {
    return (
      <div className="grid h-[52px] grid-cols-[1fr_38px] gap-2 rounded-[12px] border border-[#d7e5dc] bg-white p-2">
        <div className="space-y-2">
          <span className="block h-1.5 w-4/5 rounded-full bg-[#dfeae4]" />
          <span className="block h-1.5 w-1/2 rounded-full bg-[#eef5f1]" />
          <span className="block h-px w-3/4 bg-[#cbdad1]" />
        </div>
        <span className="rounded-full border border-dashed border-[#c8d8cf]" />
      </div>
    )
  }

  if (label === 'Team') {
    return (
      <div className="flex h-[52px] items-center">
        {['P', '+', '+'].map((marker, personIndex) => (
          <span key={`${marker}-${personIndex}`} className={`typo-meta grid size-10 place-items-center rounded-full border-2 border-white ${personIndex === 0 ? 'bg-[#e7f5ed] text-[#245e3f]' : 'border-dashed bg-white text-[#9baaa2]'} ${personIndex > 0 ? '-ml-2' : ''}`}>
            {marker}
          </span>
        ))}
      </div>
    )
  }

  if (label === 'Floor plan') {
    return (
      <div className="grid h-[52px] grid-cols-[30px_1fr_30px] gap-1 rounded-[12px] border border-dashed border-[#c8d8cf] bg-white p-2">
        <span className="rounded-[6px] border border-[#e0ebe5]" />
        <span className="rounded-[6px] border border-[#d5e2da]" />
        <span className="rounded-[6px] border border-[#e0ebe5]" />
      </div>
    )
  }

  if (label === 'Site diary') {
    return (
      <div className="grid h-[52px] grid-cols-2 gap-3">
        {[0, 1].map((row) => (
          <div key={row} className="flex items-center gap-2 rounded-[12px] border border-[#d7e5dc] bg-white p-2">
            <span className="size-8 rounded-[9px] border border-dashed border-[#c8d8cf]" />
            <span className="min-w-0 flex-1 space-y-1.5">
              <span className="block h-1.5 w-4/5 rounded-full bg-[#dfeae4]" />
              <span className="block h-1.5 w-1/2 rounded-full bg-[#eef5f1]" />
            </span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

function ProjectWorkspaceWidgets({
  project,
  sow,
  memberships = [],
  archiveItems = [],
  financeInvoices = [],
  financeExpenses = [],
  siteDiaryEntries = [],
  siteDiaryIssues = [],
  siteDiaryReferences = [],
  boqMeta = null,
  boqItems = [],
  fallbackBoqItems = [],
  projectTasks = [],
  taskApprovals = [],
  onOpenTool,
}) {
  const currentBoqItems = boqItems.length ? boqItems : (project?.id === 'p-1' ? fallbackBoqItems : [])
  const rowAmount = (row) => parseAreaValue(row.quantity ?? row.area) * row.rate
  const totalEstimate = currentBoqItems.reduce((acc, row) => acc + rowAmount(row), 0)
  const openTaskCount = projectTasks.filter((task) => task.status !== 'done').length
  const inProgressTaskCount = projectTasks.filter((task) => task.status === 'inprogress').length
  const pendingApprovalCount = taskApprovals.filter((approval) => ['pending', 'question'].includes(approval.status)).length
  const outstandingInvoiceCount = financeInvoices.filter((invoice) => !['paid', 'Paid'].includes(invoice.status)).length
  const activeTeamMembers = memberships.filter((membership) => (
    membership.status !== 'rejected'
    && !['principal-pro', 'homeowner'].includes(membership.roleId)
    && ![`m-junior-${project?.id}`, `m-site-${project?.id}`].includes(membership.id)
  ))
  const hasSow = Boolean(sow)
  const hasArchiveContent = archiveItems.length > 0
  const hasBoqContent = currentBoqItems.length > 0
  const hasTaskContent = projectTasks.length > 0 || taskApprovals.length > 0
  const hasFinanceContent = financeInvoices.length > 0 || financeExpenses.length > 0 || project.spentL > 0 || project.receivedL > 0
  const hasContractContent = sow?.status === 'executed'
  const hasTeamContent = activeTeamMembers.length > 0
  const hasFloorPlanContent = false
  const hasSiteDiaryContent = siteDiaryEntries.length > 0 || siteDiaryIssues.length > 0 || siteDiaryReferences.length > 0
  const sowStatusLabel = sow?.status ? sow.status.replace(/-/g, ' ') : 'No SOW yet'
  const boqHistoryCount = boqMeta?.history?.length || 0
  const boqVersionLabel = boqHistoryCount ? `${boqHistoryCount} signed` : `v${boqMeta?.version || 1}`
  const boqTileStatusMap = {
    draft: ['In progress', 'bg-[#eef7f1] text-[#267449]'],
    ready: ['Ready', 'bg-[#e9f2ff] text-[#2f5f9f]'],
    shared: ['Approval', 'bg-[#fff0dc] text-[#a55b13]'],
    changesRequested: ['Remarks', 'bg-[#fff0dc] text-[#a55b13]'],
    revised: ['Revised', 'bg-[#e9f2ff] text-[#2f5f9f]'],
    approved: [boqMeta?.financeScheduleCreated ? 'Finance' : 'Approved', 'bg-[#e4f5eb] text-[#24754b]'],
  }
  const [boqTileStatus, boqTileStatusClass] = boqTileStatusMap[boqMeta?.status] || ['In progress', 'bg-[#eef7f1] text-[#267449]']
  const budgetUsage = project.budgetL > 0 ? Math.min(Math.round((project.spentL / project.budgetL) * 100), 100) : 0
  const latestDiaryEntries = [...siteDiaryEntries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)

  return (
    <section className="px-4 pb-6 pt-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="typo-section-title text-black">Workspace</h2>
        <span className="typo-caption text-[#8a8a8a]">{projectWorkspaceTools.length} widgets</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {projectWorkspaceTools.map((tool) => {
          const Icon = tool.icon
          const isMoodboard = tool.label === 'Moodboard'
          const isBoq = tool.label === 'BOQ'
          const isSiteDiary = tool.label === 'Site diary'
          const isSow = tool.label === 'SOW'
          const isTasks = tool.label === 'Tasks'
          const isFinance = tool.label === 'Finance'
          const isContract = tool.label === 'Contract'
          const isTeam = tool.label === 'Team'
          const isFloorPlan = tool.label === 'Floor plan'
          const isWideWidget = isSiteDiary
          const isEmptyWidget = (
            (isMoodboard && !hasArchiveContent)
            || (isBoq && !hasBoqContent)
            || (isSiteDiary && !hasSiteDiaryContent)
            || (isSow && !hasSow)
            || (isTasks && !hasTaskContent)
            || (isFinance && !hasFinanceContent)
            || (isContract && !hasContractContent)
            || (isTeam && !hasTeamContent)
            || (isFloorPlan && !hasFloorPlanContent)
          )
          const emptyWidgetCopy = getEmptyWidgetCopy(tool.label)
          const updateCount = (project?.alerts || []).filter((alert) => (
            (toolAlertTargets[tool.label] || []).includes(alert.target)
          )).length

          return (
            <button
              key={tool.label}
              type="button"
              onClick={() => onOpenTool(tool.label)}
              className={`group flex h-[168px] min-w-0 flex-col overflow-hidden rounded-[20px] border p-[17px] text-left shadow-[0_18px_34px_rgba(16,36,24,0.12)] transition-transform active:scale-[0.985] ${
                isWideWidget
                  ? 'col-span-2 border-[#dce8df] bg-[#fbfffd]'
                  : 'border-[#dce8df] bg-[#fbfffd]'
              }`}
            >
              <div className="flex h-8 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-[12px] bg-[#e7f5ed] text-[#226342]">
                    <Icon size={16} weight="regular" />
                  </span>
                  <p className="typo-body-strong truncate text-black">{isSiteDiary ? 'Site Diary' : tool.label}</p>
                </div>
                <span className="flex h-8 shrink-0 items-center gap-1.5">
                  {updateCount > 0 ? (
                    <span className="typo-status-mini grid min-h-4 min-w-4 place-items-center rounded-full bg-[#26c485] px-1 text-white">
                      {updateCount}
                    </span>
                  ) : null}
                  <CaretRight size={16} className="shrink-0 text-[#8fa098] transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>

              {isEmptyWidget ? (
                <div className="mt-2 flex h-[94px] flex-col justify-between">
                  <EmptyWidgetPreview label={tool.label} />
                  <div className="min-w-0">
                    <p className="typo-body-strong truncate text-[#173c2a]">{emptyWidgetCopy[0]}</p>
                    <p className="typo-meta truncate text-[#7a8b82]">{emptyWidgetCopy[1]}</p>
                  </div>
                </div>
              ) : null}

              {!isEmptyWidget && isMoodboard ? (
                <div className="mt-2 flex h-[94px] flex-col justify-between">
                  <div className="hynt-tool-preview-stack flex h-[46px] items-center overflow-visible">
                    {[
                      '/hynt-home/idea-1.png',
                      '/hynt-home/idea-2.png',
                      '/hynt-home/product.png',
                      '/hynt-home/idea-1.png',
                      '/hynt-home/idea-2.png',
                      '/hynt-home/product.png',
                      '/hynt-home/idea-1.png',
                    ].map((image, imageIndex) => (
                      <img
                        key={`${image}-${imageIndex}`}
                        src={image}
                        alt=""
                        style={{ zIndex: 8 - imageIndex }}
                        className={`hynt-tool-preview-image ${imageIndex % 2 === 0 ? 'hynt-tool-preview-image--tilt-left' : 'hynt-tool-preview-image--tilt-right'}`}
                      />
                    ))}
                  </div>
                  <p className="typo-meta text-[#64766c]">{archiveItems.length} moodboard item{archiveItems.length === 1 ? '' : 's'}</p>
                </div>
              ) : null}

              {!isEmptyWidget && isBoq ? (
                <div className="mt-2 flex h-[94px] flex-col justify-between">
                  <p className="typo-data-strong inline-flex items-center text-[#173c2a]"><CurrencyInr size={17} weight="bold" />{formatRupees(totalEstimate)}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="typo-meta whitespace-nowrap text-[#64766c]">{boqVersionLabel}</span>
                    <span className={`typo-meta whitespace-nowrap rounded-full px-2 py-1 ${boqTileStatusClass}`}>{boqTileStatus}</span>
                  </div>
                </div>
              ) : null}

              {!isEmptyWidget && isSow ? (
                <div className="mt-2 flex h-[94px] flex-col justify-between">
                  <span className="typo-meta w-fit rounded-full bg-[#e4f5eb] px-2 py-1 capitalize text-[#24754b]">{sowStatusLabel}</span>
                  <div>
                    <p className="typo-meta text-[#64766c]">scope completion</p>
                    <div className="mt-2 flex gap-1">
                      {[0, 1, 2, 3].map((step) => <span key={step} className={`h-1.5 flex-1 rounded-full ${step < 3 ? 'bg-[#5fc18a]' : 'bg-[#dce8df]'}`} />)}
                    </div>
                  </div>
                </div>
              ) : null}

              {!isEmptyWidget && isTasks ? (
                <div className="mt-2 flex h-[94px] flex-col justify-between">
                  <div className="flex items-end gap-2">
                    <p className="typo-title-20 text-[#173c2a]">{openTaskCount}</p>
                    <p className="typo-meta pb-0.5 text-[#64766c]">open tasks</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between"><span className="typo-meta text-[#64766c]">In progress</span><span className="typo-meta text-black">{inProgressTaskCount}</span></div>
                    <div className="flex items-center justify-between"><span className="typo-meta text-[#64766c]">Approvals</span><span className="typo-meta text-black">{pendingApprovalCount}</span></div>
                  </div>
                </div>
              ) : null}

              {!isEmptyWidget && isFinance ? (
                <div className="mt-2 flex h-[94px] flex-col justify-between">
                  <p className="typo-data-strong inline-flex items-center text-[#173c2a]"><CurrencyInr size={17} weight="bold" />{formatLakhs(project.spentL)}</p>
                  <div>
                    <p className="typo-meta text-[#64766c]">spent of {formatLakhs(project.budgetL)}</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e2ebe6]"><span className="block h-full rounded-full bg-[#5fc18a]" style={{ width: `${budgetUsage}%` }} /></div>
                  </div>
                  <p className="typo-meta text-[#64766c]">{outstandingInvoiceCount} payment{outstandingInvoiceCount === 1 ? '' : 's'} due</p>
                </div>
              ) : null}

              {!isEmptyWidget && isSiteDiary ? (
                <div className="hynt-site-diary-preview mt-2 h-[94px] overflow-hidden">
                  {latestDiaryEntries.map((entry) => (
                    <div key={entry.id} className="flex h-[47px] items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-[#ebebeb] bg-white text-[#8ca096]">
                        {entry.photos?.[0] ? (
                          <img src={entry.photos[0]} alt="" className="size-full object-cover" />
                        ) : (
                          <PencilSimpleLine size={16} />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="typo-body-strong truncate text-black">{entry.title}</p>
                        <p className="typo-meta truncate text-[#7b8f84]">{entry.note || entry.tags?.[0] || 'Site update shared'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {!isEmptyWidget && isContract ? (
                <div className="mt-2 flex h-[94px] flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" className="text-[#102418]" />
                    <span className="typo-body-strong text-[#173c2a]">Agreement ready</span>
                  </div>
                  <p className="typo-meta text-[#64766c]">Linked to latest SOW</p>
                </div>
              ) : null}

              {!isEmptyWidget && isTeam ? (
                <div className="mt-2 flex h-[94px] flex-col justify-between">
                  <div className="flex -space-x-2">
                    {activeTeamMembers.slice(0, 3).map((member, index) => (
                      member.user?.avatar || member.user?.image
                        ? <img key={member.id} src={member.user.avatar || member.user.image} alt="" className="size-10 rounded-full border-2 border-white object-cover" />
                        : <span key={member.id || index} className="typo-meta grid size-10 place-items-center rounded-full border-2 border-white bg-[#dff2e7] text-[#245e3f]">{member.user?.name?.slice(0, 1) || 'H'}</span>
                    ))}
                  </div>
                  <p className="typo-meta text-[#64766c]">{activeTeamMembers.length} collaborator{activeTeamMembers.length === 1 ? '' : 's'}</p>
                </div>
              ) : null}

              {!isEmptyWidget && isFloorPlan ? (
                <div className="mt-2 flex h-[94px] flex-col justify-between">
                  <div className="grid h-[68px] grid-cols-[38px_1fr_38px] gap-1 rounded-[12px] border border-[#cfe3d7] bg-white p-2">
                    <div className="grid grid-rows-2 gap-1"><span className="rounded-[6px] bg-[#e7f5ed]" /><span className="rounded-[6px] border border-[#dbe8df]" /></div>
                    <span className="rounded-[6px] border border-[#dbe8df]" />
                    <span className="rounded-[6px] bg-[#f4eadb]" />
                  </div>
                  <p className="typo-meta text-[#8a9a91]">Not uploaded</p>
                </div>
              ) : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default ProjectWorkspaceWidgets
