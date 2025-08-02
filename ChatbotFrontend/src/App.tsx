import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AlertContainer, { type AlertMessage } from './components/AlertContainer'; 
import './index.css';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import ChatWindow from './pages/ChatWindow';
import BotListPage from './pages/BotListPage';

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
      <div className="flex min-h-screen">
        <Sidebar addAlert={addAlert} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/chat/:botId" element={<ChatWindow />} />
          <Route path="/bots" element={<BotListPage />} />
        </Routes>
        <AlertContainer alerts={alerts} removeAlert={removeAlert} />
      </div>
    </Router>
  );
}

export default App
