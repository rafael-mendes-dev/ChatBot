import { useEffect, useState } from "react";
import { CircleUserRound, Ellipsis } from "lucide-react";
import { getBotsAsync } from "../services/api";
import type { Bot as BotType } from "../services/types";
import { useNavigate } from "react-router-dom";
import EditBotForm from "../components/Forms/EditBotForm";
import DeleteBotForm from "../components/Forms/DeleteBotForm";
import Modal from "../components/Modal";

const PageHeader = () => (
    <div className="flex items-center justify-between text-2xl text-base-content/60 p-[20px]">
        <p>Chatbot</p>
        <CircleUserRound className="cursor-pointer hover:scale-115" />
    </div>
);

const BotListPage = () => {
    const [bots, setBots] = useState<BotType[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [editBotId, setEditBotId] = useState<number | null>(null);
    const [deleteBotId, setDeleteBotId] = useState<number | null>(null);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const handleAlert = (message: string, type: "success" | "error" | "info" = "info") => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 3000);
    };
    const handleDeleted = async () => {
        await fetchBots();
        setDeleteBotId(null);
    };
    const navigate = useNavigate();

    const fetchBots = async () => {
        setLoading(true);
        try {
            const data = await getBotsAsync();
            setBots(data);
        } catch (err) {
            // handle error
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBots();
    }, []);

    const filteredBots = bots.filter(bot => {
        const searchLower = search.toLowerCase();
        return (
            bot.name.toLowerCase().includes(searchLower) ||
            (bot.context && bot.context.toLowerCase().includes(searchLower))
        );
    });

    // Fecha o menu ao clicar fora
    useEffect(() => {
        if (!menuOpenId) return;
        const handleClick = (e: MouseEvent) => {
            const menu = document.getElementById('botlist-ellipsis-menu');
            if (menu && !menu.contains(e.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [menuOpenId]);

    return (
        <div className="flex-1 min-h-screen bg-base-100 overflow-hidden">
            <PageHeader />
            <div className="max-w-3xl m-auto p-[20px] flex flex-col h-[calc(100vh-80px)]">
                <input
                    type="text"
                    className="w-full mb-6 px-4 py-2 rounded-lg border border-base-content/20 bg-base-200 text-base-content focus:outline-none focus:border-primary"
                    placeholder="Pesquisar bots..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#323537] scrollbar-track-[#232425]">
                    {loading ? (
                        <div className="text-center text-base-content/60">Carregando...</div>
                    ) : (
                        <ul className="divide-y divide-gray-700">
                            {filteredBots.length === 0 ? (
                                <li className="py-6 text-center text-base-content/40">Nenhum bot encontrado.</li>
                            ) : (
                                filteredBots.map(bot => {
                                    const isMenuOpen = menuOpenId === bot.id;
                                    return (
                                        <li
                                            key={bot.id}
                                            className="py-4 flex items-center gap-4 group relative rounded-lg transition-colors duration-200 hover:bg-base-200"
                                        >
                                            <div
                                                className="flex-1 flex items-center gap-4 cursor-pointer"
                                                onClick={() => navigate(`/chat/${bot.id}`)}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center text-primary">
                                                    {bot.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-lg text-base-content font-medium">{bot.name}</p>
                                                    <p className="text-sm text-base-content/50 mt-1">{bot.context || "Sem contexto"}</p>
                                                </div>
                                            </div>
                                            <span
                                                className={`flex-shrink-0 z-10 transition-opacity duration-200 ml-2 ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setMenuOpenId(isMenuOpen ? null : bot.id);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Ellipsis />
                                            </span>
                                            {isMenuOpen && (
                                                <div id="botlist-ellipsis-menu" className="absolute right-0 top-full mt-2 w-32 bg-base-100 border border-base-content/20 rounded-lg shadow-lg z-20 flex flex-col">
                                                    <button
                                                        className="px-4 py-2 text-left hover:bg-neutral text-base-content border-b border-base-content/20"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setMenuOpenId(null);
                                                            setEditBotId(bot.id);
                                                        }}
                                                    >Editar</button>
                                                    <button
                                                        className="px-4 py-2 text-left hover:bg-neutral text-error"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setMenuOpenId(null);
                                                            setDeleteBotId(bot.id);
                                                        }}
                                                    >Excluir</button>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    )}
                </div>
                <Modal isOpen={!!editBotId} onClose={() => setEditBotId(null)} title="Editar Bot">
                    <EditBotForm
                        botId={editBotId}
                        isOpen={!!editBotId}
                        onClose={() => setEditBotId(null)}
                        onUpdated={fetchBots}
                        addAlert={handleAlert}
                    />
                </Modal>
                <DeleteBotForm
                    botId={deleteBotId}
                    botName={deleteBotId ? bots.find(b => b.id === deleteBotId)?.name : ''}
                    isOpen={!!deleteBotId}
                    onClose={() => setDeleteBotId(null)}
                    onDeleted={handleDeleted}
                    addAlert={handleAlert}
                />
                {alert && (
                    <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 flex items-center gap-2 ${alert.type === "success"
                            ? "alert-success"
                            : alert.type === "error"
                                ? "alert-error"
                                : "alert-info"
                        }`}>
                        {alert.type === "success" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {alert.type === "error" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        {alert.type === "info" && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <span>{alert.message}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BotListPage;
