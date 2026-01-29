import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { handleConnection } from '../controller/chatController.js';

let wss: WebSocketServer;

/**
 * Initializes the WebSocket server and attaches it to the provided HTTP server.
 */
export function initializeWebSocket(server: Server) {
    wss = new WebSocketServer({ server });

    console.log('WebSocket server initialized and attached to HTTP server');

    wss.on('connection', (ws) => {
        handleConnection(ws, wss);
    });

    return wss;
}

/**
 * Gets the current WebSocketServer instance.
 */
export function getWss() {
    return wss;
}
