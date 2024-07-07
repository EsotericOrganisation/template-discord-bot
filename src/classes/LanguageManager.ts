import { Language } from "../enums/Language.js";
import { LanguageInformation } from "../types/LanguageInformation.js";
import { readdirSync, readFileSync } from "fs";
import { languagesFolderPath, pathSeparator } from "../constants.js";
import { MessageMap } from "../types/MessageMap.js";
import { LanguageManifest } from "../types/LanguageManifest.js";
import { Message } from "../enums/Message.js";
import { DiscordUserID } from "../types/DiscordUserID.js";
import { SlimeBot } from "./SlimeBot.js";
import { User } from "discord.js";
import { UserData } from "./UserData.js";

export class LanguageManager {

    readonly bot: SlimeBot;

    readonly languageDataMap: Map<Language, LanguageInformation> = new Map();

    constructor(bot: SlimeBot) {
        this.bot = bot;

        this.loadLanguages();
    }

    loadLanguages() {
        const languageFolderNames = readdirSync(languagesFolderPath);

        for (const languageFolderName of languageFolderNames) {
            const folderPath = languagesFolderPath + pathSeparator + languageFolderName;

            const manifestFile = readFileSync(folderPath + pathSeparator + "manifest.json").toString();
            const messagesFile = readFileSync(folderPath + pathSeparator + "messages.json").toString();

            const languageData = JSON.parse(manifestFile) as LanguageManifest;
            const messagesData = JSON.parse(messagesFile) as MessageMap;

            this.languageDataMap.set(languageFolderName as Language, { languageName: languageData.languageName, messages: messagesData })
        }
    }

    getMessageByLanguage(message: Message, language: Language, ...parameters: any[]) {
        const languageData = this.languageDataMap.get(language) ?? this.languageDataMap.get(Language.DefaultLanguage);

        let messageString = languageData.messages[message];

        for (let i = 0; i < parameters.length; i++) {
            messageString = messageString.replaceAll("{" + i + "}", parameters[i].toString());
        }

        return messageString;
    }

    getMessageByUserData(message: Message, userData: UserData, ...parameters: any[]) {
        return this.getMessageByLanguage(message, userData?.userConfiguartion?.language ?? Language.DefaultLanguage, ...parameters);
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