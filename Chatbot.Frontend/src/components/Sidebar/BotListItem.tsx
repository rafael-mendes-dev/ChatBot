import React from "react";
import { Bot, Ellipsis } from "lucide-react";

interface BotListItemProps {
    bot: {
        id: number;
        name: string;
    };
    isOpen: boolean;
    isMenuOpen: boolean;
    onClick: () => void;
    onMenuClick: (e: React.MouseEvent) => void;
    onEdit: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

const BotListItem: React.FC<BotListItemProps> = ({
    bot,
    isOpen,
    isMenuOpen,
    onClick,
    onMenuClick,
    onEdit,
    onDelete,
}) => (
    <div
        key={bot.id}
        className={`group relative flex items-center ${isOpen ? 'w-full sm:w-auto sm:justify-start' : 'w-full justify-center'} p-[10px] rounded-full text-[#d3d8d4] cursor-pointer hover:bg-[#323537] transition-colors duration-200`}
        aria-label={`Bot ${bot.name}`}
        title={isOpen ? undefined : `${bot.name}`}
        onClick={onClick}
    >
        {/* Always render icon and text; collapse text for closed state to animate smoothly */}
        <div className={`flex w-full items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
            <div className={`flex items-center ${isOpen ? 'gap-2 justify-start' : 'gap-0 justify-center'} transition-all duration-300`}>
                <Bot className="flex-shrink-0" />
                <div className={`overflow-hidden transition-all duration-300 ease-in-out transform ${isOpen
                        ? 'opacity-100 max-w-xs translate-x-0 pr-2'
                        : 'opacity-0 max-w-0 -translate-x-2 pr-0'
                    }`}>
                    <p className="whitespace-nowrap">{bot.name}</p>
                    <p className="text-xs text-gray-500 whitespace-nowrap">Ver mensagens</p>
                </div>
            </div>
            <span
                className={`flex-shrink-0 z-10 transition-opacity duration-300 ${isOpen ? 'sm:opacity-0 sm:group-hover:opacity-100 opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onMenuClick}
            >
                <Ellipsis />
            </span>
        </div>
        {/* Menu de edição/exclusão */}
        {isMenuOpen && (
            <div id="sidebar-bot-menu" className="absolute right-0 top-full mt-2 w-32 bg-[#1e2020] border border-gray-700 rounded-lg shadow-lg z-20 flex flex-col">
                <button
                    className="px-4 py-2 text-left hover:bg-[#323537] text-gray-200 border-b border-gray-700"
                    onClick={onEdit}
                >Editar</button>
                <button
                    className="px-4 py-2 text-left hover:bg-[#323537] text-red-400"
                    onClick={onDelete}
                >Excluir</button>
            </div>
        )}
    </div>
);

export default BotListItem;
