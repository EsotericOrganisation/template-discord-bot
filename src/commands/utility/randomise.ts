import {SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {randomise} from "../../functions.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("randomise")
		.setDescription("Randomises a list of items.")
		.addStringOption((option) =>
			option
				.setName("list")
				.setDescription(
					"List of items to randomise. Separate items with commas.",
				)
				.setRequired(true),
		),
	usage: ["**/randomise** `list: list of items to randomise`"],
	examples: [
		"**/randomise** `list: maths homework, english homework, biology homework`",
	],
	async execute(interaction) {
		const inputArray = interaction.options.getString("list", true).split(",");

		await interaction.reply({
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle(`🎲 Randomised ${inputArray.length} Items`)
					.setDescription(
						`⏩ **Input:**\n> ${inputArray.join(
							"\n> ",
						)}\n\n🎰 **Randomised Items:**\n> ${randomise(...inputArray).join(
							"\n> ",
						)}`,
					)
					.setColor("Green"),
			],
		});
	},
};
