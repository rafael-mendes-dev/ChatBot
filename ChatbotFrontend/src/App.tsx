import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CreateBot from './pages/createBot'
import BotList from './pages/botList'
import ChatWindow from './pages/chatWindow'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 shadow-md">
          <ul className="flex justify-end space-x-6 mr-4">
            <li>
              <Link to="/bots" className="text-white hover:text-blue-200 font-semibold text-lg transition duration-200">
                Meus Bots
              </Link>
            </li>
            <li>
              <Link to="/create-bot" className="text-white hover:text-blue-200 font-semibold text-lg transition duration-200">
                Criar Novo Bot
              </Link>
            </li>
          </ul>
        </nav>

        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<BotList />} /> {/* Rota padrão */}
            <Route path="/bots" element={<BotList />} />
            <Route path="/create-bot" element={<CreateBot />} />
            <Route path="/chat/:botId" element={<ChatWindow />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
