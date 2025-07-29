import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import { getBotByIdAsync } from '../services/api.ts';
import type { Message } from '../services/types.ts';

function chatWindow() {
    const { botId } = useParams<{ botId: string }>(); // botId é uma string aqui, precisaremos converter
    const [botName, setBotName] = useState<string>('Carregando...');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>('Conectando...');
    const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efeito para configurar a conexão SignalR
  useEffect(() => {
    const botIdNum = parseInt(botId || '0');
    if (isNaN(botIdNum) || botIdNum === 0) {
      setConnectionStatus('ID do bot inválido');
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5235/chatHub") // URL do seu SignalR Hub no backend
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [botId]); // Depende do botId para recriar a conexão se o ID mudar

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          setConnectionStatus('Conectado');
          console.log('Conectado ao SignalR Hub!');
          connection.invoke("GetBotHistory", parseInt(botId || '0'))
            .catch(err => console.error("Erro ao obter histórico do bot:", err));
        })
        .catch(e => {
          setConnectionStatus('Erro na conexão');
          console.error('Erro ao conectar ao SignalR Hub:', e);
        });

      connection.on("ReceiveMessage", (message: Message & { error?: string }) => {
        console.log("Mensagem recebida:", message);
        if (message.error) {
            alert(`Erro do bot: ${message.error}`);
            // Remove a mensagem do usuário que falhou, se ela foi marcada como isSending
            setMessages((prevMessages) => prevMessages.filter(msg => !(msg.isUser && msg.isSending && msg.userMessage === message.userMessage)));
        } else {
            setMessages((prevMessages) => {
                // Tenta encontrar a mensagem do usuário que ainda está no estado "enviando"
                // e a substitui pela mensagem real do backend que inclui a resposta do bot.
                // O backend retorna uma única 'Message' que contém tanto userMessage quanto botResponse.
                const updatedMessages = prevMessages.map(msg =>
                    msg.isSending && msg.userMessage === message.userMessage
                        ? { ...message, isUser: true, isSending: false } 
                        : msg
                );

                if (!updatedMessages.some(m => m.id === message.id && !m.isUser)) {
                    return [...updatedMessages, { ...message, isUser: false }];
                }
                return updatedMessages;
            });
        }
      });

      connection.on("ReceiveHistory", (history: Message[]) => {
          console.log("Histórico recebido:", history);
          setMessages(history.map(msg => ({ ...msg, isUser: false })));
      });

      connection.onreconnecting(() => {
        setConnectionStatus('Reconectando...');
        console.log('Reconectando ao SignalR Hub...');
      });

      connection.onreconnected(() => {
        setConnectionStatus('Conectado');
        console.log('Reconectado ao SignalR Hub!');
        connection.invoke("GetBotHistory", parseInt(botId || '0'))
          .catch(err => console.error("Erro ao obter histórico do bot após reconexão:", err));
      });

      return () => {
        connection.stop()
          .then(() => console.log('Conexão SignalR parada.'))
          .catch(e => console.error('Erro ao parar conexão SignalR:', e));
      };
    }
  }, [connection, botId]);

  // Efeito para buscar o nome do bot (usando API REST)
  useEffect(() => {
    const fetchBotName = async () => {
      const id = parseInt(botId || '0');
      if (isNaN(id) || id === 0) {
        setBotName('Bot Inválido');
        return;
      }
      try {
        const bot = await getBotByIdAsync(id);
        setBotName(bot.name);
      } catch (err) {
        console.error('Erro ao buscar nome do bot:', err);
        setBotName('Bot Desconhecido');
      }
    };
    fetchBotName();
  }, [botId]);

  // Efeito para rolar a conversa para o final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const botIdNum = parseInt(botId || '0');
    if (!newMessage.trim() || !connection || connection.state !== signalR.HubConnectionState.Connected || isNaN(botIdNum)) {
      alert("Não conectado ao chat, mensagem vazia ou ID do bot inválido.");
      return;
    }

    const userMessageText = newMessage;
    // Adiciona a mensagem do usuário imediatamente com um flag "isSending"
    setMessages((prevMessages) => [...prevMessages, {
        id: Date.now(), // ID temporário, será substituído pelo ID real do backend
        botId: botIdNum,
        userMessage: userMessageText,
        botResponse: "", // Vazio porque a resposta ainda não chegou
        timestamp: new Date().toISOString(),
        isUser: true,
        isSending: true // Indica que esta mensagem está aguardando resposta do bot
    }]);
    setNewMessage('');

    try {
      await connection.invoke("SendMessageToBot", botIdNum, userMessageText);
    } catch (err: any) {
      console.error("Erro ao enviar mensagem via SignalR:", err);
      alert(`Falha ao enviar mensagem: ${err.message}`);
      setMessages((prevMessages) => prevMessages.filter(msg => !(msg.isUser && msg.userMessage === userMessageText && msg.isSending)));
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl flex flex-col h-[calc(100vh-100px)] mt-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 pb-4 border-b border-gray-200">
        Conversa com {botName}
      </h2>
      <p className={`text-center text-sm mt-2 ${connectionStatus === 'Conectado' ? 'text-green-600' : 'text-red-600'}`}>
        Status: {connectionStatus}
      </p>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id || msg.timestamp} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-lg shadow-md relative ${msg.isUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm">{msg.isUser ? msg.userMessage : msg.botResponse}</p>
              {msg.isSending && <span className="absolute bottom-1 right-2 text-xs text-gray-500 italic">Enviando...</span>}
              <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex p-4 border-t border-gray-200">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={connectionStatus !== 'Conectado'}
          className="flex-grow mr-4 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={connectionStatus !== 'Conectado' || !newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-200"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default chatWindow;