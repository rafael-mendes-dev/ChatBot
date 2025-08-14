import React, { useState, useEffect } from 'react';

interface SettingsFormProps {
  onClose: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onClose }) => {
  const [isDark, setIsDark] = useState(true);

  // Carregar tema atual
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isLight = savedTheme === 'light';
    setIsDark(!isLight);
  }, []);

  // Alternar tema
  const handleThemeChange = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;
    
    if (newIsDark) {
      // Tema escuro
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      // Tema claro
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDark(newIsDark);
  };

  return (
    <div className="space-y-6">
      {/* Seção de Tema */}
      <div className="border-b border-base-content/20 pb-6">
        <h3 className="text-lg font-semibold text-base-content mb-4">Aparência</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base-content font-medium">Tema</p>
            <p className="text-base-content/60 text-sm">Escolha entre tema claro ou escuro</p>
          </div>
          
          <label className="flex cursor-pointer gap-2">
            {/* Ícone do Sol (tema claro) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-colors duration-300 ${!isDark ? 'text-warning' : 'text-base-content/40'}`}
            >
              <circle cx="12" cy="12" r="5" />
              <path
                d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            
            {/* Toggle Switch */}
            <input 
              type="checkbox" 
              checked={isDark}
              onChange={handleThemeChange}
              className="toggle bg-base-200 border-base-content/20 checked:bg-neutral checked:border-neutral [--tglbg:var(--color-base-100)] hover:bg-base-300 transition-all duration-300" 
            />
            
            {/* Ícone da Lua (tema escuro) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-colors duration-300 ${isDark ? 'text-primary' : 'text-base-content/40'}`}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
        </div>
      </div>

      {/* Seção de Outras Configurações (placeholder para futuras funcionalidades) */}
      <div className="border-b border-base-content/20 pb-6">
        <h3 className="text-lg font-semibold text-base-content mb-4">Notificações</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content font-medium">Notificações de mensagem</p>
              <p className="text-base-content/60 text-sm">Receber notificações quando uma nova mensagem chegar</p>
            </div>
            <input 
              type="checkbox" 
              defaultChecked
              className="toggle bg-base-200 border-base-content/20 checked:bg-primary checked:border-primary"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content font-medium">Sons</p>
              <p className="text-base-content/60 text-sm">Reproduzir sons para notificações</p>
            </div>
            <input 
              type="checkbox" 
              defaultChecked
              className="toggle bg-base-200 border-base-content/20 checked:bg-primary checked:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Seção de Informações */}
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-4">Sobre</h3>
        
        <div className="space-y-2 text-sm text-base-content/60">
          <p><span className="font-medium text-base-content">Versão:</span> 1.0.0</p>
          <p><span className="font-medium text-base-content">Última atualização:</span> Agosto 2025</p>
          <p><span className="font-medium text-base-content">Desenvolvido por:</span> Sua Empresa</p>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
        >
          Salvar Configurações
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-neutral text-neutral-content rounded-lg hover:bg-neutral/80 transition-colors duration-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SettingsForm;
