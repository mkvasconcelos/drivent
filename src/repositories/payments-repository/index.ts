import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function create(
  ticketId: number,
  cardIssuer: string,
  number: number,
  value: number,
): Promise<CreatePaymentParams> {
  const cardLastDigits = number.toString().substring(number.toString().length - 4);
  const res = await prisma.payment.create({
    data: { ticketId, cardIssuer, cardLastDigits, value },
  });
  return res;
}

function findPaymentByTicketId(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({ where: { ticketId } });
}

export type CreatePaymentParams = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

const paymentRepository = {
  create,
  findPaymentByTicketId,
};

export default paymentRepository;
