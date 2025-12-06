import { DiscordWebhookMessage } from "../../types/discordWebhook.js";

export const squareDiscordTemplate = (name: string, numberOfSeatTickets: number, numberOfGoodsTickets: number, formId: string) : DiscordWebhookMessage => ({
  embeds: [
    {
        title: "新規購入申請がありました（Square）",
        description: `${name} 様が ${numberOfSeatTickets + numberOfGoodsTickets} 枚のチケットを申請しました.`,
        fields: [
            {
                name: "formId",
                value: formId,
            },
            {
                name: "購入方法",
                value: "Square",
            },
            {
                name: "座席チケット枚数",
                value: numberOfSeatTickets.toString(),
            },
            {
                name: "グッズチケット枚数",
                value: numberOfGoodsTickets.toString(),
            },
        ],
        color: 3066993,
        footer: {
            text: "Ticket Manager Server"
        },
        timestamp: new Date().toISOString(),
    },
  ],
});

export const cashDiscordTemplate = (name: string, numberOfSeatTickets: number, numberOfGoodsTickets: number, formId: string, paymentMethod: string) : DiscordWebhookMessage => ({
    embeds: [
        {
            title: "新規購入申請があります（要連絡）",
            description: `${name} 様が ${numberOfSeatTickets + numberOfGoodsTickets} 枚のチケットを申請しました．**管理者からの連絡が必要です．**`,
            fields: [
                {
                name: "formId",
                value: formId,
                },
                {
                    name: "購入方法",
                    value: paymentMethod,
                },
                {
                    name: "座席チケット枚数",
                    value: numberOfSeatTickets.toString(),
                },
                {
                    name: "グッズチケット枚数",
                    value: numberOfGoodsTickets.toString(),
                },
            ],
            color: 16762880,
            footer: {
                text: "Ticket Manager Server"
            },
            timestamp: new Date().toISOString(),
        },
    ],
});

export const paymentCompletedDiscordTemplate = (paymentMethod: string, name: string, numberOfSeatTickets: number, numberOfGoodsTickets: number, numberOfLeftoverTickets: number, formId: string) : DiscordWebhookMessage => ({
  embeds: [
    {
        title: `決済が完了しました（${paymentMethod}）`,
        description: `${name} 様が ${numberOfSeatTickets + numberOfGoodsTickets} 枚のチケットの決済を完了しました.`,
        fields: [
            {
                name: "formId",
                value: formId,
            },
            {
                name: "購入方法",
                value: paymentMethod,
            },
            {
                name: "座席チケット枚数",
                value: numberOfSeatTickets.toString(),
            },
            {
                name: "グッズチケット枚数",
                value: numberOfGoodsTickets.toString(),
            },
            {
                name: "残り座席数",
                value: numberOfLeftoverTickets.toString(),
            },
        ],
        color: 12451835,
        footer: {
            text: "Ticket Manager Server"
        },
        timestamp: new Date().toISOString(),
    },
  ],
});

