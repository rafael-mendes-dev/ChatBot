import { getBotsAsync } from "../../services/api";
import type { Bot as BotType } from "../../services/types";
import { Bot } from 'lucide-react';
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

const SidebarBots = ({ isOpen }: { isOpen: boolean }) => {
    const [bots, setBots] = useState<BotType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchBots = async () => {
        setLoading(true);
        try {
        const data = await getBotsAsync();
        setBots(data);
        } catch (err: any) {
        console.error('Erro ao buscar bots:', err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchBots();
    }, []);

    if (loading) {
    return (
      <LoadingSpinner />
    );
  }

    return (
        <div className="flex flex-col">
            {bots.slice(0, 8).map((bot) => (
                <div 
                    key={bot.id} 
                    className="flex items-center justify-start gap-[10px] p-[10px] rounded-full text-[#d3d8d4] cursor-pointer hover:bg-[#323537] transition-colors duration-200" 
                    aria-label={`Bot ${bot.name}`}
                    title={isOpen ? undefined : `${bot.name}`}
                >
                    <Bot className='flex-shrink-0' />
                    <div className={`flex flex-col items-start gap-px overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen 
                            ? 'opacity-100 max-w-xs transform translate-x-0' 
                            : 'opacity-0 max-w-0 transform -translate-x-2'
                    }`}>
                        <p className="whitespace-nowrap">{bot.name}</p>
                        <p className="text-xs text-gray-500 whitespace-nowrap">Ver mensagens</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SidebarBots;