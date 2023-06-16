import {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import {RNG} from "../../functions.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("rng")
		.setDescription("Returns a random number between two numbers provided.")
		.addStringOption((option) =>
			option
				.setName("number-one")
				.setDescription("The first number inclusive.")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("number-two")
				.setDescription("The second number inclusive.")
				.setRequired(true),
		)
		.addBooleanOption((option) =>
			option
				.setName("decimal")
				.setDescription(
					"Whether the command should consider decimal values when returning a random number.",
				),
		),
	usage: [
		"**/rng** `number-one: number` `number-two: number`",
		"**/rng** `number-one: number` `number-two: number` `decimal: True`",
	],
	examples: [
		"**/rng** `number-one: 0` `number-two: 10`",
		"**/rng** `number-one: 10` `number-two: 20` `decimal: True`",
	],
	async execute(interaction) {
		const num1 = parseFloat(interaction.options.getString("number-one", true));
		const num2 = parseFloat(interaction.options.getString("number-two", true));

		const min = Math.min(num1, num2);
		const max = Math.max(num1, num2);

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`🎲 RNG(${min}, ${max})`)
					.setDescription(
						`> RNG(${min}, ${max}) = ${RNG(
							max,
							min,
							interaction.options.getBoolean("decimal"),
						)}`,
					)
					.setColor("Transparent"),
			],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setEmoji("🎲")
						.setLabel("Generate more")
						.setStyle(ButtonStyle.Secondary)
						.setCustomId("rng"),
				),
			],
		});
	},
};
