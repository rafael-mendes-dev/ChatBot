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
            <div className="p-4 text-gray-200">
                <p>Tem certeza que deseja excluir o bot <span className="font-bold">{botName}</span>?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                        onClick={onClose}
                        disabled={loading}
                    >Cancelar</button>
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        onClick={handleDelete}
                        disabled={loading}
                    >{loading ? "Excluindo..." : "Excluir"}</button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteBotForm;
