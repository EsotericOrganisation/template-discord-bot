import settings from "../../../schemas/settings.js";

export default {
	data: {
		name: "welcomePreview",
	},
	async execute(interaction) {
		const settingsData = await settings.findOne({server: interaction.guild.id});
	},
};
