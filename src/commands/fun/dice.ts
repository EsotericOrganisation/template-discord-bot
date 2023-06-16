import {
	SlashCommandBuilder,
	EmbedBuilder,
	ChatInputCommandInteraction,
} from "discord.js";
import {RNG} from "../../functions.js";

export default {
	data: new SlashCommandBuilder()
		.setName("dice")
		.setDescription("Roll some dice.")
		.addIntegerOption((option) =>
			option
				.setName("dice")
				.setDescription("How many dice should be rolled.")
				.setMinValue(1),
		)
		.addIntegerOption((option) =>
			option
				.setName("sides")
				.setDescription("The number of sides of the dice.")
				.setMinValue(1),
		),
	usage: [
		"**/dice**",
		"**/dice** `dice: number of dice`",
		"**/dice** `dice: number of dice` `sides: number of sides`",
	],
	examples: ["**/dice** `dice: 2`", "**/dice** `dice: 3` `sides: 12`"],
	async execute(interaction: ChatInputCommandInteraction) {
		const dice = interaction.options.getInteger("dice") ?? 1;
		const sides = interaction.options.getInteger("sides") ?? 6;
		const results = [];
		let result = 0;

		for (let i = 0; i < dice; i++) {
			results.push(RNG(1, sides));
			result += results[i];
		}

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`🎲 Rolled ${dice} Dice with ${sides} sides.`)
					.setDescription(
						`**Results:**\n> ${results.join(
							"\n> ",
						)}\n\n**Total Score:** ${result}`,
					)
					.setColor(0x18f1ee),
			],
			ephemeral: true,
		});
	},
};
