import { Router } from 'express';

export const router = Router();

router.use('/test', async (req, res) => {
  res.send('test');
});
