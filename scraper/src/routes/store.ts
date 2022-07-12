import { Router } from 'express';

export const router = Router();

router.use('/test', async (req, res) => {
  console.log(req);
  res.send('test');
});
