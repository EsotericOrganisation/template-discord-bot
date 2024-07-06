import { Client, IntentsBitField } from "discord.js";

export class SlimeBot extends Client {

    botToken: string;

    constructor(botToken: string) {
        super({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers] });

        this.botToken = botToken;
    }

    override login() {
        return super.login(this.botToken);
    }
}