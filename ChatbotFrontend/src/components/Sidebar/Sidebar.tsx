import { PanelRightOpen, MessageSquarePlus, CircleQuestionMark, Settings, PanelLeftOpen } from 'lucide-react'
import SidebarBots from './SidebarBots';
import Modal from '../Modal';
import CreateBotForm from '../CreateBotForm';
import { useState } from 'react';

// Nova interface para as props, pois BotList agora recebe addAlert
interface BotListProps {
  addAlert: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Sidebar = ({ addAlert }: BotListProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const handleSuccessAlert = (message: string) => {
        addAlert(message, 'success');
    };

    const handleBotCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen inline-flex flex-col justify-between bg-[#282a2c] py-[15px] px-[10px]">
            <div className="top">
                {isMenuOpen ? <PanelRightOpen className="block ml-[10px] cursor-pointer transition-transform duration-200 hover:scale-110" 
                onClick={() => setIsMenuOpen(!isMenuOpen)} /> : 
                <PanelLeftOpen className="block ml-[10px] cursor-pointer transition-transform duration-200 hover:scale-110" onClick={() => setIsMenuOpen(!isMenuOpen)} />}
                <div 
                    className="mt-[30px] inline-flex items-center gap-[10px] py-[10px] px-[15px] rounded-full text-sm text-gray-400 cursor-pointer bg-[#323537] hover:bg-[#3a3c3e] transition-colors duration-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    <MessageSquarePlus className="flex-shrink-0" />
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen 
                            ? 'opacity-100 max-w-xs transform translate-x-0' 
                            : 'opacity-0 max-w-0 transform -translate-x-2'
                    }`}>
                        <p className="whitespace-nowrap">Novo Chatbot</p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="mt-[30px] mb-[20px] overflow-hidden transition-all duration-300 ease-in-out">
                        <p className="whitespace-nowrap">Recentes</p>
                    </div>
                    <SidebarBots isOpen={isMenuOpen} key={refreshTrigger} />
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-[10px] p-[10px] rounded-full text-[#d3d8d4] cursor-pointer hover:bg-[#323537] transition-colors duration-200">
                    <CircleQuestionMark className="flex-shrink-0" />
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen 
                            ? 'opacity-100 max-w-xs transform translate-x-0' 
                            : 'opacity-0 max-w-0 transform -translate-x-2'
                    }`}>
                        <p className="whitespace-nowrap">Ajuda</p>
                    </div>
                </div>
                <div className="flex items-center gap-[10px] p-[10px] rounded-full text-[#d3d8d4] cursor-pointer hover:bg-[#323537] transition-colors duration-200">
                    <Settings className="flex-shrink-0" />
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen 
                            ? 'opacity-100 max-w-xs transform translate-x-0' 
                            : 'opacity-0 max-w-0 transform -translate-x-2'
                    }`}>
                        <p className="whitespace-nowrap">Configurações</p>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Chatbot">
                <CreateBotForm
                onClose={() => setIsModalOpen(false)}
                onBotCreated={handleBotCreated}
                onSuccessAlert={handleSuccessAlert} // PASSA A FUNÇÃO PARA O FORMULÁRIO
                />
            </Modal>
        </div>
    )
}

export default Sidebar;