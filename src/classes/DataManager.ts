import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { DiscordUserID } from "../types/user/DiscordUserID.js";
import { UserData } from "./UserData.js";
import { botDataFolderPath, pathSeparator, userDataFolderName } from "../constants.js";
import { SlimeBot } from "./SlimeBot.js";

export class DataManager {

    private readonly botDataFolderPath: string;
    private readonly userDataFolderPath: string;

    private readonly userData: Map<DiscordUserID, UserData> = new Map();

    constructor(slimeBot: SlimeBot) {
        this.botDataFolderPath = botDataFolderPath + pathSeparator + slimeBot.discordBotClientID;
        this.userDataFolderPath = this.botDataFolderPath + pathSeparator + userDataFolderName;

        this.createDataFolders();
    }

    createDataFolders() {
        if (!existsSync(this.botDataFolderPath)) {
            mkdirSync(this.botDataFolderPath);
        }

        if (!existsSync(this.userDataFolderPath)) {
            mkdirSync(this.userDataFolderPath);
        }
    }

    removeDataFolders() {
        rmSync(this.botDataFolderPath, {recursive: true})
    }

    load() {
        const userFileNames = readdirSync(this.userDataFolderPath);

        for (const userFileName of userFileNames) {
            const userFile = readFileSync(this.userDataFolderPath + pathSeparator + userFileName).toString();

            const userData = JSON.parse(userFile) as UserData;

            this.userData.set(userData.discordUserID, userData);
        }
    }

    save() {
        this.removeDataFolders();
        this.createDataFolders();

        for (const userDataValue of this.userData.values()) {
            writeFileSync(this.userDataFolderPath + pathSeparator + userDataValue.discordUserID + ".json", JSON.stringify(userDataValue, null, 4));
        }
    }

    getUserData(DiscordUserID: DiscordUserID) {
        return this.userData.get(DiscordUserID);
    }
}