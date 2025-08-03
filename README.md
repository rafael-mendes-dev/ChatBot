# 🤖 ChatBot

Um sistema de chatbot moderno e completo desenvolvido com ASP.NET Core e React, integrado com a API do Google Gemini para processamento de linguagem natural.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Testes](#testes)

## 🎯 Sobre o Projeto

O ChatBot é uma aplicação full-stack que permite a criação e gerenciamento de múltiplos bots de conversação. Cada bot pode ter seu próprio contexto e personalidade, utilizando a inteligência artificial do Google Gemini para gerar respostas naturais e contextuais.

### ✨ Principais Características

- **Múltiplos Bots**: Crie e gerencie diferentes bots com contextos únicos
- **IA Avançada**: Integração com Google Gemini para respostas inteligentes
- **Tempo Real**: Comunicação em tempo real usando SignalR
- **Interface Moderna**: Frontend React com Tailwind CSS e DaisyUI
- **Persistência**: Histórico de conversas armazenado em SQL Server
- **Testes Unitários**: Cobertura completa com MSTest

## 🛠️ Tecnologias Utilizadas

### Backend (.NET)
- **ASP.NET Core 9.0** - Framework web principal
- **Entity Framework Core** - ORM para acesso ao banco de dados
- **SQL Server** - Banco de dados relacional
- **SignalR** - Comunicação em tempo real
- **Google Generative AI** - Integração com Gemini
- **Swagger** - Documentação da API
- **MSTest** - Framework de testes

### Frontend (React)
- **React 19** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **DaisyUI** - Componentes UI
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **SignalR Client** - Cliente para comunicação em tempo real
- **Lucide React** - Ícones

### DevOps
- **Docker Compose** - Containerização do SQL Server

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  ASP.NET Core   │    │   SQL Server    │
│   (Frontend)    │◄──►│    API          │◄──►│   Database      │
│                 │    │   (Backend)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Google Gemini  │
                       │      API        │
                       └─────────────────┘
```

### Padrões Utilizados
- **Repository Pattern** - Para acesso aos dados
- **Dependency Injection** - Para inversão de controle
- **RESTful API** - Para comunicação HTTP
- **Component-Based** - Arquitetura de componentes React

## 🚀 Funcionalidades

### 🤖 Gerenciamento de Bots
- ✅ Criar novos bots com nome e contexto personalizados
- ✅ Listar todos os bots disponíveis
- ✅ Editar informações dos bots
- ✅ Excluir bots não utilizados

### 💬 Sistema de Chat
- ✅ Conversas em tempo real com os bots
- ✅ Histórico persistente de mensagens
- ✅ Interface intuitiva e responsiva
- ✅ Suporte a markdown nas respostas
- ✅ Indicadores de carregamento

### 🎨 Interface do Usuário
- ✅ Tema claro/escuro
- ✅ Design responsivo
- ✅ Alertas e notificações
- ✅ Modais para ações importantes
- ✅ Navegação entre diferentes seções

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **.NET 9.0 SDK** ou superior
- **Node.js 18** ou superior
- **Docker Desktop** (para SQL Server)
- **Git**
- **Chave de API do Google Gemini**

## ⚙️ Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/rafael-mendes-dev/ChatBot.git
cd ChatBot
```

### 2. Configure o Banco de Dados

#### Usando Docker (Recomendado)

```bash
# Inicie o container do SQL Server
cd Chatbot.Api
docker-compose up -d
```

#### Configuração Manual
Se preferir usar uma instância local do SQL Server, atualize a connection string em `appsettings.json`.

### 3. Configure a API do Google Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Gere uma chave de API
3. Atualize o arquivo `Chatbot.Api/appsettings.json`:

```json
{
  "GeminiSettings": {
    "ApiKey": "SUA_CHAVE_DA_API_AQUI"
  }
}
```

### 4. Execute as Migrações do Banco

```bash
cd Chatbot.Api
dotnet ef database update
```

### 5. Instale as Dependências do Frontend

```bash
cd ../Chatbot.Frontend
npm install
```

### 6. Execute a Aplicação

#### Backend (Terminal 1)
```bash
cd Chatbot.Api
dotnet run
```

#### Frontend (Terminal 2)
```bash
cd Chatbot.Frontend
npm run dev
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:5173
- **Backend API**: https://localhost:5235
- **Swagger**: https://localhost:5235/swagger/index.html

> **⚠️ Nota sobre Portas**: As portas podem variar dependendo da configuração do seu ambiente. Verifique o terminal onde os serviços estão rodando para confirmar as portas corretas. Se necessário, ajuste as configurações de CORS no backend (`Program.cs`) e as URLs base no frontend (`services/`) para corresponder às portas utilizadas.

## 🎮 Como Usar

### 1. Criar um Novo Bot

1. Acesse a aplicação no navegador
2. Clique em "Criar Novo Bot"
3. Preencha o nome e contexto do bot
4. Clique em "Salvar"

### 2. Iniciar uma Conversa

1. Selecione um bot na lista
2. Digite sua mensagem no campo de texto
3. Pressione Enter ou clique no botão de enviar
4. Aguarde a resposta do bot

### 3. Gerenciar Bots

- **Editar**: Clique no ícone de edição para modificar o bot
- **Excluir**: Clique no ícone de lixeira para remover o bot
- **Visualizar Histórico**: Acesse as conversas anteriores

## 📁 Estrutura do Projeto

```
ChatBot/
├── 📁 Chatbot.Api/                 # Backend ASP.NET Core
│   ├── 📁 Controllers/             # Controladores da API
│   ├── 📁 Data/                    # Contexto do banco de dados
│   ├── 📁 Dto/                     # Data Transfer Objects
│   ├── 📁 Hubs/                    # Hubs do SignalR
│   ├── 📁 Migrations/              # Migrações do EF Core
│   ├── 📁 Models/                  # Modelos de domínio
│   ├── 📁 Services/                # Serviços de negócio
│   └── 📁 Util/                    # Interfaces e utilitários
├── 📁 Chatbot.Frontend/            # Frontend React
│   ├── 📁 src/
│   │   ├── 📁 components/          # Componentes React
│   │   ├── 📁 pages/               # Páginas da aplicação
│   │   ├── 📁 services/            # Serviços e APIs
│   │   └── 📁 assets/              # Assets estáticos
│   └── 📁 public/                  # Arquivos públicos
├── 📁 Chatbot.Tests/               # Testes unitários
│   ├── 📁 BotsControllerTests/     # Testes do controlador de bots
│   └── 📁 MessagesControllerTests/ # Testes do controlador de mensagens
└── 📄 ChatBot.sln                  # Solution do .NET
```

## 🛠️ API Endpoints

### Bots
```http
GET    /api/bots              # Listar todos os bots
POST   /api/bots              # Criar novo bot
PUT    /api/bots/{id}         # Atualizar bot
DELETE /api/bots/{id}         # Excluir bot
```

### Mensagens
```http
GET    /api/messages/{botId}           # Obter histórico de mensagens
POST   /api/messages/{botId}      # Enviar mensagem para o bot
```

### SignalR Hub
```
/chatHub                      # Hub para comunicação em tempo real
```

## 🧪 Testes

### Executar Todos os Testes

```bash
cd Chatbot.Tests
dotnet test
```

### Estrutura dos Testes

- **BotsControllerTests**: Testes do CRUD de bots
- **MessagesControllerTests**: Testes do sistema de mensagens
- **MSTestSettings**: Configurações globais dos testes

## 🐛 Problemas Conhecidos

- [ ] Limite de caracteres nas mensagens pode ser restritivo
- [ ] Necessita configuração manual da API do Gemini
- [ ] Sem suporte a anexos de arquivos