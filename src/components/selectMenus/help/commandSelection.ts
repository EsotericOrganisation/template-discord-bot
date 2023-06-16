import {CommandInformationMessage} from "../../../classes.js";

export default {
	data: {
		name: "commandSelection",
	},
	async execute(interaction, client) {
		const command = interaction.values[0];

		await interaction.deferUpdate();
		await interaction.message.edit(
			new CommandInformationMessage(command, interaction, client),
		);
	},
};
