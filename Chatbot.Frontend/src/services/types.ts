export interface Bot{
    id: number;
    name: string;
    context: string;
}

export interface Message {
    id: number;
    botId: number;
    userMessage: string;
    botResponse: string;
    timestamp: string;
    isUser?: boolean; // Indicativo para facilitar o frontend
    isSending?: boolean;
}

export interface MessageRequest {
    userMessage: string;
}