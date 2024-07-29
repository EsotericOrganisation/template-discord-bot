import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Bot } from "../../classes/bot/Bot.js";

export type Command = {
	readonly data: SlashCommandBuilder;
	readonly isBotAdminOnly?: boolean;
	execute(interaction: ChatInputCommandInteraction, bot?: Bot): Promise<void>;
};