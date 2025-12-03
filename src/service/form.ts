import { sendMail } from "../lib/gmail/gmail.js";
import { prisma } from "../lib/prisma.js";
import type { components } from "../types/api.js";
import { createSquarePaymentLink } from "../lib/square.js";
import { sendDiscordWebhook } from "../lib/discordWebhook/discordWebhook.js";
import { cashMailTemplate, squareMailTemplate } from "../lib/gmail/mailTemplate.js";
import { cashDiscordTemplate, squareDiscordTemplate } from "../lib/discordWebhook/discordTemplate.js";

type FormInput = components["schemas"]["FormInput"];

export const getForms = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.form.count(),
    prisma.form.findMany({
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
  ]);

  return { page, limit, total, users: items };
};

export const postForm = async (input: FormInput) => {
  const form = await prisma.form.create({
    data: {
      name: input.name,
      email: input.email,
      movie_id: input.movie_id,
      type: input.type,
      is_verified: input.is_verified,
      payment_method: input.payment_method,
      payment_status: "not_contacted",
      number_of_tickets: input.number_of_tickets,
      number_of_seat_tickets: input.number_of_seat_tickets,
      is_deleted: false,
      remarks: input.remarks ?? null,
    },
  });

  if (input.payment_method === "square") {

    const paymentLink = await createSquarePaymentLink({
      numberOfTickets: input.number_of_tickets, 
      formId: form.id
    });

    await sendDiscordWebhook(squareDiscordTemplate(input.name, input.number_of_tickets, form.id));

    await sendMail({
      to: input.email,
      subject: "【秩序の奔流】購入申請受付完了とお支払いのお願い",
      text: squareMailTemplate(input.name, input.number_of_tickets, paymentLink.url),
    });

    await prisma.form.update({
      where: { id: form.id },
      data: { payment_status: "pending" },
    });
  }
  else {
    await sendDiscordWebhook(cashDiscordTemplate(input.name, input.number_of_tickets, form.id, input.payment_method === "cash" ? "現金" : "銀行振込"));

    await sendMail({
      to: input.email,
      subject: "【秩序の奔流】購入申請受付完了",
        text: cashMailTemplate(input.name, input.number_of_tickets, input.payment_method === "cash" ? "現金" : "銀行振込"),
    });
  }
};

export const getFormById = async (id: string) => {
  return prisma.form.findUnique({ where: { id } });
};

export const putForm = async (id: string, input: FormInput) => {
  await prisma.form.update({
    where: { id },
    data: {
      name: input.name,
      email: input.email,
      movie_id: input.movie_id,
      type: input.type,
      is_verified: input.is_verified,
      payment_method: input.payment_method,
      payment_status: input.payment_status,
      number_of_tickets: input.number_of_tickets,
      number_of_seat_tickets: input.number_of_seat_tickets,
      remarks: input.remarks ?? null,
    },
  });
};

export const deleteForm = async (id: string) => {
  await prisma.form.update({ where: { id }, data: { is_deleted: true } });
};
