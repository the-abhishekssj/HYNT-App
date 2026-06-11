function ProToolsHome({ tools }) {
  const buildQueue = [
    ['SOW', 'Live now'],
    ['Tasks', 'Building next'],
    ['Diary', 'Building next'],
    ['Contract', 'Queued'],
  ]

  return (
    <section className="px-4 py-6">
      <section className="pb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold leading-6 text-black">Active modules</h2>
          <span className="rounded-full border border-[#e0e0e0] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f6f6f]">{tools.length} tools</span>
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
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#888888]">
                    {tool.title === 'Moodboard' || tool.title === 'BOQs' ? 'Assist' : 'Workspace'}
                  </span>
                </div>
                <p className="mt-4 text-[14px] font-extrabold leading-5 text-black">{tool.title}</p>
                <p className="mt-1 text-[12px] font-medium leading-[18px] text-[#808080]">{tool.subtitle}</p>
              </article>
            )
          })}
        </div>
      </section>

      <div className="h-2 -mx-4 bg-[#e0e0e0]" />

      <section className="py-6">
        <h2 className="text-[16px] font-extrabold leading-6 text-black">Build queue</h2>
        <div className="mt-4 space-y-3">
          {buildQueue.map(([label, status]) => (
            <article key={label} className="flex items-center justify-between rounded-2xl border border-[#e1e1e1] bg-white px-4 py-4">
              <div>
                <p className="text-[14px] font-bold leading-5 text-black">{label}</p>
                <p className="mt-1 text-[12px] font-medium leading-[18px] text-[#808080]">Native HYNT screen treatment</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${status === 'Live now' ? 'bg-[#eaf9f1] text-[#2a9a64]' : status === 'Queued' ? 'bg-[#f2f2f2] text-[#777777]' : 'bg-[#fff7e8] text-[#a46a10]'}`}>
                {status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default ProToolsHome
