import 'dotenv/config'
import { DiscordWebhookMessage } from '../../types/discordWebhook.js';

export const sendDiscordWebhook = async ( webhookMessage: DiscordWebhookMessage) => {
  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookMessage),
    });
    if (!response.ok) {
      throw new Error(`Failed to send Discord webhook: ${response.statusText}`);
    }
  } catch (err) {
    console.error('Error sending Discord webhook', err);
  }
}
