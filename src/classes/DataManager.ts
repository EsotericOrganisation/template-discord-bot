import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { DiscordUserID } from "../types/DiscordUserID.js";
import { UserData } from "./UserData.js";
import { dataFolderPath, pathSeparator, userDataFolderPath } from "../constants.js";

export class DataManager {

    readonly userData: Map<DiscordUserID, UserData> = new Map();

    constructor() {
        this.createDataFolders();
    }

    createDataFolders() {
        if (!existsSync(dataFolderPath)) {
            mkdirSync(dataFolderPath);
        }

        if (!existsSync(userDataFolderPath)) {
            mkdirSync(userDataFolderPath);
        }
    }

    removeDataFolders() {
        rmSync(dataFolderPath)
    }

    load() {
        const userFileNames = readdirSync(userDataFolderPath);

        for (const userFileName of userFileNames) {
            const userFile = readFileSync(userDataFolderPath + pathSeparator + userFileName).toString();

            const userData = JSON.parse(userFile) as UserData;

            this.userData.set(userData.discordUserID, userData);
        }
    }

    save() {
        this.removeDataFolders();
        this.createDataFolders();

        for (const userDataValue of this.userData.values()) {
            writeFileSync(userDataFolderPath + pathSeparator + userDataValue.discordUserID + ".json", JSON.stringify(userDataValue, null, 4));
        }
    }

    getUserData(DiscordUserID: DiscordUserID) {
        return this.userData.get(DiscordUserID);
    }
}