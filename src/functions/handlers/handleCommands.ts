import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import fs from "fs";
import chalk from "chalk";
import {forFolder, wordNumberEnding} from "../../functions.js";
import {SlimeBotClient} from "../../types.js";
import AsciiTable from "ascii-table";

export const handleCommands = (client: SlimeBotClient) => {
	client.handleCommands = async () => {
		const commandFolders = fs.readdirSync("./dist/commands");

		console.log(
			chalk.whiteBright(
				`${chalk.bold("[Commands]")} Started ${
					client.clearCommands ? "clearing" : "refreshing"
				} ${chalk.bold(
					commandFolders.length,
				)} application [/] command folder${wordNumberEnding(
					commandFolders.length,
				)}.\n`,
			),
		);

		const {commands, commandArray} = client;

		const rest = new REST({version: "9"}).setToken(process.env.token as string);

		const table = new AsciiTable("Application Commands")
			.setHeading()
			.setHeading("", "Command", "Status");

		forFolder(
			"commands",
			"whiteBright",
			(command, _path, _string, index) => {
				commands.set(command.data.name, command);
				commandArray.push(command.data.toJSON());
				table.addRow(index + 1, command.data.name, "✅ Loaded");
			},
			async () => {
				try {
					Array.from(commands.keys()).forEach((command, index) => {
						if (Array.from(commands.keys()).indexOf(command) !== index) {
							console.log(
								chalk.bold(chalk.red("[Commands]: ")),
								`Duplicate command names: ${chalk.bold(command)}`,
							);
						}
					});

					console.log(table.toString());

					client.commandArray = client.commandArray.filter(
						(command, index) =>
							client.commandArray
								.map((command) => command.name)
								.indexOf(command.name) === index,
					);

					await rest.put(
						Routes.applicationCommands(process.env.clientID as string),
						{
							body: client.clearCommands ? [] : client.commandArray,
						},
					);
				} catch (error) {
					console.error(error);
				}
			},
			client,
		);
	};
};
