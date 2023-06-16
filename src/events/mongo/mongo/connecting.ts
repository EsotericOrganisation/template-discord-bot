import chalk from "chalk";
import {Event} from "../../../types";

export const connecting: Event = {
	name: "connecting",
	execute() {
		console.log(
			chalk.cyan(`\n${chalk.bold("[Database Status]")} Connecting...\n`),
		);
	},
};
