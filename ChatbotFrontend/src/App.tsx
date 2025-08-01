import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AlertContainer, { type AlertMessage } from './components/AlertContainer'; 
import './index.css';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';

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
    <div className="flex min-h-screen">
      <Sidebar addAlert={addAlert} />
      <Main />
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </div>
  );
}

export default App
