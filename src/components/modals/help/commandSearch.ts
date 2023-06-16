import {CommandCategoryMessageBuilder} from "../../../classes.js";

export default {
	data: {
		name: "commandSearch",
	},
	async execute(interaction, client) {
		const input = interaction.fields.getTextInputValue("command");
		const resultArray = [];

		for (const command of client.commandArray) {
			if (new RegExp(input, "gi").test(command.name)) {
				resultArray.push(command);
			}
		}

		await interaction.message.edit(
			new CommandCategoryMessageBuilder(
				resultArray.map((command) => command.name),
				interaction,
				client,
				input,
			),
		);
		await interaction.deferUpdate();
	},
};
