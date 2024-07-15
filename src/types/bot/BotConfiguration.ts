import { DiscordUserID } from "../user/DiscordUserID.js";

export type BotConfiguration = {
    discordBotToken: string;
    discordBotClientID: DiscordUserID;
    adminDiscordUserIDs?: DiscordUserID[];
}