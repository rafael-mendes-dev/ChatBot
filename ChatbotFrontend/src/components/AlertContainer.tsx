import React, { useEffect } from 'react';
import SuccessAlert from './SucessAlert'; 

export interface AlertMessage {
  id: string; // ID único para cada alerta
  message: string;
  type: 'success' | 'error' | 'info'; // Tipo de alerta
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
          {alert.type === 'success' && <SuccessAlert message={alert.message} />}
          {/* Adicione outros tipos de alerta aqui (ex: ErrorAlert) se precisar */}
        </div>
      ))}
    </div>
  );
};

export default AlertContainer;