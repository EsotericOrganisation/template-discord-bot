import {SlashCommandBuilder} from "discord.js";
import {FunctionMessageBuilder} from "../../classes.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("function")
		.setDescription(
			"Returns information and a graph of mathematical functions. Supports many different expressions.",
		)
		.addStringOption((option) =>
			option
				.setName("functions")
				.setDescription("The functions to calculate. f(x) = ..., g(x) = ...")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("x-center")
				.setDescription("The center of the coordinate system (x)."),
		)
		.addStringOption((option) =>
			option
				.setName("y-center")
				.setDescription("The center of the coordinate system (y)."),
		)
		.addStringOption((option) =>
			option.setName("x-step").setDescription("Step (x)."),
		)
		.addStringOption((option) =>
			option.setName("y-step").setDescription("Step (y)."),
		),
	usage: [
		"**/function** `functions: mathematical function(s)` `x-center: integer` `y-center: integer` `x-step: integer` `y-step: integer`",
	],
	examples: [
		"**/function** `functions: 2x² + 3x + 1` `x-center: 5` `y-center: 5`",
		"**/function** `functions: sin(x), cos(x)`",
	],
	async execute(interaction) {
		await interaction.deferReply();

		const functionMessage = new FunctionMessageBuilder();
		await functionMessage.create(interaction);

		await interaction.editReply(functionMessage);
	},
};
