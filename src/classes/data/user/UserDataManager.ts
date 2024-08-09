import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { DiscordUserID } from "../../../types/user/DiscordUserID.js";
import { UserData } from "../../../types/user/UserData.js";
import { botDataFolderPath, dataFileExtensions as dataFilesExtension, pathSeparator, userDataFolderName } from "../../../constants.js";
import { Bot } from "../../bot/Bot.js";

export class UserDataManager {

    private readonly botDataFolderPath: string;
    private readonly userDataFolderPath: string;

    private readonly userData: Map<DiscordUserID, UserData> = new Map();

    constructor(bot: Bot) {
        this.botDataFolderPath = botDataFolderPath + pathSeparator + bot.discordBotClientID;
        this.userDataFolderPath = this.botDataFolderPath + pathSeparator + userDataFolderName;
    }

    createDataFolders() {
        mkdirSync(this.userDataFolderPath, {recursive: true});
    }

    removeDataFolders() {
        rmSync(this.botDataFolderPath, {recursive: true})
    }

    load() {
        if (!existsSync(this.botDataFolderPath)) {
            return;
        }

        const userFileNames = readdirSync(this.userDataFolderPath);

        for (const userFileName of userFileNames) {
            const userFile = readFileSync(this.userDataFolderPath + pathSeparator + userFileName).toString();

            const userData = JSON.parse(userFile) as UserData;

            this.userData.set(userData.discordUserID, userData);
        }
    }

    save() {
        if (existsSync(this.botDataFolderPath)) {
            this.removeDataFolders();
        }

        if (this.userData.size === 0) {
            return;
        }

        this.createDataFolders();

        for (const userDataValue of this.userData.values()) {
            writeFileSync(this.userDataFolderPath + pathSeparator + userDataValue.discordUserID + dataFilesExtension, JSON.stringify(userDataValue, null, 4));
        }
    }

    getUserData(DiscordUserID: DiscordUserID) {
        return this.userData.get(DiscordUserID);
    }
}