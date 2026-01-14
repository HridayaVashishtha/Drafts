import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAllEntries } from '../lib/api'
import Card from '../components/Card'
import logo from '../assets/logo.png'
// no local image loader — we use direct URLs from SheetDB (Column 1)
import { normalizePhotoUrl } from '../lib/normalize'

export default function Drafts(){
  const [entries, setEntries] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(()=>{
    let mounted = true
    fetchAllEntries().then(data=>{
      if(!mounted) return
      console.log('Sheet data:', data)
      setEntries(data)
      setLoading(false)
    }).catch((err)=>{
      if(!mounted) return
      console.error('fetchAllEntries error (Drafts):', err)
      setError(err.message || String(err))
      setLoading(false)
    })
    return ()=> mounted = false
  },[])

  // debug summary removed for local images

  return (
    <main className="app-root app-bg">
      <header className="topbar">
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <img src={logo} alt="logo" style={{width:120,height:120,objectFit:'contain'}} />
          <div>
            <h2>Drafts</h2>
            <p className="muted w-700">Messages people started writing about you in their hearts long before they ever typed them here - things they always wanted to say, unsent thoughts,<br /> quiet feelings, and tiny pieces of love. Every note here is a small part of how someone sees you: words that stayed, feelings that mattered,<br /> and thoughts that never faded, gathered in one place, finally put into words, just for you.</p>
          </div>
        </div>
      </header>

      {/* debug panel removed */}

      <section className="wall">
        {loading && <p className="muted">Loading…</p>}
        {error && <div className="error">Error loading messages: {error}</div>}
        {!loading && !error && entries.length === 0 && <p className="muted">No messages yet.</p>}
        {!loading && !error && entries.map((row, i)=>{
          const name = row['Your Name'] || 'Someone'
          // prefer SheetDB Column 1 (Column H) which contains the uploaded file link
          const raw = row['Column 1'] || row['Upload a Picture of You With Sakshi'] || row['Upload a Picture of You With Sakshi '] || row['Upload a Picture of You With Sakshi'] || ''
          const normalized = normalizePhotoUrl(raw)
          // prefer normalized uploaded photo, otherwise fall back to raw value
          const photo = normalized || raw || ''
          // debug info for each entry
          console.debug(`draft entry ${i} image debug:`, { raw, normalized, chosen: photo })
          return (
            <Card key={i} name={name} photo={photo} onOpen={()=>nav(`/message/${i}`)} />
          )
        })}
      </section>
    </main>
  )
}
