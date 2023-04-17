import { conflictError, notFoundError, requestError } from '@/errors';
import paymentRepository from '@/repositories/payments-repository';
import ticketRepository from '@/repositories/tickets-repository';

async function getTicketStatus(ticketId: number, userId: number) {
  if (!ticketId) {
    throw requestError(400, 'ticketId not valid');
  }
  const res = await paymentRepository.findPaymentByTicketId(ticketId);
  if (!res) {
    throw notFoundError();
  } else {
    await ticketRepository.findTicketTypePrice(ticketId, userId);
  }
  return res;
}

async function postPayment(userId: number, ticketId: number, cardIssuer: string, number: number) {
  const payment = await paymentRepository.findPaymentByTicketId(ticketId);
  if (payment) {
    throw conflictError('already paid');
  }
  const ticket = await ticketRepository.findTicketById(ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  const value = await ticketRepository.findTicketTypePrice(ticketId, userId);
  const res = await paymentRepository.create(ticketId, cardIssuer, number, value);
  await ticketRepository.update(ticketId);
  return res;
}

const paymentsService = {
  postPayment,
  getTicketStatus,
};

export default paymentsService;
