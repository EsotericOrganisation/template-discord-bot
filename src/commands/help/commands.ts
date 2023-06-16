import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	Client,
	Message,
	SlashCommandBuilder,
} from "discord.js";
import {
	CommandCategoriesMessageBuilder,
	CommandCategoryMessageBuilder,
} from "../../classes.js";
import {commandCategories} from "../../util.js";

export default {
	data: new SlashCommandBuilder()
		.setName("commands")
		.setDescription("Returns a list of commands.")
		.addStringOption((option) =>
			option
				.setName("category")
				.setDescription(
					"The category of commands to list. If unspecified, will return a message with all command categories.",
				)
				.setAutocomplete(true),
		),
	usage: ["**/commands**", "**/commands** `category: command category`"],
	examples: ["**/commands** `category: 📊 Utility`"],
	async autocomplete(interaction: AutocompleteInteraction) {
		const focusedValue = interaction.options.getFocused(true);

		await interaction.respond(
			commandCategories
				.filter((category) => category.startsWith(focusedValue.value))
				.map((category) => ({name: category, value: category})),
		);
	},
	async execute(
		interaction: ChatInputCommandInteraction,
		client: Client,
	): Promise<void | Message<boolean>> {
		const category = interaction.options
			.getString("category")
			?.match(/\w+$/)?.[0]
			?.toLowerCase();

		if (!category) {
			return await interaction.reply(
				new CommandCategoriesMessageBuilder(interaction, client),
			);
		}

		await interaction.reply(
			new CommandCategoryMessageBuilder(category, interaction, client),
		);
	},
};
