import { Router } from 'express';
import { handleGetHistory } from '../controller/historyController.js';

const router = Router();

// This will be mounted at /history in index.ts
router.get('/', handleGetHistory);

export { router as historyRouter };
