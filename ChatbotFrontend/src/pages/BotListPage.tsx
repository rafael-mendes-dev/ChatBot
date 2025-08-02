import { useEffect, useState } from "react";
import { CircleUserRound, Ellipsis } from "lucide-react";
import { getBotsAsync } from "../services/api";
import type { Bot as BotType } from "../services/types";
import { useNavigate } from "react-router-dom";
import EditBotForm from "../components/Forms/EditBotForm";
import DeleteBotForm from "../components/Forms/DeleteBotForm";
import Modal from "../components/Modal";

const PageHeader = () => (
    <div className="flex items-center justify-between text-2xl text-gray-400 p-[20px]">
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
        <div className="flex-1 min-h-screen position-relative overflow-hidden">
            <PageHeader />
            <div className="max-w-3xl m-auto p-[20px] flex flex-col h-[calc(100vh-80px)]">
                <input
                    type="text"
                    className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-700 bg-[#232425] text-gray-200 focus:outline-none focus:border-blue-500"
                    placeholder="Pesquisar bots..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#323537] scrollbar-track-[#232425]">
                    {loading ? (
                        <div className="text-center text-gray-400">Carregando...</div>
                    ) : (
                        <ul className="divide-y divide-gray-700">
                            {filteredBots.length === 0 ? (
                                <li className="py-6 text-center text-gray-500">Nenhum bot encontrado.</li>
                            ) : (
                                filteredBots.map(bot => {
                                    const isMenuOpen = menuOpenId === bot.id;
                                    return (
                                        <li
                                            key={bot.id}
                                            className="py-4 flex items-center gap-4 group relative rounded-lg transition-colors duration-200 hover:bg-[#232425]"
                                        >
                                            <div
                                                className="flex-1 flex items-center gap-4 cursor-pointer"
                                                onClick={() => navigate(`/chat/${bot.id}`)}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-[#323537] flex items-center justify-center text-blue-400">
                                                    {bot.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-lg text-gray-200 font-medium">{bot.name}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{bot.context || "Sem contexto"}</p>
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
                                                <div id="botlist-ellipsis-menu" className="absolute right-0 top-full mt-2 w-32 bg-[#1e2020] border border-gray-700 rounded-lg shadow-lg z-20 flex flex-col">
                                                    <button
                                                        className="px-4 py-2 text-left hover:bg-[#323537] text-gray-200 border-b border-gray-700"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setMenuOpenId(null);
                                                            setEditBotId(bot.id);
                                                        }}
                                                    >Editar</button>
                                                    <button
                                                        className="px-4 py-2 text-left hover:bg-[#323537] text-red-400"
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
                <Modal isOpen={!!deleteBotId} onClose={() => setDeleteBotId(null)} title="Excluir Bot">
                    <DeleteBotForm
                        botId={deleteBotId}
                        botName={deleteBotId ? bots.find(b => b.id === deleteBotId)?.name : ''}
                        isOpen={!!deleteBotId}
                        onClose={() => setDeleteBotId(null)}
                        onDeleted={handleDeleted}
                        addAlert={handleAlert}
                    />
                </Modal>
                {alert && (
                    <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${alert.type === "success"
                            ? "bg-green-600 text-white"
                            : alert.type === "error"
                                ? "bg-red-600 text-white"
                                : "bg-blue-600 text-white"
                        }`}>
                        {alert.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BotListPage;
