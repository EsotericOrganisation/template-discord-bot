import {Command} from "../../types";
import {SlashCommandBuilder} from "discord.js";

const yes = [
	"It is certain.",
	"It is decidedly so.",
	"Without a doubt.",
	"Yes, definitely.",
	"You may rely on it.",
	"As I see it, yes.",
	"Most likely.",
	"Outlook good.",
	"Yes.",
	"Signs point to yes.",
	"Obviously.",
	"Of course.",
	"According to my calculations, the probability of this being true is above 95%. 🤓",
	"You're goddamn right.",
	"Probably.",
	"Affirmative.",
	"Very likely.",
];

const maybe = [
	"Reply hazy, try again.",
	"Ask again later.",
	"Better not tell you now.",
	"Cannot predict now.",
	"Concentrate and ask again.",
	"Too lazy to predict.",
	"The answer is uncertain.",
	"Stop bothering me.",
	"I really don't have the time to deal with this right now.",
	"It really doesn't matter, now shush.",
	"Maybe, I'm not sure.",
	"Maybe.",
	"Perhaps.",
	"It is possible.",
	"Possibly.",
	"Ask me later.",
	"What do you think?",
	"Really cant be bothered right now.",
	"Stop worrying about it.",
	"I'm not sure.",
];

const no = [
	"Don't count on it.",
	"My reply is no.",
	"My sources say no.",
	"Outlook not so good.",
	"Very doubtful.",
	"Of course not! Are you crazy?",
	"No, god no.",
	"Not possible.",
	"No chance.",
	"Impossible.",
];

const responseArray = [...yes, ...maybe, ...no];

const responseMap = [{question: "Is Slime Bot the best bot?", answer: 0}];

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("8ball")
		.setDescription("Ask the magic 8ball a question.")
		.addStringOption((option) =>
			option
				.setName("question")
				.setDescription("Ask a question and let the magic 8ball answer.")
				.setRequired(true),
		)
		.addBooleanOption((option) =>
			option
				.setName("private")
				.setDescription(
					"Whether the answer should be posted privately (ephemeral message).",
				),
		),
	usage: [
		"**/8ball** `question: question`",
		"**/8ball** `question: question` `private: True|False`",
	],
	examples: [
		"**/8ball** `question: Is Slime Bot the best bot?` `private: True`",
	],
	description:
		"This is an advanced 8ball system. It allows for more than just yes or no questions and even remembers the answers it gave!",
	async execute(interaction) {
		const input = interaction.options.getString("question");
	},
};
