function ToolModuleCard({
  icon: Icon,
  title,
  subtitle,
  badge = null,
  onClick = null,
  footer = null,
}) {
  const Tag = onClick ? 'button' : 'article'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick || undefined}
      className="ui-soft-card p-4 text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-[var(--radius-md)] border border-[#e2e2e2] bg-white text-black">
          <Icon size={18} weight="regular" />
        </span>
        {badge ? <span className="typo-caption rounded-full bg-white px-2 py-1 uppercase text-[#888888]">{badge}</span> : null}
      </div>
      <p className="typo-card-title ui-section-title mt-4">{title}</p>
      <p className="typo-meta ui-muted mt-1">{subtitle}</p>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </Tag>
  )
}

export default ToolModuleCard
