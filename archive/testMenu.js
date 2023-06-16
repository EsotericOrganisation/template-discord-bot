module.exports = {
	data: {
		name: "testMenu",
	},
	async execute(interaction) {
		await interaction.reply({
			content: `You selected ${interaction.values[0]}`,
		});
	},
};
