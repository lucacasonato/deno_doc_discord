export type Snowflake = string;
export type ISO8601 = string;

export enum InteractionType {
  PING = 1,
  COMMAND = 2,
}

export type Interaction = InteractionPing | InteractionCommand;

export interface InteractionBase {
  id: Snowflake;
  guild_id: Snowflake;
  channel_id: Snowflake;
  member: GuildMember;
  token: string;
  vesion: 1;
}

export interface InteractionPing extends InteractionBase {
  type: InteractionType.PING;
}

export interface InteractionCommand extends InteractionBase {
  type: InteractionType.COMMAND;
  data: ApplicationCommandInteractionData;
}

export interface ApplicationCommandInteractionData {
  id: Snowflake;
  name: string;
  options?: ApplicationCommandInteractionDataOption[];
}

export interface ApplicationCommandInteractionDataOption {
  name: string;
  value?: Snowflake | string | number | boolean;
  options?: ApplicationCommandInteractionDataOption[];
}

export interface GuildMember {
  user?: User;
  nich: string | null;
  roles: Snowflake[];
  joined_at: string;
  premium_since?: string | null;
  deaf: boolean;
  mute: boolean;
  pending?: boolean;
}

export interface User {
  id: Snowflake;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

export enum InteractionResponseType {
  PONG = 1,
  ACKNOWLEDGE = 2,
  CHANNEL_MESSAGE = 3,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  ACKNOWLEDGE_WITH_SOURCE = 5,
}

export type InteractionResponse =
  | InteractionResponsePong
  | InteractionResponseCommand;

export type InteractionResponseCommand =
  | InteractionResponseAcknowledge
  | InteractionResponseChannelMessage;

export interface InteractionResponsePong {
  type: InteractionResponseType.PONG;
}

export interface InteractionResponseAcknowledge {
  type:
    | InteractionResponseType.ACKNOWLEDGE
    | InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE;
}

export interface InteractionResponseChannelMessage {
  type:
    | InteractionResponseType.CHANNEL_MESSAGE
    | InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE;
  data: InteractionApplicationCommandCallbackData;
}

export interface InteractionApplicationCommandCallbackData {
  tts?: boolean;
  content: string;
  embeds?: Embed[];
  allowed_mentions?: AllowedMentions;
}

export enum AllowedMentionType {
  Everyone = "everyone",
  Users = "users",
  Roles = "roles",
}

export interface AllowedMentions {
  parse: AllowedMentionType[];
  roles: Snowflake[];
  users: Snowflake[];
  replied_user: boolean;
}

export interface Embed {
  title?: string;
  type?: "rich" | "image" | "video" | "gifv" | "article" | "link";
  description?: string;
  url?: string;
  timestamp?: ISO8601;
  color?: number;
  footer?: Footer;
  image?: Image;
  thumbnail?: Thumbnail;
  video?: Video;
  provider?: Provider;
  author?: Author;
  fields?: Field[];
}

export interface Footer {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface Image {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface Thumbnail {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface Video {
  url?: string;
  height?: number;
  width?: number;
}

export interface Provider {
  name?: string;
  url?: string;
}

export interface Author {
  name?: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface Field {
  name: string;
  value: string;
  inline?: boolean;
}
