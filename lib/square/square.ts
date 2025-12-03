import 'dotenv/config'
import crypto from "crypto"
import { prisma } from "../../lib/prisma.js";

const pricePerTicket = 2500 // in JPY
const applicationId = process.env.SQUARE_APPLICATION_ID
const accessToken = process.env.SQUARE_ACCESS_TOKEN
const locationId = process.env.SQUARE_LOCATION_ID

type SquarePaymentLinkResponse = {
  id: string,
  version: number,
  description: string,
  order_id: string,
  url: string,
  long_url: string,
  checkout_options: {
    enable_loyalty: boolean,
    enable_coupon: boolean,
  },
  created_at: string
}

export async function createSquarePaymentLink({
  numberOfTickets,
  formId
}: {
  numberOfTickets: number
  formId: string
}) : Promise<SquarePaymentLinkResponse> {
  const body = {
    idempotency_key: crypto.randomUUID(),
    description: "秩序の奔流 チケット支払いリンク",
    quick_pay: {
      name: "秩序の奔流 チケット - " + numberOfTickets + " 枚",
      price_money: {
        amount: numberOfTickets * pricePerTicket,
        currency: "JPY",
      },
      location_id: locationId,
    },
    checkout_options: {
      enable_loyalty: false,
      enable_coupon: false,
    },
  }

  const res = await fetch(
    `${process.env.SQUARE_BASE_URL}/v2/online-checkout/payment-links`,
    {
      method: "POST",
      headers: {
        "Square-Version": "2025-10-16",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )

  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))

  await prisma.paymentLink.create({
      data: {
        id: data.payment_link.id,
        version: data.payment_link.version,
        description: data.payment_link.description,
        order_id: data.payment_link.order_id,
        url: data.payment_link.url,
        long_url: data.payment_link.long_url,
        checkout_options: data.payment_link.checkout_options,
        created_at: new Date(data.payment_link.created_at),
        is_completed: false,
        form_id: formId,
      },
    });

  return data.payment_link
}
