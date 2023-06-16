import {HelpMessageBuilder} from "../../../classes.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {
		name: "help",
	},
	async execute(interaction, client) {
		const serverSettings = await settings.findOne({
			server: interaction.guild.id,
		});
		await interaction.deferUpdate();
		await interaction.message.edit(
			new HelpMessageBuilder(interaction, client, serverSettings),
		);
	},
};
