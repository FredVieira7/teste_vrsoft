# Sistema de Notificações Assíncronas — Guia de Execução

Este README descreve, de forma objetiva, como rodar o **backend (Node.js + TypeScript + RabbitMQ)** e o **frontend (Angular)** do teste.

## Requisitos
- Node.js 20 LTS (recomendado via nvm)
- npm (vem com o Node)
- Angular CLI (para o frontend): `npm i -g @angular/cli`
- Acesso ao RabbitMQ (CloudAMQP fornecido no teste)

---

## Backend (TypeScript + Express + amqplib)

### 1) Configurar variáveis de ambiente
Crie o arquivo `.env` na pasta `backend` com o conteudo do .env.example


### 2) Instalar dependências
No diretório `backend`:
```bash
npm install
```

### 3) Rodar em desenvolvimento
```bash
npm run dev
```
O servidor subirá em `http://localhost:3001` e iniciará o consumer da fila.

### 4) Endpoints
- `POST /api/notify`  
  Body JSON:  
  ```json
  { "messageId": "opcional", "messageContent": "sua mensagem" }
  ```  
  Resposta (202):  
  ```json
  { "messageId": "..." }
  ```

- `GET /api/notification/status/:id`  
  Resposta (200 ou 404):  
  ```json
  { "messageId": "...", "status": "PROCESSING_PENDING|PROCESSED_SUCCESS|PROCESSING_FAILED|null" }
  ```

### 5) Testes
```bash
npm test
```

---

## Frontend (Angular)

### 1) Instalar dependências
No diretório do projeto Angular (`frontend`):
```bash
npm install
```

### 3) Rodar o frontend
```bash
ng serve --open
```
A aplicação abre em `http://localhost:4200`.

---

## Scripts úteis
Backend:
```bash
npm run dev    # desenvolvimento (ts-node-dev)
npm run build  # compila para dist/
npm start      # roda dist/server.js
npm test       # testes unitários (Jest)
```

Frontend:
```bash
ng serve       # desenvolvimento
```