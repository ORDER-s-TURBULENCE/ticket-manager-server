import { DiscordWebhookMessage } from "../../types/discordWebhook.js";

export const squareDiscordTemplate = (name: string, numberOfTickets: number, formId: string) : DiscordWebhookMessage => ({
  embeds: [
    {
        title: "新規購入申請（Square）がありました",
        description: `${name} 様が ${numberOfTickets} 枚のチケットを申請しました.`,
        fields: [
            {
                name: "formId",
                value: formId,
            },
            {
                name: "paymentMethod",
                value: "Square",
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

export const cashDiscordTemplate = (name: string, numberOfTickets: number, formId: string, paymentMethod: string) : DiscordWebhookMessage => ({
    embeds: [
        {
            title: "新規購入申請（要連絡）があります",
            description: `${name} 様が ${numberOfTickets} 枚のチケットを申請しました.**管理者からの連絡が必要です．**`,
            fields: [
                {
                name: "formId",
                value: formId,
                },
                {
                    name: "paymentMethod",
                    value: paymentMethod,
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

export const paymentCompletedDiscordTemplate = (paymentMethod: string, name: string, numberOfTickets: number, formId: string) : DiscordWebhookMessage => ({
  embeds: [
    {
        title: `決済が完了しました（${paymentMethod}）`,
        description: `${name} 様が ${numberOfTickets} 枚のチケットの決済を完了しました.`,
        fields: [
            {
                name: "formId",
                value: formId,
            },
            {
                name: "paymentMethod",
                value: "Square",
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

