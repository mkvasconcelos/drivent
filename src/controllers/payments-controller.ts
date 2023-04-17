import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getTicketStatus(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query as Record<string, string>;
  const { userId } = req;
  try {
    const ticket = await paymentsService.getTicketStatus(Number(ticketId), userId);
    return res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    if (error.name === 'RequestError') {
      return res.status(httpStatus.BAD_REQUEST).send(error.statusText);
    } else if (error.name === 'NotFoundError') {
      return res.status(httpStatus.UNAUTHORIZED).send(['ticket not found']);
    } else if (error.name === 'InvalidDataError') {
      return res.status(httpStatus.NOT_FOUND).send(error.details);
    }
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const body = req.body;
  if (!body.ticketId || !body.cardData) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  const ticketId: number = body.ticketId;
  const cardIssuer: string = body.cardData.issuer;
  const number: number = body.cardData.number;
  try {
    const payment = await paymentsService.postPayment(userId, ticketId, cardIssuer, number);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'InvalidDataError') {
      return res.status(httpStatus.UNAUTHORIZED).send(error.details);
    } else if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(['ticket not found']);
    } else if (error.name === 'ConflictError') {
      return res.status(httpStatus.CONFLICT).send(error.message);
    }
  }
}
