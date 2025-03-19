import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChatbotIcon from '../components/ChatbotIcon'

function MainLayout({ darkMode, toggleDarkMode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <ChatbotIcon />
    </div>
  )
}

export default MainLayout