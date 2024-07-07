import { inlineCode, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Command.js";

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

        interaction.editReply({
            content: `Pong! Latency: ${inlineCode(totalPing.toString())}`
        });
    },
} as Command