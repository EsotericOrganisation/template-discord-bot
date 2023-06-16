import {readdirSync, readFileSync} from "fs";
import {CommandCategoryMessageBuilder} from "../../../classes.js";

export default {
	data: {
		name: "embedInfoBack",
	},
	async execute(interaction, client) {
		const title = interaction.message.embeds[0].data.title;

		const command = title
			.match(/(?<=\/|^)[^/<:]+/)[0]
			.toLowerCase()
			.replace(/ /g, "");

		const commandCategories = readdirSync("./src/commands");

		let category;
		for (const commandCategory of commandCategories) {
			try {
				readFileSync(`./src/commands/${commandCategory}/${command}.js`);
				category = commandCategory;
				break;
			} catch (error) {}
		}

		await interaction.deferUpdate();
		await interaction.message.edit(
			new CommandCategoryMessageBuilder(category, interaction, client),
		);
	},
};
