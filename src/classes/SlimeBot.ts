import { Client, Collection, IntentsBitField, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import { Command } from "../types/commands/Command.js";
import { Button } from "../types/components/Button.js";
import { Menu } from "../types/components/Menu.js";
import { Modal } from "../types/components/Modal.js";
import { DiscordClientEvent } from "../types/events/DiscordClientEvent.js";
import { ProcessEvent } from "../types/events/ProcessEvent.js";
import { commandsFolderName, restVersion, commandsFolderPath, eventsFolderPath, eventsFolderName, componentsFolderPath, pathSeparator, processEventsFolderName, clientEventsFolderName, buttonsFolderName, menusFolderName, modalsFolderName, ascendDirectoryString, commandPrefix, componentsFolderName } from "../constants.js";
import { LanguageManager } from "./LanguageManager.js";
import { DataManager } from "./DataManager.js";
import { DiscordUserID } from "../types/user/DiscordUserID.js";

import chalk from "chalk";
import { BotConfiguration } from "../types/bot/BotConfiguration.js";

export class SlimeBot extends Client {

    readonly botToken: string;
    readonly discordBotClientID: DiscordUserID;
    adminDiscordUserIDs: DiscordUserID[] = [];

    commandArray: RESTPostAPIApplicationCommandsJSONBody[];
    commands: Collection<string, Command>;

    buttons: Collection<string, Button>;
    menus: Collection<string, Menu>;
    modals: Collection<string, Modal>;

    readonly dataManager: DataManager;
    readonly languageManager: LanguageManager;

    constructor(botConfiguration: BotConfiguration) {
        super({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers] });

        this.botToken = botConfiguration.discordBotToken;
        this.discordBotClientID = botConfiguration.discordBotClientID;
        this.adminDiscordUserIDs = botConfiguration.adminDiscordUserIDs;

        this.dataManager = new DataManager();
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
                        const event = (await import(ascendDirectoryString + pathSeparator + eventsFolderName + pathSeparator + eventSubfolder + pathSeparator + eventFile)).default as DiscordClientEvent;

                        if (event.once) {
                            this.once(event.name, async (...args) => await event.execute(this, ...args));
                        } else {
                            this.on(event.name, async (...args) => await event.execute(this, ...args));
                        }
                    }

                    break;
                case processEventsFolderName:
                    for (const eventFile of eventFiles) {
                        const event = (await import(ascendDirectoryString + pathSeparator + eventsFolderName + pathSeparator + eventSubfolder + pathSeparator + eventFile)).default as ProcessEvent;

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
            const command = (await import(ascendDirectoryString + pathSeparator + commandsFolderName + pathSeparator + file)).default as Command;

            console.log("Handling command " + chalk.bold(commandPrefix + command.data.name) + ".");

            this.commandArray.push(command.data.toJSON());
            this.commands.set(command.data.name, command);
        }

        await new REST({ version: restVersion })
            .setToken(this.botToken)
            .put(Routes.applicationCommands(this.user.id), { body: this.commandArray, });

        console.log(chalk.greenBright("Successfully handled " + chalk.bold(this.commandArray.length) + " command(s)."))
    };

    async handleComponents() {
        this.buttons = new Collection();
        this.menus = new Collection();
        this.modals = new Collection();

        const componentFolder = readdirSync(componentsFolderPath);

        for (const componentTypeFolder of componentFolder) {
            const componentType = readdirSync(componentsFolderPath + pathSeparator + componentTypeFolder);

            const relativeComponentFolderPath = ascendDirectoryString + pathSeparator + componentsFolderName;

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