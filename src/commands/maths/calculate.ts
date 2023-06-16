import {SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {Parser} from "expr-eval";
import {ErrorMessageBuilder} from "../../classes.js";
import {parseMath, mathParse} from "../../functions.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("calculate")
		.setDescription(
			"Calculate a mathematical expression. Supports many different types of expressions.",
		)
		.addStringOption((option) =>
			option
				.setName("expression")
				.setDescription("The mathematical expression to calculate.")
				.setRequired(true),
		),
	usage: ["**/calculate** `expression: mathematical expression to calculate`"],
	examples: [
		"**/calculate** `expression: 2 + 2`",
		"**/calculate** `expression: sin(90)`",
	],
	async execute(interaction) {
		const input = interaction.options.getString("expression", true);
		const parsed = parseMath(input);

		try {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("🔢 Calculator")
						.setDescription(
							`> \`${mathParse(parsed)} = ${new Parser().evaluate(parsed)}\``,
						)
						.setColor("Green"),
				],
				ephemeral: true,
			});
		} catch (error) {
			await interaction.reply(
				new ErrorMessageBuilder(
					`Unable to understand the expression.\n\n**Input:**\n${input}\n\n**Error:**\n${error}`,
				),
			);
		}
	},
};
