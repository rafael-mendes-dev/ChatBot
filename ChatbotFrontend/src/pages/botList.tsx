// src/pages/BotList.tsx
import { useState, useEffect } from 'react';
import { getBotsAsync } from '../services/api';
import { type Bot } from '../services/types';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import CreateBotForm from '../components/CreateBotForm';

// Nova interface para as props, pois BotList agora recebe addAlert
interface BotListProps {
  addAlert: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// O componente BotList agora recebe addAlert como prop
function BotList({ addAlert }: BotListProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchBots = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBotsAsync();
      setBots(data);
    } catch (err: any) {
      console.error('Erro ao buscar bots:', err);
      setError(err.response?.data?.message || 'Erro ao carregar a lista de bots. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleBotCreated = () => {
    fetchBots(); // Recarrega a lista de bots após um novo ser criado
  };

  // Função para passar o alerta de sucesso para o App.tsx
  const handleSuccessAlert = (message: string) => {
    addAlert(message, 'success');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-600 mt-8">
        Carregando bots...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600 font-bold mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl mt-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Meus Chatbots</h2>
      {bots.length === 0 ? (
        <p className="text-center text-gray-600 mb-6">
          Nenhum bot criado ainda. <button onClick={() => setIsModalOpen(true)} className="text-green-600 hover:underline font-semibold bg-transparent shadow-none px-0 py-0">Crie um agora!</button>
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">{bot.name}</h3>
              <p className="text-gray-700 text-sm mb-4 flex-grow">{bot.context}</p>
              <Link to={`/chat/${bot.id}`} className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                Conversar com {bot.name}
              </Link>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className="block mx-auto text-center text-lg font-bold bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition duration-200"
      >
        + Criar Novo Bot
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Chatbot">
        <CreateBotForm
          onClose={() => setIsModalOpen(false)}
          onBotCreated={handleBotCreated}
          onSuccessAlert={handleSuccessAlert} // PASSA A FUNÇÃO PARA O FORMULÁRIO
        />
      </Modal>
    </div>
  );
}

export default BotList;