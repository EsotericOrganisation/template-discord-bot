const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const mongoose = require("mongoose");
const temp = require("../../schemas/temp");

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

const posArr = ["Is Slime Bot the best bot?", "Is Elwin an NPC?"];

const neutralArr = ["What happened on October 13th?"];

const negativeArr = ["Is Elwin a good pilot?"];

module.exports = {
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
	example: [
		"**/8ball** `question: Is Slime Bot the best bot?` `private: True`",
	],
	async execute(interaction) {
		const input = interaction.options.getString("question");
		let rand;
		if (posArr.map((e) => new RegExp(e, "ig").test(input)).includes(true)) {
			rand = Math.floor(Math.random() * yes.length);
		} else if (
			neutralArr.map((e) => new RegExp(e, "ig").test(input)).includes(true)
		) {
			rand = Math.floor(Math.random() * maybe.length + yes.length);
		} else if (
			negativeArr.map((e) => new RegExp(e, "ig").test(input)).includes(true)
		)
			rand = Math.floor(Math.random() * no.length + yes.length + maybe.length);

		if (!rand) {
			const tmp = await temp.find({type: "8ball"});
			for (const temporary of tmp) {
				if (
					temporary.data.question.toLowerCase().replace(" ", "") ===
						input.toLowerCase().replace(" ", "") &&
					(!/( i|i | m(e|y|ine)|m(e|y|ine) | i'?m|i'?m |<@\d+>| he|he | she|she | we|we | they|they | hi(m|s)|hi(m|s) | hers?|hers? | us|us | our|our | the(m|ir)|the(m|ir) )/gi.test(
						temporary.data.question,
					) ||
						temporary.data.user === interaction.user.id)
				) {
					rand =
						temporary.data.answer < yes.length
							? Math.floor(Math.random() * yes.length)
							: temporary.data.answer < responseArray.length - no.length
							? Math.floor(Math.random() * maybe.length + yes.length)
							: Math.floor(
									Math.random() * no.length + yes.length + maybe.length,
							  );
					break;
				}
			}

			if (!rand) {
				rand = Math.floor(Math.random() * responseArray.length);
				const tem = new temp({
					_id: mongoose.Types.ObjectId(),
					type: "8ball",
					lifeSpan: 86400,
					data: {
						question: input,
						answer: rand,
						user: interaction.user.id,
					},
					date: Date.now(),
				});
				await tem.save();
			}
		}
		const embed = new EmbedBuilder()
			.setTitle(input)
			.setDescription(`> 🎱 ${responseArray[rand]}`);

		if (rand < yes.length) {
			embed.setColor("Green");
		} else if (rand < responseArray.length - no.length) {
			embed.setColor("Yellow");
		} else {
			embed.setColor("Red");
		}

		await interaction.reply({
			embeds: [embed],
			ephemeral: interaction.options.getBoolean("private"),
		});
	},
};
