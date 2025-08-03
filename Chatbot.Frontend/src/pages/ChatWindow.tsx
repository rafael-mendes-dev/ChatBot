import React, { useEffect, useState, useRef } from 'react';
import { CircleUserRound, CornerDownRight, BotMessageSquare } from "lucide-react";
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import { getBotByIdAsync } from '../services/api.ts';
import type { Message } from '../services/types.ts';
import { marked } from 'marked';
import LoadingSpinner from '../components/LoadingSpinner';

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
          // Remove a mensagem do usuário que falhou
          setMessages((prevMessages) => prevMessages.filter(msg => !(msg.isUser && msg.isSending && msg.userMessage === message.userMessage)));
        } else {
          setMessages((prevMessages) => {
            // Remove a mensagem temporária do usuário que estava com isSending = true
            const filteredMessages = prevMessages.filter(msg => !(msg.isSending && msg.userMessage === message.userMessage));
            
            // Adiciona a mensagem do usuário (sem isSending) e a resposta do bot
            return [
              ...filteredMessages,
              {
                ...message,
                isUser: true,
                isSending: false,
                botResponse: ""
              },
              {
                ...message,
                isUser: false,
                userMessage: ""
              }
            ];
          });
        }
      });

      connection.on("ReceiveHistory", (history: Message[]) => {
        console.log("Histórico recebido:", history);
        // Para cada mensagem, cria duas: uma do usuário e uma do bot
        let counter = Date.now();
        const formatted = history.flatMap(msg => [
          {
            ...msg,
            isUser: true,
            botResponse: "",
            id: counter++
          },
          {
            ...msg,
            isUser: false,
            userMessage: "",
            id: counter++
          }
        ]);
        setMessages(formatted);
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
    <div className="flex-1 bg-base-100 flex flex-col overflow-hidden h-screen">
      <div className="flex items-center justify-between text-2xl text-base-content/60 px-8 pt-8 pb-4 min-h-[64px]">
        <p className="font-bold text-base-content/60 truncate max-w-[80vw]">{botName}</p>
        <CircleUserRound className="cursor-pointer hover:scale-115" />
      </div>
      <div className="max-w-4xl m-auto w-full flex flex-col font-normal px-8 pb-8 pt-2 h-[calc(100vh-80px)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom scroll-smooth">
          {/* Renderiza mensagens individuais */}
          {messages.map((message) => {
            if (message.isUser) {
              return (
                <div key={message.id} className="w-full mb-6">
                  <div className="flex justify-end">
                    <div className="max-w-xl w-fit p-4 rounded-2xl shadow-md bg-neutral text-base-content font-medium relative">
                      <p className="text-base">{message.userMessage}</p>
                      <span className="absolute bottom-1 right-2 text-xs text-base-content/40">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  {/* Verifica se deve mostrar o loading spinner */}
                  {message.isSending && (
                    <div className="w-full flex flex-col items-stretch mt-2">
                      <hr className="border-base-content/20 mb-2" />
                      <div className="w-full flex items-start gap-2 relative">
                        <div className="min-w-[28px] flex flex-col items-center justify-start h-full">
                          <span className="mt-1 text-primary"><BotMessageSquare size={22} /></span>
                        </div>
                        <div className="flex-1 flex items-center">
                          <LoadingSpinner />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <div key={message.id} className="w-full mb-6">
                  <div className="w-full flex flex-col items-stretch">
                    <hr className="border-base-content/20 mb-2" />
                    <div className="w-full flex items-start gap-2 relative">
                      <div className="min-w-[28px] flex flex-col items-center justify-between h-full">
                        <span className="mt-1 text-primary"><BotMessageSquare size={22} /></span>
                        <span className="w-full text-left text-xs text-base-content/40 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-base text-base-content/80" style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: marked.parse(message.botResponse) }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex p-4 mt-4 rounded-xl bg-transparent">
          <div className="relative flex-grow">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={connectionStatus !== 'Conectado'}
              className="w-full pr-10 pl-4 py-2 bg-transparent text-base-content border border-base-content/20 rounded-full focus:outline-none focus:ring-2 focus:ring-primary placeholder-base-content/40"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
              <CornerDownRight size={22} />
            </span>
          </div>
          <button
            type="submit"
            disabled={connectionStatus !== 'Conectado' || !newMessage.trim()}
            className="ml-2 bg-gradient-to-r from-primary to-secondary hover:scale-105 text-primary-content font-bold py-2 px-3 rounded-full transition duration-200 text-sm"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default chatWindow;