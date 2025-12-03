import { sendMail } from "../../lib/gmail/gmail.js";
import { prisma } from "../../lib/prisma.js";
import type { components } from "../types/api.js";
import { createSquarePaymentLink } from "../../lib/square/square.js";

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
      payment_status: input.payment_status,
      number_of_tickets: input.number_of_tickets,
      number_of_seat_tickets: input.number_of_seat_tickets,
      is_deleted: input.is_deleted ?? false,
      remarks: input.remarks ?? null,
    },
  });

  if (input.payment_method === "square") {

    const paymentLink = await createSquarePaymentLink({
      numberOfTickets: input.number_of_tickets, 
      formId: form.id
    });

    await sendMail({
      to: input.email,
      subject: "秩序の奔流 購入申請受付完了とお支払いのお願い",
      text: `${input.name} 様\n\n購入申請をしていただき，誠にありがとうございます。\n以下のリンクからお支払いを完了してください。\n\n${paymentLink.url}\n\nよろしくお願いいたします。\n秩序の奔流 運営委員会`,
    });

    await prisma.form.update({
      where: { id: form.id },
      data: { payment_status: "pending" },
    });
  }
  else {
    await sendMail({
      to: input.email,
      subject: "秩序の奔流 購入申請受付完了",
        text: `${input.name} 様\n\n購入申請をしていただき，誠にありがとうございます。\n\n内容を確認の上，追ってご連絡いたします。\n\nよろしくお願いいたします。\n秩序の奔流 運営委員会`,
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
