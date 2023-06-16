import {Interaction, SlimeBotClient} from "../../../types";
import {InteractionType} from "discord.js";
import fs from "fs";
import chalk from "chalk";
import {
	ErrorMessageBuilder,
	InteractionInformationMessageBuilder,
} from "../../../classes.js";
import {
	checkAuthorisation,
	capitaliseFirst,
	recurringFolders,
} from "../../../functions.js";
import {publicMenus, publicButtons} from "../../../util.js";

const errorResponse = async (error, interaction: Interaction) => {
	switch (error.rawError?.message) {
		default:
			console.error(error);
			try {
				interaction.editReply(new ErrorMessageBuilder(error));
			} catch (error) {}
	}
};

export default {
	name: "interactionCreate",
	async execute(interaction: Interaction, client: SlimeBotClient) {
		const time = Date.now();

		if (client.debug) {
			console.log(
				chalk
					.yellow(
						`${chalk.bold("[Debug]")} Received interaction type ${chalk.bold(
							InteractionType[interaction.type],
						)} ${chalk.bold(
							`(${interaction.commandName ?? interaction.customId})`,
						)} in guild ${chalk.bold(
							interaction.guild?.name,
						)} from user ${chalk.bold(interaction.user.username)} (ID: ${
							interaction.user.id
						}) (C:\\Users\\d\\Documents\\Slime-Bot${recurringFolders(
							"./src",
							() => {},
							(path: string) =>
								path.endsWith(
									`${capitaliseFirst(
										interaction.commandName ?? interaction.customId,
										true,
									).replace(/ /g, "")}.ts`,
								)
									? path.replace(/\.\/|\//g, "\\")
									: null,
						)})`,
					)
					.replace(/\s{2,}/g, " "),
			);
		}

		const botData = JSON.parse(fs.readFileSync("./data/bot.json").toString());
		if (
			!client.maintenance ||
			interaction.user.id === "500690028960284672" ||
			interaction.user.id === "525338742001500161"
		) {
			if (interaction.isChatInputCommand()) {
				const {commands} = client;
				const {commandName} = interaction;
				const command = commands.get(commandName);

				if (!command) {
					await interaction.reply(
						new ErrorMessageBuilder(
							"It seems like there is no code for this command.",
							true,
						),
					);
					return console.log(
						new InteractionInformationMessageBuilder(
							interaction,
							chalk.redBright(
								`❌ Received an interaction for an unknown command with the name of ${commandName}.`,
							),
						).text,
					);
				}

				try {
					await command.execute(interaction, client);
					botData.commandUsage[command.data.name] ??= [];
					botData.commandUsage[command.data.name].push({
						date: Date.now(),
						user: interaction.user.id,
					});
					fs.writeFileSync("./data/bot.json", JSON.stringify(botData));
				} catch (error) {
					errorResponse(error, interaction);
				}
			} else if (interaction.isButton()) {
				const {buttons} = client;
				const {customId} = interaction;
				const button = buttons.get(customId);

				if (!button) {
					await interaction.reply(
						new ErrorMessageBuilder(
							"It seems like there is no code for this button.\n\nThis may happen if you are using buttons on old messages as the custom ID might have changed since that point. Attempting to delete the message to avoid using this deprecated button.\n\n> If this is not the case or you think a different issue is causing this, please report it on [the support server](https://www.discord.gg/kzFDGCK7sD).",
						),
					);
					console.log(
						new InteractionInformationMessageBuilder(
							interaction,
							chalk.redBright(
								`❌ Received an interaction for an unknown button with the custom ID of ${customId}. Attempting to delete the interaction message.`,
							),
						).text,
					);
					try {
						await interaction.message.delete();
						return console.log(
							chalk.greenBright(
								"\nSuccessfully deleted the interaction message.\n",
							),
						);
					} catch (error) {
						return console.log(
							chalk.redBright("\nFailed to delete the interaction message.\n"),
						);
					}
				}

				if (
					!publicButtons.includes(customId) &&
					!checkAuthorisation(interaction)
				) {
					try {
						return await interaction.reply(
							new ErrorMessageBuilder("This is not your menu!", true),
						);
					} catch (error) {
						errorResponse(error, interaction);
					}
				}

				try {
					await button.execute(interaction, client);
				} catch (error) {
					errorResponse(error, interaction);
				}
			} else if (interaction.isStringSelectMenu()) {
				const {selectMenus} = client;
				const {customId} = interaction;
				const menu = selectMenus.get(customId);

				if (!menu) {
					await interaction.reply(
						new ErrorMessageBuilder(
							"It seems like there is no code for this select menu.\n\nThis may happen if you are using select menus on old messages as the custom ID might have changed since that point. Attempting to delete the message to avoid using this deprecated select menu.\n\n> If this is not the case or you think a different issue is causing this, please report it on [the support server](https://www.discord.gg/kzFDGCK7sD).",
						),
					);
					console.log(
						new InteractionInformationMessageBuilder(
							interaction,
							chalk.redBright(
								`❌ Received an interaction for an unknown select menu with the custom ID of ${customId}. Attempting to delete the interaction message.`,
							),
						).text,
					);
					try {
						await interaction.message.delete();
						return console.log(
							chalk.greenBright(
								"\nSuccessfully deleted the interaction message.\n\n",
							),
						);
					} catch (error) {
						return console.log(
							chalk.redBright("\nFailed to delete the interaction message\n"),
						);
					}
				}

				if (
					!publicMenus.includes(customId) &&
					!checkAuthorisation(interaction)
				) {
					try {
						return await interaction.reply(
							new ErrorMessageBuilder("This is not your menu!", true),
						);
					} catch (error) {
						errorResponse(error, interaction);
					}
				}

				try {
					await menu.execute(interaction, client);
				} catch (error) {
					errorResponse(error, interaction);
				}
			} else if (interaction.type === InteractionType.ModalSubmit) {
				const {modals} = client;
				const {customId} = interaction;
				const modal = modals.get(customId);
				if (!modal) {
					await interaction.reply(
						new ErrorMessageBuilder(
							"It seems like there is no code for this modal.",
							true,
						),
					);
					return console.log(
						new InteractionInformationMessageBuilder(
							interaction,
							chalk.redBright(
								`❌ Received an interaction for an unknown modal with the custom ID of ${customId}.`,
							),
						).text,
					);
				}

				try {
					await modal.execute(interaction, client);
				} catch (error) {
					errorResponse(error, interaction);
				}
			} else if (interaction.isContextMenuCommand()) {
				const {commands} = client;
				const {commandName} = interaction;
				const contextCommand = commands.get(commandName);
				if (!contextCommand) {
					await interaction.reply(
						new ErrorMessageBuilder(
							"It seems like there is no code for this context menu command.",
							true,
						),
					);
					return console.log(
						new InteractionInformationMessageBuilder(
							interaction,
							chalk.redBright(
								`❌ Received an interaction for an unknown context menu command with the name of ${commandName}.`,
							),
						).text,
					);
				}

				try {
					await contextCommand.execute(interaction, client);
				} catch (error) {
					errorResponse(error, interaction);
				}
			} else if (
				interaction.type === InteractionType.ApplicationCommandAutocomplete
			) {
				const {commands} = client;
				const {commandName} = interaction;
				const command = commands.get(commandName);
				if (!command) {
					await interaction.reply(
						new ErrorMessageBuilder(
							"It seems like there is no code for this autocomplete command.",
							true,
						),
					);
					return console.log(
						new InteractionInformationMessageBuilder(
							interaction,
							chalk.redBright(
								`❌ Received an interaction for an unknown autocomplete command with the name of ${commandName}.`,
							),
						).text,
					);
				}

				try {
					await command.autocomplete(interaction, client);
				} catch (error) {
					errorResponse(error, interaction);
				}
			}
		} else {
			await interaction.reply(
				new ErrorMessageBuilder(
					"The bot is currently in maintenance mode. Please try again later.",
					true,
				),
			);
		}

		console.log(
			chalk.yellow(
				`${chalk.bold("[Debug]")} Took ${chalk.bold(
					`${Date.now() - time} milliseconds (${new Intl.NumberFormat().format(
						(Date.now() - time) / 1000,
					)} seconds)`,
				)} to execute interaction ${chalk.bold(
					interaction.commandName ?? interaction.customId,
				)}.`,
			),
		);
	},
};
