import chalk from "chalk";
import {readdirSync, readFileSync} from "fs";

/**
 * Slime Bot Emojis.
 * @property {String} successEmoji A basic square green check mark emoji. ✅
 * @property {String} errorEmoji A basic square red cross emoji. ❌
 */
export const slimeBotEmojis = {
	successEmoji: "<:_:1055239977535021186> ",
	errorEmoji: "<:_:1055237991402053752> ",
};

/**
 * The emoji array for the poll command.
 */
export const emojiArray = [
	"1️⃣",
	"2️⃣",
	"3️⃣",
	"4️⃣",
	"5️⃣",
	"6️⃣",
	"7️⃣",
	"8️⃣",
	"9️⃣",
	"🔟",
];

/**
 * Array of exponent characters.
 */
export const powerArray = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];

export const reversePropertiesAndKeys = (object: {[key: string]: string}) => {
	for (const key in object) {
		object[object[key]] = key;
	}
};

/**
 * Map of superscript characters.
 */
export const superscriptMap: {[key: string]: string} = {
	"⁰": "0",
	"¹": "1",
	"²": "2",
	"³": "3",
	"⁴": "4",
	"⁵": "5",
	"⁶": "6",
	"⁷": "7",
	"⁸": "8",
	"⁹": "9",
	"ॱ": ".",
	"⁽": "(",
	"⁾": ")",
	"⁻": "-",
	"⁺": "+",
	"ᵉ": "e",
	"ˣ": "x",
};

reversePropertiesAndKeys(superscriptMap);

/**
 * Map of subscript characters.
 */
export const subscriptMap: {[key: string]: string} = {
	"₀": "0",
	"₁": "1",
	"₂": "2",
	"₃": "3",
	"₄": "4",
	"₅": "5",
	"₆": "6",
	"₇": "7",
	"₈": "8",
	"₉": "9",
	".": ".",
	"₍": "(",
	"₎": ")",
	"₊": "+",
	"₋": "-",
	"ₑ": "e",
	"ₓ": "x",
};

reversePropertiesAndKeys(subscriptMap);

/**
 * Array of rainbow colours.
 */
export const rainbowColourArray = [
	"#ff0033",
	"#ff6633",
	"#ffcc33",
	"#ffff66",
	"#ccff00",
	"#66ff66",
	"#aaf0d1",
	"#33ccff",
	"#0066ff",
	"#a950b0",
];

/**
 * Array of colours.
 */
export const colourArray = [
	"#ff0033",
	"#0066ff",
	"#66ff66",
	"#ffff66",
	"#111111",
];

/**
 * Emojis for different options for the poll command.
 */
export const optionEmojis: {[key: string]: string} = {
	yes: "👍",
	no: "👎",
};

/**
 * Array of command categories.
 */
export const commandCategories = readdirSync("./src/commands")
	.filter((category: string) => {
		if (
			readdirSync(`./src/commands/${category}`).filter((command: string) =>
				command.endsWith(".ts"),
			).length === 0
		) {
			return false;
		}
		let categorySettings: {disabled: boolean} = {disabled: false};

		try {
			categorySettings = JSON.parse(
				readFileSync(`./src/commands/${category}/settings.json`).toString(),
			);
		} catch (error) {}

		return !categorySettings.disabled;
	})
	.map((category: string) => {
		let categorySettings: {name: string} = {
			name: category[0].toUpperCase() + category.slice(1),
		};
		try {
			categorySettings = JSON.parse(
				readFileSync(`./src/commands/${category}/settings.json`).toString(),
			);
		} catch (error) {}

		return categorySettings.name;
	});

/**
 * Array of all enabled commands.
 */
export const commandArray = readdirSync("./src/commands")
	.filter((category: string) => {
		let settings: {disabled: boolean} = {disabled: false};
		try {
			settings = JSON.parse(
				readFileSync(`./src/commands/${category}/settings.json`).toString(),
			);
		} catch (error) {}

		return !settings.disabled;
	})
	.map((category: string) =>
		readdirSync(`./src/commands/${category}`)
			.filter((command: string) => command.endsWith(".ts"))
			.map((command: string) => {
				const string = /.+(?=\.ts)/.exec(command)?.[0];

				if (!string) {
					return console.log(
						chalk.redBright(
							`\n${chalk.bold(
								"[Commands]",
							)} Invalid command name: ${command}.\n`,
						),
					);
				} else {
					if (!/[A-Z]/.test(string)) return string;

					return string
						.replace(/([A-Z])/g, " $1")
						.split(" ")
						.map((word) => word[0].toUpperCase() + word.slice(1))
						.join(" ");
				}
			}),
	)
	.flat();

/**
 * Map of command names to their IDs.
 */

/*

export const commandIDMap: {[key: string]: string} = {};

const commandsCache = client.application?.commands.cache;

if (commandsCache) {
	for (let command of client.commandArray.map((command) => command.name)) {
		if (command) {
			const commandID = commandsCache.find(
				(cmd) => cmd.name === commandName,
			)?.id;

			commandIDMap[command] = commandID;
		}
	}
} else {
	console.log(
		`${chalk.red(chalk.bold("[Commands]:"))} Failed to get commands cache.`,
	);
}

*/

/**
 * List of button IDs of buttons that are public and don't require authorisation to use.
 */
export const publicButtons = ["verify"];

/**
 * List of select menu IDs of select menus that are public and don't require authorisation to use.
 */
export const publicMenus = [""];
