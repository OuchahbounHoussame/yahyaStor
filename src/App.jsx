import { useEffect, useMemo, useState } from 'react'
import { heroImage, products } from './products'

const Icon = ({ name, size = 20 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    minus: <path d="M5 12h14"/>,
    plus: <><path d="M5 12h14M12 5v14"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const money = (value) => `${value} MAD`

function App() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [selected, setSelected] = useState(null)
  const [size, setSize] = useState('M')
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')

  const categories = ['All', 'Graphic', 'Arabic', 'Archive', 'Minimal']
  const visible = useMemo(() => products.filter((p) => {
    const categoryMatch = filter === 'All' || p.category === filter
    const queryMatch = p.name.toLowerCase().includes(search.toLowerCase())
    return categoryMatch && queryMatch
  }), [filter, search])

  const count = cart.reduce((sum, item) => sum + item.qty, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  useEffect(() => {
    document.body.style.overflow = selected || cartOpen || menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected, cartOpen, menuOpen])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(timer)
  }, [toast])

  const addToCart = (product, chosenSize = size) => {
    setCart((current) => {
      const found = current.find((x) => x.id === product.id && x.size === chosenSize)
      if (found) return current.map((x) => x === found ? { ...x, qty: x.qty + 1 } : x)
      return [...current, { ...product, size: chosenSize, qty: 1 }]
    })
    setSelected(null)
    setToast(`${product.name} added to your bag`)
  }

  const updateQty = (id, itemSize, change) => {
    setCart((current) => current
      .map((x) => x.id === id && x.size === itemSize ? { ...x, qty: x.qty + change } : x)
      .filter((x) => x.qty > 0))
  }

  const openProduct = (product) => {
    setSize('M')
    setSelected(product)
  }

  return (
    <div className="app">
      <div className="announcement"><span>Free delivery in Morocco over 700 MAD</span><span className="announcement-side">Drop 01 — available now</span></div>
      <header className="header">
        <button className="icon-btn mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
        <a className="logo" href="#top">BOY<span>X</span></a>
        <nav className="nav desktop-only">
          <a href="#shop">New drop</a><a href="#shop">Shop</a><a href="#story">Our story</a>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setShowSearch((v) => !v)} aria-label="Search"><Icon name="search" /></button>
          <button className="bag-btn" onClick={() => setCartOpen(true)} aria-label={`Cart with ${count} items`}><Icon name="bag" /><span>Bag</span><b>{count}</b></button>
        </div>
      </header>

      {showSearch && <div className="search-bar"><Icon name="search" /><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the collection..."/><button onClick={() => { setSearch(''); setShowSearch(false) }}>Close</button></div>}

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span></span> Independent streetwear · Casablanca</p>
            <h1>Wear your<br/><em>own story.</em></h1>
            <p className="hero-text">Limited pieces for people who refuse to blend in. Designed in Morocco, made for everywhere.</p>
            <a className="primary-btn" href="#shop">Explore drop 01 <Icon name="arrow" /></a>
            <div className="hero-meta"><span><b>12</b> original pieces</span><span><b>100%</b> heavyweight cotton</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-number">01</div>
            <img src={heroImage} alt="BOYX limited black graphic T-shirt" />
            <div className="hero-sticker">Limited<br/>drop</div>
            <p>FIGOSHINE / BLACK<br/>DROP 01 — 2026</p>
          </div>
        </section>

        <div className="marquee" aria-hidden="true"><div><span>MADE TO STAND OUT ✦</span><span>CASABLANCA TO THE WORLD ✦</span><span>NO RULES, JUST STYLE ✦</span><span>MADE TO STAND OUT ✦</span><span>CASABLANCA TO THE WORLD ✦</span></div></div>

        <section className="shop" id="shop">
          <div className="section-heading">
            <div><p className="eyebrow"><span></span> The collection</p><h2>Drop 01</h2></div>
            <p>{visible.length} pieces / Summer 2026</p>
          </div>
          <div className="filters">
            {categories.map((category) => <button key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}
          </div>
          {visible.length ? <div className="product-grid">
            {visible.map((product, index) => <article className="product-card" key={product.id} style={{'--delay': `${index * 45}ms`}}>
              <button className="product-image" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}>
                {product.tag && <span className="product-tag">{product.tag}</span>}
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="quick-add">Quick view <Icon name="arrow" size={18}/></span>
              </button>
              <div className="product-info"><div><h3>{product.name}</h3><p>{product.color} / Oversized</p></div><strong>{money(product.price)}</strong></div>
            </article>)}
          </div> : <div className="empty-search"><h3>No pieces found.</h3><button onClick={() => { setSearch(''); setFilter('All') }}>Reset search</button></div>}
        </section>

        <section className="story" id="story">
          <div className="story-mark">BX</div>
          <div><p className="eyebrow light"><span></span> This is BOYX</p><h2>Not made<br/>to fit in.</h2></div>
          <div className="story-copy"><p>BOYX started with one idea: clothes should say something before you do. Every drop is small, intentional, and rooted in the energy of Morocco.</p><a href="#shop">Discover our pieces <Icon name="arrow" /></a></div>
        </section>

        <section className="newsletter">
          <p>Get early access to the next drop.</p>
          <form onSubmit={(e) => { e.preventDefault(); setToast('Welcome to the BOYX family') }}><input type="email" required placeholder="YOUR EMAIL ADDRESS"/><button aria-label="Subscribe"><Icon name="arrow" /></button></form>
        </section>
      </main>

      <footer><a className="logo footer-logo" href="#top">BOY<span>X</span></a><div><p>Made with intention in Morocco.</p><p>© 2026 BOYX Studio</p></div><div className="footer-links"><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">Contact</a></div></footer>

      {selected && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <div className="product-modal">
          <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close"><Icon name="close" /></button>
          <div className="modal-image"><img src={selected.image} alt={selected.name}/></div>
          <div className="modal-details">
            <p className="eyebrow"><span></span> Drop 01 / {selected.category}</p><h2>{selected.name}</h2><h3>{money(selected.price)}</h3>
            <p className="description">Heavyweight cotton tee with a relaxed oversized cut. Designed for an effortless everyday fit.</p>
            <div className="size-head"><b>Select size</b><button>Size guide</button></div>
            <div className="sizes">{['S','M','L','XL'].map((s) => <button key={s} className={size === s ? 'active' : ''} onClick={() => setSize(s)}>{s}</button>)}</div>
            <button className="add-btn" onClick={() => addToCart(selected)}>Add to bag <span>{money(selected.price)}</span></button>
            <div className="details-list"><p><b>Material</b><span>100% cotton · 240 GSM</span></p><p><b>Fit</b><span>Oversized / unisex</span></p><p><b>Delivery</b><span>2–4 days in Morocco</span></p></div>
          </div>
        </div>
      </div>}

      <div className={`drawer-wrap ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <button className="drawer-backdrop" onClick={() => setCartOpen(false)} aria-label="Close cart"/>
        <aside className="cart-drawer">
          <div className="cart-head"><div><p>Your bag</p><span>{count} {count === 1 ? 'item' : 'items'}</span></div><button onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>
          {cart.length === 0 ? <div className="cart-empty"><Icon name="bag" size={42}/><h3>Your bag is empty</h3><p>Your next favorite piece is waiting.</p><button className="primary-btn" onClick={() => setCartOpen(false)}>Explore the drop</button></div> : <>
            <div className="cart-items">{cart.map((item) => <div className="cart-item" key={`${item.id}-${item.size}`}>
              <img src={item.image} alt=""/><div className="cart-item-info"><div><h3>{item.name}</h3><p>{item.color} / Size {item.size}</p></div><div className="cart-item-bottom"><div className="qty"><button onClick={() => updateQty(item.id, item.size, -1)}><Icon name="minus" size={14}/></button><span>{item.qty}</span><button onClick={() => updateQty(item.id, item.size, 1)}><Icon name="plus" size={14}/></button></div><strong>{money(item.price * item.qty)}</strong></div></div>
              <button className="remove" onClick={() => setCart((c) => c.filter((x) => x !== item))}><Icon name="trash" size={17}/></button>
            </div>)}</div>
            <div className="cart-footer"><div><span>Subtotal</span><strong>{money(total)}</strong></div><p>Delivery calculated at checkout</p><button onClick={() => setToast('Checkout will be connected next')}>Checkout securely <Icon name="arrow" /></button></div>
          </>}
        </aside>
      </div>

      {menuOpen && <div className="mobile-menu"><button onClick={() => setMenuOpen(false)}><Icon name="close" /></button><a href="#shop" onClick={() => setMenuOpen(false)}>New drop</a><a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><p>BOYX / Casablanca<br/>Drop 01 — 2026</p></div>}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}<span>✓</span></div>
    </div>
  )
}

export default App
