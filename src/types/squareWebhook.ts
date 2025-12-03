export interface SquarePaymentUpdatedEvent {
  merchant_id: string;
  type: "payment.updated";
  event_id: string;
  created_at: string;
  data: {
    type: "payment";
    id: string;
    object: {
      payment: Payment;
    };
  };
}

interface Payment {
  id: string;
  created_at: string;
  updated_at?: string;
  amount_money: Money;
  status?: string;
  delay_duration?: string;
  source_type?: string;
  card_details?: CardDetails;
  location_id?: string;
  order_id?: string;
  risk_evaluation?: RiskEvaluation;
  total_money?: Money;
  approved_money?: Money;
  receipt_number?: string;
  receipt_url?: string;
  delay_action?: string;
  delayed_until?: string;
  version_token?: string;

  // 拡張フィールドとして余地を残す
  [key: string]: unknown;
}

interface Money {
  amount: number;
  currency: string;
}

interface CardDetails {
  status?: string;
  card?: Card;
  entry_method?: string;
  cvv_status?: string;
  avs_status?: string;
  statement_description?: string;
  card_payment_timeline?: CardPaymentTimeline;
  [key: string]: unknown;
}

interface Card {
  card_brand?: string;
  last_4?: string;
  exp_month?: number;
  exp_year?: number;
  fingerprint?: string;
  card_type?: string;
  prepaid_type?: string;
  bin?: string;
  [key: string]: unknown;
}

interface CardPaymentTimeline {
  authorized_at?: string;
  captured_at?: string;
  [key: string]: unknown;
}

interface RiskEvaluation {
  created_at?: string;
  risk_level?: string;
  [key: string]: unknown;
}
