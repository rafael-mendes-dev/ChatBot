import { useState, useEffect } from 'react';
import { getBotsAsync } from "../services/api.ts";
import type {Bot} from '../services/types.ts';
import { Link } from 'react-router-dom';

function botList() {
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBots = async () => {
            try {
                setLoading(true);
                const data = await getBotsAsync();
                setBots(data);
            } catch (err: any) {
                console.error('Erro ao buscar bots:', err);
                setError(err.response?.data?.message || 'Erro ao buscar bots. Verifique sua conexão e tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchBots();
    }, []);
    
    if (loading){
        return(
            <div className="container mx-auto p-6 text-center text-gray-600 mt-8">
                Carregando bots...
            </div>
        )
    }
    
    if (error){
        return(
            <div className="container mx-auto p-6 text-center text-red-600 mt-8">
                <p>Erro ao carregar bots: {error}</p>
            </div>
        )
    }
    
    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl mt-8">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Meus Chatbots</h2>
            {bots.length === 0 ? (
                <p className="text-center text-gray-600 mb-6">
                    Nenhum bot criado ainda. <Link to="/create-bot" className="text-green-600 hover:underline font-semibold">Crie um agora!</Link>
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
            <Link to="/create-bot" className="block text-center text-lg font-bold text-green-600 hover:text-green-700 transition duration-200">
                + Criar Novo Bot
            </Link>
        </div>
    );
}

export default botList;