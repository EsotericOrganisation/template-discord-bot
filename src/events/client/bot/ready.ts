import {SlimeBotClient} from "../../../types";
import {ActivityType} from "discord.js";
import chalk from "chalk";
import {wordNumberEnding} from "../../../functions.js";

export const event = {
	name: "ready",
	once: true,
	async execute(client: SlimeBotClient) {
		if (client.clearCommands) {
			console.log(
				chalk.whiteBright(
					`${chalk.bold(
						"[Commands]",
					)} Successfully cleared application [/] commands. Exiting process.\n`,
				),
			);

			process.exit(0);
		}

		console.log(
			chalk.whiteBright(
				`\n${chalk.bold("[Client]")} Ready! ${chalk.bold(
					chalk.green(client.user?.username),
				)} is logged in and online.\n`,
			),
		);

		console.log(
			chalk.whiteBright(
				`${chalk.bold("[Client]")} Currently in ${chalk.bold(
					client.guilds.cache.size,
				)} guild${wordNumberEnding(client.guilds.cache.size)}.\n`,
			),
		);

		client.user?.setPresence({
			activities: [
				{name: "on The Slimy Swamp", type: ActivityType.Playing},
				{name: "you", type: ActivityType.Watching},
				{name: "to your conversations", type: ActivityType.Listening},
			],
			status: "online",
		});

		setInterval(client.checkTemp, 60000);
		setInterval(client.checkVideos, 60000);
	},
};
