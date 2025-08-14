import React from "react";
import BotListItem from "./BotListItem";
import type { Bot as BotType } from "../../services/types";

interface BotListProps {
    bots: BotType[];
    isOpen: boolean;
    visibleCount: number;
    menuOpenId: string | null;
    onBotClick: (botId: string) => void;
    onMenuClick: (botId: string, e: React.MouseEvent) => void;
    onEdit: (bot: BotType, e: React.MouseEvent) => void;
    onDelete: (bot: BotType, e: React.MouseEvent) => void;
}

const BotList: React.FC<BotListProps> = ({
    bots,
    isOpen,
    visibleCount,
    menuOpenId,
    onBotClick,
    onMenuClick,
    onEdit,
    onDelete,
}) => (
    <div className="flex flex-col w-full">
        {bots.slice(0, visibleCount).map((bot) => (
            <BotListItem
                key={bot.id}
                bot={bot}
                isOpen={isOpen}
                isMenuOpen={menuOpenId === String(bot.id)}
                onClick={() => onBotClick(String(bot.id))}
                onMenuClick={e => onMenuClick(String(bot.id), e)}
                onEdit={e => onEdit(bot, e)}
                onDelete={e => onDelete(bot, e)}
            />
        ))}
    </div>
);

export default BotList;
