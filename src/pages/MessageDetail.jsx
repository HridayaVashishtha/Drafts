import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchAllEntries } from '../lib/api'
import logo from "../assets/logo.png"
import { normalizePhotoUrl, PLACEHOLDER } from '../lib/normalize'

// use shared normalizePhotoUrl from src/lib/normalize.js

function parseSpotify(input){
  if(!input) return null
  const u = String(input).trim()
  const trackMatch = u.match(/track[\/:]([A-Za-z0-9]+)/)
  if(trackMatch) return {id: trackMatch[1]}
  const colonMatch = u.match(/spotify:track:([A-Za-z0-9]+)/)
  if(colonMatch) return {id: colonMatch[1]}
  if(/^[A-Za-z0-9]{22}$/.test(u)) return {id:u}
  return null
}


export default function MessageDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    fetchAllEntries().then(data=>{
      if(!mounted) return
      setEntries(data)
      setLoading(false)
    }).catch(()=>{ if(mounted) setLoading(false) })
    return ()=> mounted = false
  },[])

  const idx = Math.max(0, Math.min(entries.length - 1, parseInt(id || '0', 10) || 0))
  const entry = entries[idx] || null
  const canGoPrev = idx > 0
  const canGoNext = idx < entries.length - 1

  // keep page position constant when navigating between messages (do not auto-scroll)

  function findField(obj, checks){
    if(!obj) return ''
    for(const k of checks){ if(k in obj) return obj[k] }
    const keys = Object.keys(obj)
    for(const ck of checks){
      const needle = ck.toLowerCase().replace(/\s+/g,'').replace(/[\W_]+/g,'')
      for(const k of keys){
        const kk = String(k).toLowerCase().replace(/\s+/g,'').replace(/[\W_]+/g,'')
        if(kk.includes(needle)) return obj[k]
      }
    }
    return ''
  }

  if(loading){
    return (
      <div className="app-bg" style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'#957C62',fontSize:'1.125rem',fontFamily:'Georgia,serif'}}>Loading…</p>
      </div>
    )
  }

  if(!entry){
    return (
      <div className="app-bg" style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <p className="muted">Message not found.</p>
          <button onClick={()=>navigate('/drafts')} className="cta">Back to drafts</button>
        </div>
      </div>
    )
  }

  const name = entry['Your Name'] || entry['Your Name '] || entry['Your name'] || entry['Name'] || 'Someone'
  // Column 1 is the SheetDB column for the uploaded file URL (Column H in the sheet)
  const rawPhoto = entry['Column 1'] || entry['Upload a Picture of You With Sakshi'] || entry['Upload a Picture of You With Sakshi '] || entry['Upload a Picture of You with Sakshi'] || entry.photo || ''
  const normalizedPhoto = normalizePhotoUrl(rawPhoto)
  console.debug('photo raw vs normalized:', { raw: rawPhoto, normalized: normalizedPhoto })
  const photo = normalizedPhoto || rawPhoto || ''
  const specialMsg = findField(entry, ['Your Special Message for Her','Your Special Message','Your Special Message for Her  (A wish'])
  const memory = findField(entry, ['Any fun memory','Any fun memory with her','Any fun memory with her youd like us to include'])
  const songField = findField(entry, ['What song reminds you of Sakshi','What song','song'])
  const songReason = findField(entry, ['Why does this song make you think of her','Why does this song make you think of her?','why'])
  const sp = parseSpotify(songField)
  const songUrl = normalizePhotoUrl(songField) || songField || ''
  // Prefer Column 2 (sheet column 2) for song image (Cloudinary), then fall back to Column I/9
  const rawSongImage = (entry['Column 2'] || entry['Column 2 '] || entry['Column I'] || entry['Column 9'] || entry['Column I '] || '')
  // Column 2 contains a direct Cloudinary URL — prefer it as-is when it's an http(s) URL
  const songImageFromColumn = rawSongImage && /^https?:\/\//i.test(String(rawSongImage).trim()) ? String(rawSongImage).trim() : (normalizePhotoUrl(rawSongImage) || '')
  // Treat direct image URLs and common Google Drive/docs links as images
  const isSongImage = Boolean((songImageFromColumn || songUrl) && (
    /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(songImageFromColumn || songUrl) ||
    /drive\.google\.com|docs\.google\.com|googleusercontent\.com|open\?id=|\/file\/d\//i.test(String(songImageFromColumn || songField))
  ))
  console.debug('song image sources:', { rawSongImage, songImageFromColumn, songUrl })

  return (
    <div className="app-bg" style={{minHeight:'100vh',padding:'2rem 1rem'}}>
      <div style={{maxWidth:'1000px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <img src={logo} alt="logo" style={{width:'52px',height:'52px',borderRadius:'50%',objectFit:'cover',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}} />
            <button
              onClick={()=>navigate('/drafts')}
              style={{
                background:'transparent',
                border:'1px solid rgba(183,116,102,0.9)',
                color:'#B77466',
                padding:'0.5rem 0.9rem',
                borderRadius:'999px',
                cursor:'pointer',
                fontFamily:'Georgia,serif',
                fontWeight:500
              }}
              onMouseOver={(e)=> e.currentTarget.style.background='#FBF0EA'}
              onMouseOut={(e)=> e.currentTarget.style.background='transparent'}
            >
              Back
            </button>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <button onClick={()=>navigate(`/message/${idx-1}`)} disabled={!canGoPrev} style={{background:'transparent',border:'1px solid #B77466',color: canGoPrev ? '#B77466' : '#ccc',padding:'0.625rem 1.5rem',borderRadius:'2rem',fontSize:'0.9375rem',cursor: canGoPrev ? 'pointer' : 'not-allowed',fontFamily:'Georgia,serif',fontWeight:'500',opacity: canGoPrev ? 1 : 0.5}}>← Previous</button>
            <button onClick={()=>navigate(`/message/${idx+1}`)} disabled={!canGoNext} style={{background: canGoNext ? '#B77466' : '#ccc',border:'none',color:'white',padding:'0.625rem 1.5rem',borderRadius:'2rem',fontSize:'0.9375rem',cursor: canGoNext ? 'pointer' : 'not-allowed',fontFamily:'Georgia,serif',fontWeight:'500'}}>Next →</button>
          </div>
        </div>

        <div style={{background:'white',borderRadius:'24px',overflow:'hidden',boxShadow:'0 20px 60px rgba(183,116,102,0.12)'}}>
          {photo && (
            <div style={{width:'100%',maxHeight:'500px',overflow:'hidden',background:'#FAF9F7',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <img src={photo} alt={name} style={{width:'100%',height:'auto',maxHeight:'500px',objectFit:'cover',display:'block'}} onError={(e)=>{
                try{
                  const img = e.currentTarget
                  img.onerror = null
                  const cur = img.src || ''
                  const m = (cur.match(/[?&]id=([a-zA-Z0-9_-]+)/) || cur.match(/\/file\/d\/([a-zA-Z0-9_-]+)/))
                  if(m && m[1]){
                    const variants = buildDriveVariants(m[1])
                    for(const v of variants){ if(v !== cur){ img.src = v; return } }
                  }
                }catch(_){ }
                e.currentTarget.src = PLACEHOLDER
              }} />
            </div>
          )}

          <div style={{padding:'3rem 2.5rem'}}>
            <h1 style={{fontSize:'2.5rem',fontFamily:'Georgia,serif',color:'#B77466',marginBottom:'2rem',fontWeight:'400',letterSpacing:'-0.02em'}}>{name}</h1>

            {specialMsg && (
              <div style={{background:'linear-gradient(135deg, #FFE1AF 0%, #E2B59A 100%)',padding:'2rem',borderRadius:'16px',marginBottom:'2rem'}}>
                <h3 style={{fontSize:'0.875rem',fontFamily:'Georgia,serif',color:'#957C62',marginBottom:'1rem',fontWeight:'600',letterSpacing:'0.02em',textTransform:'uppercase'}}>Special Message</h3>
                <p style={{fontSize:'1.0625rem',lineHeight:'1.75',color:'#3D3D3D',fontFamily:'Georgia,serif',whiteSpace:'pre-wrap',margin:0}}>{specialMsg}</p>
              </div>
            )}

            {memory && (
              <div style={{borderLeft:'4px solid #B77466',paddingLeft:'1.5rem',marginBottom:'2rem'}}>
                <h3 style={{fontSize:'0.875rem',fontFamily:'Georgia,serif',color:'#957C62',marginBottom:'0.75rem',fontWeight:'600',letterSpacing:'0.02em',textTransform:'uppercase'}}>A Cherished Memory</h3>
                <p style={{fontSize:'1rem',lineHeight:'1.75',color:'#555',fontFamily:'Georgia,serif',whiteSpace:'pre-wrap',margin:0}}>{memory}</p>
              </div>
            )}

            {songField && (
              <div style={{background:'#FAF9F7',padding:'2rem',borderRadius:'16px'}}>
                <h3 style={{fontSize:'0.875rem',fontFamily:'Georgia,serif',color:'#957C62',marginBottom:'1.25rem',fontWeight:'600',letterSpacing:'0.02em',textTransform:'uppercase'}}>A Song For You</h3>
                {sp ? (
                  <>
                    <iframe src={`https://open.spotify.com/embed/track/${sp.id}`} style={{width:'100%',height:'152px',border:'none',borderRadius:'12px',marginBottom:'1rem'}} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" />
                    {songImageFromColumn ? (
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1rem'}}>
                          <img src={songImageFromColumn} alt="song image" style={{maxWidth:'260px',width:'100%',height:'auto',objectFit:'contain',borderRadius:'12px'}} onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=PLACEHOLDER }} />
                        </div>
                    ) : null}
                  </>
                ) : isSongImage ? (
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1rem'}}>
                    <img src={songImageFromColumn || songUrl} alt="song image" style={{maxWidth:'260px',width:'100%',height:'auto',objectFit:'contain',borderRadius:'12px'}} onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=PLACEHOLDER }} />
                  </div>
                ) : (
                  <a href={songField} target="_blank" rel="noopener noreferrer">Open song</a>
                )}
                {songReason && (
                  <div style={{marginTop:'1.25rem'}}>
                    <p style={{fontSize:'0.875rem',color:'#957C62',fontFamily:'Georgia,serif',marginBottom:'0.5rem',fontStyle:'italic',margin:'0 0 0.5rem 0'}}>This reminds me of you because…</p>
                    <p style={{fontSize:'0.9375rem',lineHeight:'1.6',color:'#666',fontFamily:'Georgia,serif',whiteSpace:'pre-wrap',margin:0}}>{songReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
