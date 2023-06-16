import {SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {ErrorMessageBuilder} from "../../classes.js";
import {lcm, parseMath} from "../../functions.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("lcm")
		.setDescription("Finds the lowest common multiple of a set of numbers")
		.addStringOption((option) =>
			option
				.setName("numbers")
				.setDescription(
					"List of numbers of which the lowest common multiple should be found. Separate numbers with a comma.",
				)
				.setRequired(true),
		),
	usage: [
		"**/lcm** `numbers: list of numbers to find the lowest common multiple of`",
	],
	examples: ["**/lcm** `numbers: 1, 2, 3, 4, 5, 6, 7`"],
	async execute(interaction) {
		await interaction.deferReply({ephemeral: true});
		const numbers = interaction.options.getString("numbers", true);

		if (!parseInt(numbers.replace(/,/, ""))) {
			return interaction.editReply(
				new ErrorMessageBuilder(
					`Please input a list of valid integers!\n\n**Input:**\n> \`${numbers}\``,
				),
			);
		}

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle("🧮 Lowest Common Multiple")
					.setDescription(
						`> **LCM(${numbers})** = **${lcm(
							...numbers
								.split(",")
								.map((number) => parseFloat(parseMath(number))),
						)}**`,
					)
					.setColor("Green"),
			],
		});
	},
};
