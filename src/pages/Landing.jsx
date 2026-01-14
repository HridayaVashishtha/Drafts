import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import background from '../assets/Background.png'

export default function Landing(){
  const nav = useNavigate()
  return (
    <div className="landing centered" style={{
      minHeight: '100vh',
      width: '100%',
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <img src={logo} alt="Adult-ish logo" className="logo" style={{width:140,height:140,objectFit:'contain',marginBottom:24}} />
      <h1>Happy 24th Birthday</h1>
      <p className="muted">This little corner of the internet was made just for you.</p>
      <button className="cta" onClick={()=>nav('/drafts')}>Open Your Surprise</button>
    </div>
  )
}
