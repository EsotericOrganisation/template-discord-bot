import { DiscordUserID } from "./DiscordUserID.js";
import { UserConfiguration } from "./UserConfiguration.js";

export type UserData = {
    readonly discordUserID: DiscordUserID;
    readonly userConfiguartion: UserConfiguration;
}