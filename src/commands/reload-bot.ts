import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/commands/Command.js";

export default {
    data: new SlashCommandBuilder()
        .setName("reload-bot")
        .setDescription("Reloads the bot settings, data and language information."),
    isBotAdminOnly: true,
    async execute(interaction, bot) {
        await interaction.deferReply({ fetchReply: true, ephemeral: true })

        await bot.reload();

        await interaction.editReply({ content: bot.languageManager.getMessageByDiscordUser("reloaded-bot-successfully", interaction.user) })
    },
} as Command;