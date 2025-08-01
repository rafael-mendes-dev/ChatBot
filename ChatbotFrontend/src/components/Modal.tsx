import React, { type ReactNode, useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const dialogRef = useRef<HTMLDialogElement>(null); 

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal(); 
    } else {
      dialogRef.current?.close(); 
    }
  }, [isOpen]); 

  return (
    <dialog id="my_modal" className="modal" ref={dialogRef} onCancel={onClose}>
      <div className="modal-box bg-[#282a2c] ">
        {/* O <form method="dialog"> permite fechar com Esc ou com o botão '✕' automaticamente */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        </form>
        {title && <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>}
        {children}
      </div>
    </dialog>
  );
};

export default Modal;