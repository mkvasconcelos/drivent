import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { conflictError, invalidDataError } from '@/errors';

async function findTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function findTickets(enrollmentId: number): Promise<Ticket[]> {
  const res = await prisma.ticket.findMany({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
  return res;
}

function findTicketByEnrollment(enrollmentId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({ where: { enrollmentId } });
}

async function create(enrollmentId: number, ticketTypeId: number): Promise<Ticket> {
  const res = await findTicketByEnrollment(enrollmentId);
  if (res) {
    throw conflictError('user already has a ticket');
  }
  try {
    return await prisma.ticket.create({
      data: {
        status: 'RESERVED',
        enrollmentId,
        ticketTypeId,
      },
      include: { TicketType: true },
    });
  } catch {
    throw invalidDataError(['invalid ticketTypeId']);
  }
}

async function update(ticketId: number): Promise<Ticket> {
  const res = await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: 'PAID' },
  });
  return res;
}

async function findTicketTypePrice(ticketId: number, userId: number): Promise<number> {
  try {
    const res = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        Enrollment: { userId },
      },
      include: {
        TicketType: true,
      },
    });
    return res.TicketType.price;
  } catch {
    throw invalidDataError(['user not have ticket']);
  }
}

async function findTicketById(ticketId: number): Promise<Ticket> {
  const res = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });
  return res;
}

export type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateTicketBody = Omit<Ticket, 'id' | 'enrollmentId' | 'status' | 'createdAt' | 'updatedAt'>;

const ticketRepository = {
  findTypes,
  findTickets,
  create,
  update,
  findTicketTypePrice,
  findTicketById,
};

export default ticketRepository;
