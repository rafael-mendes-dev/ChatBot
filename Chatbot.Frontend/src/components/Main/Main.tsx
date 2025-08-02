import { CircleUserRound } from "lucide-react";

const Main = () => {
  return (
    <div className="flex-1 min-h-screen position-relative">
      <div className="flex items-center justify-between text-2xl text-gray-400 p-[20px]">
        <p>Chatbot</p>
        <CircleUserRound className="cursor-pointer hover:scale-115" />
      </div>
      <div className="max-w-4xl m-auto font-normal p-[20px]">
        <h1 className="text-6xl font-normal mb-4 bg-linear-16 bg-clip-text text-transparent from-blue-500 to-violet-600">Olá, bem vindo!</h1>
        <p className="text-6xl text-gray-400">Como posso te ajudar hoje?</p>
        <p className="text-2xl text-gray-500 mt-4">Selecione uma opção no menu lateral para começar.</p>
      </div>
    </div>
  );
};

export default Main;