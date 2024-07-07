import { DiscordUserID } from "../types/user/DiscordUserID.js";
import { UserConfiguration } from "../types/user/UserConfiguration.js";

export class UserData {
    readonly discordUserID: DiscordUserID;

    readonly userConfiguartion: UserConfiguration;
}