import {Event} from "../../../types";
import chalk from "chalk";

export const disconnected: Event = {
	name: "disconnected",
	execute() {
		console.log(
			chalk.red(`\n${chalk.bold("[Database Status]")} Disconnected.\n`),
		);
	},
};
