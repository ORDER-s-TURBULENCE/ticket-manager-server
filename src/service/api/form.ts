import { sendMail } from "../../lib/gmail/gmail.js";
import { prisma } from "../../lib/prisma.js";
import type { components } from "../../types/api.js";
import { createSquarePaymentLink } from "../../lib/square.js";
import { sendDiscordWebhook } from "../../lib/discordWebhook/discordWebhook.js";
import { cashMailTemplate, paymentCompletedMailTemplate, squareMailTemplate } from "../../lib/gmail/mailTemplate.js";
import { cashDiscordTemplate, paymentCompletedDiscordTemplate, squareDiscordTemplate } from "../../lib/discordWebhook/discordTemplate.js";
import { createTicketsByForm, getNumberOfTicketsForPurpose } from "./ticket.js";

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
  if (input.number_of_goods_tickets < 0) {
    throw new Error("invalid_number_of_goods_tickets");
  }
  if (input.number_of_seat_tickets < 0) {
    throw new Error("invalid_number_of_seat_tickets");
  }
  const numberOfTickets = await getNumberOfTicketsForPurpose(input.movie_id);
  if (numberOfTickets.seat + input.number_of_seat_tickets > numberOfTickets.max_seats) {
    throw new Error("not_enough_seats");
  }

  const form = await prisma.form.create({
    data: {
      name: input.name,
      email: input.email,
      movie_id: input.movie_id,
      type: input.type,
      is_verified: input.is_verified,
      payment_method: input.payment_method,
      payment_status: "not_contacted",
      number_of_goods_tickets: input.number_of_goods_tickets,
      number_of_seat_tickets: input.number_of_seat_tickets,
      is_deleted: false,
      remarks: input.remarks ?? null,
    },
  });

  await createTicketsByForm(form.id);

  if (input.payment_method === "square") {

    const paymentLink = await createSquarePaymentLink({
      numberOfTickets: input.number_of_goods_tickets + input.number_of_seat_tickets, 
      formId: form.id
    });

    await sendDiscordWebhook(squareDiscordTemplate(input.name, input.number_of_seat_tickets, input.number_of_goods_tickets, form.id));
    await sendMail({
      to: input.email,
      subject: "【秩序の奔流】購入申請受付完了とお支払いのお願い",
      text: squareMailTemplate(input.name, input.number_of_seat_tickets, input.number_of_goods_tickets, paymentLink.url),
    });

    await prisma.form.update({
      where: { id: form.id },
      data: { payment_status: "pending" },
    });
  }
  else {
    await sendDiscordWebhook(cashDiscordTemplate(input.name, input.number_of_seat_tickets, input.number_of_goods_tickets, form.id, input.payment_method === "cash" ? "現金" : "銀行振込"));

    await sendMail({
      to: input.email,
      subject: "【秩序の奔流】購入申請受付完了",
        text: cashMailTemplate(input.name, input.number_of_seat_tickets, input.number_of_goods_tickets, input.payment_method === "cash" ? "現金" : "銀行振込"),
    });
  }
};

export const getFormById = async (id: string) => {
  return prisma.form.findUnique({ where: { id } });
};

export const putForm = async (id: string, input: FormInput) => {

  const form = await prisma.form.findUnique({ where: { id } });
  if (!form) throw new Error("form_not_found");

  if (form.payment_method !== input.payment_method && form.payment_method === "square") {
    throw new Error("cannot_change_payment_method_from_square");
  }
  if (form.payment_method !== input.payment_method && input.payment_method === "square") {
    throw new Error("cannot_change_payment_method_to_square");
  }
  if (form.payment_method === "square" && form.payment_status !== input.payment_status) {
    throw new Error("cannot_change_payment_status_of_square");
  }
  if (form.payment_status === "completed" && form.payment_status !== input.payment_status) {
      throw new Error("cannot_change_payment_status_of_completed_form");
  }
  if (form.number_of_seat_tickets !== input.number_of_seat_tickets
    || form.number_of_goods_tickets !== input.number_of_goods_tickets
  ) {
    throw new Error("cannot_change_number_of_tickets");
  }
    

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
      number_of_goods_tickets: input.number_of_goods_tickets,
      number_of_seat_tickets: input.number_of_seat_tickets,
      remarks: input.remarks ?? null,
    },
  });

  if (input.payment_status === "completed") {
    await prisma.ticket.updateMany({
      where: { form_id: id },
      data: { is_activated: true },
    });

    const numberOfLeftoverTickets = await getNumberOfTicketsForPurpose(input.movie_id);
    await sendDiscordWebhook(paymentCompletedDiscordTemplate(
      input.payment_method === 'cash' ? "現金" : "銀行振込", 
      input.name, 
      input.number_of_seat_tickets, 
      input.number_of_goods_tickets, 
      numberOfLeftoverTickets.max_seats - numberOfLeftoverTickets.seat, id
    ));

    await sendMail({
        to: input.email,
        subject: '【秩序の奔流】決済完了のお知らせ',
        text: paymentCompletedMailTemplate(input.name, `${process.env.TICKET_LIST_BASE_URL!}/${id}`),
    });
  }
};

export const deleteForm = async (id: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.form.update({ where: { id }, data: { is_deleted: true } });
    await tx.ticket.updateMany({ where: { form_id: id }, data: { is_deleted: true } });
  });
};
