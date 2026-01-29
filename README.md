# Start Chat WebApp

Start Chat WebApp is a real-time, containerized chat application demonstrating live state synchronization using WebSockets and React.

When a user connects to the chat, only the last 10 messages are shown. However, for already connected users, the older messages will still be shown in the ChatUI, given the connection is already established.

## Project Structure

- **[backend](procimo_state_chat_websockets/backend)**: Express server with integrated WebSocket support.
- **[frontend](procimo_state_chat_websockets/frontend)**: React application (Vite) with real-time state synchronization.
- **[shared](procimo_state_chat_websockets/shared)**: Shared TypeScript types for consistent data structure.

## Key Features

- **Real-time Communication**: Low-latency chat using WebSockets (`ws`).
- **Persistent Storage**: Full message history stored in **Redis** (up to 1000 messages).
- **Instant Hydration**: New connections immediately receive the last 10 messages from an in-memory buffer.
- **Paginated History API**: REST endpoint `GET /history?page=1&limit=10` for retrieving older messages.
- **Modular Architecture**: Structured backend using the Service/Controller/Router pattern for scalability.
- **Containerized**: Fully orchestrated using Docker Compose.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm
- Docker & Docker Compose (optional, for containerized setup)

### How to setup

Get started like so:
```bash
git clone https://github.com/Jendorski/full_stack_web_socket_chats.git
```
Run the entire stack (backend and frontend) using Docker (Ensure Docker is running on your system):

```bash
docker compose up
```

To shut down the entire stack on Docker, open another terminal, as the above command will occupy the current terminal:
```bash
docker compose down
```

Or

```bash
cd backend && npm run down
```

The frontend will be available at `http://localhost:80` and the backend at `ws://localhost:8081`.

### Manual Setup
The manual setup is also available, however, Docker is recommend.

#### 1. Shared Types
Ensure types are available (though usually handled by local imports):
```bash
cd shared
# No install needed, just referenced by paths
```

#### 2. Backend
```bash
cd backend
npm install
npm run dev
```

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Design Decisions

### Modular Architecture
The backend is organized into a **Service/Controller/Router** pattern to ensure a clean separation of concerns:
- **Services**: Contain business logic (e.g., managing the message buffer in `chatService.ts` or Redis operations in `redis.ts`).
- **Controllers**: Handle request/response logic and WebSocket event orchestration.
- **Routes/Handlers**: Define API endpoints using Express Router and initialize WebSocket server lifecycle.

### Multi-Layered History Management
To balance performance and data persistence, the app uses a dual-layer approach:
1. **In-Memory Buffer**: Stores the most recent 10 messages for near-instant hydration of new WebSocket clients.
2. **Redis Persistence**: All messages are pushed to a Redis List using `RPUSH`. This provides persistent storage that survives server restarts and allows for large-scale history retrieval.

### API Integration
By transitioning to **Express**, the application now supports standard HTTP features like CORS and JSON parsing, enabling the implementation of a RESTful API alongside the real-time WebSocket communication on a unified port.
