import { WebSocket, WebSocketServer } from 'ws';
import { getInMemoryHistory, processNewMessage } from '../services/chatService.js';

export function handleConnection(ws: WebSocket, wss: WebSocketServer) {
    console.log('New client connected via WebSocket controller');

    // 1. Send hydration data from buffer
    const history = getInMemoryHistory();
    const hydrationData = JSON.stringify({
        type: 'history',
        messages: history
    });
    ws.send(hydrationData);

    // 2. Handle incoming messages
    ws.on('message', async (data: string) => {
        try {
            const payload = JSON.parse(data.toString());
            const result = await processNewMessage(payload);

            if ('error' in result) {
                const errorData = JSON.stringify({
                    type: 'error',
                    error: {
                        code: result.error,
                        message: result.error === 'MESSAGE_TOO_LONG' 
                            ? 'Message is too long. Maximum length is 500 characters.'
                            : 'Message content cannot be empty.'
                    }
                });
                ws.send(errorData);
                console.warn(`WebSocket error: ${result.error}`);
                return;
            }

            // Broadcast message to all clients
            const broadcastData = JSON.stringify({
                type: 'message',
                message: result
            });

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(broadcastData);
                }
            });

            console.log(`Broadcasted message from ${result.user}`);
        } catch (error) {
            console.error('Error in WebSocket message handler:', error);
        }
    });

    // 3. Handle close
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // 4. Handle error
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
}
