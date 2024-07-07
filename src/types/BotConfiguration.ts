import { DiscordUserID } from "./DiscordUserID.js";

export type BotConfiguration = {
    discordBotToken: string;
    discordBotClientID: DiscordUserID;
    adminDiscordUserIDs?: DiscordUserID[];
}