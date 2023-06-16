import chalk from "chalk";
import {Event, SlimeBotClient} from "../../../types";

export const debug: Event = {
	name: "debug",
	async execute(message: string, client: SlimeBotClient) {
		if (client.debug)
			console.log(
				chalk.yellowBright(
					chalk.bold(/^\[.+\]/.exec(message)?.[0] ?? "") +
						(/[^\]]+$/.exec(message)?.[0] ?? message),
				),
			);
	},
};
