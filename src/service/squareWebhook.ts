import "dotenv/config";
import { paymentCompletedDiscordTemplate } from '../lib/discordWebhook/discordTemplate.js';
import { sendDiscordWebhook } from '../lib/discordWebhook/discordWebhook.js';
import { sendMail } from '../lib/gmail/gmail.js';
import { paymentCompletedMailTemplate } from '../lib/gmail/mailTemplate.js';
import { prisma } from '../lib/prisma.js'
import { SquarePaymentUpdatedEvent } from '../types/squareWebhook.js';

export const squareWebhook = async (squarePaymentUpdatedEvent: SquarePaymentUpdatedEvent ) => {

  try {
        if (squarePaymentUpdatedEvent.data.object.payment.status !== 'COMPLETED') {
            return;
        }

        const paymentLink = await prisma.paymentLink.findUnique({
            where: { order_id: squarePaymentUpdatedEvent.data.object.payment.order_id },
        });
        if (!paymentLink) {
            throw new Error('payment_link_not_found');
        }
        if (paymentLink.is_completed) {
            return;
        }

        const form = await prisma.form.findUnique({
            where: { id: paymentLink.form_id },
        });
        if (!form) throw new Error('form_not_found');

        await prisma.$transaction(async (tx) => {
            await tx.form.update({
                where: { id: form.id },
                data: { payment_status: 'completed' },
            });
            await tx.paymentLink.update({
                where: { id: paymentLink.id },
                data: { is_completed: true },
            });
            await prisma.ticket.updateMany({
                where: { form_id: form.id },
                data: { is_activated: true },
            });
        });

        await sendDiscordWebhook(paymentCompletedDiscordTemplate("Square", form.name, form.number_of_tickets, form.id));

        await sendMail({
            to: form.email,
            subject: '【秩序の奔流】決済完了のお知らせ',
            text: paymentCompletedMailTemplate(form.name, `${process.env.TICKET_LIST_BASE_URL!}/${form.id}`),
        });
        
    } catch (error) {
        console.error('getMovies error', error);
        throw error;
    }
};
