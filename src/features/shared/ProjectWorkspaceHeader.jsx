import { CaretLeft } from '@phosphor-icons/react'

export default function ProjectWorkspaceHeader({ title, subtitle, onBack, actions = null, below = null }) {
  return (
    <header className="ui-workspace-header fixed left-1/2 top-0 z-[90] w-full max-w-[390px] -translate-x-1/2">
      <div className="ui-workspace-header-inner">
        <div className="flex items-center justify-between gap-3 py-1">
          <button type="button" onClick={onBack} className="flex min-w-0 items-center gap-4">
            <span className="grid size-6 shrink-0 place-items-center">
              <CaretLeft size={24} />
            </span>
            <span className="min-w-0 text-left">
              <span className="typo-section-title ui-section-title block truncate">{title}</span>
              {subtitle ? <span className="typo-caption ui-muted block truncate">{subtitle}</span> : null}
            </span>
          </button>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
        {below ? <div className="mt-3">{below}</div> : null}
      </div>
    </header>
  )
}
