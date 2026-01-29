import { getPaginatedHistory } from '../redis.js';
import { IMessage } from '../../../shared/types.js';

export async function fetchPaginatedHistory(page: number, limit: number): Promise<IMessage[]> {
    return await getPaginatedHistory(page, limit);
}
