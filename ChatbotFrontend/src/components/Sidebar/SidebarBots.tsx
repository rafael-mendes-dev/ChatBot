import { getBotsAsync } from "../../services/api";
import type { Bot as BotType } from "../../services/types";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import DeleteBotForm from "../Forms/DeleteBotForm";
import Modal from "../Modal";
import EditBotForm from "../Forms/EditBotForm";
import { useNavigate } from "react-router-dom";
import BotList from "./BotList";

interface SidebarBotsProps {
    isOpen: boolean;
    addAlert: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const SidebarBots = ({ isOpen, addAlert }: SidebarBotsProps) => {
    const [bots, setBots] = useState<BotType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(10); // Limite inicial de bots visíveis
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [editBotId, setEditBotId] = useState<string | null>(null);

    const handleBotClick = (botId: string) => {
        navigate(`/chat/${botId}`);
    };
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
        const updateCount = () => {
            if (window.innerHeight < 600) setVisibleCount(4);
            else if (window.innerHeight < 900) setVisibleCount(8);
            else if (window.innerHeight < 1000) setVisibleCount(11);
        };
        updateCount();
        window.addEventListener("resize", updateCount);
        return () => window.removeEventListener("resize", updateCount);
    }, []);

    // Fecha o menu ao clicar fora
    useEffect(() => {
        if (!menuOpenId) return;
        const handleClick = (e: MouseEvent) => {
            const menu = document.getElementById('sidebar-bot-menu');
            if (menu && !menu.contains(e.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [menuOpenId]);

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <>
            <BotList
                bots={bots}
                isOpen={isOpen}
                visibleCount={visibleCount}
                menuOpenId={menuOpenId}
                onBotClick={handleBotClick}
                onMenuClick={(botId, e) => {
                    if (!isOpen) return;
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === botId ? null : botId);
                }}
                onEdit={(bot, e) => {
                    e.stopPropagation();
                    setMenuOpenId(null);
                    setEditBotId(String(bot.id));
                }}
                onDelete={(bot, e) => {
                    e.stopPropagation();
                    setMenuOpenId(null);
                    setConfirmDeleteId(String(bot.id));
                }}
            />
            <Modal isOpen={!!editBotId} onClose={() => setEditBotId(null)} title="Editar Bot">
                <EditBotForm
                    botId={editBotId ? Number(editBotId) : null}
                    isOpen={!!editBotId}
                    onClose={() => setEditBotId(null)}
                    onUpdated={fetchBots}
                    addAlert={addAlert}
                />
            </Modal>
            <DeleteBotForm
                botId={confirmDeleteId ? Number(confirmDeleteId) : null}
                botName={confirmDeleteId ? bots.find(b => String(b.id) === confirmDeleteId)?.name : ''}
                isOpen={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onDeleted={fetchBots}
                addAlert={addAlert}
            />
        </>
    );
};

export default SidebarBots;