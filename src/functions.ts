import chalk from "chalk";
import {
	PermissionsBitField,
	Guild,
	Client,
	GuildMember,
	GuildChannel,
	ModalSubmitInteraction,
	ButtonInteraction,
	AnySelectMenuInteraction,
} from "discord.js";
import {readdirSync, readFileSync} from "fs";
import {powerArray, superscriptMap, subscriptMap} from "./util.js";
import {Parser} from "expr-eval";
import {Configuration, OpenAIApi} from "openai";
import Decimal from "decimal.js";

const standardLog = console.log.bind(console);
const consoleLogs: unknown[][] = [];

console.log = (...args: unknown[]) => {
	consoleLogs.push(args);

	const previousLog =
		consoleLogs[consoleLogs.length - 2]?.[
			consoleLogs[consoleLogs.length - 2]?.length - 1
		] ?? "";

	standardLog(
		...(args ?? []).map((argument) =>
			/[\s\S]+\\n[\s\S]{0,31}$/.test(
				typeof previousLog === "string"
					? JSON.stringify(previousLog)
					: previousLog,
			) || !(consoleLogs.length - 1)
				? typeof argument === "string"
					? argument.replace(/^([\s\S]{0,23})\n/, "$1")
					: argument
				: argument,
		),
	);
};

/**
 * A function that compares two elements more precisely than a simple equality operator.
 * @param {any} a The first element to compare.
 * @param {any} b The second element to compare.
 * @return {boolean} Whether the two elements are equal.
 * @example
 * console.log(areEqual({foo: "bar"}, {foo: "bar"}));
 * => true;
 */
export const areEqual = (a: any, b: any): boolean => {
	if (typeof a !== typeof b) return false;

	if (Array.isArray(a)) {
		return areEqualArrays(a, b);
	}

	if (typeof a === "object") {
		return areEqualObjects(a, b);
	}

	return a === b;
};

/**
 * A function that compares whether two objects are exactly equal taking into account all the properties.
 * @param {object} a The first object to compare.
 * @param {object} b The second object to compare.
 * @returns {boolean} Whether the two objects are equal.
 * @example
 * console.log(areEqualObjects({name: "John"}, {name: "John"}));
 *
 * => true;
 */
export const areEqualObjects = (
	a: {[key: string]: any},
	b: {[key: string]: any},
): boolean => {
	for (const key in a) {
		if (!areEqual(a[key], b[key])) return false;
	}

	for (const key in b) {
		if (!areEqual(a[key], b[key])) return false;
	}

	return true;
};

/**
 * A function that compares whether two arrays are exactly equal taking into account all their elements.
 * @param {any[]} a The first array to compare.
 * @param {any[]} b The second object to compare.
 * @returns {boolean} Whether the two arrays are equal.
 * @example
 * console.log(areEqualArrays([1,2,3], [1,2,3]));
 *
 * => true;
 */
export const areEqualArrays = (a: any[], b: any[]): boolean => {
	for (let i = 0; i < a.length; i++) {
		if (!areEqual(a[i], b[i])) return false;
	}

	for (let i = 0; i < b.length; i++) {
		if (!areEqual(a[i], b[i])) return false;
	}

	return true;
};

/**
 * A better version of Array.prototype.includes. This function also works for objects and arrays.
 * @param {any[]} array The array to find the element of.
 * @param {any} element The element to search for.
 * @param {number?} startIndex The index to begin searching from.
 * @returns {boolean} Whether the element is contained in the array.
 * @example
 * console.log(includes([{name: "foo"}], {name: "foo"}));
 * => true;
 */
export const includes = (
	array: any[],
	element: any,
	startIndex?: number,
): boolean => {
	array = Array.from(array);

	for (let i = startIndex ?? 0; i < array.length; i++) {
		if (areEqual(array[i], element)) return true;
	}

	return false;
};

/**
 * Loops over an array and returns the sum of it.
 * @param {number[]} array Array of numbers to sum
 * @returns {number} The sum of the elements of the array.
 * @example
 * console.log(sum([1,2,3]));
 *
 * => 6;
 */
export const sum = (array: number[]): number =>
	array
		.reduce(
			(sum: Decimal, element: number) =>
				new Decimal(parseInt(`${element}`.replace(/ /g, ""))).plus(sum),
			new Decimal(0),
		)
		.toNumber();

/**
 * Returns a random number between two provided numbers inclusive.
 * @param {number} number1 The first number.
 * @param {number} number2 The second number.
 * @param {boolean} decimals Whether to consider decimals when returning a random number.
 * @returns {number} A random number between provided numbers inclusive.
 * @example
 * console.log(RNG(4,2));
 * // Expected output: Number between 4 and 2 inclusive.
 *
 * console.log(RNG(-5, 2, true));
 * // Expected output: Number between minus 5 and 2 inclusive, including decimals.
 */
export const RNG = (
	number1: number,
	number2: number,
	decimals?: boolean | null,
): number => {
	const min = Math.min(number1, number2);
	const max = Math.max(number1, number2);

	decimals ??= /\./.test(`${number1}`) || /\./.test(`${number2}`);

	let randomNumber = decimals
		? Math.random() * Math.abs(max - min) + min
		: Math.round(Math.random() * Math.abs(max - min) + min);

	if (min === max) randomNumber = max;

	return randomNumber;
};

/**
 * Capitalises the first letter in the provided String. Returns a new string.
 * @param {string} string The string to capitalise the first letter of.
 * @param {boolean?} lowerCase Whether to lowercase the first letter of the string instead.
 * @returns {string} String with the first letter capitalised or lowercased.
 * @example
 * console.log(capitaliseFirst("hello"));
 * //Expected Output: Hello.
 */
export const capitaliseFirst = (string: string, lowerCase?: boolean): string =>
	(lowerCase ? string[0].toLowerCase() : string[0].toUpperCase()) +
	string.slice(1);

/**
 * Returns the appropriate ending for a number.
 * @param {number} number The number to find the ending for.
 * @returns {"st" | "nd" | "rd" | "th"} The appropriate ending for the provided number.
 * @example
 * `You are currently editing your ${count}${numberEnding(count)} embed.`;
 */
export const numberEnding = (
	number: number | string,
): "st" | "nd" | "rd" | "th" => {
	number = `${number}`;
	if (number.endsWith("1") && !number.endsWith("11")) return "st";
	if (number.endsWith("2") && !number.endsWith("12")) return "nd";
	if (number.endsWith("3") && !number.endsWith("13")) return "rd";
	return "th";
};

/**
 * Returns the appropriate ending to a word that is either plural or singular.
 * @param {number} number The string to convert.
 * @returns {"s"|""} The appropriate ending to the provided string.
 * @example
 * `You have ${count} embed${wordNumberEnding(input)}.`;
 */
export const wordNumberEnding = (number: number): "s" | "" =>
	number === 1 ? "" : "s";

/**
 * Waits for a specified amount of time.
 * @param {number} milliseconds The number of milliseconds to wait.
 * @returns {Promise<void>}
 * @example
 * // waits around 1 second.
 * await sleep(1000);
 */
export const sleep = async (milliseconds: number): Promise<void> => {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
};

/**
 * Limits the amount of characters a string can have and adds a nice representation of how many characters are not shown (never exceeds the limit of characters, even with the added text).
 * @param {string} string The string to limit the amount of characters of.
 * @param {number} allowedCharacters The amount of allowed characters that can be shown, includes the extra text ("..." or "... x more character(s)").
 * @param {boolean?} simple The mode to limit the number of characters with. Default is "normal". Simple mode will not show how many remaining characters are not shown.
 * @returns {string} A cut version of the string as well as a number representing how many characters are not shown.
 * @example
 * // A string is too long to fit on one line of an embed:
 *
 * const {EmbedBuilder} = require("discord.js")
 *
 * // Normal mode:
 * new EmbedBuilder().setDescription(cut("https://cdn.discordapp.com/attachments/883754224905769051/1056534040611659797/poll-image.png", 61))
 *
 * // Expected output: "https://cdn.discordapp.com/attachment ... 31 more characters.".
 *
 * // Simple mode:
 * new EmbedBuilder().setDescription(cut("https://cdn.discordapp.com/attachments/883754224905769051/1056534040611659797/poll-image.png", 61, true))
 *
 * // Expected output: "https://cdn.discordapp.com/attachments/883754224905769051 ...".
 */
export const cut = (
	string: string,
	allowedCharacters: number,
	simple?: boolean,
): string => {
	const remainingChars = string?.length - allowedCharacters;

	const output = `${string?.slice(
		0,
		allowedCharacters -
			(simple
				? 4
				: 21 +
				  `${remainingChars}`.length +
				  wordNumberEnding(remainingChars).length),
	)} ...${
		simple
			? ""
			: ` ${remainingChars} more character${wordNumberEnding(remainingChars)}.`
	}`;

	if (allowedCharacters < output.length) {
		throw new Error(
			`Not enough allowed characters, running the function will return "${output}".`,
		);
	}

	return string?.length > allowedCharacters ? output : string;
};

/**
 * Function to capitalise each first letter of each word in a string.
 * @param {string} string The string to transform to title case.
 * @param {boolean} lowercase Whether to lowercase each first letter of each word.
 * @returns {string} String with all first letters of words capitalised.
 * @example
 * titleCase("title Case") // Returns "Title Case".
 */
export const titleCase = (string: string, lowercase: boolean): string => {
	const wordArray = string.toLowerCase().split(" ");
	for (let i = 0; i < wordArray.length; i++) {
		wordArray[i] =
			(lowercase
				? wordArray[i][0].toLowerCase()
				: wordArray[i][0].toUpperCase()) + wordArray[i].slice(1);
	}
	return wordArray.join(" ");
};

/**
 * Transforms a camelcase string into a normal-cased string.
 * @param {string} string The string to transform into into a normal string.
 * @returns {string} A normal-cased string.
 * @example
 * fromCamelCase("fromCamelCase") // Returns "From camel case".
 */
export const fromCamelCase = (string: string): string =>
	titleCase(string.replace(/([A-Z]+)/g, " $1"), true);

/**
 * A function to check if a string is a valid URL or not.
 * @param {String} urlString The string to check.
 * @returns {Boolean} Whether the string is a valid URL.
 * @example
 * // Getting an output for a link input.
 *
 * const {ErrorMessageBuilder} = require('./classes');
 * if (!isValidURL(interaction.fields.getTextInputValue(iconURL))) {await interaction.reply(new ErrorMessageBuilder("Please provide a valid URL!"));}
 *
 * isValidURL("styles.css"); // Returns false.
 * isValidURL("https://www.youtube.com"); // Returns true.
 */
export const isValidURL = (urlString: string): boolean =>
	/^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i.test(
		urlString,
	);

/**
 * Checks whether an array of users have a permissions.
 * @param {string[]} permissions The permissions to check.
 * @param {GuildMember[]} users The users to check if they have the permissions.
 * @param {GuildChannel?} channel The channel to check the permissions in.
 * @param {Guild} guild The guild to check the permissions in.
 * @param {GuildMember} defaultUser The user who is considered the default user. Will display "*You* do not have the permission." if the user does not have a permission.
 * @returns {Promise<{value: boolean;permission?: string;user?: GuildMember;message?: string;}>} Object with information about the permissions.
 */
export const checkPermissions = async (
	permissions: string[],
	users: GuildMember[],
	channel: GuildChannel | null,
	guild: Guild,
	defaultUser: GuildMember,
): Promise<{
	value: boolean;
	permission?: string;
	user?: GuildMember;
	message?: string;
}> => {
	permissions = permissions.length
		? permissions
		: ["ViewChannel", "SendMessages"];

	for (const permission of permissions) {
		if (permission) {
			for (let user of users) {
				user = await guild.members.fetch(user.id);

				if (!channel) {
					if (!user.permissions.has(PermissionsBitField.Flags[permission])) {
						return {
							permission,
							user,
							value: false,
							message: `${
								user.id === defaultUser.id ? "You do " : `<#${user.id}> does `
							}not have the \`${permission}\` permission!`,
						};
					}
					continue;
				}

				const userChannelPermissions = channel.permissionsFor(user);

				if (
					!userChannelPermissions.has(PermissionsBitField.Flags[permission])
				) {
					return {
						permission,
						user,
						value: false,
						message: `${
							user.id === defaultUser.id ? "You do " : `<@${user.id}> does `
						}not have the \`${permission}\` permission in the <#${
							channel.id
						}> channel!`,
					};
				}
			}
		}
	}

	return {value: true};
};

/**
 * Function to find lowest common multiple of an array of numbers.
 * @param {number[]} numbers Array of numbers to find the lowest common multiple of.
 * @returns {number} The lowest common multiple of the provided numbers.
 * @example
 * lcm(2,3,4,5,6,7);
 * // Expected output: 420.
 */
export const lcm = (...numbers: number[]): number => {
	const max = Math.max(...numbers);
	loop: for (let i = max; ; i += max) {
		for (let number of numbers) {
			if (i / number !== Math.floor(i / number)) continue loop;
		}
		return i;
	}
};

/**
 * Finds the highest common factor of a list of numbers.
 * @param {number[]} numbers Array of numbers to find the highest common factor of.
 * @returns {number} The highest common factor of the provided numbers.
 * @example
 * console.log(HCF(185, 355, 785, 1000));
 * // Expected output: 5.
 */
export const HCF = (...numbers: number[]): number => {
	const min = Math.min(...numbers);
	let hcf = 1;
	loop: for (let i = 2; i < min; i++) {
		for (const number of numbers) {
			if (number / i !== Math.floor(number / i)) continue loop;
		}
		hcf = i;
	}
	return hcf;
};

/**
 * Maps every character of a string using a callback function.
 * @param {string} string The string to map each character of.
 * @param {(character: string, index: number, string: string) => string} callback The function to map each character with.
 * @returns {string} The new mapped string.
 * @example
 * map("1234", (number) => parseInt(number) + 1);
 * => "2345";
 */
export const map = (
	string: string,
	callback: (character: string, index: number, string: string) => string,
): string => {
	let newString = "";
	for (let i = 0; i < string.length; i++) {
		newString += callback(string[i], i, string);
	}
	return newString;
};

/**
 * Simplifies a fraction.
 * @param {number} numerator The numerator of the fraction.
 * @param {number} denominator The denominator of the fraction.
 * @param {boolean} returnValue Whether to force return the value.
 * @param {boolean} mapCharacters Whether to map the fraction characters to subscript and superscript characters.
 * @returns {string|Decimal|[Decimal, Decimal]} Array of the [0] numerator and [1] the denominator. | The decimal or integer that the fraction represents. Will only return if the decimal places terminate or if returnValue = true.
 */
export const simplify = (
	numerator: number | Decimal,
	denominator: number | Decimal,
	returnValue: boolean,
	mapCharacters: boolean,
): string | Decimal | [Decimal, Decimal] => {
	numerator = new Decimal(numerator);
	denominator = new Decimal(denominator);

	const hcf = HCF(numerator.toNumber(), denominator.toNumber());

	numerator = numerator.dividedBy(hcf);
	denominator = denominator.dividedBy(hcf);

	if (denominator.toNumber() < 0) {
		if (numerator.toNumber() < 0) {
			numerator = numerator.abs();
			denominator = denominator.abs();
		} else {
			numerator = numerator.times(-1);
			denominator = denominator.abs();
		}
	}

	const decimal = numerator.dividedBy(denominator);

	return parseFloat(decimal.toFixed(11)) === parseFloat(decimal.toFixed(12)) ||
		returnValue
		? decimal
		: mapCharacters
		? `${map(
				`${numerator}`,
				(number: string) => superscriptMap[`${number}`],
		  )}/${map(
				`${denominator}`,
				(number: string) => subscriptMap[`${number}`] ?? number,
		  )}`
		: [numerator, denominator];
};

/**
 * Finds the mean average of a list of values.
 * @param {number[]} values The values to find the mean of.
 * @returns {number} The mean average of the values.
 * @example
 * const mean = mean(4, 5, 6);
 * => 5;
 */
export const mean = (...values: number[]): number => {
	const sum = values.reduce((sum, value) => sum + value, 0);

	return sum / values.length;
};

/**
 * Finds the median of a list of values.
 * @param {number[]} values The values to find the median of.
 * @returns {number} The median of the values.
 * @example
 * median(5, 2, 8);
 * => 5;
 *
 * median(1, 2, 3, 4);
 * => 2.5;
 */
export const median = (...values: number[]): number => {
	values = values.sort((a, b) => a - b);

	if (values.length % 2) return values[Math.floor(values.length / 2)];

	return mean(values[values.length / 2 - 1], values[values.length / 2]);
};

/**
 * Finds the mode of a list of values.
 * @param {(string|number)[]} values The values to find the mode of.
 * @returns {string} The mode or modes of the values.
 * @example
 * mode(5, 5, 6, 6, 3);
 * => "5, 6";
 */
export const mode = (...values: (string | number)[]): string => {
	const valuesObject: {[key: string]: number} = {};

	for (const value of values) {
		valuesObject[value.toString()] ??= 0;
		valuesObject[value.toString()]++;
	}

	let modes = [Object.keys(valuesObject)[0]];

	for (const value in valuesObject) {
		if (valuesObject[value] === valuesObject[modes[0]]) {
			modes.push(value);
		}

		if (valuesObject[value] > valuesObject[modes[0]]) {
			modes = [value];
		}
	}

	modes = modes.filter((value, index) => modes.indexOf(value) === index);

	return modes.length ===
		values.filter((value, index) => values.indexOf(value) === index).length
		? "No Mode"
		: modes.length === 1
		? modes[0]
		: modes.join(", ");
};

/**
 * A function to randomise an array.
 * @param {any[]} values Array of values to randomise.
 * @returns {any[]} Array of the randomised elements.
 * @example
 * console.log(randomise(1,2,3,4,5,6,7,8,9,10));
 * // Expected output: Array of the same numbers but in a different, random order.
 */
export const randomise = (...values: any[]): any[] => {
	const newArray = [];
	while (values.length) {
		const index = Math.floor(Math.random() * values.length);
		newArray.push(values[index]);
		values.splice(index, 1);
	}
	return newArray;
};

/**
 * Function to parse a string with a mathematic expression as code that can be evaluated by the JavaScript expression evaluator module. Supports many different types of expressions.
 * @param {string} string The expression to parse.
 * @returns {string} The parsed expression.
 * @example
 * parseMath(`2x² + 3 - 4`);
 * // Expected output: `2x^2+3-1*4`.
 */
export const parseMath = (string?: string | number | null): string | number => {
	if (!string) return NaN;

	string = string.toString();

	string = string
		.replace(/ /gi, "")
		.replace(/(x|\d+x?|\))(?=[⁻¹²³⁴⁵⁶⁷⁸⁹⁰])/gi, "$1^")
		.replace(/\*\*/gi, "^")
		.replace(/\)\(/gi, ")*(")
		.replace(/(√|root)(?=\(.+\))/gi, "sqrt")
		.replace(/(√|root)([0-9x]+)/gi, "sqrt($2)")
		.replace(/(pi\(\)|pi|π|Π|𝜫|𝝅|𝝥|𝝿|𝞟|𝞹|п|∏|∐)/gi, "PI")
		.replace(/(x|\d+x?|\))(?=\(.+\))/gi, "$1*")
		.replace(/⋅/gi, "*")
		.replace(/⁻/gi, "-")
		.replace(
			/(abs|acos|acosh|asin|asinh|atan|atanh|cbrt|ceil|cos|cosh|exp|expm1|floor|length|ln|log|log10|log1p|log2|not|round|sign|sin|sinh|sqrt|tan|tanh|trunc)(\d+|x)/gi,
			"$1($2)",
		);

	for (let i = 0; i < powerArray.length; i++) {
		string = string.replace(new RegExp(powerArray[i], "gi"), `${i}`);
	}

	// TODO: Put brackets around bases of the exponents and around the exponents too probably.
	// TODO: Put brackets around factorial numbers.
	// TODO: Add support for more superscript text.

	return string
		.replace(/divided* *b*y*/gi, "/")
		.replace(/multipl(ied|y) *b*y*/gi, "*")
		.replace(/minus/gi, "-")
		.replace(/plus/gi, "+")
		.replace(/t*o* * *t*h*e* *power *o*f*/gi, "**")
		.replace(/fact(orial)?/gi, "!")
		.replace(/-/gi, "-1*")
		.replace(/,/gi, ".")
		.replace(/\\cdot/gi, "*")
		.replace(/\\(?!\/)/gi, "")
		.replace(/(e\(\)|e)/gi, "E")
		.replace(
			/(\d+|\d*x)(abs|acos|acosh|asin|asinh|atan|atanh|cbrt|ceil|cos|cosh|exp|expm1|floor|length|ln|log|log10|log1p|log2|not|round|sign|sin|sinh|sqrt|tan|tanh|trunc)/gi,
			"$1*$2",
		)
		.replace(/(PI|E)(\w|\d)/gi, "$1*$2")
		.replace(/(\d+|\d*x)(PI|E)/gi, "$1*$2")
		.replace(/(PI|E)(x|\d+x)/gi, "$1*$2")
		.replace(/(\d+|x)x/gi, "$1*x")
		.replace(/(\d+|x)x/gi, "$1*x")
		.replace(/÷/gi, "/")
		.replace(/×/gi, "*")
		.replace(/\u2061/gi, "");
};

/**
 * Parses a JavaScript or JavaScript Expression Evaluator math expression to be more humanly readable.
 * @param {string} string The string to be parsed.
 * @returns {string} The parsed expression.
 * @example
 * mathParse("-1*x+x^3"); // Returns "-x+x³".
 */
export const mathParse = (string: string): string => {
	// const matches = string.match(/(\*\*|\^)[0-9x]+/gi);

	// for (let i = 0; i < powerArray.length; i++) {
	// 	string = string.replace(new RegExp(`(?<)${i}`, "ig"), `$2${powerArray[i]}`);
	// }

	/(?<=[⁰¹²³⁴⁵⁶⁷⁸⁹]|)/;

	// ! ONLY WORKS FOR SINGLE DIGIT EXPONENTS.
	// TODO: ADD SUPPORT FOR MULTIPLE DIGIT EXPONENTS.

	return string
		.replace(/\*/gi, " ⋅ ")
		.replace(/\+/gi, " + ")
		.replace(/-/gi, " - ")
		.replace(/\//gi, " ÷ ")
		.replace(/(\d+) ⋅ ([a-z]|\()/gi, "$1$2")
		.replace(/^ /, "")
		.replace(/- 1 ⋅ (\d)/gi, "-$1")
		.replace(/PI/gi, "π")
		.replace(/E/gi, "e")
		.replace(/sqrt\((.+)\)/g, "√($1)")
		.replace(/cbrt\((.+)\)/g, "∛($1)")
		.replace(/√\((\d+)\)/g, "√$1")
		.replace(/∛\((\d+)\)/g, "∛$1")
		.replace(/-(\d+)/g, "- $1")
		.replace(/\) ⋅ \(/g, ")(");
};

/**
 *A function that goes through each file in a folder, including subfolders.
 * @param {string} folderPath The folder to go through.
 * @param {(path: string) => void} callback The function to call on each file. The function is given one parameter, which is the file path.
 * @param {(path: string) => any?} returnCallback An optional function that, if the return value is truthy, will return the return value.
 * @returns {void|any}
 * @example
 * let code = "";
 * recurringFolders("./src", (path) => code += readFileSync(path));
 * console.log(code);
 * // Returns all code written.
 */
export const recurringFolders = (
	folderPath: string,
	callback: (path: string) => void,
	returnCallback?: (path: string) => any,
): void | any => {
	const files = readdirSync(folderPath);
	for (const file of files) {
		try {
			readFileSync(`${folderPath}/${file}`);

			if (callback) callback(`${folderPath}/${file}`);

			if (returnCallback) {
				const returnValue = returnCallback(`${folderPath}/${file}`);
				if (returnValue) return returnValue;
			}
		} catch (error) {
			const returnValue = recurringFolders(
				`${folderPath}/${file}`,
				callback,
				returnCallback,
			);
			if (returnValue) return returnValue;
		}
	}
};

/**
 * Clears Discord formatting from a string.
 * @param {string} string The string to clear the formatting of.
 * @returns {string} The string with a backslash before every formatting character, effectively clearing the formatting.
 * @example
 * clearFormatting("**Some cool bold text** and *maybe some italic too?*");
 * // Returns "\*\*Some cool bold text\*\* and \*maybe some italic too?\*".
 */
export const clearFormatting = (string: string): string =>
	string
		.replace(/\*/g, "\\*")
		.replace(/_/g, "\\_")
		.replace(/~/g, "\\~")
		.replace(/`/g, "\\`")
		.replace(/\^/, "\\^");

/**
 * Goes through each file of each folder of a folder and executes a function on each file. Logs the results to the console.
 * @param {string} path The path of the folder to iterate through.
 * @param {string} colour The colour of the console message.
 * @param {(exports: any | null, path: string, fileName: string) => void} callback The function to perform on each of the files. It is given three arguments: the file exports (or null if it is not a JS file), the file path and the file name.
 * @param {() => Promise<void>?} optionalCallback An optional function to execute after the main functions have been executed.
 * @param {Client?} client The client.
 * @returns {Promise<void>}
 */
export const forFolder = async (
	path: string,
	colour: keyof typeof chalk,
	callback: (
		exports: any | null,
		path: string,
		fileName: string,
		index: number,
	) => void,
	optionalCallback?: () => Promise<void>,
	client?: Client & {clearCommands: boolean},
): Promise<void> => {
	let registeredFiles = 0;
	let skippedFiles = 0;
	let totalFiles = 0;
	let skippedFolders = 0;
	let folders = 0;

	for (const folder of readdirSync(`./dist/${path}`)) {
		let folderFiles = readdirSync(`./dist/${path}/${folder}`).filter(
			(file) => !(file.endsWith(".json") || file.endsWith(".js.map")),
		);

		totalFiles += folderFiles.length;
		const count = folderFiles.length;
		folderFiles = folderFiles.filter(
			(file) =>
				file.endsWith(".js") || file.endsWith(".ttf") || file.endsWith(".otf"),
		);
		let settings = {disabled: false};
		try {
			settings = JSON.parse(
				readFileSync(`./dist/${path}/${folder}/settings.json`).toString(),
			);
		} catch (error) {}

		if (!settings.disabled) {
			skippedFiles += count - folderFiles.length;
			registeredFiles += folderFiles.length;
			folders++;

			let index = 0;
			for await (const file of folderFiles) {
				const fileData = !(file.endsWith(".js") || file.endsWith(".ts"))
					? null
					: await import(`./${path}/${folder}/${file}`);

				callback(
					Object.keys(fileData ?? {}).length === 1
						? fileData[Object.keys(fileData)[0]] ?? fileData
						: fileData,
					`./${path}/${folder}/${file}`,
					file,
					index,
				);

				index++;
			}
		} else skippedFolders++;
	}

	if (optionalCallback) {
		try {
			await optionalCallback();
		} catch (error) {}
	}

	let type = fromCamelCase(
		path.match(/([^/]+[^s](?=(s$)))/)?.[0] ??
			`${path.match(/(client|mongo|process)/)?.[0]} event`,
	);

	type =
		type === "command"
			? "application [/] command"
			: path === "functions"
			? "client function"
			: type;

	const message = capitaliseFirst(path.match(/[^/.]+/)?.[0] ?? "Unknown");

	const action = /Components/.test(message)
		? "Successfully registered"
		: /Events/.test(message)
		? "Now listening for"
		: /Commands/.test(message)
		? client?.clearCommands
			? "Successfully cleared"
			: "Successfully refreshed"
		: "Successfully loaded";

	console.log(
		chalk[colour](
			`\n${chalk.bold(`[${message}]`)} ${action} ${chalk.bold(
				chalk.whiteBright(registeredFiles),
			)} ${type}${wordNumberEnding(registeredFiles)} (${chalk.bold(
				chalk.whiteBright(folders),
			)} folder${wordNumberEnding(folders)}).${
				totalFiles - registeredFiles
					? ` Skipped ${chalk.bold(
							chalk.redBright(totalFiles - registeredFiles),
					  )} disabled ${type}${wordNumberEnding(
							totalFiles - registeredFiles,
					  )} (` +
					  `${
							skippedFolders
								? `${chalk.bold(
										chalk.redBright(skippedFolders),
								  )} disabled folder${wordNumberEnding(skippedFolders)}`
								: ""
					  }${skippedFolders && skippedFiles ? " and " : ""}${
							skippedFiles
								? `${chalk.bold(
										chalk.redBright(skippedFiles),
								  )} disabled file${wordNumberEnding(skippedFiles)}`
								: ""
					  }).`
					: ""
			}\n`,
		),
	);
};

/**
 * Resolves a date from a given string.
 * @param {string} string The string to resolve the date of.
 * @returns {number} The resolved date.
 * @example
 * resolveDate("In 5 days"); // Returns Date.now() + 5 * 24 * 60 * 60 * 1000.
 * resolveDate("Now"); // Returns Date.now().
 * resolveDate("5 min"); // Returns 5 * 60 * 1000.
 */
export const resolveDate = (string: string): number | null => {
	if (/now/gi.test(string)) return Date.now();

	const durations: {[key: string]: number} = {
		minute: 60000,
		min: 60000,
		m: 60000,
		hour: 3600000,
		h: 3600000,
		day: 86400000,
		d: 86400000,
		week: 604800000,
		w: 604800000,
		mo: 2592000000,
		month: 2592000000,
	};

	try {
		string = string.replace(/(\d+)/g, "+ $1 *").replace(/ /g, "").trim();

		for (const time in durations) {
			string = string.replace(
				new RegExp(`${time}s?`, "ig"),
				`${durations[time]}`,
			);
		}

		const parser = new Parser();

		if (/^in/.test(string))
			return (
				Date.now() + parser.evaluate(string.match(/(?<=in).+/)?.[0] ?? "0")
			);

		if (/ago$/.test(string))
			return (
				Date.now() - parser.evaluate(string.match(/.+(?=ago)/)?.[0] ?? "0")
			);

		return parser.evaluate(string);
	} catch (error) {
		return null;
	}
};

/**
 * Returns a colour emoji based on a given hex colour code.
 * @param {string} hex The colour code to convert to an emoji.
 * @returns {"⬜"|"⬛"|"🟨"|"🟫"|"🟪"|"🟧"|"🟥"|"🟦"|"🟩"} The colour emoji corresponding to the hex colour code.
 * @example
 * colourMatch("#111111"); // Returns "⬛".
 * colourMatch("#1133ff"); // Returns "🟦".
 */
export const colourMatch = (
	hex: string,
): "⬜" | "⬛" | "🟨" | "🟫" | "🟪" | "🟧" | "🟥" | "🟦" | "🟩" => {
	hex = `${hex}`.replace(/^0x|^#/, "");

	const red = hex.slice(0, 2);
	const redBaseTen = parseInt(red, 16);

	const green = hex.slice(2, 4);
	const greenBaseTen = parseInt(green, 16);

	const blue = hex.slice(4, 6);
	const blueBaseTen = parseInt(blue, 16);

	if (redBaseTen >= 200 && greenBaseTen >= 200 && blueBaseTen >= 200)
		return "⬜";

	if (
		(redBaseTen <= 40 && greenBaseTen <= 40 && blueBaseTen <= 40) ||
		Math.abs(
			Math.max(redBaseTen, greenBaseTen, blueBaseTen) -
				Math.min(redBaseTen, blueBaseTen, greenBaseTen),
		) <= 5
	)
		return "⬛";

	if (Math.abs(redBaseTen - greenBaseTen) <= 3 && blueBaseTen <= 160)
		return "🟨";

	if (blueBaseTen <= 30 && Math.abs(redBaseTen - greenBaseTen) <= 70)
		return "🟫";

	if (
		greenBaseTen <= 150 &&
		Math.abs(redBaseTen - blueBaseTen) >= 50 &&
		Math.abs(redBaseTen - blueBaseTen) <= 125
	)
		return "🟪";

	if (
		redBaseTen >= 160 &&
		blueBaseTen <= 100 &&
		Math.abs(redBaseTen - greenBaseTen) <= 150 &&
		Math.abs(redBaseTen - greenBaseTen) >= 50
	)
		return "🟧";

	if (Math.max(redBaseTen, greenBaseTen, blueBaseTen) === redBaseTen)
		return "🟥";

	if (Math.max(redBaseTen, greenBaseTen, blueBaseTen) === blueBaseTen)
		return "🟦";

	if (Math.max(redBaseTen, greenBaseTen, blueBaseTen) === greenBaseTen)
		return "🟩";

	return "⬛";
};

/**
 * Checks whether a user is authorised to perform an interaction based on certain variables.
 * @param {ModalSubmitInteraction | ButtonInteraction | AnySelectMenuInteraction} interaction The interaction to check authorisation for.
 * @returns {boolean} Whether the user is authorised to perform the interaction.
 * @example
 * checkAuthorisation(interaction);
 */
export const checkAuthorisation = (
	interaction:
		| ModalSubmitInteraction
		| ButtonInteraction
		| AnySelectMenuInteraction,
): boolean => {
	const usernameReg = new RegExp(interaction.user.username, "ig");
	const userTagReg = new RegExp(interaction.user.tag, "ig");
	const userIDReg = new RegExp(interaction.user.id, "ig");

	const embed = interaction.message?.embeds?.[0]?.data;

	for (const element of [
		embed?.title,
		embed?.footer?.text ?? "",
		embed?.author?.name ?? "",
	]) {
		if (
			element &&
			(usernameReg.test(element) ||
				userTagReg.test(element) ||
				userIDReg.test(element))
		) {
			return true;
		}
	}

	return interaction.message?.interaction?.user?.id === interaction.user.id;
};

export const getEmbedType = (
	match: "file" | "embed" | "component",
	EmbedFileMessageBuilderFunction: Function,
	EmbedEmbedMessageBuilderFunction: Function,
	EmbedComponentMessageBuilderFunction: Function,
	...args: any[]
) => {
	switch (match) {
		case "file":
			return EmbedFileMessageBuilderFunction(...args);
		case "embed":
			return EmbedEmbedMessageBuilderFunction(...args);
		case "component":
			return EmbedComponentMessageBuilderFunction(...args);
	}
};

/**
 *A function to send a prompt to ChatGPT.
 * @param {string} prompt The prompt to send to ChatGPT.
 * @param {number} temperature (0-1) The temperature to configure the AI with. Higher temperature means more randomised and creative results. Default is 1.0.
 * @returns {string} The returned text from ChatGPT.
 * @example
 * await generateText("Is this ChatGPT?", 1);
 */
export const generateText = async (
	prompt: string,
	temperature: number = 1,
): Promise<string> => {
	const configuration = new Configuration({apiKey: process.env.openAIKey});
	const openAI = new OpenAIApi(configuration);

	const response = await openAI.createCompletion({
		model: "text-davinci-003",
		prompt: prompt,
		// eslint-disable-next-line camelcase
		max_tokens: 100,
		temperature: temperature ?? 1,
	});

	return `${response}`;
};

/**
 * A function to map an object. Similar to *Array.prototype.map*.
 * @param {object} object The object to map.
 * @param {(property, index: number, key: string, object: object) => any} callback The function to map the object with. The function is provided with four arguments: The value, the index, the key and the object.
 * @returns {object} The mapped object.
 * @example
 * const object = {foo: "bar"};
 * objectMap(object, (value, index, key, object) => {console.log(value, index, key, object)});
 * // Expected output: "bar" 0 "foo" {foo: "bar"}
 */
export const objectMap = (
	object: {[key: string]: any},
	callback: (property: any, index: number, key: string, object: object) => any,
): object => {
	let index = 0;
	for (const key in object) {
		object[key] = callback(object[key], index, key, object);
		index++;
	}
	return object;
};

/**
 * Formats a number to look nicer.
 * @param {number} number The number to format
 * @returns {number|string} The original number or the formatted number.
 * @example
 * formatNumber(-1);
 * => "-";
 *
 * formatNumber(1);
 * => "";
 */
export const formatNumber = (number: number | Decimal): "-" | "" | Decimal => {
	number = new Decimal(number);
	return number.equals(1) ? "" : number.equals(-1) ? "-" : number;
};

/**
 * Finds whether a number is a multiple of a special number (like e or PI).
 * @param {number} number The number to check.
 * @param {boolean} value Whether to return the more precise value of the number.
 * @param {boolean} strict Whether to be more strict with the judging (requires fxString). Judges based on the fxString.
 * @param {string} fxString The function string.
 * @param {number | Decimal} precision The precision to use. Lower precision means that the number will be checked more strictly.
 * @returns {string|Decimal} The string representation of the number.
 * @example
 * findNumber(6.28, 0.1); // Returns "2π"
 */
export const findNumber = (
	number: number | Decimal,
	value: boolean,
	strict: boolean,
	fxString: string,
	precision: number | Decimal = new Decimal(0.1),
): string | Decimal => {
	number = new Decimal(number);

	for (const index of [
		{number: Math.PI, symbol: "π", regex: /sin|cos|tan|π/},
		{number: Math.E, symbol: "e", regex: /log|ln|e/},
	]) {
		if (
			number
				.dividedBy(new Decimal(index.number).dividedBy(2))
				.abs()
				.minus(
					number
						.dividedBy(new Decimal(index.number).dividedBy(2))
						.round()
						.abs(),
				)
				.abs()
				.lessThanOrEqualTo(precision) &&
			number
				.abs()
				.greaterThanOrEqualTo(
					new Decimal(index.number).times(0.5).minus(precision),
				) &&
			(!strict || index.regex.test(fxString))
		) {
			number = number.dividedBy(index.number);

			return value
				? number.times(index.number)
				: `${formatNumber(number.times(2).round().dividedBy(2))}${
						index.symbol
				  }`;
		}
	}

	return number;
};

/**
 * Function to find the root of a mathematical function. Searches a range around a number to find a value where y = 0.
 * @param {string} fxString The function to find the root of.
 * @param {number | Decimal} integer The current integer value.
 * @param {number | Decimal} range The range to search for the root.
 * @param {number | Decimal} precision The precision to use.
 * @param {boolean} returnSearchRange Whether to return the range that was searched.
 * @param {number} depth The current depth of the recursive search.
 * @returns {Decimal | {x: Decimal; y: Decimal; range: Decimal}} The root of the function if it was found.
 */
export const findRoot = (
	fxString: string,
	integer: number | Decimal,
	range: number | Decimal,
	precision: number | Decimal,
	returnSearchRange: boolean,
	depth: number = 1,
):
	| Decimal
	| {x: Decimal; y: Decimal; range: Decimal | undefined}
	| undefined => {
	if (depth === 0) return;

	fxString = parseMath(fxString);

	integer = new Decimal(integer);
	range = new Decimal(range);
	precision = new Decimal(precision);

	const interval = range.dividedBy(1000);

	let lowestValue: {x: Decimal; y: Decimal; range?: Decimal} = {
		x: new Decimal(Infinity),
		y: new Decimal(Infinity),
	};

	for (
		let i = integer;
		i.lessThanOrEqualTo(integer.plus(range));
		i = i.plus(interval)
	) {
		const value = new Decimal(
			Parser.evaluate(fxString.replace(/x/g, `(${i})`)),
		);

		if (value.abs().lessThan(Math.abs(lowestValue.y.toNumber()))) {
			lowestValue = {x: i, y: value, range: integer.minus(i).abs()};
		}
	}

	if (!new Decimal(lowestValue.y).abs().lessThanOrEqualTo(precision)) {
		return findRoot(
			fxString,
			new Decimal(lowestValue.x).minus(interval),
			interval.times(2),
			precision,
			returnSearchRange,
			depth - 1,
		);
	}

	return returnSearchRange
		? {x: lowestValue.x, y: lowestValue.y, range: lowestValue.range}
		: lowestValue.x;
};

/**
 * Advanced square root function. Supports imaginary numbers.
 * @param {number} number The number to take the square root of.
 * @returns {number|string} The square root of the number. | The square root of the number using imaginary numbers.
 * @example
 * const squareRoot = imaginarySquareRoot(-2);
 * => "i√2";
 */
export const imaginarySquareRoot = (number: number): Decimal | string => {
	const positiveNumber = new Decimal(number).abs();

	let positiveNumberRoot: Decimal | string = positiveNumber.sqrt();

	positiveNumberRoot =
		parseFloat(positiveNumberRoot.toFixed(11)) ===
		parseFloat(positiveNumberRoot.toFixed(12))
			? positiveNumberRoot
			: `√${positiveNumber}`;

	if (number < 0) {
		const isRadicalCoefficient = typeof positiveNumberRoot === "string";

		return `${isRadicalCoefficient ? "i" : ""}${positiveNumberRoot}${
			isRadicalCoefficient ? "" : "i"
		}`;
	}

	return positiveNumberRoot;
};

/**
 * Finds the ID of a client command.
 * @param {String} commandName The name of the command to find the ID of.
 * @param {Client} client The client to find the command ID of.
 * @returns {<Promise>String|null} The ID of the command if it was found, or null otherwise.

const getCommandID = async (commandName, client) => {
	const commands = await client.application.commands.fetch();
	const command = commands.find((cmd) => cmd.name === commandName);

	console.log(commands.map((command) => `${command.name} ${command.id}`));

	return command?.id;
};
*/

const newtonRaphson = (
	lhs: string,
	rhs: string,
	lhsPrime: string,
	rhsPrime: string,
	x_0: number | Decimal,
	variable: string,
	precision: number | Decimal,
): Decimal => {
	precision = new Decimal(precision);

	const fx = `${parseMath(lhs)} - (${parseMath(rhs)})`;
	const fprimex = `${parseMath(lhsPrime)} - (${parseMath(rhsPrime)})`;

	let x = new Decimal(x_0);

	for (let i = 1; precision.greaterThanOrEqualTo(i); i++) {
		x = new Decimal(x).minus(
			new Decimal(
				new Parser().evaluate(
					fx.replace(new RegExp(variable, "ig"), `(${x.toString()})`),
				),
			).dividedBy(
				new Decimal(
					new Parser().evaluate(
						fprimex.replace(new RegExp(variable, "ig"), `(${x.toString()})`),
					),
				),
			),
		);
	}

	return x;
};

export const getPolygonData = (data: {
	[key: string]:
		| Decimal
		| null
		| {value: Decimal | null; inscriptionLevel: Decimal | null}[]
		| Decimal[]
		| undefined;
	sides?: Decimal | null;
	sideLength?: {value: Decimal | null; inscriptionLevel: Decimal | null}[];
	apothemLength?: {value: Decimal | null; inscriptionLevel: Decimal | null}[];
	radiusLength?: {value: Decimal | null; inscriptionLevel: Decimal | null}[];
	polygonArea?: {value: Decimal | null; inscriptionLevel: Decimal | null}[];
	incircleArea?: {value: Decimal | null; inscriptionLevel: Decimal | null}[];
	incircleCircumference?: {
		value: Decimal | null;
		inscriptionLevel: Decimal | null;
	}[];
	circumcircleArea?: {
		value: Decimal | null;
		inscriptionLevel: Decimal | null;
	}[];
	circumcircleCircumference?: {
		value: Decimal | null;
		inscriptionLevel: Decimal | null;
	}[];
	alpha?: Decimal | null;
	beta?: Decimal | null;
	gamma?: Decimal | null;
	delta?: Decimal | null;
	desiredInscriptionLevels?: Decimal[];
}) => {
	const values: {
		[key: string]: {
			[key: string]: Decimal | null | undefined;
			sideLength?: Decimal | null;
			apothemLength?: Decimal | null;
			radiusLength?: Decimal | null;
			polygonArea?: Decimal | null;
			incircleArea?: Decimal | null;
			incircleCircumference?: Decimal | null;
			circumcircleArea?: Decimal | null;
			circumcircleCircumference?: Decimal | null;
		};
	} = {};

	for (const property in data) {
		if (
			Array.isArray(data[property]) &&
			property !== "desiredInscriptionLevels"
		) {
			for (const variables of data[property]) {
				const index =
					Object.keys(values).filter((key) => /\?/.test(key)).length + 1;

				values[
					isNaN(variables.inscriptionLevel?.toNumber())
						? `?${index}`
						: `${variables.inscriptionLevel.toNumber()}`
				] ??= {};

				values[
					isNaN(variables.inscriptionLevel?.toNumber())
						? `?${index}`
						: `${variables.inscriptionLevel.toNumber()}`
				][`${property}`] ??= variables.value;
			}
		}
	}

	const {sides, alpha, beta, gamma, delta} = data;

	for (const value in values) {
		// ! CALCULATIONS;
		// value[value] = ...;
	}

	return values;
};

// console.log(
// 	getPolygonData({
// 		sides: new Decimal(5),
// 		sideLength: [
// 			{value: new Decimal(4), inscriptionLevel: new Decimal(0)},
// 			{value: new Decimal(2), inscriptionLevel: new Decimal(1)},
// 			{value: new Decimal(5), inscriptionLevel: new Decimal(4)},
// 		],
// 		polygonArea: [{value: new Decimal(64), inscriptionLevel: new Decimal(0)}],
// 	}),
// );
