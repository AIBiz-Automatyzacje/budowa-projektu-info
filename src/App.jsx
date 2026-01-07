import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Phase1Page from './pages/Phase1Page'
import Phase2Page from './pages/Phase2Page'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/faza-1" element={<Phase1Page />} />
          <Route path="/faza-2" element={<Phase2Page />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
