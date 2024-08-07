import { readdirSync, readFileSync } from "fs";
import { languagesFolderPath, pathSeparator } from "../../constants.js";
import { MessageMap } from "../../types/language/MessageMap.js";
import { Message } from "../../enums/language/Message.js";
import { DiscordUserID } from "../../types/user/DiscordUserID.js";
import { Bot } from "../bot/Bot.js";
import { User } from "discord.js";
import { UserData } from "../../types/user/UserData.js";

export class LanguageManager {

    private readonly bot: Bot;

    private readonly languageDataMap: Map<string, MessageMap> = new Map();

    constructor(bot: Bot) {
        this.bot = bot;

        this.loadLanguages();
    }

    loadLanguages() {
        const languageFileNames = readdirSync(languagesFolderPath);

        for (const languageFileName of languageFileNames) {
            const languageFilePath = languagesFolderPath + pathSeparator + languageFileName;
            const languageFileContents = readFileSync(languageFilePath).toString();
            const languageMessageData = JSON.parse(languageFileContents) as MessageMap;

            this.languageDataMap.set(languageFileName.split(".")[0], languageMessageData)
        }
    }

    getMessageByLanguage(message: Message, language: string, ...parameters: any[]) {
        const languageData = this.languageDataMap.get(language) ?? this.languageDataMap.get(this.bot.defaultLanguage);
        let messageString = languageData[message];

        for (let i = 0; i < parameters.length; i++) {
            messageString = messageString.replaceAll("{" + i + "}", parameters[i].toString());
        }

        return messageString;
    }

    getMessageByUserData(message: Message, userData: UserData, ...parameters: any[]) {
        return this.getMessageByLanguage(message, userData?.userConfiguartion?.language ?? this.bot.defaultLanguage, ...parameters);
    }

    getMessageByDiscordUserID(message: Message, userID: DiscordUserID, ...parameters: any[]) {
        const dataManager = this.bot.dataManager;

        const userData = dataManager.getUserData(userID);

        return this.getMessageByUserData(message, userData, ...parameters);
    }

    getMessageByDiscordUser(message: Message, user: User, ...parameters: any[]) {
        return this.getMessageByDiscordUserID(message, user.id as DiscordUserID, ...parameters);
    }
}