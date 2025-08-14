import React, { useState, useEffect } from "react";
import { updateBotAsync, getBotByIdAsync } from "../../services/api";

interface EditBotFormProps {
    botId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: () => void;
    addAlert: (message: string, type?: "success" | "error" | "info") => void;
}

const EditBotForm: React.FC<EditBotFormProps> = ({ botId, isOpen, onClose, onUpdated, addAlert }) => {
    const [name, setName] = useState("");
    const [context, setContext] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (botId && isOpen) {
            setLoading(true);
            getBotByIdAsync(botId)
                .then(bot => {
                    setName(bot.name);
                    setContext(bot.context || "");
                })
                .finally(() => setLoading(false));
        }
    }, [botId, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!botId) return;
        setLoading(true);
        setError(null);
        try {
            await updateBotAsync(botId, name, context);
            addAlert("Bot atualizado com sucesso!", "success");
            onUpdated();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Erro ao atualizar bot. Verifique sua conexão ou tente novamente.");
            addAlert("Erro ao atualizar bot.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="text-error text-center mb-4 text-sm">{error}</p>}
            {loading ? (
                <div className="text-center text-base-content/60 py-8">Salvando alterações...</div>
            ) : (
                <>
                    <div className="mb-4">
                        <label htmlFor="editBotName" className="block text-base-content text-sm font-semibold mb-2">
                            Nome do Bot:
                        </label>
                        <input
                            type="text"
                            id="editBotName"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Assistente de Vendas"
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 bg-base-200 text-base-content border border-base-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder-base-content/40"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="editBotContext" className="block text-base-content text-sm font-semibold mb-2">
                            Contexto/Descrição Inicial:
                        </label>
                        <textarea
                            id="editBotContext"
                            value={context}
                            onChange={e => setContext(e.target.value)}
                            placeholder="Ex: Você é um assistente de vendas educado e prestativo. Seu objetivo é ajudar clientes a escolher produtos."
                            rows={5}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 bg-base-200 text-base-content border border-base-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y placeholder-base-content/40"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-success hover:scale-105 hover:bg-success/90 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200"
                    >
                        Salvar alterações
                    </button>
                </>
            )}
        </form>
    );
};

export default EditBotForm;
