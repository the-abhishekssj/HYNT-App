import { CaretLeft } from '@phosphor-icons/react'

export default function ProjectWorkspaceHeader({ title, subtitle, onBack, actions = null }) {
  return (
    <header className="fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2 border-b border-[#e0e0e0] bg-[rgba(255,255,255,0.72)] backdrop-blur-[16px]">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3 py-1">
          <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4">
            <span className="grid size-6 shrink-0 place-items-center">
              <CaretLeft size={24} />
            </span>
            <span className="min-w-0 text-left">
              <span className="type-section-title block truncate text-black">{title}</span>
              {subtitle ? <span className="type-caption block truncate text-[#999999]">{subtitle}</span> : null}
            </span>
          </button>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      </div>
    </header>
  )
}
