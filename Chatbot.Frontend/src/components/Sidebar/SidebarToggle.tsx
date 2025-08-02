import React from "react";

interface SidebarToggleProps {
    isOpen: boolean;
    onToggle: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({ isOpen, onToggle }) => (
    <button 
        className="p-2 rounded-lg bg-neutral hover:bg-neutral/80 text-neutral-content transition-colors duration-200"
        onClick={onToggle}
        aria-label={isOpen ? "Fechar sidebar" : "Abrir sidebar"}
    >
        {isOpen ? (
            // X icon (close)
            <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
            >
                <polygon
                    points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" 
                />
            </svg>
        ) : (
            // Hamburger icon (open)
            <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                fill="currentColor"
            >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>
        )}
    </button>
);

export default SidebarToggle;
