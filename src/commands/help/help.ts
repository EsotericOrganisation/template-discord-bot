import {SlashCommandBuilder} from "discord.js";
import {HelpMessageBuilder} from "../../classes.js";
import settings from "../../schemas/settings.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Shows important information about the bot."),
	usage: ["**/help**"],
	async execute(interaction, client) {
		const serverSettings = await settings.findOne({
			server: interaction.guild?.id,
		});

		await interaction.reply(
			new HelpMessageBuilder(interaction, client, serverSettings),
		);
	},
};
