import {SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {randomise} from "../../functions.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("choose")
		.setDescription("Chooses a random item from a list of items.")
		.addStringOption((option) =>
			option
				.setName("list")
				.setDescription("The list of items to pick a random item from.")
				.setRequired(true),
		),
	usage: ["**/choose** `list: list of items to pick from`"],
	examples: ["**/choose** `list: Play Minecraft, Go to bed`"],
	async execute(interaction) {
		const inputArray = interaction.options.getString("list", true).split(",");

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`🎲 Chose a Random Item From ${inputArray.length} Items`)
					.setDescription(
						`⏩ **input:**\n> ${inputArray.join(
							"\n>",
						)}\n\n🎰 **Chosen Item:**\n> ${randomise(...inputArray)[0]}`,
					)
					.setColor(0x18f1ee),
			],
			ephemeral: true,
		});
	},
};
