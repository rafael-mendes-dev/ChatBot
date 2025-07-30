import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BotList from './pages/botList';
import ChatWindow from './pages/chatWindow';
import AlertContainer, { type AlertMessage } from './components/AlertContainer'; // Importa o AlertContainer
import './index.css';

function App() {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  // Função para adicionar um novo alerta
  const addAlert = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newAlert: AlertMessage = {
      id: Math.random().toString(36).substring(2, 9), // ID único simples
      message,
      type,
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  }, []);

  // Função para remover um alerta
  const removeAlert = useCallback((id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  }, []);

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
          </ul>
        </nav>

        <main className="flex-grow p-4">
          <Routes>
            {/* Passamos a função addAlert como prop para os componentes que precisam dela */}
            <Route path="/" element={<BotList addAlert={addAlert} />} />
            <Route path="/bots" element={<BotList addAlert={addAlert} />} />
            <Route path="/chat/:botId" element={<ChatWindow />} />
          </Routes>
        </main>

        {/* Renderiza o AlertContainer no final do App.tsx */}
        <AlertContainer alerts={alerts} removeAlert={removeAlert} />
      </div>
    </Router>
  );
}

export default App
