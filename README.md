# Start Chat WebApp

Start Chat WebApp is a real-time, containerized chat application demonstrating live state synchronization using WebSockets and React.

When a user connects to the chat, only the last 10 messages are shown. However, for already connected users, the older messages will still be shown in the ChatUI, given the connection is already established.

## Project Structure

- **[backend](procimo_state_chat_websockets/backend)**: Node.js WebSocket server using the `ws` library.
- **[frontend](procimo_state_chat_websockets/frontend)**: React application (Vite) with a custom `useChatSocket` hook.
- **[shared](procimo_state_chat_websockets/shared)**: Shared TypeScript types for consistent data structure.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm
- Docker & Docker Compose (optional, for containerized setup)

### Docker Setup (Recommended)

To run the entire stack (backend and frontend) using Docker:

```bash
docker compose up
```

To shut down the entire stack on Docker:
```bash
docker compose down
```

Or

```bash
cd backend && npm run down
```

The frontend will be available at `http://localhost:80` and the backend at `ws://localhost:8081`.

### Manual Setup

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

### Choice of WebSocket Library
For the backend, I chose the **`ws`** library. It is a lightweight, high-performance WebSocket implementation for Node.js. Unlike higher-level abstractions like Socket.IO, `ws` is simple, follows the standard WebSocket API closely, and has minimal overhead. This makes it perfect for a project where I want to demonstrate low-level state synchronization without the weight of additional features like polling or complex room management.

### State Synchronization
State synchronization for the "last 10 messages" is handled server-side using an in-memory array (`messageHistory`). 
- **Hydration**: When a new client connects, the server immediately sends the current `messageHistory` array to "hydrate" the client's local state.
- **Broadcast & Limitation**: As new messages arrive, the server pushes them to the array. If the array exceeds 10 messages, the oldest message is removed using `shift()`. After updating the history, the server broadcasts the new message to all connected clients, ensuring everyone sees the update in real-time while maintaining a consistent "window" of the most recent conversation.
