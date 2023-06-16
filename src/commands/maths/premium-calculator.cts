import {SlashCommandBuilder} from "discord.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("premium-calculator")
		.setDescription("Calculate an insurance premium."),
	usage: ["**/premium-calculator**"],
	async execute(interaction) {},
};
