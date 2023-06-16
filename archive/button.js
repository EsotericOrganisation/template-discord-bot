const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("button")
		.setDescription("No idea what this command does"),
	async execute(interaction) {
		const button = new ButtonBuilder()
			.setCustomId("test")
			.setLabel("test")
			.setStyle(ButtonStyle.Primary);

		await interaction.reply({
			components: [new ActionRowBuilder().addComponents(button)],
		});
	},
};
