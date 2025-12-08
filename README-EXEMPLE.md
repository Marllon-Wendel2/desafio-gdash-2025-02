# 🌤️ G-Dash - Dashboard Meteorológico com IA

[![Docker](https://img.shields.io/badge/Docker-✓-blue)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-✓-3178C6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-✓-61DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-✓-E0234E)](https://nestjs.com/)

Uma aplicação full-stack para monitoramento meteorológico em tempo real com insights de inteligência artificial.

## ídeo de Demonstração
[Assista ao vídeo explicativo da arquitetura e demonstração](https://youtube.com/SEU_LINK_AQUI)

## Arquitetura

```mermaid
graph TB
    A[Coletor Python] -->|Publica dados| B[Redis Queue]
    B -->|Consome mensagens| C[Worker Go]
    C -->|Persiste dados| D[MongoDB]
    D -->|Consulta/WebSocket| E[Backend NestJS]
    E -->|API REST| F[Frontend React]
    F -->|Visualização| G[Dashboard]
    
    H[APIs Meteorológicas] --> A
    E -->|WebSocket| F


    ✨ Funcionalidades
    📊 Dashboard em tempo real com métricas meteorológicas

    🤖 Insights de IA para previsões e análises

    🔄 Pipeline assíncrono de processamento de dados

    📱 Interface responsiva e moderna

    🐳 Containerizada com Docker Compose

    🔍 Monitoramento com Mongo Express e Redis Commander

    # 1. Clone o repositório
    git clone https://github.com/seu-usuario/g-dash.git
    cd g-dash

    # 2. Configure as variáveis de ambiente
    cp .env.example .env
    # Edite o .env conforme necessário (veja a seção abaixo)

    # 3. Inicie TODOS os containers em background (-d para detached mode)
    docker-compose up -d --build

    # 4. Verifique se todos os serviços estão rodando
    docker-compose ps

    # 5. Acesse a aplicação:
    # Frontend:      http://localhost:5173
    # Backend API:   http://localhost:8001/docs
    # MongoDB UI:    http://localhost:8082  (usuário: admin, senha: admin)
    # Redis UI:      http://localhost:8081

