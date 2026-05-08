import React, { useEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_PRODUCTS = [
  { id: 'h07rn-f', code: 'H07RN-F', category: 'energia', price: 0, visible: true, available: true, datasheet: 'H07RN_F.EN.pdf', description_it: 'Cavo armonizzato in gomma per posa fissa, uso mobile e servizio gravoso.', description_en: 'Harmonized rubber cable for fixed installation, mobile use and heavy-duty service.' },
  { id: 'fror', code: 'FROR CU-PVC-PVC', category: 'energia', price: 0, visible: true, available: true, datasheet: 'FROR CU-PVC-PVC.pdf', description_it: 'Cavo multipolare flessibile per alimentazione e controllo.', description_en: 'Flexible multicore cable for power and control applications.' },
  { id: 'liyy', code: 'LIYY CU-PVC-PVC', category: 'segnale', price: 0, visible: true, available: true, datasheet: 'LIYY CU-PVC-PVC.pdf', description_it: 'Cavo dati, segnale e controllo con conduttori in rame flessibile.', description_en: 'Data, signal and control cable with flexible copper conductors.' },
  { id: 'liycy', code: 'LIY-CY CU-PVC-PVC SCREENED', category: 'segnale', price: 0, visible: true, available: true, datasheet: 'LIY-CY CU-PVC-PVC SCREENED.pdf', description_it: 'Cavo schermato per trasmissione segnali analogici e digitali.', description_en: 'Screened cable for analog and digital signal transmission.' },
  { id: 'alarm', code: 'ALARM CABLES', category: 'allarme', price: 0, visible: true, available: true, datasheet: 'Alarm_cables.pdf', description_it: 'Cavi per sistemi di allarme e sicurezza.', description_en: 'Cables for alarm and security systems.' },
  { id: 'speaker', code: 'FIGURE 8 SPEAKER CABLE', category: 'audio', price: 0, visible: true, available: true, datasheet: 'FIGURE 8 SPEAKER CABLE.pdf', description_it: 'Cavo audio per altoparlanti.', description_en: 'Speaker audio cable.' },
  { id: 'mic', code: 'MIC CABLE ITAL995M', category: 'audio', price: 0, visible: true, available: true, datasheet: 'MIC CABLE ITAL995M.pdf', description_it: 'Cavo microfonico bilanciato per applicazioni audio professionali.', description_en: 'Balanced microphone cable for professional audio applications.' },
  { id: 'telephone', code: 'TRR TELEPHONE CABLE', category: 'telefono', price: 0, visible: true, available: true, datasheet: 'TRR TELEPHONE CABLE.pdf', description_it: 'Cavo telefonico per impianti interni.', description_en: 'Telephone cable for internal systems.' },
]

const i18n = {
  it: {
    catalogue: 'Prodotti', admin: 'Area Admin', login: 'Entra', logout: 'Esci', password: 'Password admin', passHint: 'Password demo: admin',
    title: 'Cavi elettrici disponibili a magazzino', subtitle: 'Catalogo ITALICAB con prezzi visibili, schede tecniche e prodotti disponibili.',
    search: 'Cerca codice o descrizione...', all: 'Tutte', available: 'Disponibile', price: 'Prezzo', datasheet: 'Scheda tecnica', noDatasheet: 'Nessuna scheda', request: 'Richiedi informazioni',
    code: 'Codice', category: 'Categoria', descIt: 'Descrizione IT', descEn: 'Descrizione EN', save: 'Salva prodotto', update: 'Aggiorna prodotto', cancel: 'Annulla', edit: 'Modifica', del: 'Elimina', hide: 'Nascondi', show: 'Mostra',
    addTitle: 'Aggiungi / modifica articolo', products: 'Gestione prodotti', export: 'Esporta catalogo JSON', import: 'Importa catalogo JSON', uploadName: 'Nome file scheda tecnica PDF',
    note: 'Versione semplice senza database: i dati restano nel browser e possono essere esportati/importati con JSON. Per PDF permanenti, carica i file nella cartella public/datasheets del progetto.'
  },
  en: {
    catalogue: 'Catalogue', admin: 'Admin Area', login: 'Login', logout: 'Logout', password: 'Admin password', passHint: 'Demo password: admin',
    title: 'Electrical cables available from stock', subtitle: 'ITALICAB catalogue with visible prices, datasheets and available products.',
    search: 'Search code or description...', all: 'All', available: 'Available', price: 'Price', datasheet: 'Datasheet', noDatasheet: 'No datasheet', request: 'Request information',
    code: 'Code', category: 'Category', descIt: 'Description IT', descEn: 'Description EN', save: 'Save product', update: 'Update product', cancel: 'Cancel', edit: 'Edit', del: 'Delete', hide: 'Hide', show: 'Show',
    addTitle: 'Add / edit item', products: 'Product management', export: 'Export catalogue JSON', import: 'Import catalogue JSON', uploadName: 'PDF datasheet file name',
    note: 'Simple version without database: data stays in the browser and can be exported/imported as JSON. For permanent PDFs, upload files to the project public/datasheets folder.'
  }
}

const emptyForm = { id: '', code: '', category: 'energia', price: '', datasheet: '', description_it: '', description_en: '', available: true, visible: true }
const categories = ['energia', 'segnale', 'allarme', 'audio', 'telefono', 'dati', 'automazione', 'solare']

function currency(value) {
  const n = Number(value || 0)
  return n > 0 ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n) : 'Prezzo da definire'
}

export default function App() {
  const [lang, setLang] = useState('it')
  const [view, setView] = useState('catalogue')
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('italicab-products')
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS
  })
  const [form, setForm] = useState(emptyForm)
  const fileInput = useRef(null)
  const t = i18n[lang]

  useEffect(() => localStorage.setItem('italicab-products', JSON.stringify(products)), [products])

  const visibleProducts = useMemo(() => products.filter(p => p.visible !== false && p.available !== false), [products])
  const filtered = useMemo(() => visibleProducts.filter(p => {
    const text = `${p.code} ${p.description_it} ${p.description_en} ${p.category}`.toLowerCase()
    return (cat === 'all' || p.category === cat) && text.includes(query.toLowerCase())
  }), [visibleProducts, query, cat])

  function updateForm(key, value) { setForm(prev => ({ ...prev, [key]: value })) }
  function resetForm() { setForm(emptyForm) }
  function saveProduct() {
    if (!form.code.trim()) return
    const item = { ...form, id: form.id || `${Date.now()}`, price: Number(form.price || 0), available: true, visible: true }
    setProducts(prev => form.id ? prev.map(p => p.id === form.id ? item : p) : [item, ...prev])
    resetForm()
  }
  function editProduct(p) { setForm({ ...p, price: String(p.price || '') }); setView('admin') }
  function deleteProduct(id) { setProducts(prev => prev.filter(p => p.id !== id)) }
  function toggleProduct(id) { setProducts(prev => prev.map(p => p.id === id ? { ...p, visible: p.visible === false } : p)) }
  function exportJson() {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'italicab-products.json'; a.click(); URL.revokeObjectURL(url)
  }
  function importJson(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProducts(JSON.parse(reader.result))
    reader.readAsText(file)
  }
  function datasheetHref(name) { return name ? `/datasheets/${encodeURIComponent(name)}` : null }

  return <div className="app">
    <header className="topbar">
      <div className="brand"><img src="/logo.png" alt="ITALICAB" /><span>the cable specialists</span></div>
      <nav>
        <button onClick={() => setLang(lang === 'it' ? 'en' : 'it')}>{lang.toUpperCase()}</button>
        <button className={view === 'catalogue' ? 'active' : ''} onClick={() => setView('catalogue')}>{t.catalogue}</button>
        <button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}>{t.admin}</button>
      </nav>
    </header>

    {view === 'catalogue' && <main>
      <section className="hero">
        <div>
  <h1>{t.title}</h1>
  <p>{t.subtitle}</p>
  <a className="primary" href="mailto:info@italicab.it">{t.request}</a>
  <a className="primary" href="/datasheets/ITALICAB-catalogue.pdf" target="_blank">Apri Catalogo PDF</a>
</div>
        <div className="contact"><b>ITALICAB</b><span>info@italicab.it</span><span>Tel. +39 030 6365625</span><span>Fax +39 030 6364819</span><span>Corso Cavour, 31 - 25121 Brescia</span></div>
      </section>
      <section className="filters"><input placeholder={t.search} value={query} onChange={e => setQuery(e.target.value)} /><select value={cat} onChange={e => setCat(e.target.value)}><option value="all">{t.all}</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></section>
      <section className="grid">{filtered.map(p => <article className="card" key={p.id}><div className="tag">{p.category}</div><h3>{p.code}</h3><p>{lang === 'it' ? p.description_it : p.description_en}</p><div className="row"><span>{t.available}</span><b>{currency(p.price)}</b></div>{p.datasheet ? <a className="outline" href={datasheetHref(p.datasheet)} target="_blank">{t.datasheet}</a> : <button className="outline" disabled>{t.noDatasheet}</button>}</article>)}</section>
    </main>}

    {view === 'admin' && <main>
      {!isAdmin ? <section className="login"><h2>{t.admin}</h2><p>{t.passHint}</p><input type="password" placeholder={t.password} value={password} onChange={e => setPassword(e.target.value)} /><button className="primary" onClick={() => password === 'admin' && setIsAdmin(true)}>{t.login}</button></section> : <>
        <section className="adminHead"><h2>{t.products}</h2><button onClick={() => setIsAdmin(false)}>{t.logout}</button></section>
        <p className="note">{t.note}</p>
        <section className="adminLayout">
          <div className="form"><h3>{t.addTitle}</h3><input placeholder={t.code} value={form.code} onChange={e => updateForm('code', e.target.value)} /><select value={form.category} onChange={e => updateForm('category', e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select><input type="number" step="0.01" placeholder={t.price} value={form.price} onChange={e => updateForm('price', e.target.value)} /><input placeholder={t.uploadName} value={form.datasheet} onChange={e => updateForm('datasheet', e.target.value)} /><textarea placeholder={t.descIt} value={form.description_it} onChange={e => updateForm('description_it', e.target.value)} /><textarea placeholder={t.descEn} value={form.description_en} onChange={e => updateForm('description_en', e.target.value)} /><button className="primary" onClick={saveProduct}>{form.id ? t.update : t.save}</button>{form.id && <button onClick={resetForm}>{t.cancel}</button>}</div>
          <div className="adminList"><div className="actions"><button onClick={exportJson}>{t.export}</button><button onClick={() => fileInput.current.click()}>{t.import}</button><input ref={fileInput} type="file" accept="application/json" hidden onChange={importJson} /></div>{products.map(p => <div className="adminItem" key={p.id}><b>{p.code}</b><span>{p.category} · {currency(p.price)} · {p.datasheet || '-'}</span><div><button onClick={() => editProduct(p)}>{t.edit}</button><button onClick={() => toggleProduct(p.id)}>{p.visible === false ? t.show : t.hide}</button><button onClick={() => deleteProduct(p.id)}>{t.del}</button></div></div>)}</div>
        </section>
      </>}
    </main>}
  </div>
}
