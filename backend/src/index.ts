import { WebSocketServer, WebSocket } from 'ws';
import { IMessage } from '../../shared/types.js';
import { randomUUID } from 'crypto';

const PORT = 8081;
const wss = new WebSocketServer({ port: PORT });

const messageHistory: IMessage[] = [];
const MAX_HISTORY = 10;
const MAX_MESSAGE_LENGTH = 500;

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    const hydrationData = JSON.stringify({
        type: 'history',
        messages: messageHistory
    });
    ws.send(hydrationData);

    ws.on('message', (data: string) => {
        try {
            const parsed = JSON.parse(data.toString());
            
            const content = parsed.content?.trim();
            const username = parsed.user?.trim() || 'Anonymous';

            if (content && content.length > 0) {
                if (content.length > MAX_MESSAGE_LENGTH) {
                    const errorData = JSON.stringify({
                        type: 'error',
                        error: {
                            code: 'MESSAGE_TOO_LONG',
                            message: `Message is too long. Maximum length is ${MAX_MESSAGE_LENGTH} characters.`
                        }
                    });
                    ws.send(errorData);
                    console.warn(`Received message exceeding length limit from ${username}`);
                    return;
                }

                const newMessage: IMessage = {
                    id: parsed.id || randomUUID(),
                    user: username,
                    content: content,
                    timestamp: parsed.timestamp || Date.now()
                };

                messageHistory.push(newMessage);

                if (messageHistory.length > MAX_HISTORY) {
                    messageHistory.shift();
                }

                const broadcastData = JSON.stringify({
                    type: 'message',
                    message: newMessage
                });

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(broadcastData);
                    }
                });
                
                console.log(`Broadcasted message from ${username}: "${content}"`);
            } else {
                const errorData = JSON.stringify({
                    type: 'error',
                    error: {
                        code: 'EMPTY_MESSAGE',
                        message: 'Message content cannot be empty.'
                    }
                });
                ws.send(errorData);
                console.warn('Received empty or invalid message content');
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});
