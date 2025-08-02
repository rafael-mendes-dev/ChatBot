import React, { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  // Prevenir scroll do body quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Se clicou diretamente no backdrop (não no conteúdo), fecha o modal
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Se o modal não está aberto, não renderiza nada
  if (!isOpen) return null;

  // Renderizar o modal diretamente no body usando createPortal
  return createPortal(
    <div 
      className="modal" 
      onClick={handleBackdropClick}
    >
      <div className="modal-box bg-base-300" onClick={(e) => e.stopPropagation()}>
        {/* Botão de fechar */}
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
        {title && <h2 className="text-2xl font-bold text-center mb-6 text-base-content">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;