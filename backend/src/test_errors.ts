import { WebSocket } from 'ws';

const WS_URL = 'ws://localhost:8081';

async function runErrorTest() {
    console.log('--- Starting Error Handling Verification ---');

    const client = new WebSocket(WS_URL);

    await new Promise((resolve) => client.once('open', resolve));
    console.log('Client connected.');

    let receivedError: any = null;

    client.on('message', (data) => {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'error') {
            console.log('Received expected error:', parsed.error);
            receivedError = parsed.error;
        }
    });

    // Test 1: Empty message
    console.log('\nTest 1: Sending empty message...');
    client.send(JSON.stringify({ user: 'Tester', content: '' }));
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (receivedError?.code === 'EMPTY_MESSAGE') {
        console.log('✅ Test 1 Passed: Correct error code received.');
    } else {
        console.log('❌ Test 1 Failed: Expected EMPTY_MESSAGE, got', receivedError?.code);
    }
    receivedError = null;

    // Test 2: Message too long
    console.log('\nTest 2: Sending message > 500 characters...');
    const longMessage = 'a'.repeat(501);
    client.send(JSON.stringify({ user: 'Tester', content: longMessage }));
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (receivedError?.code === 'MESSAGE_TOO_LONG') {
        console.log('✅ Test 2 Passed: Correct error code received.');
    } else {
        console.log('❌ Test 2 Failed: Expected MESSAGE_TOO_LONG, got', receivedError?.code);
    }
    receivedError = null;

    // Test 3: Valid message
    console.log('\nTest 3: Sending valid message...');
    let receivedMessage = false;
    client.on('message', (data) => {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'message' && parsed.message.content === 'Valid Message') {
            receivedMessage = true;
        }
    });
    client.send(JSON.stringify({ user: 'Tester', content: 'Valid Message' }));
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (receivedMessage) {
        console.log('✅ Test 3 Passed: Valid message broadcasted.');
    } else {
        console.log('❌ Test 3 Failed: Valid message not received.');
    }

    client.close();
    console.log('\n--- Error Handling Verification Finished ---');
    process.exit(0);
}

runErrorTest().catch(console.error);
