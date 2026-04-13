import { useState, useMemo } from 'react'
import { products, categories } from './products'

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [selectedCategory, search])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🏗️</span>
            <span className="logo-text">Leiten<span className="logo-accent">Ya</span></span>
          </div>
          <div className="address">
            <span className="address-icon">📍</span>
            <div>
              <div className="address-label">Entregamos en</div>
              <div className="address-value">Buenos Aires, CABA</div>
            </div>
          </div>
          <div className="search-wrap">
            <input className="search" placeholder="Buscar máquinas, hormigoneras, elevadores..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Carrito
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Tu obra, más rápida.</h1>
          <p>Máquinas de construcción a domicilio en 24-72hs. Sin vueltas.</p>
        </div>
      </section>

      <nav className="categories">
        <button className={`cat-chip ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>
          <span>🧰</span> Todos
        </button>
        {categories.map(c => (
          <button key={c.id} className={`cat-chip ${selectedCategory === c.id ? 'active' : ''}`} onClick={() => setSelectedCategory(c.id)}>
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
      </nav>

      <main className="main">
        <h2 className="section-title">
          {selectedCategory === 'all' ? 'Todos los productos' : categories.find(c => c.id === selectedCategory)?.name}
          <span className="count">({filtered.length})</span>
        </h2>
        <div className="grid">
          {filtered.map(p => (
            <article className="card" key={p.id}>
              <div className="card-img-wrap">
                <img src={p.image} alt={p.name} loading="lazy" />
                <span className="card-time">⏱ {p.time}</span>
              </div>
              <div className="card-body">
                <div className="card-rating">⭐ {p.rating}</div>
                <h3 className="card-title">{p.name}</h3>
                <p className="card-desc">{p.description}</p>
                <div className="card-footer">
                  <span className="card-price">{formatPrice(p.price)}</span>
                  <button className="add-btn" onClick={() => addToCart(p)}>Agregar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty">No encontramos productos 🔍</div>}
      </main>

      {cartOpen && (
        <>
          <div className="overlay" onClick={() => setCartOpen(false)} />
          <aside className="drawer">
            <div className="drawer-header">
              <h3>Tu pedido</h3>
              <button className="close" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-cart"><div style={{ fontSize: 48 }}>🛒</div><p>Tu carrito está vacío</p></div>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">{formatPrice(item.price)}</div>
                        <div className="qty">
                          <button onClick={() => updateQty(item.id, -1)}>−</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, +1)}>+</button>
                          <button className="remove" onClick={() => removeFromCart(item.id)}>🗑</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="drawer-footer">
                  <div className="total-row"><span>Total</span><strong>{formatPrice(total)}</strong></div>
                  <button className="checkout-btn" onClick={() => alert('¡Gracias por tu pedido en LeitenYa! 🏗️')}>Finalizar pedido</button>
                </div>
              </>
            )}
          </aside>
        </>
      )}

      <footer className="footer"><p>LeitenYa © 2026 — Demo inspirado en leiten.com.ar · Hecho con React</p></footer>
    </div>
  )
}
