import embedSchema from "../../schemas/embedSchema.js";
import {SlashCommandBuilder} from "discord.js";
import {EmbedsMessageBuilder} from "../../classes.js";
import {AutoCompleteCommand} from "../../types";

const command: AutoCompleteCommand = {
	data: new SlashCommandBuilder()
		.setName("embeds")
		.setDescription("View your embeds!")
		.addIntegerOption((option) =>
			option
				.setName("page")
				.setDescription("The page to view.")
				.setAutocomplete(true),
		),
	usage: ["**/embeds**", "**/embeds** `page: page number`"],
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused(true).value;

		const embedArray = await embedSchema.find({author: interaction.user.id});

		const pages = Math.ceil(embedArray.length / 25);

		const pagesArray = [];

		for (let i = 0; i < pages; i++) {
			pagesArray.push(i + 1);
		}

		await interaction.respond(
			pagesArray
				.filter((page) => new RegExp(focusedValue, "gi").test(`${page}`))
				.map((page) => ({name: `${page}`, value: `${page}`})),
		);
	},
	async execute(interaction, client) {
		const embedArray = await embedSchema.find({
			author: interaction.user.id,
		});

		const page = interaction.options.getInteger("page");

		await interaction.reply(
			new EmbedsMessageBuilder(
				embedArray,
				interaction,
				client,
				!page || page > Math.ceil(embedArray.length / 25) ? 1 : page,
			),
		);
	},
};

export default command;
