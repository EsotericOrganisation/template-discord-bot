module.exports = {
	data: {
		name: "test",
	},
	async execute(interaction) {
		await interaction.reply({
			content: "https://www.youtube.com",
		});
	},
};
