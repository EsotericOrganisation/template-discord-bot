import {sleep} from "../functions";
import chalk from "chalk";
import Readline from "readline";

const readline = Readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

readline.question(
	chalk.bold("> Event name and arguments: "),
	async (string: string) => {
		await import("../bot");

		await sleep(1500);

		(await import("../bot")).client.emit(...string.trim().split(" "));
	},
);
