import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
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

        const messageCreationLatency = message.createdTimestamp - interaction.createdTimestamp;

        const totalPing = bot.ws.ping + messageCreationLatency;

        const languageManager = bot.languageManager;

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(languageManager.getMessageByDiscordUser(Message.Ping, interaction.user))
                    .setDescription(languageManager.getMessageByDiscordUser(Message.PingResult, interaction.user, interaction.createdTimestamp, message.createdTimestamp, messageCreationLatency, bot.ws.ping, totalPing))
            ],
        });
    },
} as Command