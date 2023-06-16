const {SlashCommandBuilder} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("autocomplete")
		.setDescription("Returns an autocomplete command!")
		.addStringOption((option) =>
			option
				.setName("colour")
				.setDescription("A colour based on autocomplete")
				.setAutocomplete(true)
				.setRequired(true),
		),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused(true);
		const choices = [
			"red",
			"orange",
			"yellow",
			"green",
			"light blue",
			"blue",
			"purple",
		];
		const filtered = choices.filter((choice) =>
			choice.startsWith(focusedValue.value),
		);
		await interaction.respond(
			filtered.map((choice) => ({name: choice, value: choice})),
		);
	},
	async execute(interaction) {
		const option = interaction.options.getString("colour");
		await interaction.reply({
			content: `You told me, "${option}"`,
		});
	},
};
