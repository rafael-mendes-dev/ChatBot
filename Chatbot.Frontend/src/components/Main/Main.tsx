import { CircleUserRound } from "lucide-react";

const Main = () => {
  return (
    <div className="flex-1 min-h-screen bg-base-100">
      <div className="flex items-center justify-between text-2xl text-base-content/60 p-[20px]">
        <p>Chatbot</p>
        <CircleUserRound className="cursor-pointer hover:scale-115" />
      </div>
      <div className="max-w-4xl m-auto font-normal p-[20px]">
        <h1 className="text-6xl font-normal mb-4 bg-linear-16 bg-clip-text text-transparent from-blue-500 to-violet-600">Olá, bem vindo!</h1>
        <p className="text-6xl text-base-content/60">Como posso te ajudar hoje?</p>
        <p className="text-2xl text-base-content/40 mt-4">Selecione uma opção no menu lateral para começar.</p>
      </div>
    </div>
  );
};

export default Main;