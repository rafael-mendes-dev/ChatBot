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
        className={`group relative flex items-center ${isOpen ? 'w-full sm:w-auto sm:justify-start' : 'w-full justify-center'} p-[10px] rounded-full text-neutral-content cursor-pointer hover:bg-neutral transition-colors duration-200`}
        aria-label={`Bot ${bot.name}`}
        title={isOpen ? undefined : `${bot.name}`}
        onClick={onClick}
    >
        {/* Always render icon and text; collapse text for closed state to animate smoothly */}
        <div className={`flex w-full items-center ${isOpen ? 'justify-between' : 'justify-center'} transition-all duration-300`}>
            <div className={`flex items-center ${isOpen ? 'gap-2 justify-start' : 'gap-0 justify-center'} transition-all duration-300`}>
                <Bot className="flex-shrink-0 transition-all duration-300" />
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen
                        ? 'opacity-100 max-w-[180px] translate-x-0 pr-2'
                        : 'opacity-0 max-w-0 -translate-x-4 pr-0'
                    }`}>
                    <p className="whitespace-nowrap transition-all duration-300">{bot.name}</p>
                    <p className="text-xs text-base-content/50 whitespace-nowrap transition-all duration-300">Ver mensagens</p>
                </div>
            </div>
            <span
                className={`flex-shrink-0 z-10 transition-all duration-300 ${isOpen ? 'sm:opacity-0 sm:group-hover:opacity-100 opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-75'}`}
                onClick={onMenuClick}
            >
                <Ellipsis />
            </span>
        </div>
        {/* Menu de edição/exclusão */}
        {isMenuOpen && (
            <div id="sidebar-bot-menu" className="absolute right-0 top-full mt-2 w-32 bg-base-100 border border-base-content/20 rounded-lg shadow-lg z-20 flex flex-col">
                <button
                    className="px-4 py-2 text-left hover:bg-neutral text-base-content border-b border-base-content/20"
                    onClick={onEdit}
                >Editar</button>
                <button
                    className="px-4 py-2 text-left hover:bg-neutral text-error"
                    onClick={onDelete}
                >Excluir</button>
            </div>
        )}
    </div>
);

export default BotListItem;
