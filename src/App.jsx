import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Drafts from './pages/Drafts'
import MessageDetail from './pages/MessageDetail'

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/drafts" element={<Drafts/>} />
      <Route path="/message/:id" element={<MessageDetail/>} />
    </Routes>
  )
}
