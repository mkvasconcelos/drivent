import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    return res.status(httpStatus.OK).send([]);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const tickets = await ticketsService.getTickets(userId);
    return res.status(httpStatus.OK).send(tickets[0]);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send([error.message]);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;
  try {
    const ticket = await ticketsService.postTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if (error.name === 'InvalidDataError') {
      return res.status(httpStatus.BAD_REQUEST).send(error.details);
    } else if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send(['user not found']);
    } else if (error.name === 'ConflictError') {
      return res.status(httpStatus.CONFLICT).send(error.message);
    } else {
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
