import { IMessage } from '../../../shared/types.js';
import { randomUUID } from 'crypto';
import { getChatHistory, saveMessage } from '../redis.js';

const MAX_IN_MEMORY_HISTORY = 10;
const MAX_MESSAGE_LENGTH = 500;

let messageHistory: IMessage[] = [];

/**
 * Initialize the in-memory buffer from Redis.
 */
export async function initializeChatService() {
    messageHistory = await getChatHistory(MAX_IN_MEMORY_HISTORY);
    console.log(`ChatService initialized with ${messageHistory.length} messages in buffer`);
}

/**
 * Gets the current in-memory history.
 */
export function getInMemoryHistory(): IMessage[] {
    return [...messageHistory];
}

/**
 * Processes a new message: validates, saves to Redis, and updates the buffer.
 */
export async function processNewMessage(payload: any): Promise<IMessage | { error: string }> {
    const content = payload.content?.trim();
    const username = payload.user?.trim() || 'Anonymous';

    if (!content || content.length === 0) {
        return { error: 'EMPTY_MESSAGE' };
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
        return { error: 'MESSAGE_TOO_LONG' };
    }

    const newMessage: IMessage = {
        id: payload.id || randomUUID(),
        user: username,
        content: content,
        timestamp: payload.timestamp || Date.now()
    };

    // Update in-memory buffer
    messageHistory.push(newMessage);
    if (messageHistory.length > MAX_IN_MEMORY_HISTORY) {
        messageHistory.shift();
    }

    // Save to Redis (asynchronously)
    saveMessage(newMessage).catch(err => console.error('Failed to save message to Redis in ChatService:', err));

    return newMessage;
}
