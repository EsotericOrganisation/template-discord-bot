import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/commands/Command.js";
import { Message } from "../enums/language/Message.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pings the bot. Returns information about the bot's latency."),
    async execute(interaction, bot) {
        const message = await interaction.deferReply({
            fetchReply: true,
            ephemeral: true
        });

        const messageCreationLatency = message.createdTimestamp - interaction.createdTimestamp;
        const wsPing = Math.max(bot.ws.ping, 0);
        const totalLatency = wsPing + messageCreationLatency;
        const languageManager = bot.languageManager;

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(languageManager.getMessageByDiscordUser("ping", interaction.user))
                    .setDescription(languageManager.getMessageByDiscordUser("pingResult", interaction.user, interaction.createdTimestamp, message.createdTimestamp, messageCreationLatency, wsPing, totalLatency))
            ],
        });
    },
} as Command