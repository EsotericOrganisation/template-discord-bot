import chalk from "chalk";
import {Event} from "../../../types";

export const shardError: Event = {
	name: "shardError",
	async execute(error) {
		console.error(
			chalk.red(
				`${chalk.bold(
					"A websocket connection encountered an error:",
				)} ${error}\n`,
			),
		);
	},
};
