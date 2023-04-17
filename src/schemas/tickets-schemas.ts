import Joi from 'joi';
import { CreateTicketBody } from '@/repositories/tickets-repository';

export const ticketsSchema = Joi.object<CreateTicketBody>({
  ticketTypeId: Joi.number().required(),
});
