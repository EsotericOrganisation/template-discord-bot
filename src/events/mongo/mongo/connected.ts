import chalk from "chalk";
import {Event} from "../../../types";

export const connected: Event = {
	name: "connected",
	execute() {
		console.log(
			chalk.green(`\n${chalk.bold("[Database Status]")} Connected.\n`),
		);
	},
};
