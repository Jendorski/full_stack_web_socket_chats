import { createServer } from 'http';

import express from 'express';
import cors from 'cors';
import { historyRouter } from './routes/historyRoutes.js';
import { initializeChatService } from './services/chatService.js';
import { initializeWebSocket } from './routes/chatSocket.js';

const PORT = 8081;

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/history', historyRouter);

// Initialize services and servers
initializeChatService().catch(err => console.error('Failed to initialize ChatService:', err));

const server = createServer(app);
initializeWebSocket(server);

console.log(`Server is running on http://localhost:${PORT}`);
console.log(`WebSocket server is attached and initialized via structured handlers`);

server.listen(PORT);
