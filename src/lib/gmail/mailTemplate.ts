import "dotenv/config";
import { TICKET_PRICE } from "../constant.js";

export const squareMailTemplate = (name: string, numberOfTickets: number, paymentLink: string) => `${name} 様

秩序の奔流 製作委員会です．

この度は「秩序の奔流」のチケット購入を申請していただき，
誠にありがとうございます．

申請内容を確認の上，
下記リンクからお支払いをお願いいたします．

なお，24時間以内にお支払いが確認できない場合，
申請は自動的にキャンセルされますのでご注意ください．

----------

申請内容：秩序の奔流 チケット ${numberOfTickets}枚
お支払い金額：￥${numberOfTickets * TICKET_PRICE}

お支払いリンク：${paymentLink}

----------

よろしくお願いいたします．

秩序の奔流 製作委員会

【お問い合わせ】
mail: ${process.env.SUPPORT_EMAIL}
`;

export const cashMailTemplate = (name: string, numberOfTickets: number, paymentMethod: string) => `${name} 様

秩序の奔流 製作委員会です．

この度は「秩序の奔流」のチケット購入を申請していただき，
誠にありがとうございます．

以下の内容で申請を受け付けました．

----------

申請内容：秩序の奔流 チケット ${numberOfTickets}枚
お支払い金額：￥${numberOfTickets * TICKET_PRICE}
お支払い方法：${paymentMethod}

----------

追って担当者よりご連絡いたしますので，
今しばらくお待ちください．

なお，1週間以内にお支払いが確認できない場合，
申請は自動的にキャンセルされますのでご注意ください．

よろしくお願いいたします．

秩序の奔流 製作委員会

【お問い合わせ】
mail: ${process.env.SUPPORT_EMAIL}
`;

export const paymentCompletedMailTemplate = (name: string, ticketListLink: string) => `${name} 様

秩序の奔流 製作委員会です．

この度は「秩序の奔流」のチケットを購入していただき，
誠にありがとうございます．

決済が完了いたしましたので，
チケットの使用方法についてご案内いたします．


1. 下記リンクからチケットの一覧を確認できます．
${ticketListLink}

2. チケットテーブルのQRコード表示ボタンを押下することで，各チケットのQRコードを表示できます．

3. 表示したQRコードをスタッフにご提示ください．


なお，各チケットには使用用途が設定されております．
- 座席：入場用チケット
- グッズ：グッズ交換用チケット

入場時に座席チケットのQRコードを，
グッズ交換時にグッズチケットのQRコードをご提示ください．

当日，皆様にお会いできることを心待ちにしております．

秩序の奔流 製作委員会

【お問い合わせ】
mail: ${process.env.SUPPORT_EMAIL}
`;
