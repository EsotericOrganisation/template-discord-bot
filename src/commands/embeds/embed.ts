import embedSchema from "../../schemas/embedSchema.js";
import {
	SlashCommandBuilder,
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
} from "discord.js";
import mongoose from "mongoose";
import {numberEnding, checkPermissions, cut} from "../../functions.js";
import {
	ErrorMessageBuilder,
	EmbedMessageBuilder,
	SuccessMessageBuilder,
} from "../../classes.js";
import {AutoCompleteCommand} from "../../types";

export const command: AutoCompleteCommand = {
	data: new SlashCommandBuilder()
		.setName("embed")
		.setDescription(
			"Create, edit and send custom messages containing embeds, attachments, buttons and select menus.",
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("create")
				.setDescription("Create a new embed.")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription(
							"The name of the embed, this can be changed later.",
						),
				),
		)
		.addSubcommandGroup((group) =>
			group
				.setName("delete")
				.setDescription("Delete one or all of your embeds")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("all")
						.setDescription(
							"Delete all your embeds. This action can not be undone.",
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("one")
						.setDescription("Delete an embed.")
						.addStringOption((option) =>
							option
								.setName("embed")
								.setDescription(
									"Which embed would you like to delete? (Input embed name or ID)",
								)
								.setAutocomplete(true)
								.setRequired(true),
						),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("edit")
				.setDescription("View and edit an existing embed.")
				.addStringOption((option) =>
					option
						.setName("embed")
						.setDescription(
							"Which embed would you like to edit? (Input embed name or ID)",
						)
						.setAutocomplete(true)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("send")
				.setDescription("Send one of your embeds in a chosen channel.")
				.addStringOption((option) =>
					option
						.setName("embed")
						.setDescription(
							"Which embed would you like to send? (Input embed name or ID)",
						)
						.setRequired(true)
						.setAutocomplete(true),
				)
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription("Which channel should the embed be sent in?")
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
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("save")
				.setDescription("Save an embed from a message to your embed profile.")
				.addStringOption((option) =>
					option
						.setName("message")
						.setDescription(
							"Which message would you like to save? (Input message ID or link)",
						)
						.setRequired(true),
				)
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription(
							"What channel is the message in? (Input channel ID or link)",
						)
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
		),
	usage: [
		"**/embed create** `name: embed name`",
		"**/embed delete one** `embed: embed name`",
		"**/embed delete all**",
		"**/embed edit** `embed: embed name`",
		"**/embed save** `message: message id or link` `channel: channel`",
	],
	examples: [
		"**/embed create** `name: my embed 1`",
		"**/embed edit** `embed: 1`",
		"**/embed delete one** `embed: 1 - my embed 1`",
	],
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused(true).value;

		const embedArray =
			(await embedSchema.find({author: interaction.user.id})) ?? [];

		const map = embedArray.map((embed) => `${embed.customID} - ${embed.name}`);

		const filtered = map
			.filter((embed) => new RegExp(focusedValue, "ig").test(`${embed}`))
			.sort(
				(a, b) =>
					parseInt(/^\d+/.exec(a)?.[0] ?? "0") -
					parseInt(/^\d+/.exec(b)?.[0] ?? "0"),
			);

		await interaction.respond(
			filtered.map((embed) => ({name: embed, value: embed})).slice(0, 25),
		);
	},
	async execute(interaction, client) {
		const input = interaction.options.getString("embed");

		let embedArray = await embedSchema.find({
			author: interaction.user.id,
		});

		let embed =
			(await embedSchema.findOne({
				author: interaction.user.id,
				customID: input?.match(/\d+/)?.[0],
			})) ??
			embedArray[
				embedArray.forEach((embed, index) => {
					if (new RegExp(input, "gi").test(embed.name)) {
						return index;
					}
				})
			];

		const channel =
			interaction.options.getChannel("channel") ?? interaction.channel;

		if (
			!embed &&
			!(
				interaction.options.getSubcommand() === "create" ||
				interaction.options.getSubcommand() === "all" ||
				interaction.options.getSubcommand() === "save"
			)
		) {
			return interaction.reply(
				new ErrorMessageBuilder("That embed does not exist!"),
			);
		}

		switch (interaction.options.getSubcommand()) {
			case "one": {
				await embedSchema.deleteOne({
					author: interaction.user.id,
					customID: embed.customID,
				});

				for (
					let index = embed.customID + 1;
					index <= embedArray.length;
					index++
				)
					await embedSchema.findOneAndUpdate(
						{
							author: interaction.user.id,
							customID: index,
						},
						{customID: index - 1},
					);

				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle("🗑 Embed Successfully deleted")
							.setColor("Red"),
					],
					ephemeral: true,
				});
				break;
			}
			case "create": {
				embed = new embedSchema({
					_id: new mongoose.Types.ObjectId(),
					name:
						interaction.options.getString("name") ??
						`${interaction.user.username}'s Embed`,
					author: interaction.user.id,
					customID: embedArray.length + 1,
					content: "",
					embeds: [],
					files: [],
					components: [],
				});

				await embed.save();

				embedArray = await embedSchema.find({author: interaction.user.id});

				await interaction.reply(
					new EmbedMessageBuilder(
						client,
						embed,
						embedArray,
						`Successfully created your \`${embedArray.length}${numberEnding(
							embedArray.length,
						)}\` embed builder! Select what you would like to do with it below.`,
					),
				);
				break;
			}
			case "edit": {
				await interaction.reply(
					new EmbedMessageBuilder(
						client,
						embed,
						embedArray,
						`Currently editing your \`${embed.customID}${numberEnding(
							embed.customID,
						)}\` embed builder! Select what you would like to do \n> with it below`,
					),
				);
				break;
			}
			case "all": {
				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle("🗑️ Confirm Deletion")
							.setColor("Red")
							.setDescription(
								"> Are you sure you would like to delete all your embed builders? You can not\n> undo this action.",
							),
					],
					ephemeral: true,
					components: [
						new ActionRowBuilder()
							.addComponents([
								new ButtonBuilder()
									.setLabel("Nevermind ❌")
									.setStyle(ButtonStyle.Danger)
									.setCustomId("embedDeletionNevermind")
									.toJSON(),
								new ButtonBuilder()
									.setStyle(ButtonStyle.Success)
									.setLabel("Confirm Deletion ✅")
									.setCustomId("embedDeletionConfirm")
									.toJSON(),
							])
							.toJSON(),
					],
				});
				break;
			}
			case "send": {
				await interaction.deferReply({ephemeral: true});

				const permissions = await checkPermissions(
					["ViewChannel", "SendMessages", "EmbedLinks"],
					[interaction.user, client.user],
					channel,
					interaction.guild,
					interaction.user,
				);

				if (!permissions.value) {
					return interaction.editReply(
						new ErrorMessageBuilder(permissions.message),
					);
				}

				if (
					!embed.content &&
					!embed.embeds.length &&
					!embed.files.length &&
					!embed.components.length
				) {
					return interaction.editReply(
						new ErrorMessageBuilder("Can not send an empty message!", true),
					);
				}

				await channel.send({
					content: embed.content,
					embeds: embed.embeds,
					files: embed.files.map((file) => file.link),
					components: embed.components,
				});

				await interaction.editReply(
					new SuccessMessageBuilder(
						`Embed successfully sent in channel ${channel}`,
					),
				);

				break;
			}
			case "save": {
				const id = interaction.options.getString("message");

				let message;

				try {
					message = await channel.messages.fetch(id);
				} catch (error) {
					message = await (
						await client.channels.fetch(id.split("/")[5])
					).messages.fetch(id.split("/")[6]);
				}

				if (!message) {
					return await interaction.reply(
						new ErrorMessageBuilder(
							"This message does not exist! Please input a valid message ID or link.",
							true,
						),
					);
				}

				const data = message.embeds?.[0]?.data;

				embed = new embedSchema({
					_id: new mongoose.Types.ObjectId(),
					name:
						data?.title ??
						cut(data?.description, 100) ??
						data?.author.name ??
						data?.footer?.text ??
						message.content ??
						(message.attachments.length
							? "Attachment"
							: `${interaction.user.username}'s Embed Builder`),
					author: interaction.user.id,
					customID: embedArray.length + 1,
					content: message.content,
					embeds: message.embeds.map((embed) => embed.data),
					files: [...message.attachments.values()].map((e) => ({
						name: e.name,
						link: e.attachment,
						type: e.contentType,
						size: e.size,
					})),
					components: message.components.map((component) => {
						component.type = component.data.type;
						delete component.data;

						component.components = component.components.map(
							(comp) => comp.data,
						);

						component.label = "Unnamed Component";

						return component;
					}),
				});

				await embed.save();

				embedArray = embedSchema.find({author: interaction.user.id});

				await interaction.reply(
					new EmbedMessageBuilder(
						client,
						embed,
						embedArray,
						`The message has been saved to your embed profile with the custom ID of \`${embedArray.length}\`.`,
					),
				);

				break;
			}
		}
	},
};
