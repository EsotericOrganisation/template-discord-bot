import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/commands/Command.js";
import { Message } from "../enums/language/Message.js";

export default {
    data: new SlashCommandBuilder()
        .setName("stop-bot")
        .setDescription("Stops the current bot from running."),
    async execute(interaction, bot) {
        await interaction.reply({content: bot.languageManager.getMessageByDiscordUser(Message.StoppingBot, interaction.user), ephemeral: true});

        bot.stop();
    },
} as Command;