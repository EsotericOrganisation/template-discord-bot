import { APIApplicationCommandOption, ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandSubCommandData, ApplicationCommandSubGroupData, Client, Collection, IntentsBitField, LocaleString, LocalizationMap, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import { Command } from "../../types/commands/Command.js";
import { Button } from "../../types/components/Button.js";
import { Menu } from "../../types/components/Menu.js";
import { Modal } from "../../types/components/Modal.js";
import { DiscordClientEvent } from "../../types/events/DiscordClientEvent.js";
import { ProcessEvent } from "../../types/events/ProcessEvent.js";
import { commandsFolderName, restVersion, commandsFolderPath, eventsFolderPath, eventsFolderName, componentsFolderPath, pathSeparator, processEventsFolderName, clientEventsFolderName, buttonsFolderName, menusFolderName, modalsFolderName, ascendDirectoryString, commandPrefix, componentsFolderName } from "../../constants.js";
import { LanguageManager } from "../language/LanguageManager.js";
import { UserDataManager } from "../data/user/UserDataManager.js";
import { DiscordUserID } from "../../types/user/DiscordUserID.js";

import { BotConfiguration } from "../../types/bot/BotConfiguration.js";
import { BotManager } from "./BotManager.js";
import { BotLogger } from "../logging/BotLogger.js";
import { Message } from "../../enums/language/Message.js";

export class Bot extends Client {

    public readonly botManager: BotManager;

    public readonly logger: BotLogger;

    public isRunning: boolean = false;

    private readonly botToken: string;
    public readonly discordBotClientID: DiscordUserID;
    public adminDiscordUserIDs: DiscordUserID[] = [];
    public readonly defaultLanguage: string;

    public commandArray: RESTPostAPIApplicationCommandsJSONBody[];
    public commands: Collection<string, Command>;

    public buttons: Collection<string, Button>;
    public menus: Collection<string, Menu>;
    public modals: Collection<string, Modal>;

    public readonly dataManager: UserDataManager;
    public readonly languageManager: LanguageManager;

    constructor(botManager: BotManager, botConfiguration: BotConfiguration) {
        super({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers] });

        this.botManager = botManager;

        this.botToken = botConfiguration.discordBotToken;
        this.discordBotClientID = botConfiguration.discordBotClientID;

        this.logger = new BotLogger(this.discordBotClientID, this.discordBotClientID);

        this.adminDiscordUserIDs = botConfiguration.adminDiscordUserIDs;
        this.defaultLanguage = botConfiguration.defaultLanguage;

        this.dataManager = new UserDataManager(this);
        this.languageManager = new LanguageManager(this);

        this.dataManager.load();
    }

    async run() {
        await this.login(this.botToken);

        await this.runHandlers();

        this.isRunning = true;
    }

    async stop(permanently: boolean) {
        this.logger.log("Stopping bot " + this.user.displayName + (permanently ? " permanently" : "") + ".");

        if (permanently) {
            this.botManager.removeBotFromMap(this);
            this.botManager.permanentlyStoppedBotIDs.push(this.discordBotClientID);
        }

        await super.destroy();
        await this.ws.client.destroy();
        this.dataManager.save();

        this.isRunning = false;
    }

    async runHandlers() {
        await this.handleEvents();
        await this.handleCommands();
        await this.handleComponents();
    }

    async handleEvents() {
        this.removeAllListeners();

        const eventFolder = readdirSync(eventsFolderPath);

        for (const eventSubfolder of eventFolder) {
            const eventFiles = readdirSync(eventsFolderPath + pathSeparator + eventSubfolder);

            switch (eventSubfolder) {
                case clientEventsFolderName:
                    for (const eventFile of eventFiles) {
                        const event = (await import(ascendDirectoryString + pathSeparator + ascendDirectoryString + pathSeparator + eventsFolderName + pathSeparator + eventSubfolder + pathSeparator + eventFile)).default as DiscordClientEvent;

                        if (event.once) {
                            this.once(event.name, async (...args) => await event.execute(this, ...args));
                        } else {
                            this.on(event.name, async (...args) => await event.execute(this, ...args));
                        }
                    }

                    break;
                case processEventsFolderName:
                    for (const eventFile of eventFiles) {
                        const event = (await import(ascendDirectoryString + pathSeparator + ascendDirectoryString + pathSeparator + eventsFolderName + pathSeparator + eventSubfolder + pathSeparator + eventFile)).default as ProcessEvent;

                        if (event.once) {
                            process.once(event.name, (...args) => event.execute(this, ...args));
                        } else {
                            process.on(event.name, async (...args) => await event.execute(this, ...args));
                        }
                    }

                    break;
            }
        }
    }

    async handleCommands() {
        this.commandArray = [];
        this.commands = new Collection();

        const commandFiles = readdirSync(commandsFolderPath);

        for (const file of commandFiles) {
            const command = (await import(ascendDirectoryString + pathSeparator + ascendDirectoryString + pathSeparator + commandsFolderName + pathSeparator + file)).default as Command;

            this.logger.log("Handling command " + commandPrefix + command.data.name + ".");

            this.commandArray.push(this.addCommandLocalizations(command));
            this.commands.set(command.data.name, command);
        }

        await new REST({ version: restVersion })
            .setToken(this.botToken)
            .put(Routes.applicationCommands(this.discordBotClientID), { body: this.commandArray, });

        this.logger.log("Successfully handled " + this.commandArray.length + " command(s).");
    };

    async handleComponents() {
        this.buttons = new Collection();
        this.menus = new Collection();
        this.modals = new Collection();

        const componentFolder = readdirSync(componentsFolderPath);

        for (const componentTypeFolder of componentFolder) {
            const componentType = readdirSync(componentsFolderPath + pathSeparator + componentTypeFolder);

            const relativeComponentFolderPath = ascendDirectoryString + pathSeparator + ascendDirectoryString + pathSeparator + componentsFolderName;

            switch (componentTypeFolder) {
                case buttonsFolderName:
                    for (const file of componentType) {
                        const button = (await import(relativeComponentFolderPath + pathSeparator + buttonsFolderName + pathSeparator + file)).default as Button;

                        this.buttons.set(button.id, button);
                    }

                    break;
                case menusFolderName:
                    for (const file of componentType) {
                        const menu = (await import(relativeComponentFolderPath + pathSeparator + menusFolderName + pathSeparator + file)).default as Menu;

                        this.menus.set(menu.id, menu);
                    }

                    break;
                case modalsFolderName:
                    for (const file of componentType) {
                        const modal = (await import(relativeComponentFolderPath + pathSeparator + modalsFolderName + pathSeparator + file)).default as Modal;

                        this.modals.set(modal.id, modal);
                    }

                    break;
            }
        }
    }

    async reload() {
        this.logger.log("Reloading " + this.user?.displayName + ".");

        if (!this.isRunning) {
            this.login(this.botToken);
        }

        await this.runHandlers();

        const {languageManager, dataManager} = this;

        languageManager.loadLanguages();

        dataManager.save();
        dataManager.load();
    }

    private addCommandLocalizations(command: Command): RESTPostAPIApplicationCommandsJSONBody {
        const jsonData = command.data.toJSON();

        const baseMessageKey = (command.data.name + "-command");

        this.addNameAndDescriptionLocalizations(jsonData, baseMessageKey);
        this.addCommandOptionLocalizations(jsonData, baseMessageKey);

        return jsonData;
    }

    private addCommandOptionLocalizations(objectWithOptions: {
        options?: readonly (APIApplicationCommandOption | Exclude<
            ApplicationCommandOptionData,
            ApplicationCommandSubGroupData | ApplicationCommandSubCommandData
        >)[]
    } & Record<string, any>, baseMessageKey: string) {
        if (!objectWithOptions.options) {
            return;
        }

        for (const option of objectWithOptions.options) {
            const newBaseMessageKey = (baseMessageKey + "-" + option.name + "-option");
            if (option.type === ApplicationCommandOptionType.Subcommand) {
                this.addCommandOptionLocalizations(option as ApplicationCommandSubCommandData, newBaseMessageKey);
            }

            this.addNameAndDescriptionLocalizations(option, newBaseMessageKey);
        }
    }

    private addNameAndDescriptionLocalizations(object: { name_localizations?: LocalizationMap, description_localizations?: LocalizationMap } & Record<string, any>, baseMessageKey: string) {
        if (!object.name_localizations) {
            object.name_localizations = {};
        }

        if (!object.description_localizations) {
            object.description_localizations = {};
        }

        this.addLocalizations(object.name_localizations, (baseMessageKey + "-name") as Message);
        this.addLocalizations(object.description_localizations, (baseMessageKey + "-description") as Message);
    }

    private addLocalizations(localizationMap: LocalizationMap, messageKey: Message) {
        for (const language of this.languageManager.languages) {
            localizationMap[language as LocaleString] = this.languageManager.getMessageByLanguage(messageKey, language);
        }
    }
}