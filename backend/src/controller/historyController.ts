import { Request, Response } from 'express';
import { fetchPaginatedHistory } from '../services/historyService.js';

export async function handleGetHistory(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    try {
        const history = await fetchPaginatedHistory(page, limit);
        res.json({
            page,
            limit,
            messages: history
        });
    } catch (error) {
        console.error('Controller error in handleGetHistory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
