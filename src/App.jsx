import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Movie from './pages/Movie'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route index element={<Home/>}/>
      <Route path=":movie" element={<Movie/>}/>
    </Routes>
  )
}

export default App
