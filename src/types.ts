import {
	AnySelectMenuInteraction,
	AutocompleteInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	Client,
	Collection,
	ContextMenuCommandBuilder,
	MessageContextMenuCommandInteraction,
	ModalSubmitInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	UserContextMenuCommandInteraction,
} from "discord.js";

export type Command = {
	data:
		| SlashCommandSubcommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	description?: string;
	usage: string[];
	examples?: string[];
	execute: (
		interaction: ChatInputCommandInteraction,
		client: Client,
	) => Promise<unknown>;
};

export type AutoCompleteCommand = {
	data:
		| SlashCommandSubcommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	description?: string;
	usage: string[];
	examples: string[];
	autocomplete: (
		interaction: AutocompleteInteraction,
		client: Client,
	) => Promise<unknown>;
	execute: (
		interaction: ChatInputCommandInteraction,
		client: Client,
	) => Promise<unknown>;
};

export type MessageContextMenuCommand = {
	data: ContextMenuCommandBuilder;
	description: string;
	usage: string[];
	execute: (
		interaction: MessageContextMenuCommandInteraction,
		client: Client,
	) => Promise<unknown>;
};

export type UserContextMenuCommand = {
	data: ContextMenuCommandBuilder;
	description: string;
	usage: string[];
	execute: (
		interaction: UserContextMenuCommandInteraction,
		client: Client,
	) => Promise<unknown>;
};

export type ContextMenuCommand =
	| UserContextMenuCommand
	| MessageContextMenuCommand;

export type AnyCommand = Command | AutoCompleteCommand | ContextMenuCommand;

export type AnyCommandData =
	| SlashCommandSubcommandBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
	| ContextMenuCommandBuilder;

export type Button = {
	data: {name: string};
	execute: (interaction: ButtonInteraction, client: Client) => Promise<void>;
};

export type Modal = {
	data: {name: string};
	execute: (
		interaction: ModalSubmitInteraction,
		client: Client,
	) => Promise<void>;
};

export type SelectMenu = {
	data: {name: string};
	execute: (
		interaction: AnySelectMenuInteraction,
		client: Client,
	) => Promise<void>;
};

export type Event = {
	name: string;
	once?: boolean;
	execute: (...args: unknown[]) => Promise<void> | void;
};

export type ContextMenuInteraction =
	| UserContextMenuCommandInteraction
	| MessageContextMenuCommandInteraction;

export type Interaction =
	| ChatInputCommandInteraction
	| AutocompleteInteraction
	| ContextMenuInteraction
	| ButtonInteraction
	| AnySelectMenuInteraction
	| ModalSubmitInteraction;

export type SlimeBotClient = Client & {
	commands: Collection<
		string,
		Command | AutoCompleteCommand | ContextMenuCommand
	>;
	commandArray: AnyCommandData[];
	buttons: Collection<string, Button>;
	selectMenus: Collection<string, SelectMenu>;
	modals: Collection<string, Modal>;
	handleEvents: () => Promise<void>;
	handleCommands: () => Promise<void>;
	handleComponents: () => Promise<void>;
	checkTemp: () => Promise<void>;
	checkVideos: () => Promise<void>;
	debug: boolean;
	maintenance: boolean;
	clearCommands: boolean;
};
