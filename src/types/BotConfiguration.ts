import { DiscordUserID } from "./DiscordUserID.js";

export type BotConfiguration = {
    discordBotToken: string;
    adminDiscordUserIDs?: DiscordUserID[];
}