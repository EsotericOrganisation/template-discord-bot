import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlimeBot } from "../classes/SlimeBot.js";

export type Command = {
	readonly data: SlashCommandBuilder;
	execute(interaction: ChatInputCommandInteraction, bot?: SlimeBot): Promise<void>;
};