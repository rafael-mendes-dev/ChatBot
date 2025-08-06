import React, { useEffect, useState, useRef } from 'react';
import { CircleUserRound, CornerDownRight, BotMessageSquare } from "lucide-react";
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import { getBotByIdAsync } from '../services/api.ts';
import type { Message } from '../services/types.ts';
import { marked } from 'marked';
import LoadingSpinner from '../components/LoadingSpinner';
import '../index.css'

interface ChatWindowProps {
  addAlert: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

function chatWindow({ addAlert }: ChatWindowProps) {
  const { botId } = useParams<{ botId: string }>();
  const [botName, setBotName] = useState<string>('Carregando...');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efeito para configurar a conexão SignalR
  useEffect(() => {
    const botIdNum = parseInt(botId || '0');
    if (isNaN(botIdNum) || botIdNum === 0) {
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5235/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [botId]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          setIsConnected(true);
          connection.invoke("GetBotHistory", parseInt(botId || '0'));
        })
        .catch(() => {
          setIsConnected(false);
        });

      connection.on("ReceiveMessage", (message: Message & { error?: string }) => {
        if (message.error) {
          addAlert(`Erro do bot: ${message.error}`, 'error');
          setMessages((prevMessages) => prevMessages.filter(msg => !(msg.isUser && msg.isSending && msg.userMessage === message.userMessage)));
        } else {
          setMessages((prevMessages) => {
            const filteredMessages = prevMessages.filter(msg => !(msg.isSending && msg.userMessage === message.userMessage));
            
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
        setIsConnected(false);
      });

      connection.onreconnected(() => {
        setIsConnected(true);
        connection.invoke("GetBotHistory", parseInt(botId || '0'));
      });

      return () => {
        connection.stop();
      };
    }
  }, [connection, botId]);

  // Efeito para buscar o nome do bot
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
      addAlert("Não conectado ao chat, mensagem vazia ou ID do bot inválido.", 'warning');
      return;
    }

    const userMessageText = newMessage;
    // Adiciona a mensagem do usuário imediatamente com um flag "isSending"
    setMessages((prevMessages) => [...prevMessages, {
      id: Date.now(),
      botId: botIdNum,
      userMessage: userMessageText,
      botResponse: "",
      timestamp: new Date().toISOString(),
      isUser: true,
      isSending: true
    }]);
    setNewMessage('');

    try {
      await connection.invoke("SendMessageToBot", botIdNum, userMessageText);
    } catch (err: any) {
      addAlert(`Falha ao enviar mensagem: ${err.message}`, 'error');
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
              disabled={!isConnected}
              className="w-full pr-10 pl-4 py-2 bg-transparent text-base-content border border-base-content/20 rounded-full focus:outline-none focus:ring-2 focus:ring-primary placeholder-base-content/40"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
              <CornerDownRight size={22} />
            </span>
          </div>
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
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