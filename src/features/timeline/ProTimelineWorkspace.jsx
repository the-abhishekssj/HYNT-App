import { useMemo, useRef, useState } from 'react'
import {
  CalendarDots,
  CaretLeft,
  CheckCircle,
  Plus,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'

const phaseTone = {
  done: 'border-[#d8e9df] bg-[#f7fbf8]',
  active: 'border-[#f1d8be] bg-[#fffaf4]',
  upcoming: 'border-[#e5e5e5] bg-white',
}

const badgeTone = {
  done: 'bg-[#eaf8ef] text-[#267449]',
  active: 'bg-[#fff1df] text-[#a86a00]',
  upcoming: 'bg-[#f2f2f2] text-[#6a6a6a]',
}

const formatDate = (value) => new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

function Header({ subtitle, onBack, onAdd }) {
  return (
    <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between py-1">
          <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4">
            <span className="grid size-6 shrink-0 place-items-center">
              <CaretLeft size={24} />
            </span>
            <span className="min-w-0 text-left">
              <span className="typo-section-title block truncate text-black">Timeline</span>
              <span className="typo-caption block truncate text-[#999999]">{subtitle}</span>
            </span>
          </button>
          <button type="button" onClick={onAdd} className="grid size-9 place-items-center rounded-xl bg-black text-white" aria-label="Add timeline phase">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

function ProTimelineWorkspace({ project, onBack }) {
  const projectId = project?.id || 'p-1'
  const { timelinePhases, actions } = useSharedProject(projectId)
  const [phaseName, setPhaseName] = useState('')
  const [delayTargetId, setDelayTargetId] = useState(null)
  const phaseInputRef = useRef(null)

  const completedCount = timelinePhases.filter((phase) => phase.status === 'done').length
  const progress = timelinePhases.length ? Math.round((completedCount / timelinePhases.length) * 100) : 0
  const activePhase = timelinePhases.find((phase) => phase.status === 'active') || timelinePhases[0] || null
  const delayedPhases = timelinePhases.filter((phase) => phase.delay)

  const sortedPhases = useMemo(
    () => [...timelinePhases].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
    [timelinePhases],
  )

  const addPhase = () => {
    if (!phaseName.trim()) return
    actions.addTimelinePhase({
      name: phaseName.trim(),
      startDate: '2025-12-01',
      endDate: '2025-12-15',
      assignedTo: ['Riya Desai'],
      note: 'Custom milestone added from the project timeline.',
    })
    setPhaseName('')
  }

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
        <Header
          subtitle={project?.scope || 'Project schedule'}
          onBack={onBack}
          onAdd={() => phaseInputRef.current?.focus()}
        />

        <section className="border-b border-[#e5e5e5] px-4 py-5">
          <p className="typo-caption uppercase text-[#267449]">Project progress</p>
          <h1 className="typo-page-title mt-2 text-black">{progress}% complete</h1>
          <p className="typo-body mt-2 text-[#5f7467]">
            {completedCount} of {timelinePhases.length} phases done. {activePhase ? `${activePhase.name} is currently active.` : 'No active phase yet.'}
          </p>
          <div className="mt-4 h-2 rounded-full bg-[#ececec]">
            <div className="h-2 rounded-full bg-[#5fc18a]" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-3 border-y border-[#e5e5e5]">
            {[
              ['Done', completedCount],
              ['Active', activePhase ? 1 : 0],
              ['Delayed', delayedPhases.length],
            ].map(([label, value]) => (
              <div key={label} className="border-r border-[#e5e5e5] px-3 py-3 text-center last:border-r-0">
                <p className="typo-caption uppercase text-[#7b7b7b]">{label}</p>
                <p className="typo-meta mt-1 text-black">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-[#e0e0e0] px-4 py-6">
          <h2 className="typo-section-title text-black">Daily actions</h2>
          <div className="mt-3 flex items-start justify-between gap-2 overflow-hidden">
            <button type="button" onClick={() => activePhase && actions.markTimelinePhaseDone(activePhase.id)} className="flex min-w-0 items-center gap-2 py-2 text-left">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[rgba(217,217,217,0.24)]">
                <CheckCircle size={20} />
              </span>
              <span className="typo-body-strong truncate text-black">Mark active done</span>
            </button>
            <button type="button" onClick={() => activePhase && setDelayTargetId(activePhase.id)} className="flex min-w-0 items-center gap-2 py-2 text-left">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[rgba(217,217,217,0.24)]">
                <CalendarDots size={20} />
              </span>
              <span className="typo-body-strong truncate text-black">Log delay</span>
            </button>
          </div>
        </section>

        <section className="px-4 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="typo-section-title text-black">Phases</h2>
            <span className="typo-caption text-[#7b7b7b]">{sortedPhases.length} total</span>
          </div>
          <div className="space-y-3">
            {sortedPhases.map((phase) => (
              <article key={phase.id} className={`rounded-[20px] border px-4 py-4 ${phaseTone[phase.status] || phaseTone.upcoming}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="typo-body-strong text-black">{phase.name}</p>
                    <p className="typo-meta mt-1 text-[#6f6f6f]">{formatDate(phase.startDate)} - {formatDate(phase.endDate)}</p>
                  </div>
                  <span className={`typo-caption rounded-full px-2 py-1 uppercase ${badgeTone[phase.status] || badgeTone.upcoming}`}>
                    {phase.status}
                  </span>
                </div>
                {phase.status === 'active' ? (
                  <div className="mt-3 h-2 rounded-full bg-[#ececec]">
                    <div className="h-2 rounded-full bg-[#f0a34d]" style={{ width: `${phase.progress}%` }} />
                  </div>
                ) : null}
                <p className="typo-body mt-3 text-[#202020]">{phase.note}</p>
                <p className="typo-meta mt-2 text-[#6f6f6f]">Assigned: {phase.assignedTo.join(', ')}</p>
                {phase.delay ? <p className="typo-caption mt-2 text-[#a86a00]">Delayed by {phase.delay.window} / {phase.delay.reason}{phase.clientNotified ? ' / homeowner notified' : ''}</p> : null}
              </article>
            ))}
          </div>
        </section>
      </section>

      <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-6 pt-4">
        {delayTargetId ? (
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { actions.delayTimelinePhase(delayTargetId, { window: '2 weeks', reason: 'Material delay', notifyClient: true }); setDelayTargetId(null) }} className="typo-body-strong h-10 rounded-xl bg-black text-white">
              Delay + notify
            </button>
            <button type="button" onClick={() => setDelayTargetId(null)} className="typo-body-strong h-10 rounded-xl border border-[#d7d7d7]">
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={phaseInputRef}
              value={phaseName}
              onChange={(event) => setPhaseName(event.target.value)}
              placeholder="Add custom phase"
              className="typo-body h-10 min-w-0 flex-1 rounded-xl border border-[#d7d7d7] px-3 outline-none"
            />
            <button type="button" onClick={addPhase} disabled={!phaseName.trim()} className="grid size-10 shrink-0 place-items-center rounded-xl bg-black text-white disabled:bg-[#d9d9d9]" aria-label="Add phase">
              <Plus size={17} />
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default ProTimelineWorkspace
