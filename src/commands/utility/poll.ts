import {SlashCommandBuilder, ChannelType, TextChannel, User, Role, APIRole} from "discord.js";
import {evaluate} from "mathjs";
import mongoose from "mongoose";
import {
	createSuccessMessage,
	createErrorMessage,
	PollMessageBuilder,
	checkPermissions,
	resolveDuration
} from "../../utility.js";
import temporaryDataSchema from "../../schemas/temporaryDataSchema.js";
import {Command} from "../../types";

export const poll: Command = {
	data: new SlashCommandBuilder()
		.setName("poll")
		.setDescription("📊 Create a poll for others to vote on!")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("create")
				.setDescription("📝 Create a poll.")
				.addStringOption((option) =>
					option.setName("message").setDescription("💬 What do you want to be voted on?").setRequired(true)
				)
				.addStringOption((option) => option.setName("description").setDescription("📜 The description of the poll."))
				.addStringOption((option) =>
					option
						.setName("colour")
						.setDescription("🌈 The colour of the poll embed. Accepts colour codes and the names of colours.")
				)
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription("💬 The channel that the poll should be sent in")
						.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
				)
				.addStringOption((option) =>
					option
						.setName("max-options")
						.setDescription("🔢 The maximum number of options that a user can select.")
						.addChoices(
							{name: "∞ Unlimited", value: "Unlimited"},
							{name: "1", value: "1"},
							{name: "2", value: "2"},
							{name: "3", value: "3"},
							{name: "4", value: "4"},
							{name: "5", value: "5"},
							{name: "6", value: "6"},
							{name: "7", value: "7"},
							{name: "8", value: "8"},
							{name: "9", value: "9"},
							{name: "10", value: "10"},
							{name: "11", value: "11"},
							{name: "12", value: "12"},
							{name: "13", value: "13"},
							{name: "14", value: "14"},
							{name: "15", value: "15"}
						)
				)
				.addStringOption((option) =>
					option.setName("duration").setDescription(
						// eslint-disable-next-line quotes
						'⏳ The poll duration. E.g. "5m", "5 minutes", "3 hours", "5 days", "1 week".'
					)
				)
				.addBooleanOption((option) =>
					option.setName("anonymous").setDescription("👤 Whether the poll should be sent anonymously.")
				)
				.addRoleOption((option) =>
					option.setName("required-role").setDescription("👤 The role required to vote on the poll.")
				)
				.addRoleOption((option) => option.setName("ping-role").setDescription("👤 The role that the bot should ping."))
				.addStringOption((option) =>
					option
						.setName("thread-name")
						.setDescription("💬 If a name is provided, a thread will be created with that name.")
				)
				.addStringOption((option) =>
					option
						.setName("attachments")
						.setDescription("🎨 Send an attachment. Send multiple by separating links with commas.")
				)
				.addStringOption((option) => option.setName("choice-1").setDescription("1️⃣ The first option."))
				.addStringOption((option) => option.setName("choice-2").setDescription("2️⃣The second option."))

				.addStringOption((option) => option.setName("choice-3").setDescription("3️⃣ The third option."))
				.addStringOption((option) => option.setName("choice-4").setDescription("4️⃣ The fourth option."))
				.addStringOption((option) => option.setName("choice-5").setDescription("5️⃣ The fifth option."))
				.addStringOption((option) => option.setName("choice-6").setDescription("6️⃣ The sixth option."))
				.addStringOption((option) => option.setName("choice-7").setDescription("7️⃣ The seventh option."))
				.addStringOption((option) => option.setName("choice-8").setDescription("8️⃣ The eighth option."))
				.addStringOption((option) => option.setName("choice-9").setDescription("9️⃣ The ninth option."))
				.addStringOption((option) => option.setName("choice-10").setDescription("🔟 The tenth option."))
		),
	usage: [
		"poll create message: poll question description: description of the poll question colour: the colour of the poll embed channel: channel to send the poll message to max-options: maximum number of options a user can select duration: the duration of time that server members will be able to vote on the poll anonymous: whether the poll should be sent anonymously required-role: which role should be required for people to vote on the poll ping-role: which role should the be pinged for the poll thread-name: if provided, will create a thread with that name attachments: any images/other file attachments that should be sent along with the poll ...choices: choices that server members can select - up to 10 allowed"
	],
	examples: [
		"poll create message: 🥣 Is Cereal a Soup? description: Top scientists have been consumed by this question for years. choice-1: Yes choice-2: No",
		"poll create message: 🤖 Is Slime Bot the best bot? description: Truly an intriguing conundrum. choice-1: Yes",
		"poll create message: 🐈🐕 Are you a cat or a dog person? description: Which animal do you prefer? choice-1: 🐱 Cat choice-2: 🐶 Dog"
	],
	async execute(interaction, client) {
		const {options, guild, user} = interaction;

		if (!interaction.channel || !guild)
			return interaction.reply(createErrorMessage("This command can only be used in a guild!"));

		if (options.getSubcommand() === "create") {
			let duration: string | number | null = options.getString("duration");

			if (duration) {
				try {
					duration = evaluate(`${resolveDuration(duration.replace(/( *in *)|( *ago *)/g, ""))}`);
				} catch (error) {
					return interaction.reply(createErrorMessage(`**Invalid duration provided:** ${duration}\n\n> ${error}`));
				}
			}

			const channel = (options.getChannel("channel") ?? interaction.channel) as TextChannel;

			const permissions = await checkPermissions(
				["ViewChannel", "SendMessages", "EmbedLinks", "AddReactions", "UseApplicationCommands"],
				[user],
				channel,
				guild,
				user
			);

			if (!permissions.value) {
				return interaction.reply(createErrorMessage(permissions.message as string));
			}

			const botPermissions = await checkPermissions(
				["ViewChannel", "SendMessages", "EmbedLinks", "AddReactions"],
				[client.user as User],
				channel,
				guild,
				user
			);

			if (!botPermissions.value) {
				return interaction.reply(createErrorMessage(botPermissions.message as string));
			}

			await interaction.deferReply({
				ephemeral: true
			});

			const pollMessage = await new PollMessageBuilder().create(interaction, client);

			const embedMessage = await channel.send(pollMessage);

			for (const emoji of pollMessage.emojis) {
				if (emoji) await embedMessage.react(emoji);
			}

			if (duration) {
				const temporary = new temporaryDataSchema({
					_id: new mongoose.Types.ObjectId(),
					type: "poll",
					data: {message: embedMessage.id, channel: channel.id},
					creationDate: Date.now(),
					lifeSpan: Math.round(parseInt(`${duration}`))
				});

				await temporary.save();
			}

			if (options.getString("thread-name")) {
				const thread = await embedMessage.startThread({
					name: `${options.getString("thread-name")}`,
					autoArchiveDuration: 60
				});

				if (options.getRole("ping-role")) {
					await thread.send(`<@&${(options.getRole("ping-role") as Role | APIRole).id}>`);
				}
			}

			await interaction.editReply(createSuccessMessage(`Successfully created and sent the poll in <#${channel.id}>.`));
		}
	}
};
