import React, { useState } from 'react';
import { createBotAsync } from '../../services/api';


interface CreateBotFormProps {
  onClose: () => void;
  onBotCreated: () => void;
  onSuccessAlert: (message: string) => void;
}

const CreateBotForm: React.FC<CreateBotFormProps> = ({ onClose, onBotCreated, onSuccessAlert }) => {
  const [name, setName] = useState<string>('');
  const [context, setContext] = useState<string>('');

  // Função para limpar o formulário
  const clearForm = () => {
    setName('');
    setContext('');
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBotAsync(name, context);
      clearForm(); // Limpa o formulário
      onBotCreated(); // Recarrega a lista de bots
      onClose();      // Fecha o modal imediatamente
      onSuccessAlert('Bot criado com sucesso!'); // Chama a função para exibir o alerta global
    } catch (err: any) {
      console.error('Erro ao criar o bot:', err);
      setError(err.response?.data?.message || 'Erro ao criar o bot. Verifique sua conexão ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-400 text-center mb-4 text-sm">{error}</p>} {/* Erro permanece no modal */}

      {loading ? (
        <div className="text-center text-gray-400 py-8">Criando bot...</div>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="botName" className="block text-gray-200 text-sm font-semibold mb-2">
              Nome do Bot:
            </label>
            <input
              type="text"
              id="botName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Assistente de Vendas"
              required
              disabled={loading}
              className="w-full px-3 py-2 bg-[#3d4043] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="botContext" className="block text-gray-200 text-sm font-semibold mb-2">
              Contexto/Descrição Inicial:
            </label>
            <textarea
              id="botContext"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Ex: Você é um assistente de vendas educado e prestativo. Seu objetivo é ajudar clientes a escolher produtos."
              rows={5}
              required
              disabled={loading}
              className="w-full px-3 py-2 bg-[#3d4043] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y placeholder-gray-400"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:scale-105 hover:bg-lime-500 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200"
          >
            Criar Bot
          </button>
        </>
      )}
    </form>
  );
};

export default CreateBotForm;