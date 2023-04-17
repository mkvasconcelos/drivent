import { conflictError, notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/tickets-repository';

function getTicketTypes() {
  const res = ticketRepository.findTypes();
  return res;
}

async function getTickets(userId: number) {
  const resEnrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!resEnrollment) {
    throw conflictError('enrollment not found');
  }
  const enrollmentId = resEnrollment.id;
  const res = await ticketRepository.findTickets(enrollmentId);
  if (res.length === 0) {
    throw conflictError('ticket not found');
  }
  return res;
}

async function postTicket(userId: number, ticketTypeId: number) {
  try {
    const resEnrollment = await enrollmentRepository.findEnrollmentByUserId(userId);
    const enrollmentId = resEnrollment.id;
    const res = ticketRepository.create(enrollmentId, ticketTypeId);
    return res;
  } catch {
    throw notFoundError();
  }
}

const ticketsService = { getTicketTypes, getTickets, postTicket };

export default ticketsService;
