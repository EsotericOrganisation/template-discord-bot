import chalk from "chalk";
import {Event} from "../../../types";

export const warn: Event = {
	name: "warn",
	async execute(warning: string) {
		console.log(chalk.bold(chalk.yellow(`\n${warning}`)));
	},
};
