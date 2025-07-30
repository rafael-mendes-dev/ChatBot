import axios from 'axios';
import type {Bot, Message, MessageRequest} from './types'; // Importa as interfaces

const API_BASE_URL = 'http://localhost:5235/api'; // Altere para o URL do seu backend

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const createBotAsync = async (name: string, context: string): Promise<Bot> => {
    const response = await api.post<Bot>('/bots', { name, context });
    return response.data;
};

export const getBotsAsync = async (): Promise<Bot[]> => {
    const response = await api.get<Bot[]>('/bots');
    return response.data;
};

export const getBotByIdAsync = async (id: number): Promise<Bot> => {
    const response = await api.get<Bot>(`/bots/${id}`);
    return response.data;
};

export const getBotMessagesAsync = async (botId: number): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/bots/messages/${botId}`);
    return response.data;
};

export const sendMessageRestAsync = async (botId: number, userMessage: string): Promise<Message> => {
    const request: MessageRequest = { userMessage };
    const response = await api.post<Message>(`/bots/messages/${botId}`, request);
    return response.data;
};

export default api;