function ProToolsHome({ tools }) {
  return (
    <section className="px-4 py-6">
      <section className="pb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-section-title text-black">Active modules</h2>
          <span className="type-caption rounded-full border border-[#e0e0e0] bg-white px-3 py-1 uppercase text-[#6f6f6f]">{tools.length} tools</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <article key={tool.title} className="rounded-2xl border border-[#e1e1e1] bg-[#fbfbfb] p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-[#e2e2e2] bg-white text-black">
                    <Icon size={18} weight="regular" />
                  </span>
                  <span className="type-caption rounded-full bg-white px-2 py-1 uppercase text-[#888888]">
                    {tool.title === 'Moodboard' || tool.title === 'BOQs' ? 'Assist' : 'Workspace'}
                  </span>
                </div>
                <p className="type-card-title mt-4 text-black">{tool.title}</p>
                <p className="type-meta mt-1 text-[#808080]">{tool.subtitle}</p>
              </article>
            )
          })}
        </div>
      </section>
    </section>
  )
}

export default ProToolsHome
