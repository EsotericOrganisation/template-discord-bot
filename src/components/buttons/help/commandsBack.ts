import {CommandCategoriesMessageBuilder} from "../../../classes.js";

export default {
	data: {
		name: "commandsBack",
	},
	async execute(interaction, client) {
		await interaction.deferUpdate();

		await interaction.message.edit(
			new CommandCategoriesMessageBuilder(interaction, client),
		);
	},
};
