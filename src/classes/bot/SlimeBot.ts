import { Client, Collection, IntentsBitField, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
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
import { SlimeBotManager } from "./SlimeBotManager.js";

export class SlimeBot extends Client {

    public readonly botManager: SlimeBotManager;

    private readonly botToken: string;
    public readonly discordBotClientID: DiscordUserID;
    public adminDiscordUserIDs: DiscordUserID[] = [];

    public commandArray: RESTPostAPIApplicationCommandsJSONBody[];
    public commands: Collection<string, Command>;

    public buttons: Collection<string, Button>;
    public menus: Collection<string, Menu>;
    public modals: Collection<string, Modal>;

    public readonly dataManager: UserDataManager;
    public readonly languageManager: LanguageManager;

    constructor(botManager: SlimeBotManager, botConfiguration: BotConfiguration) {
        super({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers] });

        this.botManager = botManager;

        this.botToken = botConfiguration.discordBotToken;
        this.discordBotClientID = botConfiguration.discordBotClientID;
        this.adminDiscordUserIDs = botConfiguration.adminDiscordUserIDs;

        this.dataManager = new UserDataManager(this);
        this.languageManager = new LanguageManager(this);

        this.dataManager.load();
    }

    async run() {
        await this.login(this.botToken);

        await this.runHandlers();
    }

    stop() {
        this.dataManager.save();
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

            console.log("Handling command " + commandPrefix + command.data.name + ".");

            this.commandArray.push(command.data.toJSON());
            this.commands.set(command.data.name, command);
        }

        await new REST({ version: restVersion })
            .setToken(this.botToken)
            .put(Routes.applicationCommands(this.user.id), { body: this.commandArray, });

        console.log("Successfully handled " + this.commandArray.length + " command(s).");
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
        await this.runHandlers();

        const {languageManager, dataManager} = this;

        languageManager.loadLanguages();

        dataManager.save();
        dataManager.load();
    }
}