import { Enrollment } from '@prisma/client';
import { prisma } from '@/config';

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

async function findEnrollmentByUserId(userId: number): Promise<GetEnrollmentParams> {
  const enrollmentId = prisma.enrollment.findFirst({ where: { userId } });
  return enrollmentId;
}

export type CreateEnrollmentParams = Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, 'userId'>;
export type GetEnrollmentParams = Omit<
  Enrollment,
  'name' | 'cpf' | 'birthday' | 'userId' | 'phone' | 'createdAt' | 'updatedAt'
>;

const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  findEnrollmentByUserId,
};

export default enrollmentRepository;
