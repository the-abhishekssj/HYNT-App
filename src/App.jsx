import { useMemo, useState } from 'react'
import {
  ArrowArcLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Bookmark,
  BookmarkSimple,
  CalendarDots,
  Camera,
  CaretDown,
  CaretLeft,
  ChatsCircle,
  CheckSquareOffset,
  HandDeposit,
  Handshake,
  House,
  IdentificationBadge,
  ImagesSquare,
  Kanban,
  MapPinSimpleArea,
  Microphone,
  PaperPlaneTilt,
  Plus,
  User,
  XCircle,
} from '@phosphor-icons/react'
import './App.css'

const roomTags = ['Living Room', 'Bedroom', 'Kitchen', 'Home Office', 'Bathroom']
const quickActions = [
  { label: 'Brand of the day', icon: null },
  { label: 'Saved Ideas', icon: ImagesSquare },
  { label: 'Saved Products', icon: Bookmark },
  { label: 'Shortlisted Pros', icon: Handshake },
  { label: 'Posted Requirements', icon: HandDeposit },
]
const ideas = [
  { badge: null, image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80' },
  { badge: '1/16', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80' },
]
const pros = [
  { name: 'Rohan Kapoor', role: 'Interior Designer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Arjun Murthy', role: 'Interior Designer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Maya Jain', role: 'Vastu Specialist', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80' },
]
const products = [
  { title: 'Alto Modular Kitchen L-Shape', category: 'Kitchen Cabinets', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80' },
  { title: 'Nordic Sofa Set with Ottoman', category: 'Living Room', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
]
const upcomingEvents = [
  { title: 'AD Design Show', date: 'Thu, 11 Dec 2025', city: 'Hyderabad', interested: '100+ interested', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80' },
  { title: 'FOAID', date: 'Fri, 19 Dec 2025', city: 'Mumbai', interested: '64 interested', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80' },
]

const chatWelcome = 'Hi, I am HYNT AI. Tell me your space, budget, and style and I will build a tailored action plan.'
const styleOptions = [
  { label: 'Japanese', image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=600&q=80' },
  { label: 'Brutalist', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80' },
  { label: 'Neo Gothic', image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=600&q=80' },
]
const inspirationOptions = [
  { label: 'Warm Minimal', image: 'https://images.unsplash.com/photo-1616593969747-4797dc75033e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Urban Industrial', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80' },
  { label: 'Japandi', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Earthy Contemporary', image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=600&q=80' },
]
const flowSteps = {
  size: { key: 'size', prompt: 'Great start. Pick your property size so I can calibrate space planning.', type: 'chips', options: ['2 BHK', '3 BHK', '4 BHK', 'Villa'] },
  style: { key: 'style', prompt: 'Perfect. Select your preferred design style.', type: 'styles', options: styleOptions },
  inspiration: { key: 'inspiration', prompt: 'No problem. Pick a few inspiration references and I will infer your style direction.', type: 'gallery', options: inspirationOptions },
  budget: { key: 'budget', prompt: 'Nice. Choose your budget range for interiors and finishes.', type: 'chips', options: ['20L-40L', '40L-80L', '80L-1.5Cr', '1.5Cr+'] },
  nextAction: { key: 'nextAction', prompt: 'What should I do next?', type: 'chips', options: ['Draft requirement', 'Select professionals'] },
  prosSelect: { key: 'prosSelect', prompt: 'Select professionals to shortlist.', type: 'pros_grid', options: pros },
}

function FlowActionButton({ kind = 'primary', children, ...props }) {
  return <button type="button" className={kind === 'secondary' ? 'inline-secondary' : 'inline-primary'} {...props}>{children}</button>
}

function App() {
  const [prompt, setPrompt] = useState('')
  const [chatPrompt, setChatPrompt] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ role: 'ai', type: 'text', text: chatWelcome }])
  const [flowStep, setFlowStep] = useState(null)
  const [draftPlan, setDraftPlan] = useState({ size: '', style: '', budget: '' })
  const [selectedInspiration, setSelectedInspiration] = useState([])
  const [selectedPros, setSelectedPros] = useState([])

  const unread = useMemo(() => Math.min(chatMessages.filter((message) => message.role === 'ai').length + 1, 9), [chatMessages])

  const buildAgentReply = (text) => {
    const normalized = text.toLowerCase()
    if (normalized.includes('kitchen')) return 'Great. For your kitchen, I recommend a modular layout with matte laminate shutters and a quartz counter.'
    if (normalized.includes('bedroom')) return 'For the bedroom, I can create a calm modern concept with warm lighting and a clean wardrobe layout.'
    if (normalized.includes('living')) return 'For your living room, I can shortlist TV wall concepts, sofa layouts, and a materials palette.'
    return 'Understood. I can convert this into a requirement post, shortlist professionals, and suggest products next.'
  }

  const queueAgentMessage = (text, delay = 500) => {
    setTimeout(() => setChatMessages((prev) => [...prev, { role: 'ai', type: 'text', text }]), delay)
  }

  const queueFlowPrompt = (stepKey, delay = 500) => {
    const step = flowSteps[stepKey]
    if (!step) return
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: 'ai', type: 'text', text: step.prompt }])
      setFlowStep(stepKey)
    }, delay)
  }

  const openChatFromHome = () => {
    const question = prompt.trim()
    if (!question) return
    setPrompt('')
    setIsChatOpen(true)
    setDraftPlan({ size: '', style: '', budget: '' })
    setSelectedInspiration([])
    setChatMessages([{ role: 'ai', type: 'text', text: chatWelcome }, { role: 'user', type: 'text', text: question }])
    queueFlowPrompt('size')
  }

  const sendChatMessage = () => {
    const question = chatPrompt.trim()
    if (!question) return
    setChatPrompt('')
    setChatMessages((prev) => [...prev, { role: 'user', type: 'text', text: question }])
    if (!flowStep) {
      const response = buildAgentReply(question)
      queueAgentMessage(response, 650)
    }
  }

  const pushSelectionMessage = (label, value, image = null) => {
    setChatMessages((prev) => [...prev, { role: 'user', type: 'selection', label, value, image }])
  }

  const onFlowSelect = (value) => {
    if (!flowStep) return
    if (flowStep === 'nextAction') {
      pushSelectionMessage('Next step', value)
      setFlowStep(null)
      if (value === 'Draft requirement') {
        queueAgentMessage('Draft ready. I converted your selections into a requirement brief below.', 450)
        setTimeout(() => {
          setChatMessages((prev) => [...prev, {
            role: 'ai',
            type: 'draft_card',
            title: 'Requirement Draft',
            lines: [
              `Property: ${draftPlan.size}`,
              `Style: ${draftPlan.style}`,
              `Budget: ${draftPlan.budget}`,
              'Scope: Full-home interior planning and execution',
            ],
          }])
        }, 700)
      } else {
        queueFlowPrompt('prosSelect', 450)
      }
      return
    }

    if (flowStep === 'size') {
      setDraftPlan((prev) => ({ ...prev, size: value }))
      pushSelectionMessage('Property size', value)
      queueFlowPrompt('style')
      return
    }

    if (flowStep === 'style') {
      if (value === "I don't know yet") {
        setDraftPlan((prev) => ({ ...prev, style: value }))
        pushSelectionMessage('Preferred design style', value)
        queueFlowPrompt('inspiration')
        return
      }
      const styleMeta = styleOptions.find((option) => option.label === value)
      setDraftPlan((prev) => ({ ...prev, style: value }))
      pushSelectionMessage('Preferred design style', value, styleMeta?.image || null)
      queueFlowPrompt('budget')
      return
    }

    if (flowStep === 'budget') {
      setDraftPlan((prev) => ({ ...prev, budget: value }))
      pushSelectionMessage('Budget range', value)
      setFlowStep(null)
      queueAgentMessage(`Done. I have ${draftPlan.size}, ${draftPlan.style}, and ${value}.`, 450)
      queueFlowPrompt('nextAction', 850)
    }
  }

  const toggleInspiration = (item) => {
    setSelectedInspiration((prev) => {
      const exists = prev.some((entry) => entry.label === item.label)
      if (exists) return prev.filter((entry) => entry.label !== item.label)
      return [...prev, item]
    })
  }

  const confirmInspiration = () => {
    if (!selectedInspiration.length) return
    const inferred = selectedInspiration.map((item) => item.label).join(', ')
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', type: 'gallery_selection', label: 'Inspiration references selected', items: selectedInspiration },
      { role: 'ai', type: 'text', text: `Great picks. Your references suggest a ${inferred} direction.` },
    ])
    setDraftPlan((prev) => ({ ...prev, style: `Inferred from inspirations (${inferred})` }))
    setSelectedInspiration([])
    queueFlowPrompt('budget')
  }

  const togglePro = (name) => {
    setSelectedPros((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const confirmProsSelection = () => {
    if (!selectedPros.length) return
    const picked = pros.filter((pro) => selectedPros.includes(pro.name))
    const pickedSummary = picked.map((pro) => `${pro.name} (${pro.role})`).join(', ')
    setChatMessages((prev) => [
      ...prev,
      { role: 'user', type: 'selection', label: 'Professionals selected', value: `${selectedPros.length} shortlisted` },
      { role: 'user', type: 'pros_cards', items: picked },
      {
        role: 'ai',
        type: 'text',
        text: `Great. You've selected ${pickedSummary}. Would you like to now draft a requirement?`,
      },
    ])
    setSelectedPros([])
    setFlowStep(null)
  }

  const clearProsSelection = () => setSelectedPros([])

  const renderFlowInline = () => {
    if (!flowStep) return null
    const step = flowSteps[flowStep]

    if (step.type === 'chips') {
      return (
        <div className="inline-options chips-grid">
          {step.options.map((option) => (
            <button key={option} type="button" className="inline-chip" onClick={() => onFlowSelect(option)}>{option}</button>
          ))}
        </div>
      )
    }

    if (step.type === 'styles') {
      return (
        <div className="inline-options tiles-grid">
          {step.options.map((option) => (
            <button key={option.label} type="button" className="inline-tile" onClick={() => option.image ? onFlowSelect(option.label) : queueFlowPrompt('inspiration', 0)}>
              {option.image ? <img src={option.image} alt={option.label} /> : <div className="inline-fallback">?</div>}
              <span>{option.label}</span>
            </button>
          ))}
          <button type="button" className="inline-secondary" onClick={() => onFlowSelect("I don't know yet")}>I don't know yet</button>
        </div>
      )
    }

    if (step.type === 'gallery') {
      return (
        <div className="inline-options tiles-grid">
          {step.options.map((option) => {
            const active = selectedInspiration.some((item) => item.label === option.label)
            return (
              <button key={option.label} type="button" className={`inline-tile ${active ? 'active' : ''}`} onClick={() => toggleInspiration(option)}>
                <img src={option.image} alt={option.label} />
                <span>{option.label}</span>
              </button>
            )
          })}
          <FlowActionButton kind="secondary" onClick={() => setSelectedInspiration([])}>Clear selected</FlowActionButton>
          <FlowActionButton disabled={!selectedInspiration.length} onClick={confirmInspiration}>Confirm selections ({selectedInspiration.length})</FlowActionButton>
        </div>
      )
    }

    if (step.type === 'pros_grid') {
      return (
        <div className="inline-options tiles-grid pros-picker-grid">
          {step.options.map((pro) => {
            const active = selectedPros.includes(pro.name)
            return (
              <button key={pro.name} type="button" className={`inline-pro-tile ${active ? 'active' : ''}`} onClick={() => togglePro(pro.name)}>
                <img src={pro.image} alt={pro.name} />
                <strong>{pro.name}</strong>
                <span>{pro.role}</span>
              </button>
            )
          })}
          <FlowActionButton kind="secondary" onClick={clearProsSelection}>Clear selected</FlowActionButton>
          <FlowActionButton disabled={!selectedPros.length} onClick={confirmProsSelection}>Confirm professionals ({selectedPros.length})</FlowActionButton>
        </div>
      )
    }

    return null
  }

  const renderMessageBody = (message) => {
    if (message.type === 'selection') {
      return (
        <div className="selection-card">
          <p>{message.label}</p>
          {message.image ? (
            <div className="selection-thumb"><img src={message.image} alt={message.value} /><span>{message.value}</span></div>
          ) : (
            <span className="selection-chip">{message.value}</span>
          )}
        </div>
      )
    }

    if (message.type === 'gallery_selection') {
      return (
        <div className="selection-card">
          <p>{message.label}</p>
          <div className="selection-gallery">
            {message.items.map((item) => (
              <div key={item.label} className="selection-thumb"><img src={item.image} alt={item.label} /><span>{item.label}</span></div>
            ))}
          </div>
        </div>
      )
    }

    if (message.type === 'draft_card') {
      return (
        <div className="draft-card">
          <h4>{message.title}</h4>
          {message.lines.map((line) => <p key={line}>{line}</p>)}
        </div>
      )
    }

    if (message.type === 'pros_cards') {
      return (
        <div className="chat-pros-row">
          {message.items.map((pro) => (
            <article key={pro.name} className="pro-card chat-pro-card">
              <img src={pro.image} alt={pro.name} />
              <p className="pro-name">{pro.name}</p>
              <p className="pro-role">{pro.role}</p>
              <div className="pro-meta"><span><CheckSquareOffset size={14} />42</span><i /><span><IdentificationBadge size={14} />5 years</span></div>
            </article>
          ))}
        </div>
      )
    }

    return message.text
  }

  if (isChatOpen) {
    const hasText = chatPrompt.trim().length > 0
    return (
      <main className="hynt-app chat-screen">
        <header className="top-wrap chat-top">
          <div className="top-row chat-row">
            <button className="chat-back" type="button" onClick={() => setIsChatOpen(false)}><CaretLeft size={18} weight="bold" /><span>Back</span></button>
            <p>HYNT AI Agent</p>
          </div>
        </header>

        <section className="chat-thread">
          {chatMessages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`chat-bubble ${message.role === 'user' ? 'user' : 'ai'} ${message.type || 'text'}`}>
              {renderMessageBody(message)}
            </article>
          ))}
        </section>

        <form className="chat-compose" onSubmit={(event) => { event.preventDefault(); sendChatMessage() }}>
          <div className="chat-compose-shell">
            {renderFlowInline()}
            <div className="chat-compose-input">
              <button className="chat-action-single" type="button" aria-label="Open camera"><Camera size={20} weight="fill" /></button>
              <input value={chatPrompt} onChange={(event) => setChatPrompt(event.target.value)} placeholder="Enter message..." />
              {hasText ? (
                <button className="chat-action-send" type="submit" aria-label="Send message"><ArrowUp size={14} weight="bold" /><span>Send</span></button>
              ) : (
                <div className="chat-action-dual">
                  <button type="button" aria-label="Open stickers"><ImagesSquare size={20} weight="fill" /></button>
                  <button type="button" aria-label="Open microphone"><Microphone size={20} weight="fill" /></button>
                </div>
              )}
            </div>
          </div>
          <button className="flow-reset" type="button" onClick={() => queueFlowPrompt('size', 0)}><ArrowArcLeft size={14} /><span>Restart guided flow</span></button>
        </form>
      </main>
    )
  }

  return (
    <main className="hynt-app">
      <header className="top-wrap">
        <div className="top-row">
          <button className="city-btn" type="button">Mumbai <CaretDown size={12} weight="bold" /></button>
          <div className="top-actions">
            <button className="icon-btn" type="button"><Bell size={20} /><span className="badge blue">2</span></button>
            <button className="icon-btn" type="button"><ChatsCircle size={22} /><span className="badge green">{unread}</span></button>
          </div>
        </div>
      </header>

      <section className="section quick-wrap">
        {quickActions.map(({ label, icon: Icon }, i) => (
          <button className="quick-item" key={label} type="button">
            <span className={`quick-icon ${i === 0 ? 'brand' : ''}`}>{Icon ? <Icon size={21} weight="fill" /> : <span className="brand-dot" />}</span>
            <span>{label}</span>
          </button>
        ))}
      </section>

      <section className="section">
        <div className="ai-card">
          <p>Home planning with <b>HYNT</b> <small>AI</small></p>
          <div className="ai-input-row">
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask anything" />
            <button onClick={openChatFromHome} type="button"><ArrowUp size={12} weight="bold" /></button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="title-row"><h2>Browse By Room</h2><button type="button">See all <ArrowRight size={16} /></button></div>
        <div className="pills-row">{roomTags.map((tag) => <button key={tag} type="button">{tag}</button>)}</div>
      </section>

      <section className="section">
        <div className="title-row"><h2>Ideas For You</h2><button type="button">Explore all <ArrowRight size={16} /></button></div>
        <div className="cards-row">
          {ideas.map((idea, index) => (
            <article key={`idea-${index}`} className="idea-card">
              <div className="idea-media">
                <img src={idea.image} alt={`Idea ${index + 1}`} />
                {idea.badge ? <span className="idea-badge">{idea.badge}</span> : null}
                <button type="button"><BookmarkSimple size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section"><img className="showcase" src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80" alt="Showcase your brand" /></section>

      <section className="section">
        <div className="title-row"><h2>Professionals for you</h2><button type="button">View all <ArrowRight size={16} /></button></div>
        <div className="cards-row pros">
          {pros.map((pro) => (
            <article key={pro.name + pro.image} className="pro-card">
              <img src={pro.image} alt={pro.name} />
              <p className="pro-name">{pro.name}</p>
              <p className="pro-role">{pro.role}</p>
              <div className="pro-meta"><span><CheckSquareOffset size={14} />42</span><i /><span><IdentificationBadge size={14} />5 years</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="title-row"><h2>Products you might like</h2><button type="button">View all <ArrowRight size={16} /></button></div>
        <div className="cards-row products">
          {products.map((product, index) => (
            <article key={`product-${index}`} className="product-card">
              <div className="product-media"><img src={product.image} alt={product.title} /><span>1/5</span><button type="button"><BookmarkSimple size={16} /></button></div>
              <div className="product-content"><p className="product-name">{product.title}</p><p className="product-type">{product.category}</p><button type="button">Get a quote <CaretDown size={14} /></button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="title-row"><h2>Upcoming events</h2><button type="button">View all <ArrowRight size={16} /></button></div>
        <div className="cards-row">
          {upcomingEvents.map((event) => (
            <article key={event.title} className="event-card">
              <div className="event-media"><img src={event.image} alt={event.title} /><span>{event.interested}</span></div>
              <p className="event-name">{event.title}</p>
              <p className="event-meta"><CalendarDots size={14} />{event.date}</p>
              <p className="event-meta"><MapPinSimpleArea size={14} />{event.city}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="toast">
        <p><PaperPlaneTilt size={14} />Requirement sent to all relevant professionals</p>
        <button type="button"><XCircle size={16} /></button>
      </div>

      <nav className="bottom-nav">
        <button type="button" className="active"><House size={20} weight="fill" /><span>Home</span></button>
        <button type="button"><Kanban size={20} /><span>Explore</span></button>
        <button type="button"><Plus size={20} /><span>Post</span></button>
        <button type="button"><CalendarDots size={20} /><span>Events</span></button>
        <button type="button"><User size={20} /><span>Profile</span></button>
      </nav>
    </main>
  )
}

export default App
