import { MessageSquarePlus, CircleEllipsis, Settings } from 'lucide-react'
import SidebarToggle from './SidebarToggle';
import SidebarBots from './SidebarBots';
import Modal from '../Modal';
import CreateBotForm from '../Forms/CreateBotForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Nova interface para as props, pois BotList agora recebe addAlert
interface BotListProps {
  addAlert: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Sidebar = ({ addAlert }: BotListProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const navigate = useNavigate();

    const handleSuccessAlert = (message: string) => {
        addAlert(message, 'success');
    };

    const handleBotCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <>
            {/* Botão sempre visivel em telas menores */}
            <div className="sm:hidden fixed top-0 left-0 z-50 p-2">
            <SidebarToggle isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
            </div>
            {/* Sidebar: overlays para telas menores */}
            <div
            className={`
                ${isMenuOpen
                ? 'fixed inset-0 z-40 flex flex-col justify-between bg-[#282a2c] p-4 transition-all duration-300 sm:static sm:inline-flex sm:h-screen sm:w-auto sm:justify-between sm:bg-[#282a2c] sm:p-[15px] sm:px-[10px]'
                : 'invisible fixed inset-0 z-40 flex flex-col justify-between bg-[#282a2c] p-2 transition-all duration-300 sm:visible sm:static sm:inline-flex sm:h-screen sm:w-auto sm:justify-between sm:bg-[#282a2c] sm:p-[15px] sm:px-[10px]'
                }`}>
                <div className="top">
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            {/* Botão de alternância oculto dentro da barra lateral em dispositivos móveis, visível apenas fora */}
                            <div className="sm:block hidden">
                                <SidebarToggle isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
                            </div>
                            {/* Apenas exibe os itens do menu se estiver aberto ou em desktop */}
                        {/* Novo Chatbot */}
                        <div
                            className={`mt-[30px] flex items-center ${isMenuOpen ? 'gap-[10px] py-[10px] px-[15px] justify-start' : 'justify-center p-[10px]'} rounded-full text-sm text-gray-400 cursor-pointer bg-[#323537] hover:bg-[#3a3c3e] transition-colors duration-200`}
                            onClick={() => setIsModalOpen(true)}
                        >
                            <MessageSquarePlus className="flex-shrink-0" />
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'opacity-100 max-w-xs translate-x-0' : 'opacity-0 max-w-0 -translate-x-2'}`}>
                                <p className="whitespace-nowrap">Novo Chatbot</p>
                            </div>
                        </div>
                        <div className={`mt-[30px] mb-[20px] overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'block' : 'hidden sm:block'}`}>
                            <p className="whitespace-nowrap">Bots criados</p>
                        </div>
                        <div className={isMenuOpen ? 'block' : 'hidden sm:block'}>
                            <SidebarBots isOpen={isMenuOpen} key={refreshTrigger} addAlert={addAlert}/>
                        </div>
                    </div>
                </div>
                </div>
                <div className="flex flex-col">
                    {/* Ver mais bots */}
                    <div
                        className={`flex items-center ${isMenuOpen ? 'gap-[10px] p-[10px] justify-start' : 'justify-center p-[10px]'} rounded-full text-[#d3d8d4] cursor-pointer hover:bg-[#323537] transition-colors duration-200`}
                        onClick={() => navigate('/bots')}
                    >
                        <CircleEllipsis className="flex-shrink-0" />
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'opacity-100 max-w-xs translate-x-0' : 'opacity-0 max-w-0 -translate-x-2'}`}>
                            <p className="whitespace-nowrap">Ver mais bots</p>
                        </div>
                    </div>
                    {/* Configurações */}
                    <div
                        className={`flex items-center ${isMenuOpen ? 'gap-[10px] p-[10px] justify-start' : 'justify-center p-[10px]'} rounded-full text-[#d3d8d4] cursor-pointer hover:bg-[#323537] transition-colors duration-200`}
                    >
                        <Settings className="flex-shrink-0" />
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'opacity-100 max-w-xs translate-x-0' : 'opacity-0 max-w-0 -translate-x-2'}`}>
                            <p className="whitespace-nowrap">Configurações</p>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Chatbot">
                    <CreateBotForm
                    onClose={() => setIsModalOpen(false)}
                    onBotCreated={handleBotCreated}
                    onSuccessAlert={handleSuccessAlert}
                    />
                </Modal>
            </div>
        </>
    )
}

export default Sidebar;