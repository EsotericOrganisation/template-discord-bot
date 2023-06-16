import {SlashCommandBuilder} from "discord.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Mass delete messages."),
	usage: ["**/purge** `messages: number of messages to delete`"],
	async execute() {},
};
