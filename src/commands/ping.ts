import { inlineCode, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Command";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription("Pings the bot."),
    async execute(interaction, bot) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        const ping = bot.ws.ping + message.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply({
            content: `Pong! Latency: ${inlineCode(ping.toString())}`
        });
    },
} as Command