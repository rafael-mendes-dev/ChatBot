import React, { useState } from 'react';
import { createBotAsync} from "../services/api.ts";
import { useNavigate } from 'react-router-dom';

function createBot(){
    const [name, setName] = useState<string>('');
    const [context, setContext] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await createBotAsync(name, context);
            alert('Bot criado com sucesso!');
            navigate('/bots');
        }catch(err: any){
            console.error('Erro ao criar o bot:', err);
            setError(err.response?.data?.message || 'Erro ao criar o bot. Verifique sua conexão e tente novamente.');
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl max-w-lg mt-8">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Criar Novo Chatbot</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="botName" className="block text-gray-700 text-sm font-semibold mb-2">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="botContext" className="block text-gray-700 text-sm font-semibold mb-2">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                >
                    {loading ? 'Criando...' : 'Criar Bot'}
                </button>
                {error && <p className="text-red-600 text-center mt-4 font-medium">{error}</p>}
            </form>
        </div>
    );
}

export default createBot;