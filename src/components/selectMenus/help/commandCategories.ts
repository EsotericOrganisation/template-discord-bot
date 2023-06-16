import {CommandCategoryMessageBuilder} from "../../../classes.js";

export default {
	data: {
		name: "commandCategories",
	},
	async execute(interaction, client) {
		const category = interaction.values[0];
		if (category === "search") {
			return require("../../buttons/help/commandSearch").execute(interaction);
		}
		const categoryName = category.match(/\w+$/)[0].toLowerCase();

		await interaction.deferUpdate();
		await interaction.message.edit(
			new CommandCategoryMessageBuilder(categoryName, interaction, client),
		);
	},
};
