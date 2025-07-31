import React, { useEffect } from 'react';

export interface AlertMessage {
  id: string; 
  message: string;
  type: 'success' | 'error' | 'info' | 'warning'; // Tipo de alerta
}

interface AlertContainerProps {
  alerts: AlertMessage[];
  removeAlert: (id: string) => void;
}

const AlertContainer: React.FC<AlertContainerProps> = ({ alerts, removeAlert }) => {
  useEffect(() => {
    // Remover alertas automaticamente após alguns segundos
    const timerIds = alerts.map(alert =>
      setTimeout(() => {
        removeAlert(alert.id);
      }, 5000) // Alerta desaparece após 5 segundos
    );

    // Limpeza dos timers quando os alertas mudam ou o componente desmonta
    return () => {
      timerIds.forEach(clearTimeout);
    };
  }, [alerts, removeAlert]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3">
      {alerts.map(alert => (
        <div key={alert.id} className="w-full max-w-xs"> {/* Define largura máxima para o alerta */}
          <div role="alert" className={`alert alert-${alert.type}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{alert.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertContainer;