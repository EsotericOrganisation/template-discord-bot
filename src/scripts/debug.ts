import {readFileSync, writeFileSync} from "fs";

import chalk from "chalk";

console.log(
	chalk.yellow(`${chalk.bold("[Debug]")} Successfully enabled debug mode.\n`),
);

const bot = JSON.parse(readFileSync("./data/bot.json").toString());

bot.debug = true;

writeFileSync("./data/bot.json", JSON.stringify(bot));

await import("../bot");
