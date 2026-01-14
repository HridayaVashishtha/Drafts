export function normalizePhotoUrl(raw){
  if(!raw) return null
  try{
    let s = String(raw).trim()
    const low = s.toLowerCase()
    // Common placeholders meaning no image
    if(['', 'na', 'n/a', 'none', 'no', 'no image', 'no response', 'nil'].includes(low)) return null
    // If the value contains an anchor tag, extract href
    const href = s.match(/href=["']([^"']+)["']/i)
    if(href && href[1]) s = href[1]
    // If the field contains multiple comma-separated values, pick the first sensible URL
    if(s.includes(',')){
      const parts = s.split(',').map(p=>p.trim()).filter(Boolean)
      for(const p of parts){
        if(/https?:\/\//i.test(p)){
          s = p
          break
        }
      }
    }

    // If it already looks like a URL, return it (Cloudinary or other hosting)
    if(/^https?:\/\//i.test(s)) return s

    // If it ends with a common image extension, return it
    if(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(s)) return s

    // If it's a Google Drive viewer URL like /file/d/ID/view or open?id=ID, try to convert
    if(s.includes('drive.google.com')){
      let m = s.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
      if(m && m[1]) return `https://drive.google.com/uc?export=view&id=${m[1]}`
      m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/)
      if(m && m[1]) return `https://drive.google.com/uc?export=view&id=${m[1]}`
    }

    return null
  }catch(e){
    return raw
  }
}

export function buildDriveVariants(id){
  if(!id) return []
  return [
    `https://drive.google.com/uc?export=view&id=${id}`,
    `https://drive.google.com/uc?export=download&id=${id}`,
    `https://docs.google.com/uc?export=view&id=${id}`,
    `https://docs.google.com/uc?export=download&id=${id}`
  ]
}

export const PLACEHOLDER = `data:image/svg+xml;utf8,` + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f3f4f6' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-family='Arial,Helvetica,sans-serif' font-size='20'>No image</text></svg>`)
