import { useMemo } from 'react'
import {
  CaretLeft,
  Check,
} from '@phosphor-icons/react'
import { useSharedProject } from '../collaboration/mockProjectStore'

const formatDate = (value) => new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

function Header({ subtitle, onBack }) {
  return (
    <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
      <div className="px-4 py-3">
        <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4 py-1">
          <span className="grid size-6 shrink-0 place-items-center">
            <CaretLeft size={24} />
          </span>
          <span className="min-w-0 text-left">
            <span className="typo-section-title block truncate text-black">Project timeline</span>
            <span className="typo-caption block truncate text-[#999999]">{subtitle}</span>
          </span>
        </button>
      </div>
    </header>
  )
}

function statusLabel(phase) {
  if (phase.status === 'done') return 'Completed'
  if (phase.status === 'active') return phase.delay ? 'Delayed' : 'In progress'
  return 'Upcoming'
}

function HomeownerTimelineWorkspace({ onBack }) {
  const { project, timelinePhases } = useSharedProject('p-1')

  const sortedPhases = useMemo(
    () => [...timelinePhases].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
    [timelinePhases],
  )
  const completedCount = sortedPhases.filter((phase) => phase.status === 'done').length
  const progress = sortedPhases.length ? Math.round((completedCount / sortedPhases.length) * 100) : 0
  const activePhase = sortedPhases.find((phase) => phase.status === 'active') || null

  return (
    <main className="min-h-dvh w-full overflow-x-hidden bg-white font-['Urbanist'] text-black">
      <section className="mx-auto w-full max-w-[390px] pb-12 pt-16">
        <Header subtitle={`${project.name} / ${project.designerName}`} onBack={onBack} />

        <section className="border-b border-[#e5e5e5] px-4 py-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="typo-caption uppercase text-[#267449]">Timeline progress</p>
              <h1 className="typo-page-title mt-2 text-black">{progress}% complete</h1>
            </div>
            <span className="typo-caption rounded-full border border-[#dbe6df] px-3 py-2 text-[#5f7467]">
              {completedCount} / {sortedPhases.length} done
            </span>
          </div>
          <p className="typo-body mt-3 text-[#5f7467]">
            {activePhase ? `${activePhase.name} is the current live stage.` : 'The next active stage will appear here once work begins.'}
          </p>
          <div className="mt-4 h-1.5 rounded-full bg-[#ececec]">
            <div className="h-1.5 rounded-full bg-[#5fc18a]" style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="px-4 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="typo-section-title text-black">Track progress</h2>
            <span className="typo-caption text-[#7b7b7b]">Updated by your pro</span>
          </div>

          <div>
            {sortedPhases.map((phase, index) => {
              const isLast = index === sortedPhases.length - 1
              const isDone = phase.status === 'done'
              const isActive = phase.status === 'active'
              const lineTone = isDone ? 'bg-[#5fc18a]' : isActive ? 'bg-[#f0a34d]' : 'bg-[#d9d9d9]'
              const dotTone = isDone
                ? 'border-[#5fc18a] bg-[#5fc18a] text-white'
                : isActive
                  ? 'border-[#f0a34d] bg-[#fff7ee] text-[#f0a34d]'
                  : 'border-[#d0d0d0] bg-white text-transparent'

              return (
                <div key={phase.id} className="flex gap-3">
                  <div className="flex w-7 shrink-0 flex-col items-center">
                    <span className={`grid size-5 place-items-center rounded-full border ${dotTone}`}>
                      {isDone ? <Check size={12} weight="bold" /> : isActive ? <span className="block size-2 rounded-full bg-[#f0a34d]" /> : <span className="block size-2 rounded-full bg-[#d0d0d0]" />}
                    </span>
                    {!isLast ? <span className={`mt-1 h-full min-h-14 w-px ${lineTone}`} /> : null}
                  </div>

                  <div className="flex-1 border-b border-[#e5e5e5] pb-5 last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="typo-body-strong text-black">{phase.name}</p>
                        <p className="typo-meta mt-1 text-[#6f6f6f]">{formatDate(phase.startDate)} - {formatDate(phase.endDate)}</p>
                      </div>
                      <span className={`typo-caption whitespace-nowrap rounded-full px-2 py-1 ${isDone ? 'bg-[#eaf8ef] text-[#267449]' : isActive ? 'bg-[#fff1df] text-[#a86a00]' : 'bg-[#f2f2f2] text-[#6a6a6a]'}`}>
                        {statusLabel(phase)}
                      </span>
                    </div>

                    <p className="typo-body mt-2 text-[#202020]">{phase.note}</p>

                    <div className="mt-2 flex flex-wrap gap-2 text-[#6f6f6f]">
                      <span className="typo-caption rounded-full border border-[#e5e5e5] px-2 py-1">
                        {phase.assignedTo.join(', ')}
                      </span>
                      {phase.delay ? (
                        <span className="typo-caption rounded-full border border-[#f3d4ad] px-2 py-1 text-[#a86a00]">
                          {phase.delay.window} delay: {phase.delay.reason}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </section>
    </main>
  )
}

export default HomeownerTimelineWorkspace
