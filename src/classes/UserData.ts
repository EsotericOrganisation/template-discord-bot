import { DiscordUserID } from "../types/DiscordUserID.js";
import { UserConfiguration } from "../types/UserConfiguration.js";

export class UserData {
    readonly discordUserID: DiscordUserID;

    readonly userConfiguartion: UserConfiguration;
}