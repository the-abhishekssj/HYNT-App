import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUp,
  Bookmark,
  Bell,
  BookmarkSimple,
  CalendarDots,
  CaretDown,
  ChatsCircle,
  CheckSquareOffset,
  HandDeposit,
  Handshake,
  House,
  IdentificationBadge,
  ImagesSquare,
  Kanban,
  MapPinSimpleArea,
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
const aiReplies = [
  'Shortlisting 5 interior designers in Mumbai based on your budget and style.',
  'I found 3 vastu consultants with strong homeowner reviews near your area.',
  'Want me to draft a requirement post for your living room and kitchen?',
]

function App() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState(['Requirement sent to all relevant professionals'])
  const unread = useMemo(() => Math.min(messages.length + 2, 9), [messages.length])

  const onAsk = () => {
    if (!prompt.trim()) return
    const reply = aiReplies[messages.length % aiReplies.length]
    setMessages((prev) => [...prev, `You: ${prompt.trim()}`, `HYNT AI: ${reply}`])
    setPrompt('')
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
            <button onClick={onAsk} type="button"><ArrowUp size={12} weight="bold" /></button>
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

      {messages.length > 0 && (
        <div className="toast">
          <p><PaperPlaneTilt size={14} />{messages[messages.length - 1]}</p>
          <button type="button" onClick={() => setMessages([])}><XCircle size={16} /></button>
        </div>
      )}

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
