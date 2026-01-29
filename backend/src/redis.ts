import { Redis } from 'ioredis';
import { IMessage } from '../../shared/types.js';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const MAX_HISTORY = 1000;
const HISTORY_KEY = 'chat:history';

const redis = new Redis(REDIS_URL);

redis.on('error', (err: Error) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Connected to Redis'));

/**
 * Fetches the latest chat history from Redis.
 * Used for high-level operations or small sets.
 */
export async function getChatHistory(limit: number = 10): Promise<IMessage[]> {
    try {
        const history = await redis.lrange(HISTORY_KEY, -limit, -1);
        return history.map((msg: string) => JSON.parse(msg));
    } catch (error) {
        console.error('Error fetching history from Redis:', error);
        return [];
    }
}

/**
 * Fetches a paginated slice of chat history from Redis.
 * page 1 is the most recent messages.
 */
export async function getPaginatedHistory(page: number, limit: number): Promise<IMessage[]> {
    try {
        const start = -(page * limit);
        const end = -((page - 1) * limit) - 1;
        
        // Handle case where (page-1)*limit is 0
        const finalEnd = end >= 0 ? -1 : end;

        const history = await redis.lrange(HISTORY_KEY, start, finalEnd);
        return history.map((msg: string) => JSON.parse(msg));
    } catch (error) {
        console.error('Error fetching paginated history from Redis:', error);
        return [];
    }
}

/**
 * Saves a new message to Redis and trims the history to the maximum size.
 */
export async function saveMessage(message: IMessage): Promise<void> {
    try {
        await redis.rpush(HISTORY_KEY, JSON.stringify(message));
        await redis.ltrim(HISTORY_KEY, -MAX_HISTORY, -1);
    } catch (error) {
        console.error('Error saving message to Redis:', error);
    }
}

export default redis;
