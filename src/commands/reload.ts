import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Command.js";
import { Message } from "../enums/Message.js";

export default {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reloads the bot settings, data and language information."),
    isBotAdminOnly: true,
    async execute(interaction, bot) {
        await interaction.deferReply({ fetchReply: true, ephemeral: true })

        await bot.reload();

        await interaction.editReply({ content: bot.languageManager.getMessageByDiscordUser(Message.ReloadedSuccessfully, interaction.user) })
    },
} as Command;