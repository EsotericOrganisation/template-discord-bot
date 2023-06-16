import {
	ChatInputCommandInteraction,
	Client,
	SlashCommandBuilder,
} from "discord.js";
import {CommandInformationMessage} from "../../classes.js";
import {commandArray} from "../../util.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("command")
		.setDescription("View information about a command.")
		.addStringOption((option) =>
			option
				.setName("command")
				.setDescription("The command to look up.")
				.setChoices(
					...commandArray.map((command) => ({name: command, value: command})),
				)
				.setRequired(true),
		),
	usage: ["**/command** `command: The command to look up`"],
	async execute(interaction: ChatInputCommandInteraction, client: Client) {
		await interaction.reply(
			new CommandInformationMessage(
				interaction.options.getString("command"),
				interaction,
				client,
			),
		);
	},
};
