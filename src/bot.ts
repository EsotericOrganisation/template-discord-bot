import dotenv from "dotenv";

dotenv.config();

import chalk from "chalk";
import {readFileSync, writeFileSync} from "fs";
const {token, databaseToken} = process.env;
import {connect} from "mongoose";
import {Client, Collection, GatewayIntentBits, Partials} from "discord.js";
import {forFolder, recurringFolders} from "./functions.js";
import {registerFont} from "canvas";
import {SlimeBotClient} from "./types.js";

const client: SlimeBotClient = new Client({
	intents: Object.keys(GatewayIntentBits),
	partials: Object.keys(Partials),
}) as SlimeBotClient;

const bot = JSON.parse(readFileSync("./data/bot.json").toString());

client.debug = bot.debug;
client.maintenance = bot.maintenance;
client.clearCommands = bot.clearCommands;

bot.debug = false;
bot.maintenance = false;
bot.clearCommands = false;

writeFileSync("./data/bot.json", JSON.stringify(bot));

await forFolder("functions", "magenta", (callback) => {
	callback(client);
});

client.handleEvents().catch(console.error);

client.commands = new Collection();

client.commandArray = [];

client.handleCommands().catch(console.error);

client.buttons = new Collection();

client.selectMenus = new Collection();

client.modals = new Collection();

client.handleComponents().catch(console.error);

let code: string | string[] = "";
recurringFolders("./src", (path: string) => {
	if (path.endsWith(".ts") || path.endsWith(".json"))
		code += readFileSync(path).toString();
});

recurringFolders("./data", (path: string) => {
	if (path.endsWith(".ts") || path.endsWith(".json"))
		code += readFileSync(path).toString();
});

code = code
	.split("\n")
	.map((line) => line.trim())
	.filter((line) => line && !line.startsWith("//") && !line.startsWith("*"));

console.log(
	chalk.red(
		`${chalk.bold("\n[Code]")} There have been a total of ${chalk.whiteBright(
			chalk.bold(new Intl.NumberFormat().format(code.length)),
		)} lines of code written! (${chalk.whiteBright(
			chalk.bold(new Intl.NumberFormat().format(code.join("").length)),
		)} characters).\n`,
	),
);

console.log(
	chalk.blue(
		`${chalk.bold("[Functions]")} Successfully loaded ${chalk.whiteBright(
			chalk.bold(Object.keys(await import("./functions.js")).length),
		)} functions.\n`,
	),
);

console.log(
	chalk.yellowBright(
		`${chalk.bold("[Classes]")} Successfully loaded ${chalk.whiteBright(
			chalk.bold(Object.keys(await import("./classes.js")).length),
		)} classes.\n`,
	),
);

client.login(token).catch(console.error);

if (!databaseToken) {
	console.log(
		chalk.redBright(
			`\n${chalk.bold("[Database]")} Invalid database token provided.\n`,
		),
	);
} else {
	(async () => {
		await connect(databaseToken).catch(console.error);
	})();
}

const fontArray = [
	"sans-serif",
	"serif",
	"monospace",
	"cursive",
	"fantasy",
	"Times New Roman",
	"Georgia",
	"Garamond",
	"Arial",
	"Verdana",
	"Helvetica",
	"Courier New",
	"Lucida Console",
	"Monaco",
	"Brush Script MT",
	"Lucida Handwriting",
	"Copperplate",
	"Papyrus",
];

await forFolder("../fonts", "redBright", (_font, path, fontName) => {
	const font = /[^.]+/.exec(fontName)?.[0];

	if (!font) {
		console.log(
			chalk.redBright(
				`\n${chalk.bold("[Fonts]")} Invalid Font Name: ${path}.\n`,
			),
		);
	} else {
		registerFont(path.replace(/^\.\/\./, ""), {
			family: font,
		});
		fontArray.push(font);
	}
});

export {fontArray, client};
