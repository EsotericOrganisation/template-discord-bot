import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Command.js";
import { Message } from "../enums/Message.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pings the bot."),
    async execute(interaction, bot) {
        const message = await interaction.deferReply({
            fetchReply: true,
            ephemeral: true
        });

        const messageCreationPing = message.createdTimestamp - interaction.createdTimestamp;

        const totalPing = bot.ws.ping + messageCreationPing;

        const languageManager = bot.languageManager;

        interaction.editReply({
            content: languageManager.getMessageByDiscordUser(Message.Ping, interaction.user, totalPing.toString())
        });
    },
} as Command