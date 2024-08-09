import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/commands/Command.js";
import { Message } from "../enums/language/Message.js";
import { configFilePath } from "../constants.js";

export default {
    data: new SlashCommandBuilder()
        .setName("reload-all")
        .setDescription("Reloads the bot manager as well as all running bots."),
    isBotAdminOnly: true,
    async execute(interaction, bot) {
        await interaction.deferReply({ fetchReply: true, ephemeral: true })

        const botManager = bot.botManager;
        await botManager.reload(configFilePath);

        await interaction.editReply({ content: bot.languageManager.getMessageByDiscordUser("reloaded-all-bots-successfully", interaction.user) })
    },
} as Command;