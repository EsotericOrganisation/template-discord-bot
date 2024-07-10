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

        const totalLatency = bot.ws.ping + messageCreationLatency;

        const languageManager = bot.languageManager;

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(languageManager.getMessageByDiscordUser(Message.Ping, interaction.user))
                    .setDescription(languageManager.getMessageByDiscordUser(Message.PingResult, interaction.user, interaction.createdTimestamp, message.createdTimestamp, messageCreationLatency, bot.ws.ping, totalLatency))
            ],
        });
    },
} as Command