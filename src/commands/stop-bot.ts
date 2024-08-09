import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/commands/Command.js";
import { Message } from "../enums/language/Message.js";

export default {
    data: new SlashCommandBuilder()
        .setName("stop-bot")
        .setDescription("Stops the current bot from running.")
        .addBooleanOption((option) => option.setName("permanently").setDescription("Whether the bot should be stopped permanently.")),
    async execute(interaction, bot) {
        const isPermanentStop = interaction.options.getBoolean("permanently") ?? false;

        await interaction.reply({content: bot.languageManager.getMessageByDiscordUser("stopping-bot", interaction.user), ephemeral: true});

        await bot.stop(isPermanentStop);
    },
} as Command;