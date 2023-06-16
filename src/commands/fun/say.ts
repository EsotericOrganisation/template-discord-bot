import {SlashCommandBuilder, ChannelType} from "discord.js";
import {ErrorMessageBuilder, SuccessMessageBuilder} from "../../classes.js";
import {checkPermissions} from "../../functions.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Make the bot say something in a channel.")
		.addStringOption((option) =>
			option
				.setName("text")
				.setDescription("The text that the bot should say.")
				.setRequired(true),
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("The channel the message should be sent in.")
				.addChannelTypes(
					ChannelType.GuildText,
					ChannelType.GuildVoice,
					ChannelType.GuildAnnouncement,
					ChannelType.PublicThread,
					ChannelType.PrivateThread,
					ChannelType.AnnouncementThread,
					ChannelType.GuildForum,
				),
		),
	usage: ["**/say** `text: text`", "**/say** `text: text` `channel: channel`"],
	examples: [
		"**/say** `text: Slime Bot is the best!`",
		`**/say** \`text: ${
			Math.random() <= 0.1 ? "Goodbye" : "Hello"
		} world!\` \`channel: #general\``,
	],
	async execute(interaction, client) {
		const channel =
			interaction.options.getChannel("channel") ?? interaction.channel;

		const permissions = await checkPermissions(
			[],
			[interaction.user, client.user],
			channel,
			interaction.guild,
		);

		if (!permissions.value) {
			await interaction.reply(new ErrorMessageBuilder(permissions.message));
		} else {
			await channel.send({
				content: `${interaction.options
					.getString("text")
					.replace(/\\n/g, "\n")}\u200b`,
				allowedMentions: {parse: []},
			});

			await interaction.reply(
				new SuccessMessageBuilder(`Successfully sent in channel ${channel}`),
			);
		}
	},
};
