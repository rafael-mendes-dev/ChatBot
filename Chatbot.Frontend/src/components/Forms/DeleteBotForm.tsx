import React, { useState } from "react";
import Modal from "../Modal";
import { deleteBotAsync } from "../../services/api";

interface DeleteBotFormProps {
    botId: number | null;
    botName?: string;
    isOpen: boolean;
    onClose: () => void;
    onDeleted?: () => void;
    addAlert?: (message: string, type?: "success" | "error" | "info") => void;
}

const DeleteBotForm: React.FC<DeleteBotFormProps> = ({ botId, botName, isOpen, onClose, onDeleted, addAlert }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!botId) return;
        setLoading(true);
        try {
            await deleteBotAsync(botId);
            if (addAlert) addAlert("Bot excluído com sucesso!", "success");
            if (onDeleted) onDeleted();
            onClose();
        } catch (err) {
            if (addAlert) addAlert("Erro ao excluir bot.", "error");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar exclusão">
            <div className="p-4">
                <p className="text-base-content text-lg">
                    Tem certeza que deseja excluir o bot <span className="font-bold text-primary">{botName}</span>?
                </p>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className="px-4 py-2 rounded bg-neutral text-neutral-content hover:bg-neutral/80 transition-colors font-medium"
                        onClick={onClose}
                        disabled={loading}
                    >Cancelar</button>
                    <button
                        className="px-4 py-2 rounded bg-error text-white hover:bg-error/90 transition-colors font-medium"
                        onClick={handleDelete}
                        disabled={loading}
                    >{loading ? "Excluindo..." : "Excluir"}</button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteBotForm;
