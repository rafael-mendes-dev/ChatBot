import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BotList from './pages/botList';
import ChatWindow from './pages/chatWindow';
import AlertContainer, { type AlertMessage } from './components/AlertContainer'; // Importa o AlertContainer
import './index.css';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  // Função para adicionar um novo alerta
  const addAlert = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newAlert: AlertMessage = {
      id: Math.random().toString(36).substring(2, 9), 
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
      <Sidebar />
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<BotList addAlert={addAlert} />} />
          <Route path="/bots" element={<BotList addAlert={addAlert} />} />
          <Route path="/chat/:botId" element={<ChatWindow />} />
          </Routes>
        </main>

        {/* Renderiza o AlertContainer no final do App.tsx */}
        <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </Router>
  );
}

export default App
