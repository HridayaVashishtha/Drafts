const API_URL = 'https://sheetdb.io/api/v1/yjusytgjlvwox'

export async function fetchAllEntries(){
  try{
    const res = await fetch(API_URL, { mode: 'cors' })
    if(!res.ok){
      const msg = `SheetDB fetch error: ${res.status} ${res.statusText}`
      console.error(msg)
      throw new Error(msg)
    }
    const data = await res.json()
    if(!Array.isArray(data)) throw new Error('SheetDB returned non-array')
    // Normalize keys: trim whitespace so form-question keys like "Your Name " become "Your Name"
    const normalized = data.map(row => {
      const out = {}
      Object.entries(row).forEach(([k, v]) => {
        if(typeof k === 'string') out[k.trim()] = v
        else out[k] = v
      })
      return out
    })
    return normalized
  }catch(err){
    console.error('Failed to fetch SheetDB', err)
    throw err
  }
}
