import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketStatus, postPayment } from '@/controllers';
import { paymentsSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getTicketStatus)
  .post('/process', validateBody(paymentsSchema), postPayment);

export { paymentsRouter };
