import React from 'react'
import { normalizePhotoUrl, buildDriveVariants, PLACEHOLDER } from '../lib/normalize'

export default function Card({name,photo,onOpen}){
  const normalized = normalizePhotoUrl(photo)
  const src = normalized || PLACEHOLDER
  return (
    <article className="card" onClick={onOpen} tabIndex={0} onKeyPress={(e)=>{if(e.key==='Enter') onOpen()}}>
      <img
        src={src}
        alt={`${name} photo`}
        onError={(e)=>{
          try{
            const img = e.currentTarget
            img.onerror = null
            const cur = img.src || ''
            const m = (cur.match(/[?&]id=([a-zA-Z0-9_-]+)/) || cur.match(/\/file\/d\/([a-zA-Z0-9_-]+)/))
            if(m && m[1]){
              const variants = buildDriveVariants(m[1])
              for(const v of variants){
                if(v !== cur){ img.src = v; return }
              }
            }
          }catch(_){ }
          e.currentTarget.src = PLACEHOLDER
        }}
      />
      <div className="name">{name}</div>
    </article>
  )
}
