import { Client, Collection, IntentsBitField, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import { Command } from "../types/Command";

export class SlimeBot extends Client {

    botToken: string;

    commandArray: RESTPostAPIApplicationCommandsJSONBody[] = [];
    commands: Collection<string, Command> = new Collection();

    constructor(botToken: string) {
        super({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers] });

        this.botToken = botToken;
    }

    async run() {
        await this.login(this.botToken);

        await this.handleCommands();
    }

    async handleCommands() {
        const commandFolder = readdirSync("./dist/commands");

        for (const file of commandFolder) {
            const command = (await import(`../commands/${file}`)).default.default as Command;

            this.commandArray.push(command.data.toJSON());
            this.commands.set(command.data.name, command);
        }

        await new REST({ version: "10" })
            .setToken(this.botToken)
            .put(Routes.applicationCommands(this.user.id), { body: this.commandArray, });
    };
}