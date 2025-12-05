import { prisma } from '../../lib/prisma.js';

export const deleteExpiredForms = async () => {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const squareDeletionDate = new Date(now);
    squareDeletionDate.setDate(squareDeletionDate.getDate() - 1);
    await tx.form.updateMany({
      where: {
        payment_method: 'square',
        payment_status: 'pending',
        created_at: { lte: squareDeletionDate },
      },
      data: { is_deleted: true },
    });

    const cashBankDeletionDate = new Date(now);
    cashBankDeletionDate.setDate(cashBankDeletionDate.getDate() - 7);
    await tx.form.updateMany({
      where: {
        payment_method: { in: ['cash', 'bank_transfer'] },
        payment_status: 'pending',
        created_at: { lte: cashBankDeletionDate },
      },
      data: { is_deleted: true },
    });

    await tx.ticket.updateMany({
      where: {
        form: {
          is_deleted: true,
        },
      },
      data: {
        is_deleted: true,
      },
    });
  });
};
