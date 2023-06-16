import {SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {ErrorMessageBuilder} from "../../classes.js";
import {HCF, parseMath} from "../../functions.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("hcf")
		.setDescription("Finds the highest common factor of a set of numbers")
		.addStringOption((option) =>
			option
				.setName("numbers")
				.setDescription(
					"List of numbers of which the highest common factor should be found. Separate numbers with a comma.",
				)
				.setRequired(true),
		),
	usage: [
		"**/hcf** `numbers: list of numbers to find the highest common factor of`",
	],
	examples: ["**/hcf** `numbers: 12, 6, 4, 8`"],
	async execute(interaction) {
		const numbers = interaction.options.getString("numbers", true);

		if (!parseInt(numbers.replace(/,/, ""))) {
			return interaction.reply(
				new ErrorMessageBuilder(
					`Please input a list of valid integers!\n\n**Input:**\n> \`${numbers}\``,
				),
			);
		}

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("🧮 Highest Common Factor")
					.setDescription(
						`> **HCF(${numbers})** = **${HCF(
							...numbers
								.split(",")
								.map((number) => parseFloat(parseMath(number))),
						)}**`,
					)
					.setColor("Green"),
			],
			ephemeral: true,
		});
	},
};
