import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlimeBot } from "../classes/SlimeBot";

export type Command = {
	data: SlashCommandBuilder;
	execute(interaction: ChatInputCommandInteraction, bot: SlimeBot): Promise<void>;
};