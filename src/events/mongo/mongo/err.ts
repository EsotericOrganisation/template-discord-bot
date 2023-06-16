import chalk from "chalk";
import {Error} from "mongoose";
import {Event} from "../../../types";

export const err: Event = {
	name: "err",
	execute(err: Error) {
		console.log(
			chalk.cyan(
				`${chalk.bold(
					"[Database Status]",
				)} An error occurred with the database connection: \n${err}\n`,
			),
		);
	},
};
