import chalk from "chalk";
import {readFileSync, writeFileSync} from "fs";

console.log(
	chalk.redBright(`${chalk.bold("[Maintenance]")} Maintenance mode enabled.\n`),
);

const bot = JSON.parse(readFileSync("./data/bot.json").toString());

bot.maintenance = true;

writeFileSync("./data/bot.json", JSON.stringify(bot));

await import("../bot");
