interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbedAuthor {
  name?: string;
  url?: string;
  icon_url?: string;
}

interface DiscordEmbedFooter {
  text: string;
  icon_url?: string;
}

interface DiscordEmbedImage {
  url: string;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: DiscordEmbedFooter;
  image?: DiscordEmbedImage;
  thumbnail?: DiscordEmbedImage;
  author?: DiscordEmbedAuthor;
  fields?: DiscordEmbedField[];
}

export interface DiscordWebhookMessage {
  content?: string;
  embeds?: DiscordEmbed[];
}
