import { featureInteractionMap } from '../../collaboration/featureInteractionMap'

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

      <section className="border-t border-[#e0e0e0] pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="type-section-title text-black">Interaction map</h2>
          <span className="type-caption shrink-0 rounded-full border border-[#e0e0e0] bg-white px-3 py-1 uppercase text-[#6f6f6f]">Demo model</span>
        </div>

        <div className="space-y-3">
          {featureInteractionMap.map((item) => (
            <article key={item.feature} className="rounded-2xl border border-[#e1e1e1] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="type-card-title text-black">{item.feature}</p>
                  <p className="type-meta mt-1 text-[#808080]">{item.owner} to {item.client}</p>
                </div>
                <span className="type-caption shrink-0 rounded-full bg-[#f4fbf7] px-2 py-1 uppercase text-[#267449]">Role based</span>
              </div>
              <div className="mt-3 rounded-xl border border-[#dbe6df] bg-[#f7fbf8] p-3">
                <p className="type-caption uppercase text-[#6e907d]">Lifecycle</p>
                <p className="type-body mt-1 text-black">{item.lifecycle}</p>
              </div>
              <p className="type-meta mt-3 text-[#5f7467]">{item.permissions}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default ProToolsHome
