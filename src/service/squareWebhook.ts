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

        const paymentLinks = await prisma.paymentLink.findMany({
            where: { order_id: squarePaymentUpdatedEvent.data.object.payment.order_id },
        });
        if (paymentLinks.length === 0) {
            throw new Error('payment_link_not_found');
        }

        const form = await prisma.form.findUnique({
            where: { id: paymentLinks[0]?.form_id },
        });
        if (!form) throw new Error('form_not_found');

        await prisma.$transaction(async (tx) => {
            await tx.form.update({
                where: { id: form.id },
                data: { payment_status: 'completed' },
            });
            await tx.paymentLink.update({
                where: { id: paymentLinks[0].id },
                data: { is_completed: true },
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
