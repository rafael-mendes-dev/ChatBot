import { PanelRightOpen, MessageSquarePlus, CircleQuestionMark, Settings, PanelLeftOpen } from 'lucide-react'
import SidebarBots from './SidebarBots';
import { useState } from 'react';

const Sidebar = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="min-h-screen inline-flex flex-col justify-between bg-[#282a2c] py-[15px] px-[10px]">
            <div className="top">
                {isOpen ? <PanelRightOpen className="block ml-[10px] cursor-pointer transition-transform duration-200 hover:scale-110" 
                onClick={() => setIsOpen(!isOpen)} /> : 
                <PanelLeftOpen className="block ml-[10px] cursor-pointer transition-transform duration-200 hover:scale-110" onClick={() => setIsOpen(!isOpen)} />}
                <div className="mt-[30px] inline-flex items-center gap-[10px] py-[10px] px-[15px] rounded-full text-sm text-gray-400 cursor-pointer bg-[#323537] hover:bg-[#3a3c3e] transition-colors duration-200">
                    <MessageSquarePlus className="flex-shrink-0" />
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen 
                            ? 'opacity-100 max-w-xs transform translate-x-0' 
                            : 'opacity-0 max-w-0 transform -translate-x-2'
                    }`}>
                        <p className="whitespace-nowrap">Novo Bot</p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mt-[30px] mb-[20px] overflow-hidden transition-all duration-300 ease-in-out">
                        <p className="whitespace-nowrap">Recentes</p>
                    </div>
                    <SidebarBots isOpen={isOpen} />
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-[10px] p-[10px] rounded-full text-[#d3d8d4] cursor-pointer hover:bg-[#323537] transition-colors duration-200">
                    <CircleQuestionMark className="flex-shrink-0" />
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen 
                            ? 'opacity-100 max-w-xs transform translate-x-0' 
                            : 'opacity-0 max-w-0 transform -translate-x-2'
                    }`}>
                        <p className="whitespace-nowrap">Ajuda</p>
                    </div>
                </div>
                <div className="flex items-center gap-[10px] p-[10px] rounded-full text-[#d3d8d4] cursor-pointer hover:bg-[#323537] transition-colors duration-200">
                    <Settings className="flex-shrink-0" />
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen 
                            ? 'opacity-100 max-w-xs transform translate-x-0' 
                            : 'opacity-0 max-w-0 transform -translate-x-2'
                    }`}>
                        <p className="whitespace-nowrap">Configurações</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;