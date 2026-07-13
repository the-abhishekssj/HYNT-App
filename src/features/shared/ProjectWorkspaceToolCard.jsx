import { CaretRight } from '@phosphor-icons/react'

function ProjectWorkspaceToolCard({
  icon: Icon,
  title,
  onClick,
  meta = null,
  preview = null,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ui-card flex min-h-[132px] min-w-0 flex-1 flex-col justify-between p-3 text-left"
    >
      <div className="flex flex-1 flex-col justify-between gap-5">
        <div className="flex items-center justify-between">
          <span className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[#5fc18a] text-white">
            <Icon size={24} weight="regular" />
          </span>
          <CaretRight size={16} className="text-[#8fa098]" />
        </div>
        <div>
          <p className="typo-body-strong ui-section-title truncate">{title}</p>
          {meta ? <p className="typo-meta ui-muted mt-1">{meta}</p> : null}
        </div>
      </div>

      {preview}
    </button>
  )
}

export default ProjectWorkspaceToolCard
