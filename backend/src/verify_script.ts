import { WebSocket } from 'ws';
import { IMessage } from '../../shared/types.js';

const WS_URL = 'ws://localhost:8081';

async function runTest() {
    console.log('--- Starting Backend Verification (Shared Types) ---');

    console.log('Connecting Client 1...');
    const client1 = new WebSocket(WS_URL);

    await new Promise((resolve) => client1.once('open', resolve));
    console.log('Client 1 connected.');

    client1.on('message', (data) => {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'history') {
            const messages = parsed.messages as IMessage[];
            console.log('Client 1 received history (hydration):', messages.map(m => `${m.user}: ${m.content}`));
        } else if (parsed.type === 'message') {
            const message = parsed.message as IMessage;
            console.log('Client 1 received broadcast message:', `${message.user}: ${message.content} (id: ${message.id})`);
        }
    });

    console.log('Client 1 sending message...');
    client1.send(JSON.stringify({ user: 'User1', content: "Hello from C1" }));

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('Connecting Client 2...');
    const client2 = new WebSocket(WS_URL);

    client2.on('message', (data) => {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'history') {
            const messages = parsed.messages as IMessage[];
            console.log('Client 2 received history (hydration):', messages.map(m => `${m.user}: ${m.content}`));
        } else if (parsed.type === 'message') {
            const message = parsed.message as IMessage;
            console.log('Client 2 received broadcast message:', `${message.user}: ${message.content} (id: ${message.id})`);
        }
    });

    await new Promise((resolve) => client2.once('open', resolve));
    console.log('Client 2 connected.');

    console.log('Client 2 sending message...');
    client2.send(JSON.stringify({ user: 'User2', content: "Hello from C2" }));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    client1.close();
    client2.close();
    console.log('--- Verification Finished ---');
    process.exit(0);
}

runTest().catch(console.error);
