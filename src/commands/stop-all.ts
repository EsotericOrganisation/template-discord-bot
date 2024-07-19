import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/commands/Command.js";
import { Message } from "../enums/language/Message.js";

export default {
    data: new SlashCommandBuilder()
        .setName("stop-all")
        .setDescription("Stops all bots currently running."),
    async execute(interaction, bot) {
        await interaction.reply({content: bot.languageManager.getMessageByDiscordUser(Message.StoppingAllBots, interaction.user), ephemeral: true});

        const botManager = bot.botManager;
        for (const [, bot] of botManager.slimeBots) {
            bot.stop();
        }
    },
} as Command;