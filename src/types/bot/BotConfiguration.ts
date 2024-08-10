import { DiscordUserID } from "../user/DiscordUserID.js";

export type BotConfiguration = {
    readonly discordBotToken: string;
    readonly discordBotClientID: DiscordUserID;
    readonly adminDiscordUserIDs?: DiscordUserID[];
    readonly defaultLanguage: string;
}