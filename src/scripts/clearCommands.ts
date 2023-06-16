import chalk from "chalk";
import {writeFileSync, readFileSync} from "fs";

console.log(
	chalk.whiteBright(`${chalk.bold("[Commands]")} Started clearing commands.\n`),
);

const bot = JSON.parse(readFileSync("./data/bot.json").toString());
bot.clearCommands = true;

writeFileSync("./data/bot.json", JSON.stringify(bot));

await import("../bot");
