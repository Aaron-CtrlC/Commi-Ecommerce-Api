import { Router } from 'express';

const router = Router();

// Webhook route is mounted directly in app.ts before express.json()
// Add future payment routes here (they'll use JSON parser from app)

export default router;
