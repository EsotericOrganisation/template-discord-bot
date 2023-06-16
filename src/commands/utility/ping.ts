import {Command} from "../../types";
import {SlashCommandBuilder, EmbedBuilder} from "discord.js";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Returns the bot ping and the API latency."),
	usage: ["**/ping**"],
	async execute(interaction, client) {
		const message = await interaction.deferReply({
			fetchReply: true,
			ephemeral: true,
		});

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Pong! 🏓")
					.setColor("Red")
					.setDescription(
						`> 🤖 **API Latency**: \`${
							client.ws.ping
						}\`\n> \n> 👤 **Client Ping**: \`${
							message.createdTimestamp - interaction.createdTimestamp
						}\``,
					),
			],
		});
	},
};
