const {
	SlashCommandBuilder,
	SelectMenuBuilder,
	ActionRowBuilder,
	SelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("menu")
		.setDescription("Returns a menu!"),
	async execute(interaction) {
		const menu = new SelectMenuBuilder()
			.setCustomId("testMenu")
			.setMinValues(1)
			.setMaxValues(1)
			.setOptions(
				new SelectMenuOptionBuilder({
					label: "option 1",
					value: "https:www.youtube.com",
				}),
				new SelectMenuOptionBuilder({
					label: "option 2",
					value: "Hello does this fix it",
				}),
			);

		await interaction.reply({
			components: [new ActionRowBuilder().addComponents(menu)],
		});
	},
};
