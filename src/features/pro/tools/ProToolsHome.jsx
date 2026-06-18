import { Eye } from '@phosphor-icons/react'
import { featureInteractionMap } from '../../collaboration/featureInteractionMap'
import { useSharedProject } from '../../collaboration/mockProjectStore'
import ToolModuleCard from '../../shared/ToolModuleCard'

function ProToolsHome({ tools }) {
  const { activeViewer, activeViewerRoleId, roleTemplates, actions } = useSharedProject('p-1')

  return (
    <section className="px-4 py-6">
      <section className="pb-6">
        <div className="rounded-[24px] border border-[#e1e1e1] bg-white p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[#dbe6df] bg-[#f7fbf8] text-black">
              <Eye size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="type-label uppercase text-[#5f7467]">Demo view as</p>
              <p className="type-card-title mt-1 text-black">{activeViewer?.role?.label || 'Principal Pro'}</p>
              <p className="type-meta mt-1 text-[#5f7467]">Global prototype switcher so you never get stuck inside restricted screens.</p>
            </div>
          </div>

          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            {roleTemplates.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => actions.setActiveViewerRole(role.id)}
                className={`type-caption shrink-0 rounded-full border px-3 py-2 uppercase ${activeViewerRoleId === role.id ? 'border-black bg-black text-white' : 'border-[#dbe6df] bg-white text-[#5f7467]'}`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-section-title text-black">Active modules</h2>
          <span className="type-caption rounded-full border border-[#e0e0e0] bg-white px-3 py-1 uppercase text-[#6f6f6f]">{tools.length} tools</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => {
            return (
              <ToolModuleCard
                key={tool.title}
                icon={tool.icon}
                title={tool.title}
                subtitle={tool.subtitle}
                badge={tool.title === 'Moodboard' || tool.title === 'BOQs' ? 'Assist' : 'Workspace'}
              />
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
