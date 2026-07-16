import { useMemo, useState } from 'react'
import {
  CaretRight,
  FileText,
  Handshake,
  PaperPlaneTilt,
  PencilSimpleLine,
  Plus,
  Trash,
} from '@phosphor-icons/react'
import Button from '../../components/ui/Button'
import { useSharedProject } from '../collaboration/mockProjectStore'
import ProjectWorkspaceHeader from '../shared/ProjectWorkspaceHeader'
import { formatBoqHistoryDate } from '../boq/boqHistoryUtils'
import { formatRupees, getBoqItemAmount } from '../boq/boqUtils'

const contractTemplates = [
  {
    id: 'full-service',
    name: 'Full-service interior agreement',
    label: 'Execution',
    description: 'Design, procurement coordination, execution supervision, payments, change orders, and handover.',
  },
  {
    id: 'design-only',
    name: 'Design consultation agreement',
    label: 'Design',
    description: 'Design deliverables, drawings, revisions, consultation windows, and owner-side execution responsibility.',
  },
  {
    id: 'renovation',
    name: 'Renovation works contract',
    label: 'Renovation',
    description: 'Site access, demolition, repair scope, variation approval, contractor coordination, and practical completion.',
  },
]

function todayLabel() {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function StatusPill({ children, tone = 'draft' }) {
  const toneClass = {
    draft: 'bg-[#f2f2f2] text-[#6f6f6f]',
    ready: 'bg-[#e7f5ed] text-[#267449]',
    sent: 'bg-[#fff3dd] text-[#a86a00]',
    signed: 'bg-[#e9f2ff] text-[#2f5f9f]',
  }[tone] || 'bg-[#f2f2f2] text-[#6f6f6f]'

  return <span className={`typo-caption shrink-0 rounded-full px-3 py-1 uppercase ${toneClass}`}>{children}</span>
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#edf2ee] py-3 last:border-b-0">
      <span className="typo-body text-[#5f7467]">{label}</span>
      <span className="typo-body-strong max-w-[58%] text-right text-black">{value}</span>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="typo-label uppercase text-[#7b7b7b]">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

function inputClass() {
  return 'typo-body h-12 w-full rounded-2xl border border-[#d8e2db] bg-white px-4 text-black outline-none focus:border-black'
}

function textareaClass() {
  return 'typo-body min-h-28 w-full resize-none rounded-2xl border border-[#d8e2db] bg-white px-4 py-3 text-black outline-none focus:border-black'
}

function buildContractFromTemplate(template, { project, document, contractTotal, boqMeta }) {
  return {
    id: `contract-${Date.now()}`,
    templateId: template.id,
    title: template.name,
    status: 'draft',
    createdAt: todayLabel(),
    sentAt: null,
    clientName: document.clientName || project?.clientName || 'Client',
    designerName: project?.designerName || 'Designer',
    projectName: document.projectName || project?.name || 'Project',
    location: document.location || project?.location || 'Project site',
    value: contractTotal,
    sowReference: document.projectName ? `Executed SOW for ${document.projectName}` : 'Executed SOW',
    boqReference: boqMeta?.approvedAt ? `Signed BOQ on ${formatBoqHistoryDate(boqMeta.approvedAt)}` : `BOQ v${boqMeta?.version || 1}`,
    terms: [
      'The executed SOW is the scope baseline for this agreement.',
      'Any scope, material, quantity, timeline, or budget change requires written approval before execution.',
      'Payments follow the approved milestones and receipts tracked in Finance.',
      'The homeowner provides reasonable site access for measurement, execution, supervision, and handover.',
    ],
    specialNotes: template.description,
  }
}

function ContractListItem({ contract, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(contract.id)} className="flex w-full items-center gap-3 border-b border-[#edf2ee] py-4 text-left last:border-b-0">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#eef7f1] text-[#267449]">
        <FileText size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="typo-body-strong block truncate text-black">{contract.title}</span>
            <span className="typo-meta mt-1 block truncate text-[#6f7d74]">{contract.clientName} / {contract.createdAt}</span>
          </span>
          <StatusPill tone={contract.status}>{contract.status}</StatusPill>
        </span>
      </span>
      <CaretRight size={16} className="shrink-0 text-[#9a9a9a]" />
    </button>
  )
}

function ContractPreview({ contract }) {
  return (
    <article className="bg-white">
      <div className="border-b border-[#edf2ee] px-5 py-5">
        <p className="typo-caption uppercase text-[#267449]">Agreement preview</p>
        <h1 className="typo-page-title mt-2 text-black">{contract.title}</h1>
        <p className="typo-body mt-2 text-[#5f7467]">{contract.projectName}</p>
      </div>

      <section className="border-b border-[#edf2ee] px-5 py-4">
        <h2 className="typo-section-title text-black">Parties</h2>
        <div className="mt-3 border-y border-[#edf2ee]">
          <SummaryLine label="Designer" value={contract.designerName} />
          <SummaryLine label="Client" value={contract.clientName} />
          <SummaryLine label="Project site" value={contract.location} />
        </div>
      </section>

      <section className="border-b border-[#edf2ee] px-5 py-4">
        <h2 className="typo-section-title text-black">Commercial basis</h2>
        <div className="mt-3 border-y border-[#edf2ee]">
          <SummaryLine label="Contract value" value={formatRupees(contract.value || 0)} />
          <SummaryLine label="Scope source" value={contract.sowReference} />
          <SummaryLine label="Quotation source" value={contract.boqReference} />
        </div>
      </section>

      <section className="px-5 py-4">
        <h2 className="typo-section-title text-black">Terms</h2>
        <div className="mt-3 space-y-3">
          {contract.terms.map((term, index) => (
            <div key={`${term}-${index}`} className="flex items-start gap-3">
              <span className="typo-caption mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#eef7f1] text-[#267449]">{index + 1}</span>
              <p className="typo-body text-black">{term}</p>
            </div>
          ))}
        </div>
        {contract.specialNotes ? <p className="typo-body mt-4 rounded-[18px] bg-[#f7fbf8] p-4 text-[#5f7467]">{contract.specialNotes}</p> : null}
      </section>
    </article>
  )
}

function ProContractWorkspace({ project, onBack }) {
  const projectId = project?.id || 'p-1'
  const { sow, boqItems, boqMeta } = useSharedProject(projectId)
  const document = useMemo(() => sow?.document || {}, [sow?.document])
  const contractTotal = useMemo(
    () => boqItems.reduce((sum, item) => sum + getBoqItemAmount(item), 0),
    [boqItems],
  )
  const starterContract = useMemo(() => {
    if (sow?.status !== 'executed') return null
    return {
      ...buildContractFromTemplate(contractTemplates[0], { project, document, contractTotal, boqMeta }),
      id: 'contract-default',
      status: 'ready',
      createdAt: sow.clientSignedAt ? formatBoqHistoryDate(sow.clientSignedAt) : todayLabel(),
    }
  }, [boqMeta, contractTotal, document, project, sow])

  const [contracts, setContracts] = useState(() => (starterContract ? [starterContract] : []))
  const [screen, setScreen] = useState('list')
  const [selectedContractId, setSelectedContractId] = useState(starterContract?.id || null)
  const selectedContract = contracts.find((contract) => contract.id === selectedContractId) || null
  const [draft, setDraft] = useState(null)

  const openContract = (id) => {
    setSelectedContractId(id)
    setScreen('preview')
  }

  const selectTemplate = (template) => {
    const contract = buildContractFromTemplate(template, { project, document, contractTotal, boqMeta })
    setContracts((current) => [contract, ...current])
    setSelectedContractId(contract.id)
    setScreen('preview')
  }

  const startEdit = () => {
    if (!selectedContract) return
    setDraft({
      title: selectedContract.title,
      clientName: selectedContract.clientName,
      location: selectedContract.location,
      specialNotes: selectedContract.specialNotes,
      termsText: selectedContract.terms.join('\n'),
    })
    setScreen('edit')
  }

  const saveDraft = () => {
    if (!selectedContract || !draft) return
    setContracts((current) => current.map((contract) => (
      contract.id === selectedContract.id
        ? {
          ...contract,
          title: draft.title,
          clientName: draft.clientName,
          location: draft.location,
          specialNotes: draft.specialNotes,
          terms: draft.termsText.split('\n').map((term) => term.trim()).filter(Boolean),
          status: contract.status === 'sent' ? 'sent' : 'ready',
        }
        : contract
    )))
    setDraft(null)
    setScreen('preview')
  }

  const sendToClient = () => {
    if (!selectedContract) return
    setContracts((current) => current.map((contract) => (
      contract.id === selectedContract.id
        ? { ...contract, status: 'sent', sentAt: todayLabel() }
        : contract
    )))
  }

  const deleteContract = () => {
    if (!selectedContract) return
    setContracts((current) => current.filter((contract) => contract.id !== selectedContract.id))
    setSelectedContractId(null)
    setScreen('list')
  }

  if (screen === 'templates') {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-8 pt-16">
          <ProjectWorkspaceHeader title="New contract" subtitle={project?.scope || 'Select template'} onBack={() => setScreen('list')} />
          <div className="ui-screen-content pt-6">
            <p className="typo-body text-[#5f7467]">Start from the agreement structure that matches how this project is being delivered.</p>
            <div className="mt-5 space-y-3">
              {contractTemplates.map((template) => (
                <button key={template.id} type="button" onClick={() => selectTemplate(template)} className="w-full rounded-[24px] border border-[#dbe6df] bg-white p-4 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="typo-caption rounded-full bg-[#eef7f1] px-2 py-1 uppercase text-[#267449]">{template.label}</span>
                      <p className="typo-section-title mt-3 text-black">{template.name}</p>
                      <p className="typo-body mt-2 text-[#5f7467]">{template.description}</p>
                    </div>
                    <CaretRight size={18} className="mt-1 shrink-0 text-[#7f9188]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (screen === 'edit' && selectedContract && draft) {
    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
          <ProjectWorkspaceHeader title="Edit contract" subtitle={selectedContract.title} onBack={() => setScreen('preview')} />
          <div className="ui-screen-content space-y-4 pt-6">
            <Field label="Contract title">
              <input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} className={inputClass()} />
            </Field>
            <Field label="Client">
              <input value={draft.clientName} onChange={(event) => setDraft((current) => ({ ...current, clientName: event.target.value }))} className={inputClass()} />
            </Field>
            <Field label="Project site">
              <input value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} className={inputClass()} />
            </Field>
            <Field label="Terms">
              <textarea value={draft.termsText} onChange={(event) => setDraft((current) => ({ ...current, termsText: event.target.value }))} className={textareaClass()} />
            </Field>
            <Field label="Special notes">
              <textarea value={draft.specialNotes} onChange={(event) => setDraft((current) => ({ ...current, specialNotes: event.target.value }))} className={textareaClass()} />
            </Field>
          </div>
          <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
            <Button type="button" fullWidth onClick={saveDraft}>Save contract</Button>
          </div>
        </section>
      </main>
    )
  }

  if (screen === 'preview' && selectedContract) {
    const isSent = selectedContract.status === 'sent'
    const isSigned = selectedContract.status === 'signed'

    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-32 pt-16">
          <ProjectWorkspaceHeader
            title="Contract preview"
            subtitle={selectedContract.status === 'sent' ? `Sent ${selectedContract.sentAt}` : project?.scope || 'Agreement draft'}
            onBack={() => setScreen('list')}
            actions={<Button type="button" variant="outline" icon={PencilSimpleLine} onClick={startEdit} aria-label="Edit contract" />}
          />
          <div className="pt-6">
            <div className="mb-4 flex items-center justify-between gap-3 px-4">
              <StatusPill tone={selectedContract.status}>{selectedContract.status}</StatusPill>
              <p className="typo-meta text-[#7b7b7b]">{selectedContract.createdAt}</p>
            </div>
            <ContractPreview contract={selectedContract} />
            <div className="px-4">
              <Button type="button" variant="ghost" fullWidth leadingIcon={Trash} onClick={deleteContract} className="mt-4 text-[#b42318] hover:bg-[#fff5f5]">
                Delete contract
              </Button>
            </div>
          </div>
          <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
            {isSigned ? (
              <Button type="button" fullWidth variant="outline" leadingIcon={FileText} className="border-black text-black">Download signed contract</Button>
            ) : isSent ? (
              <Button type="button" fullWidth leadingIcon={Handshake} onClick={() => setContracts((current) => current.map((contract) => contract.id === selectedContract.id ? { ...contract, status: 'signed' } : contract))}>
                Mark client signed
              </Button>
            ) : (
              <Button type="button" fullWidth trailingIcon={PaperPlaneTilt} onClick={sendToClient}>
                Send to client
              </Button>
            )}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
      <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
        <ProjectWorkspaceHeader
          title="Contracts"
          subtitle={project?.scope || 'Project agreements'}
          onBack={onBack}
          actions={<Button type="button" icon={Plus} aria-label="New contract" onClick={() => setScreen('templates')} />}
        />

        <div className="ui-screen-content pt-6">
          <section className="border-b border-[#e5e5e5] pb-5">
            <p className="typo-caption uppercase text-[#267449]">Project contracts</p>
            <h1 className="typo-page-title mt-2 text-black">{contracts.length} contract{contracts.length === 1 ? '' : 's'}</h1>
            <p className="typo-body mt-2 text-[#5f7467]">Create agreements from templates, preview the document, edit terms, send to client, and keep the signed copy here.</p>
          </section>

          <section className="grid grid-cols-3 border-b border-[#e5e5e5] py-5">
            <div className="border-r border-[#e5e5e5] pr-3">
              <p className="typo-label uppercase text-[#7a8780]">SOW</p>
              <p className="typo-body-strong mt-2 text-black">{sow?.status === 'executed' ? 'Executed' : 'Pending'}</p>
            </div>
            <div className="border-r border-[#e5e5e5] px-3">
              <p className="typo-label uppercase text-[#7a8780]">BOQ</p>
              <p className="typo-body-strong mt-2 text-black">{boqMeta?.status === 'approved' ? 'Signed' : 'Draft'}</p>
            </div>
            <div className="pl-3">
              <p className="typo-label uppercase text-[#7a8780]">Value</p>
              <p className="typo-body-strong mt-2 text-black">{formatRupees(contractTotal || 0)}</p>
            </div>
          </section>

          <section className="py-5">
            {contracts.length ? (
              <div className="border-y border-[#edf2ee]">
                {contracts.map((contract) => <ContractListItem key={contract.id} contract={contract} onOpen={openContract} />)}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#c8d8cf] bg-[#fbfffd] p-5 text-center">
                <FileText size={30} className="mx-auto text-[#7f9188]" />
                <p className="typo-body-strong mt-3 text-black">No contracts yet</p>
                <p className="typo-body mt-2 text-[#607269]">Create the first agreement once the SOW is ready to become a legal operating document.</p>
                <Button type="button" leadingIcon={Plus} onClick={() => setScreen('templates')} className="mt-5">New contract</Button>
              </div>
            )}
          </section>
        </div>

        <div className="fixed bottom-0 left-1/2 z-[95] w-full max-w-[390px] -translate-x-1/2 border-t border-[#e0e0e0] bg-white px-4 pb-5 pt-3">
          <Button type="button" fullWidth leadingIcon={Plus} onClick={() => setScreen('templates')}>
            New contract
          </Button>
        </div>
      </section>
    </main>
  )
}

export default ProContractWorkspace
