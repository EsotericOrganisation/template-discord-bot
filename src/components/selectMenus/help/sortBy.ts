import {CommandCategoryMessageBuilder} from "../../../classes.js";

export default {
	data: {
		name: "sortBy",
	},
	async execute(interaction, client) {
		const sort = interaction.values[0];

		const {title, description} = interaction.message.embeds[0].data;

		let category;
		let search;

		if (/Showing results/.test(title)) {
			category = description
				.match(
					/((?<=\*\*)(?<!`)[^\n<`]+(?!`)(?=\*\*))|((?<=\*\*<\/)(?<!`)[^\n]+(?=:))/g,
				)
				.map((command) => {
					return command.match(/[^/]+/)[0].replace(/ /g, "").toLowerCase();
				});

			search = title.match(/(?<=Commands - 🔎 Showing results for ").+(?="$)/);
		} else {
			category = title.match(/\w+$/)[0].replace(/ /g, "").toLowerCase();
		}

		await interaction.deferUpdate();
		await interaction.message.edit(
			new CommandCategoryMessageBuilder(
				category,
				interaction,
				client,
				search,
				sort,
			),
		);
	},
};
