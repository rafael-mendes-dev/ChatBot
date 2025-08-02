import React, { useState, useEffect } from 'react';

export interface AlertMessage {
  id: string; 
  message: string;
  type: 'success' | 'error' | 'info' | 'warning'; // Tipo de alerta
}

interface AlertContainerProps {
  alerts: AlertMessage[];
  removeAlert: (id: string) => void;
}

// Renderiza um subcomponente para realizar animação de fade-out e remoção
const AlertItem: React.FC<{ alert: AlertMessage; removeAlert: (id: string) => void }> = ({ alert, removeAlert }) => {
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsClosing(true), 2500);
    const removeTimer = setTimeout(() => removeAlert(alert.id), 3000);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, [alert.id, removeAlert]);
  return (
    <div className={`w-full max-w-xs transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div role="alert" className={`alert alert-${alert.type}`}>  
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{alert.message}</span>
      </div>
    </div>
  );
};
const AlertContainer: React.FC<AlertContainerProps> = ({ alerts, removeAlert }) => {

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3">
      {alerts.map(alert => (
        <AlertItem key={alert.id} alert={alert} removeAlert={removeAlert} />
      ))}
    </div>
  );
};

export default AlertContainer;