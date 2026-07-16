import { useMemo, useState } from 'react'
import {
  CaretRight,
  FileText,
  Handshake,
  ListBullets,
  ListNumbers,
  PaperPlaneTilt,
  PencilSimpleLine,
  Plus,
  Quotes,
  TextB,
  TextItalic,
  TextUnderline,
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

function EditorTool({ children, active = false, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid size-9 shrink-0 place-items-center rounded-[10px] border ${
        active ? 'border-[#102418] bg-[#102418] text-white' : 'border-[#d8e2db] bg-white text-[#33433a]'
      }`}
    >
      {children}
    </button>
  )
}

function OutlineTab({ children, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`typo-caption shrink-0 rounded-full px-3 py-1.5 ${
        active ? 'bg-[#102418] text-white' : 'border border-[#d8e2db] bg-white text-[#425349]'
      }`}
    >
      {children}
    </button>
  )
}

function cloneEditorBlocks(blocks = []) {
  return blocks.map((block) => ({
    ...block,
    fields: block.fields ? { ...block.fields } : undefined,
    rows: block.rows ? block.rows.map((row) => ({ ...row })) : undefined,
    clauses: block.clauses ? block.clauses.map((clause) => ({ ...clause, marks: { ...(clause.marks || {}) } })) : undefined,
    marks: { ...(block.marks || {}) },
  }))
}

function newBlockId(type) {
  return `${type}-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

function createContractEditorBlocks(contract) {
  if (contract.editorBlocks?.length) return cloneEditorBlocks(contract.editorBlocks)

  return [
    { id: 'title', type: 'heading', title: 'Title', text: contract.title, marks: {} },
    {
      id: 'parties',
      type: 'parties',
      title: 'Parties',
      fields: {
        designerName: contract.designerName,
        clientName: contract.clientName,
        location: contract.location,
      },
    },
    {
      id: 'commercial',
      type: 'commercial',
      title: 'Commercial basis',
      fields: {
        value: formatRupees(contract.value || 0),
        sowReference: contract.sowReference,
        boqReference: contract.boqReference,
      },
    },
    {
      id: 'terms',
      type: 'clauses',
      title: 'Terms',
      clauses: contract.terms.map((term, index) => ({ id: `clause-${index + 1}`, text: term, marks: {} })),
    },
    {
      id: 'payments',
      type: 'paymentSchedule',
      title: 'Payment schedule',
      rows: [
        { id: 'payment-1', milestone: 'Booking and mobilisation', amount: '10%', due: 'On contract signing' },
        { id: 'payment-2', milestone: 'Execution milestone', amount: '40%', due: 'After material lock' },
        { id: 'payment-3', milestone: 'Handover balance', amount: '50%', due: 'Before final handover' },
      ],
    },
    {
      id: 'signatures',
      type: 'signatures',
      title: 'Signatures',
      fields: {
        designerName: contract.designerName,
        clientName: contract.clientName,
      },
    },
    { id: 'notes', type: 'note', title: 'Special notes', text: contract.specialNotes || '', marks: {} },
  ]
}

function createInsertedBlock(type) {
  const id = newBlockId(type)
  if (type === 'clauses') {
    return {
      id,
      type,
      title: 'New clause set',
      clauses: [{ id: `${id}-clause-1`, text: 'Add a contract clause here.', marks: {} }],
    }
  }
  if (type === 'paymentSchedule') {
    return {
      id,
      type,
      title: 'Payment schedule',
      rows: [{ id: `${id}-row-1`, milestone: 'Milestone', amount: '0%', due: 'Due date' }],
    }
  }
  if (type === 'signatures') {
    return { id, type, title: 'Signatures', fields: { designerName: 'Designer', clientName: 'Client' } }
  }
  return { id, type: 'note', title: 'Note', text: 'Add supporting notes here.', marks: {} }
}

function textMarkClass(marks = {}) {
  return [
    marks.bold ? 'font-bold' : '',
    marks.italic ? 'italic' : '',
    marks.underline ? 'underline' : '',
  ].filter(Boolean).join(' ')
}

function ClauseRow({ index, clause, selected, onSelect, onChange, onToggleMark, onDelete }) {
  return (
    <label className={`grid grid-cols-[34px_1fr] gap-3 border-b border-[#edf2ee] py-3 last:border-b-0 ${selected ? 'bg-[#fbfffd]' : ''}`}>
      <span className="typo-caption mt-0.5 grid size-7 place-items-center rounded-full bg-[#e7f5ed] text-[#267449]">{index + 1}</span>
      <span className="min-w-0">
        <textarea
          value={clause.text}
          onFocus={onSelect}
          onChange={(event) => onChange(event.target.value)}
          className={`typo-body min-h-16 w-full resize-none border-none bg-transparent text-black outline-none ${textMarkClass(clause.marks)}`}
        />
        {selected ? (
          <span className="mt-2 flex items-center gap-1">
            <EditorTool label="Bold clause" active={Boolean(clause.marks?.bold)} onClick={() => onToggleMark('bold')}><TextB size={15} weight="bold" /></EditorTool>
            <EditorTool label="Italic clause" active={Boolean(clause.marks?.italic)} onClick={() => onToggleMark('italic')}><TextItalic size={15} /></EditorTool>
            <EditorTool label="Underline clause" active={Boolean(clause.marks?.underline)} onClick={() => onToggleMark('underline')}><TextUnderline size={15} /></EditorTool>
            <button type="button" onClick={onDelete} className="typo-caption ml-auto h-9 rounded-[10px] px-2 text-[#b42318]">Delete</button>
          </span>
        ) : null}
      </span>
    </label>
  )
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
      blocks: createContractEditorBlocks(selectedContract),
      activeBlockId: 'terms',
      activeClauseId: selectedContract.terms.length ? 'clause-1' : null,
    })
    setScreen('edit')
  }

  const saveDraft = () => {
    if (!selectedContract || !draft) return
    const blocks = draft.blocks || []
    const titleBlock = blocks.find((block) => block.type === 'heading')
    const partiesBlock = blocks.find((block) => block.type === 'parties')
    const commercialBlock = blocks.find((block) => block.type === 'commercial')
    const noteBlocks = blocks.filter((block) => block.type === 'note')
    const terms = blocks
      .filter((block) => block.type === 'clauses')
      .flatMap((block) => (block.clauses || []).map((clause) => clause.text.trim()).filter(Boolean))

    setContracts((current) => current.map((contract) => (
      contract.id === selectedContract.id
        ? {
          ...contract,
          title: titleBlock?.text?.trim() || contract.title,
          clientName: partiesBlock?.fields?.clientName?.trim() || contract.clientName,
          designerName: partiesBlock?.fields?.designerName?.trim() || contract.designerName,
          location: partiesBlock?.fields?.location?.trim() || contract.location,
          sowReference: commercialBlock?.fields?.sowReference?.trim() || contract.sowReference,
          boqReference: commercialBlock?.fields?.boqReference?.trim() || contract.boqReference,
          specialNotes: noteBlocks.map((block) => block.text?.trim()).filter(Boolean).join('\n\n'),
          terms: terms.length ? terms : contract.terms,
          editorBlocks: cloneEditorBlocks(blocks),
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
    const blocks = draft.blocks || []
    const activeBlock = blocks.find((block) => block.id === draft.activeBlockId) || blocks[0] || null
    const activeBlockIndex = activeBlock ? blocks.findIndex((block) => block.id === activeBlock.id) : -1
    const activeClause = activeBlock?.type === 'clauses'
      ? (activeBlock.clauses || []).find((clause) => clause.id === draft.activeClauseId) || activeBlock.clauses?.[0]
      : null

    const updateBlocks = (producer) => {
      setDraft((current) => ({ ...current, blocks: producer(current.blocks || []) }))
    }

    const selectBlock = (blockId, clauseId = null) => {
      setDraft((current) => ({
        ...current,
        activeBlockId: blockId,
        activeClauseId: clauseId,
      }))
    }

    const updateBlock = (blockId, updater) => {
      updateBlocks((currentBlocks) => currentBlocks.map((block) => (
        block.id === blockId ? updater(block) : block
      )))
    }

    const updateBlockField = (blockId, field, value) => {
      updateBlock(blockId, (block) => ({ ...block, fields: { ...(block.fields || {}), [field]: value } }))
    }

    const updateClause = (blockId, clauseId, value) => {
      updateBlock(blockId, (block) => ({
        ...block,
        clauses: (block.clauses || []).map((clause) => (
          clause.id === clauseId ? { ...clause, text: value } : clause
        )),
      }))
    }

    const toggleClauseMark = (blockId, clauseId, mark) => {
      updateBlock(blockId, (block) => ({
        ...block,
        clauses: (block.clauses || []).map((clause) => (
          clause.id === clauseId
            ? { ...clause, marks: { ...(clause.marks || {}), [mark]: !clause.marks?.[mark] } }
            : clause
        )),
      }))
    }

    const addClause = (blockId) => {
      const clauseId = newBlockId('clause')
      updateBlock(blockId, (block) => ({
        ...block,
        clauses: [...(block.clauses || []), { id: clauseId, text: 'New clause', marks: {} }],
      }))
      selectBlock(blockId, clauseId)
    }

    const deleteClause = (blockId, clauseId) => {
      updateBlock(blockId, (block) => {
        const nextClauses = (block.clauses || []).filter((clause) => clause.id !== clauseId)
        return { ...block, clauses: nextClauses.length ? nextClauses : block.clauses }
      })
      setDraft((current) => ({ ...current, activeClauseId: null }))
    }

    const updatePaymentRow = (blockId, rowId, field, value) => {
      updateBlock(blockId, (block) => ({
        ...block,
        rows: (block.rows || []).map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
      }))
    }

    const addPaymentRow = (blockId) => {
      updateBlock(blockId, (block) => ({
        ...block,
        rows: [...(block.rows || []), { id: newBlockId('payment-row'), milestone: 'New milestone', amount: '0%', due: 'Due date' }],
      }))
    }

    const insertBlock = (type) => {
      setDraft((current) => {
        const currentBlocks = current.blocks || []
        const newBlock = createInsertedBlock(type)
        const insertIndex = Math.max(0, currentBlocks.findIndex((block) => block.id === current.activeBlockId)) + 1
        return {
          ...current,
          blocks: [...currentBlocks.slice(0, insertIndex), newBlock, ...currentBlocks.slice(insertIndex)],
          activeBlockId: newBlock.id,
          activeClauseId: newBlock.type === 'clauses' ? newBlock.clauses?.[0]?.id || null : null,
        }
      })
    }

    const moveBlock = (blockId, direction) => {
      setDraft((current) => {
        const currentBlocks = current.blocks || []
        const index = currentBlocks.findIndex((block) => block.id === blockId)
        const nextIndex = index + direction
        if (index < 0 || nextIndex < 0 || nextIndex >= currentBlocks.length) return current
        const nextBlocks = [...currentBlocks]
        const [movedBlock] = nextBlocks.splice(index, 1)
        nextBlocks.splice(nextIndex, 0, movedBlock)
        return { ...current, blocks: nextBlocks }
      })
    }

    const deleteBlock = (blockId) => {
      setDraft((current) => {
        const currentBlocks = current.blocks || []
        const block = currentBlocks.find((item) => item.id === blockId)
        if (!block || ['heading', 'parties'].includes(block.type) || currentBlocks.length <= 2) return current
        const nextBlocks = currentBlocks.filter((item) => item.id !== blockId)
        return {
          ...current,
          blocks: nextBlocks,
          activeBlockId: nextBlocks[0]?.id || null,
          activeClauseId: null,
        }
      })
    }

    const renderBlockBody = (block) => {
      if (block.type === 'heading') {
        return (
          <input
            value={block.text || ''}
            onFocus={() => selectBlock(block.id)}
            onChange={(event) => updateBlock(block.id, (current) => ({ ...current, text: event.target.value }))}
            className="typo-page-title mt-1 w-full border-none bg-transparent text-black outline-none"
          />
        )
      }

      if (block.type === 'parties') {
        return (
          <div className="border-y border-[#edf2ee]">
            {[
              ['designerName', 'Designer'],
              ['clientName', 'Client'],
              ['location', 'Project site'],
            ].map(([field, label]) => (
              <label key={field} className="grid grid-cols-[92px_1fr] items-center gap-3 border-b border-[#edf2ee] py-3 last:border-b-0">
                <span className="typo-label uppercase text-[#8a9891]">{label}</span>
                <input
                  value={block.fields?.[field] || ''}
                  onFocus={() => selectBlock(block.id)}
                  onChange={(event) => updateBlockField(block.id, field, event.target.value)}
                  className="typo-body-strong min-w-0 border-none bg-transparent text-black outline-none"
                />
              </label>
            ))}
          </div>
        )
      }

      if (block.type === 'commercial') {
        return (
          <div className="border-y border-[#edf2ee]">
            {[
              ['value', 'Value'],
              ['sowReference', 'Scope'],
              ['boqReference', 'Quotation'],
            ].map(([field, label]) => (
              <label key={field} className="grid grid-cols-[92px_1fr] items-center gap-3 border-b border-[#edf2ee] py-3 last:border-b-0">
                <span className="typo-label uppercase text-[#8a9891]">{label}</span>
                <input
                  value={block.fields?.[field] || ''}
                  onFocus={() => selectBlock(block.id)}
                  onChange={(event) => updateBlockField(block.id, field, event.target.value)}
                  className="typo-body-strong min-w-0 border-none bg-transparent text-black outline-none"
                />
              </label>
            ))}
          </div>
        )
      }

      if (block.type === 'clauses') {
        return (
          <div>
            <div className="border-y border-[#edf2ee]">
              {(block.clauses || []).map((clause, index) => (
                <ClauseRow
                  key={clause.id}
                  index={index}
                  clause={clause}
                  selected={block.id === draft.activeBlockId && clause.id === draft.activeClauseId}
                  onSelect={() => selectBlock(block.id, clause.id)}
                  onChange={(value) => updateClause(block.id, clause.id, value)}
                  onToggleMark={(mark) => toggleClauseMark(block.id, clause.id, mark)}
                  onDelete={() => deleteClause(block.id, clause.id)}
                />
              ))}
            </div>
            <button type="button" onClick={() => addClause(block.id)} className="typo-body mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#b8c9be] px-4 py-3 text-[#4f6659]">
              <Plus size={16} />
              Add clause
            </button>
          </div>
        )
      }

      if (block.type === 'paymentSchedule') {
        return (
          <div className="space-y-2">
            {(block.rows || []).map((row) => (
              <div key={row.id} className="grid grid-cols-[1fr_54px] gap-2 rounded-[14px] border border-[#edf2ee] p-3">
                <input
                  value={row.milestone}
                  onFocus={() => selectBlock(block.id)}
                  onChange={(event) => updatePaymentRow(block.id, row.id, 'milestone', event.target.value)}
                  className="typo-body-strong min-w-0 border-none bg-transparent text-black outline-none"
                />
                <input
                  value={row.amount}
                  onFocus={() => selectBlock(block.id)}
                  onChange={(event) => updatePaymentRow(block.id, row.id, 'amount', event.target.value)}
                  className="typo-body-strong min-w-0 border-none bg-transparent text-right text-[#267449] outline-none"
                />
                <input
                  value={row.due}
                  onFocus={() => selectBlock(block.id)}
                  onChange={(event) => updatePaymentRow(block.id, row.id, 'due', event.target.value)}
                  className="typo-caption col-span-2 min-w-0 border-none bg-transparent text-[#7a8b82] outline-none"
                />
              </div>
            ))}
            <button type="button" onClick={() => addPaymentRow(block.id)} className="typo-body flex h-10 items-center gap-2 rounded-[12px] text-[#4f6659]">
              <Plus size={16} />
              Add milestone
            </button>
          </div>
        )
      }

      if (block.type === 'signatures') {
        return (
          <div className="grid grid-cols-2 gap-3">
            {[
              ['designerName', 'Designer'],
              ['clientName', 'Client'],
            ].map(([field, label]) => (
              <label key={field} className="rounded-[14px] border border-dashed border-[#c8d8cf] p-3">
                <span className="typo-label uppercase text-[#8a9891]">{label}</span>
                <input
                  value={block.fields?.[field] || ''}
                  onFocus={() => selectBlock(block.id)}
                  onChange={(event) => updateBlockField(block.id, field, event.target.value)}
                  className="typo-body-strong mt-5 w-full border-none bg-transparent text-black outline-none"
                />
              </label>
            ))}
          </div>
        )
      }

      return (
        <textarea
          value={block.text || ''}
          onFocus={() => selectBlock(block.id)}
          onChange={(event) => updateBlock(block.id, (current) => ({ ...current, text: event.target.value }))}
          className={`typo-body min-h-28 w-full resize-none border-none bg-[#fbfffd] text-black outline-none ${textMarkClass(block.marks)}`}
        />
      )
    }

    return (
      <main className="ui-screen-base ui-feature-surface min-h-dvh w-full overflow-x-hidden bg-white text-black">
        <section className="mx-auto w-full max-w-[390px] pb-28 pt-16">
          <ProjectWorkspaceHeader title="Edit contract" subtitle={selectedContract.title} onBack={() => setScreen('preview')} />
          <div className="pt-5">
            <div className="sticky top-16 z-[80] border-y border-[#e5ece7] bg-white/95 backdrop-blur">
              <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
                {blocks.map((block) => (
                  <OutlineTab key={block.id} active={block.id === activeBlock?.id} onClick={() => selectBlock(block.id, block.type === 'clauses' ? block.clauses?.[0]?.id || null : null)}>
                    {block.title}
                  </OutlineTab>
                ))}
              </div>
            </div>

            <div className="border-b border-[#edf2ee] bg-[#fbfffd] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="typo-label truncate uppercase text-[#7b8a82]">{activeBlock?.title || 'Document'}</p>
                  <p className="typo-caption truncate text-[#8a9891]">
                    {activeBlock?.type === 'clauses' ? 'Select a clause to format text' : 'Edit the selected document section'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <EditorTool label="Bold" active={Boolean(activeClause?.marks?.bold)} onClick={() => activeClause && toggleClauseMark(activeBlock.id, activeClause.id, 'bold')}><TextB size={16} weight="bold" /></EditorTool>
                  <EditorTool label="Italic" active={Boolean(activeClause?.marks?.italic)} onClick={() => activeClause && toggleClauseMark(activeBlock.id, activeClause.id, 'italic')}><TextItalic size={16} /></EditorTool>
                  <EditorTool label="Underline" active={Boolean(activeClause?.marks?.underline)} onClick={() => activeClause && toggleClauseMark(activeBlock.id, activeClause.id, 'underline')}><TextUnderline size={16} /></EditorTool>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {[
                  ['clauses', 'Clause'],
                  ['paymentSchedule', 'Payment'],
                  ['signatures', 'Signature'],
                  ['note', 'Note'],
                ].map(([type, label]) => (
                  <button key={type} type="button" onClick={() => insertBlock(type)} className="typo-caption rounded-full border border-[#d8e2db] bg-white px-3 py-1.5 text-[#425349]">
                    + {label}
                  </button>
                ))}
              </div>
            </div>

            <article className="bg-white pb-5">
              <div className="min-h-[720px] bg-white px-4 py-5">
                <p className="typo-caption uppercase text-[#267449]">Agreement builder</p>
                {blocks.map((block) => {
                  const selected = block.id === activeBlock?.id
                  return (
                    <section key={block.id} className={`mt-4 border-b border-[#edf2ee] pb-4 last:border-b-0 ${selected ? 'rounded-[16px] bg-[#fbfffd] px-3 py-3 ring-1 ring-[#bdd8c8]' : ''}`}>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <button type="button" onClick={() => selectBlock(block.id, block.type === 'clauses' ? block.clauses?.[0]?.id || null : null)} className="min-w-0 text-left">
                          <span className="typo-label block truncate uppercase text-[#7b8a82]">{block.title}</span>
                          <span className="typo-caption block truncate text-[#9aa6a0]">{block.type}</span>
                        </button>
                        {selected ? (
                          <div className="flex shrink-0 gap-1">
                            <button type="button" disabled={activeBlockIndex <= 0} onClick={() => moveBlock(block.id, -1)} className="typo-caption rounded-lg px-2 py-1 text-[#4f6659] disabled:opacity-35">Up</button>
                            <button type="button" disabled={activeBlockIndex >= blocks.length - 1} onClick={() => moveBlock(block.id, 1)} className="typo-caption rounded-lg px-2 py-1 text-[#4f6659] disabled:opacity-35">Down</button>
                            <button type="button" onClick={() => deleteBlock(block.id)} className="typo-caption rounded-lg px-2 py-1 text-[#b42318]">Delete</button>
                          </div>
                        ) : null}
                      </div>
                      {renderBlockBody(block)}
                      {selected ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button type="button" onClick={() => insertBlock('clauses')} className="typo-caption rounded-full bg-[#e7f5ed] px-3 py-1.5 text-[#267449]">Insert clause after</button>
                          <button type="button" onClick={() => insertBlock('paymentSchedule')} className="typo-caption rounded-full bg-[#eef3f0] px-3 py-1.5 text-[#425349]">Insert payment schedule</button>
                        </div>
                      ) : null}
                    </section>
                  )
                })}
              </div>
            </article>
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
