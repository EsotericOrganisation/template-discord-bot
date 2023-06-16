import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SelectMenuOptionBuilder,
	SelectMenuBuilder,
	AttachmentBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	ApplicationCommandOptionType,
	resolveColor,
	Message,
	Client,
	ButtonInteraction,
	ChatInputCommandInteraction,
	Collection,
	SlashCommandBuilder,
	ContextMenuCommandBuilder,
	ApplicationCommandOptionBase,
	ToAPIApplicationCommandOptions,
	Interaction,
	MessageReaction,
} from "discord.js";
import {
	wordNumberEnding,
	cut,
	numberEnding,
	isValidURL,
	resolveDate,
	capitaliseFirst,
	colourMatch,
	parseMath,
	includes,
	findNumber,
	findRoot,
	clearFormatting,
	mathParse,
	objectMap,
} from "./functions.js";
import chalk from "chalk";
import {readdirSync, readFileSync} from "fs";
import {Canvas} from "canvas";
import {
	slimeBotEmojis,
	emojiArray,
	rainbowColourArray,
	commandCategories,
	optionEmojis,
	colourArray,
} from "./util.js";
import Decimal from "decimal.js";
import {Parser} from "expr-eval";

/**
 * Class to create an error message. Returns an ephemeral embed with a title and description.
 * @param {string} errorMessage The error message.
 * @param {boolean?} simple Whether to create a simple error message.
 */
class ErrorMessageBuilder {
	embeds: EmbedBuilder[];
	ephemeral: boolean;
	constructor(errorMessage: string, simple?: boolean) {
		this.embeds = [
			new EmbedBuilder()
				.setTitle(simple ? null : `${slimeBotEmojis.errorEmoji} Error`)
				.setDescription(
					`> ${simple ? `${slimeBotEmojis.errorEmoji} ` : ""}${errorMessage}`,
				)
				.setColor("Red"),
		];
		this.ephemeral = true;
	}
}

/**
 * Class to create a success message. Returns an ephemeral embed with a title and description.
 * @param {String} successMessage The success message.
 * @param {Boolean=false} simple Whether the success message should be simple.
 */
class SuccessMessageBuilder {
	embeds: EmbedBuilder[];
	ephemeral: boolean;
	constructor(successMessage: string, simple: boolean = false) {
		this.embeds = [
			new EmbedBuilder()
				.setTitle(simple ? null : `${slimeBotEmojis.successEmoji} Success!`)
				.setDescription(
					`> ${simple ? slimeBotEmojis.successEmoji : ""}${successMessage}`,
				)
				.setColor("Green"),
		];
		this.ephemeral = true;
	}
}

/**
 * Get information about an interaction.
 * @param {Object} interaction The interaction to get information about.
 * @param {String} txt Optional other message to display.
 * @returns {String} A string with information about the interaction.
 */
class InteractionInformationMessageBuilder {
	text: string;
	constructor(interaction: Interaction, txt: string) {
		this.text =
			(txt ?? "") +
			chalk.whiteBright(
				chalk.bold("\nInteraction date: ") +
					new Date(interaction.createdTimestamp) +
					chalk.bold("\nInteraction timestamp: ") +
					interaction.createdTimestamp +
					chalk.bold("\nGuild name: ") +
					interaction.guild?.name +
					chalk.bold("\nGuild ID: ") +
					interaction.guild?.id +
					chalk.bold("\nChannel name: ") +
					interaction.channel?.name +
					chalk.bold("\nChannel ID: ") +
					interaction.channel?.id +
					chalk.bold("\nUser tag: ") +
					interaction.user.tag +
					chalk.bold("\nUser ID: ") +
					interaction.user.id +
					chalk.bold("\nMessage content: ") +
					(interaction.message?.content === ""
						? chalk.italic("No content")
						: interaction.message?.content) +
					chalk.bold("\nMessage embed title: ") +
					(interaction.message?.embeds?.[0]?.data?.title ??
						chalk.italic("No embeds or no embed title")) +
					chalk.bold("\nMessage ID: ") +
					interaction.message?.id +
					chalk.bold("\nMessage date: ") +
					new Date(interaction.message?.createdTimestamp) +
					chalk.bold("\nMessage timestamp: ") +
					interaction.message?.createdTimestamp,
			);
	}
}

class PollMessageBuilder {
	emojis: (string | null)[];
	options: (string | null)[];
	content: string;
	embeds: EmbedBuilder[];
	files: string[];
	constructor() {
		this.emojis = [];
		this.options = [];
		this.content = "";
		this.embeds = [];
		this.files = [];
	}
	async create(
		data: {message: Message} | MessageReaction | ChatInputCommandInteraction,
		client: Client,
	) {
		const embed = !(data instanceof ChatInputCommandInteraction)
			? data.message?.embeds?.[0]?.data
			: undefined;
		const role =
			data instanceof ChatInputCommandInteraction
				? data.options.getRole("required-role")
				: null;
		const timestamp =
			data instanceof ChatInputCommandInteraction
				? data.options.getString("duration")
				: null;
		const ping =
			data instanceof ChatInputCommandInteraction
				? data.options.getRole("ping")
				: null;
		const pollEnd = embed
			? embed.fields?.[1].value.match(/(?<=\*Poll ends:\* <t:)\d+(?=>)/)?.[0]
			: null;

		this.emojis = [];

		this.options = [];

		const emojiReg =
			/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟)/;

		const afterEmojiReg =
			/(?<=^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟)).+/;

		if (embed) {
			const optionArray = embed.description
				.match(
					/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟).+/gm,
				)
				.filter((option: string) => !option.startsWith("█"));

			for (const option of optionArray) {
				const emoji = option.match(emojiReg)[0];

				if (emojiArray.includes(emoji)) {
					const index = emojiArray.indexOf(emoji);
					this.emojis[index] = emoji;
					this.options[index] = option.match(afterEmojiReg)?.[0] ?? " ";
				} else {
					this.emojis.push(option.match(emojiReg)[0]);
					this.options.push(option.match(afterEmojiReg)?.[0] ?? " ");
				}
			}
		} else if (data instanceof ChatInputCommandInteraction) {
			for (let i = 1; i <= 10; i++) {
				const option = data.options.getString(`choice-${i}`);

				const emoji = (option ?? "").match(emojiReg)?.[0];

				const afterEmojiMatch = (option ?? "").match(afterEmojiReg)?.[0];

				if (
					emoji &&
					!this.emojis.includes(emoji) &&
					!emojiArray.includes(emoji)
				) {
					this.emojis.push(emoji);
					this.options.push(afterEmojiMatch ?? " ");
				} else {
					const optionEmojisOption: string | undefined =
						optionEmojis[(option ?? "").toLowerCase()];

					this.emojis.push(
						option
							? optionEmojisOption && !this.emojis.includes(optionEmojisOption)
								? optionEmojisOption
								: emojiArray[i - 1]
							: null,
					);
					this.options.push(option);
				}
			}

			this.emojis = this.emojis.filter((emoji) => emoji).length
				? this.emojis
				: ["👍", "👎"];
			this.options = this.options.filter((option) => option).length
				? this.options
				: ["Yes", "No"];
		}

		if (!(data instanceof ChatInputCommandInteraction))
			this.content = data.message?.content ?? (ping ? `<@&${ping.id}>` : "");

		let description = "";

		const reactions = !(data instanceof ChatInputCommandInteraction)
			? [...data.message.reactions.cache.values()].filter((reaction) =>
					this.emojis.includes(reaction._emoji.name),
			  )
			: this.options.filter((option) => option).map(() => ({count: 1}));

		const totalReactions = reactions.reduce(
			(totalReactions, reaction) => totalReactions + reaction.count - 1,
			0,
		);

		const canvas = new Canvas(500, 500);
		const ctx = canvas.getContext("2d");

		ctx.save();

		let currentAngle = 0;
		let reactionIndex = 0;

		for (let i = 0; i < 10; i++) {
			if (this.options[i]) {
				const progressBar =
					(reactions
						? reactions.map((reaction) => reaction.count - 1)[reactionIndex] /
						  totalReactions
						: 0) * 10 || 0;

				description += `\n\n${this.emojis[i]} ${this.options[i]}\n\`${
					"█".repeat(Math.round(progressBar)) +
					" ".repeat(Math.round(10 - progressBar))
				}\` | ${(progressBar * 10).toFixed(2)}% (${
					reactions
						? reactions.map((e) => e.count - 1)[reactionIndex] ?? 0
						: "0"
				})`;

				if (reactions[reactionIndex].count - 1 || totalReactions === 0) {
					ctx.restore();

					const portionAngle =
						((reactions[reactionIndex].count - 1) / totalReactions ||
							1 / this.options.filter((option) => option).length) *
						2 *
						Math.PI;

					ctx.beginPath();

					ctx.arc(250, 250, 250, currentAngle, currentAngle + portionAngle); // Draws circle slice with radius of 250 around x: 250, y:250.

					currentAngle += portionAngle;

					ctx.lineTo(250, 250); // Draws a line to the center of the circle.

					ctx.fillStyle = rainbowColourArray[i];

					ctx.fill(); // Fills the circle.

					ctx.fillStyle = "#FFFFFF";

					ctx.translate(250, 250); // Center the canvas around the center of the pie chart.

					// If the option is the only option with any votes, then the option text will be displayed in the middle of the pie chart.
					if (
						totalReactions !== reactions[reactionIndex].count - 1 ||
						!totalReactions
					) {
						ctx.rotate(currentAngle - portionAngle * 0.5); // Rotate the canvas so the x axis intersects the center radius of one of current sector of the pie chart.

						ctx.translate(250 / 2, 0); // Move the canvas forward so it is now centered around the center point of the current sector of the pie chart.

						ctx.rotate(-(currentAngle - portionAngle * 0.5)); // Rotate the canvas so it is now the normal rotation.
					}

					const fontSize = Math.min(
						(reactions[reactionIndex].count / totalReactions) * 25,
						25,
					);

					ctx.font = `${fontSize}px "Noto Colour Emoji"`;

					const emojiLength = ctx.measureText(this.emojis[i]).width;

					ctx.font = `${fontSize}px "Odin Rounded Light"`;

					const text = `${this.options[i]?.trim() ? " " : ""}${this.options[
						i
					]?.trim()} - ${(progressBar * 10).toFixed(2)}%`;

					const textLength = ctx.measureText(text).width;

					const stringLength = emojiLength + textLength;

					ctx.translate(-(stringLength / 2), fontSize / 2); // Move the canvas back so the text is centered.

					ctx.font = `${fontSize}px "Noto Colour Emoji"`;

					ctx.fillText(this.emojis[i], 0, 0); // Writes the emoji.

					ctx.translate(emojiLength, 0); // Move forward so the text is after the emoji

					ctx.font = `${fontSize}px "Odin Rounded Light"`;

					ctx.fillText(text, 0, 0); // Writes the text.

					ctx.translate(-emojiLength, 0); // Moves back the length of the emoji.

					ctx.translate(stringLength / 2, -fontSize / 2); // Start undoing the whole process (move the canvas forward so it is centred around the center point of the current sector of the pie chart.)

					if (
						totalReactions !== reactions[reactionIndex].count - 1 ||
						!totalReactions
					) {
						ctx.rotate(currentAngle - portionAngle * 0.5); // Rotate it and prepare to go back to the center of the pie chart.

						ctx.translate(-(250 / 2), 0); // Go back to the center of the pie chart.

						ctx.rotate(-(currentAngle - portionAngle * 0.5)); // Rotate it normally.
					}

					ctx.translate(-250, -250); // Center the canvas around 0, 0.
				}

				reactionIndex++;
			}
		}

		let attachment: AttachmentBuilder | string = new AttachmentBuilder(
			canvas.toBuffer(),
			{
				name: `slime-bot-poll-${new Date(Date.now())}.png`,
			},
		);

		const user = await client.users.fetch("500690028960284672");

		const message: Message = await user.send({files: [attachment]});

		attachment = [...message.attachments.values()][0].attachment.toString();

		const pollTime =
			timestamp || pollEnd
				? pollEnd ||
				  Math.round(
						(Date.now() +
							resolveDate(
								/^in.+/.test(timestamp.trim())
									? timestamp.match(/(?<=^in).+/)[0]
									: timestamp,
							)) /
							1000,
				  )
				: null;

		this.embeds = [
			new EmbedBuilder()
				.setTitle(embed?.title ?? data.options.getString("message"))
				.setDescription(
					(embed
						? embed.description.match(
								RegExp(
									`^[\\s\\S]+(?=${this.emojis.filter((emoji) => emoji)[0]})`,
									"gm",
								),
						  )?.[0] ?? ""
						: data.options.getString("description") ?? "") + description,
				)
				.setColor(
					embed?.color ??
						(() => {
							try {
								return resolveColor(data.options.getString("colour"));
							} catch (error) {}
							return null;
						})() ??
						0x5865f2,
				)
				.setAuthor({
					name: `${client.user?.username} Poll${
						pollEnd && pollEnd * 1000 <= Date.now() ? " - Ended" : ""
					}`,
					iconURL: client.user?.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setFooter({
					text: embed?.footer?.text ?? `Poll by ${data.user.username}`,
					iconURL:
						embed?.footer?.icon_url ??
						data.user.displayAvatarURL({
							size: 4096,
							extension: "png",
						}),
				})
				.setTimestamp(
					embed?.timestamp ? Date.parse(embed.timestamp) : Date.now(),
				)
				.addFields([
					{
						name: "👤 Poll Creator",
						value:
							embed?.fields?.[0]?.value ??
							(data.options.getBoolean("anonymous")
								? "Anonymous"
								: `<@${data.user.id}>`),
						inline: true,
					},
					{
						name: "⚙ Poll Settings",
						value:
							embed && !pollEnd
								? embed.fields[1].value
								: `*Max options:* \`${
										embed
											? /(?<=\*Max options:\* `).+(?=`)/.exec(
													embed.fields[1].value,
											  )[0]
											: data.options.getString("max-options") ?? "Unlimited"
								  }\`\n*Required role:* ${
										role
											? `<@&${role.id}>`
											: embed
											? /(?<=\*Required role:\* )(`None`|<@&\d+>)/.exec(
													embed.fields[1].value,
											  )[0]
											: "`None`"
								  }\n*Poll end${
										pollEnd && pollEnd * 1000 <= Date.now() ? "ed" : "s"
								  }:* ${
										timestamp || pollEnd
											? `<t:${pollTime}> (<t:${pollTime}:R>)`
											: "`Never`"
								  }`,
						inline: true,
					},
				])
				.setThumbnail(attachment),
		];

		this.files = data.message
			? [...data.message.attachments.values()].map(
					(attachment) => attachment.attachment,
			  )
			: [];

		if (!data.message) {
			for (const attachment of (
				data.options.getString("attachments") ?? ""
			).split(",")) {
				if (isValidURL(attachment)) {
					this.files.push(attachment);
				}
			}
		}
		return this;
	}
}

/**
 * Handy constructor class to create the message displaying the users embeds.
 * @param {Object} embedArray
 * @param {ChatInputCommandInteraction | ButtonInteraction} interaction
 * @param {Client} Object
 * @param {number} page
 */
class EmbedsMessageBuilder {
	embeds: EmbedBuilder[];
	components: ActionRowBuilder[];
	constructor(
		embedArray,
		interaction: ChatInputCommandInteraction | ButtonInteraction,
		client: Client,
		page: number,
	) {
		const count = embedArray.length;
		embedArray = embedArray.slice(25 * (page - 1), 25 * (page - 1) + 25);

		this.embeds = [
			new EmbedBuilder()
				.setTitle(`${interaction.user.username}'s Embed Builders`)
				.setColor("#10ff50")
				.setDescription(
					`> You have \`${count}\` active embed builder${wordNumberEnding(
						count,
					)}. Use \`/embed create\` to ${
						count === 0 ? "start creating embeds" : "create more"
					}.\n\n${embedArray
						.map((embed) => `**${embed.customID}** - ${embed.name}`)
						.join("\n")}`,
				)
				.setFooter(
					count > 25
						? {
								text: `Page ${page}/${Math.ceil(count / 25)}`,
						  }
						: null,
				)
				.setTimestamp(Date.now())
				.setAuthor({
					name: client.user?.username ?? "🌳 Slime Bot [/]",
					iconURL: `${client.user?.displayAvatarURL({
						size: 4096,
						extension: "png",
					})}`,
				}),
		];

		this.components = [];

		if (embedArray.length) {
			this.components = [
				new ActionRowBuilder().addComponents(
					new SelectMenuBuilder()
						.setCustomId("embeds")
						.setMinValues(1)
						.setMaxValues(1)
						.setOptions(
							embedArray.map((embed) => ({
								label: `${embed.customID} - ${embed.name}`,
								value: `${embed.customID}`,
								description: `Embeds: ${embed.embeds.length}, Components: ${embed.components.length}, Files: ${embed.files.length}`,
								emoji: "🎨",
							})),
						)
						.setPlaceholder("🎨 Select an embed..."),
				),
			];
		}

		if (count > 25) {
			this.components.push(
				new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId("embedsMenuBack")
							.setEmoji("◀")
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(page === 1),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId("embedsMenuForward")
							.setEmoji("▶")
							.setStyle(ButtonStyle.Secondary)
							.setDisabled(page === Math.ceil(count / 25)),
					),
			);
		}
	}
}

/**
 * Handy constructor class to create a message displaying information about a user's embed and allow the user to edit it using buttons.
 * @param {DiscordBotClient} client The bot client.
 * @param {embedSchema.tree} embedProfile The data of the embed to display information about.
 * @param {embedSchema.tree[]} embedArray Array of all the user's embeds.
 * @param {String} description An extra message to display above the embed data.
 */
class EmbedMessageBuilder {
	embeds: EmbedBuilder[];
	components: ActionRowBuilder[];
	constructor(client: Client, embedProfile, embedArray, description: string) {
		const page = Math.ceil(embedProfile.customID / 25);
		embedArray = embedArray.slice(25 * (page - 1), 25 * (page - 1) + 25);

		description += `\n\n**📝 Content:**\n${
			embedProfile.content === ""
				? "*No content*"
				: cut(`"${embedProfile.content}"`, 64)
		}`;
		description += "\n\n**🎨 Embeds:**\n";

		for (const embed of embedProfile.embeds) {
			const properties =
				Object.values(embed).filter((value) => value).length - 1;

			description += `*${embed.title}*\n> \`${properties}\` Propert${
				properties === 1 ? "y" : "ies"
			}\n> Description: ${cut(
				embed.description,
				61,
			)}\n> Colour: \`${colourMatch(
				embed.color.toString(16),
			)} ${embed.color.toString(16)}\`\n`;
		}

		if (!embedProfile.embeds.length) description += "*No embeds*\n";
		description += "\n**🗃 Files:**\n";
		for (const file of embedProfile.files) {
			description += `*${file.name}*\n> Link: [${cut(file.link, 67)}](${
				file.link
			})\n> Type: ${file.type}\n> Size: ${(file.size / 1000000).toPrecision(
				1,
			)} MB\n\n`;
		}
		if (!embedProfile.files.length) description += "*No files*\n";
		description += "\n**📋 Components:**";
		for (const actionRow of embedProfile.components) {
			description += `\n*Action Row - ${
				actionRow.components.length
			} component${wordNumberEnding(actionRow.components.length)}*\n`;
			for (const component of actionRow.components) {
				description += `> ${
					component.type === 2 ? "⏸️ Button" : "📋 Select Menu"
				} - ${component.label ?? component.placeholder}\n`;
			}
			if (!actionRow.components.length) description += "*No components*\n";
		}
		if (!embedProfile.components.length) description += "\n*No components*";

		this.embeds = [
			new EmbedBuilder()
				.setTitle(`🎨 Embed Builder - ${embedProfile.name}`)
				.setDescription(`> ${description}`)
				.setColor(embedProfile.embeds[0]?.color ?? "Green")
				.setAuthor({
					name: client.user?.username ?? "🌳 Slime Bot [/]",
					iconURL: client.user?.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setTimestamp(Date.now())
				.setFooter({
					text: `Editing Embed Builder ${embedProfile.customID}`,
					iconURL:
						"https://cdn.discordapp.com/attachments/1020058739526619186/1051111672938496070/pen_2.png",
				}),
		];

		this.components = [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("embedBackBack")
					.setLabel("Back")
					.setEmoji("⏪")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId("embedHelp")
					.setLabel("Help")
					.setEmoji("❓")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId("embedSend")
					.setLabel("Send")
					.setEmoji("💬")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId("embedPreview")
					.setLabel("Preview")
					.setEmoji("👥")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId("embedDelete")
					.setLabel("Delete Embed")
					.setEmoji("🗑")
					.setStyle(ButtonStyle.Danger),
			),
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("embedEditEmbeds")
					.setLabel("Edit Embeds")
					.setEmoji("📝")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("embedEditFiles")
					.setLabel("Edit Files")
					.setEmoji("📝")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("embedEditComponents")
					.setLabel("Edit Components")
					.setEmoji("📝")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("embedEditContent")
					.setLabel("Edit Content")
					.setEmoji("📝")
					.setStyle(ButtonStyle.Secondary),
			),
			new ActionRowBuilder().addComponents(
				new SelectMenuBuilder()
					.setCustomId("embeds")
					.setMinValues(1)
					.setMaxValues(1)
					.setOptions(
						embedArray.map((embed) => ({
							label: `${embed.customID} - ${embed.name}`,
							value: `${embed.customID}`,
							description: `Embeds: ${embed.embeds.length}, Components: ${embed.components.length}, Files: ${embed.files.length}`,
							default: embed.customID === embedProfile.customID,
							emoji: "🎨",
						})),
					)
					.setPlaceholder("🎨 Select an embed..."),
			),
		];
	}
}

class EmbedClassBuilder {
	class: Function;
	constructor(
		name: string,
		emoji: string,
		titleEmoji: string,
		descriptionFunction: (data: any, selected?: boolean) => string,
		selectMenuOptionFunction: (
			data: unknown,
			index: number,
		) => {
			label: string;
			value: string;
			description: string;
		},
		selectedButtonArray: ButtonBuilder[],
	) {
		this.class = class {
			embeds: EmbedBuilder[];
			components: ActionRowBuilder[];
			constructor(embedData, selected: number, client: Client) {
				let description = `> Currently editing your \`${
					embedData.customID
				}${numberEnding(
					embedData.customID,
				)}\` embed builder. Edit it's ${name}s here.`;

				embedData[`${name}s`].forEach((type, index) => {
					description += `\n\n${index === selected ? "```md\n" : ""}${
						index + 1
					}. ${cut(
						type.name ?? type.title ?? type.label,
						61 - 2 - `${index + 1}`.length,
					)}${
						index === selected
							? `\n====${"=".repeat(
									(type.name ?? type.title ?? type.label).length -
										2 +
										`${index + 1}`.length,
							  )}\n<SELECTED>`.slice(0, 62)
							: ""
					}\n${
						index === selected
							? descriptionFunction(type, true)
									.replace(/>/g, "-")
									.replace(/`/g, "")
							: descriptionFunction(type)
					}${index === selected ? "```" : ""}`;
				});

				if (!embedData[`${name}s`].length) description += `\n\n*No ${name}s*`;

				this.embeds = [
					new EmbedBuilder()
						.setTitle(`${titleEmoji} ${embedData.name} - Editing ${name}s`)
						.setDescription(description)
						.setColor(embedData.embeds[0]?.color ?? "Green")
						.setAuthor({
							name: client.user?.username ?? "🌳 Slime Bot [/]",
							iconURL: client.user?.displayAvatarURL({
								size: 4096,
								extension: "png",
							}),
						})
						.setFooter({
							text:
								selected !== null
									? `Editing ${capitaliseFirst(name)} ${selected + 1}`
									: `Editing Embed Builder ${embedData.customID}`,
							iconURL:
								"https://cdn.discordapp.com/attachments/1020058739526619186/1051111672938496070/pen_2.png",
						})
						.setTimestamp(Date.now()),
				];

				name = capitaliseFirst(name);

				this.components =
					selected !== null
						? ((...buttons) => {
								const resultArray = [];

								for (let i = 0; i < buttons.length; i += 5) {
									resultArray.push(
										new ActionRowBuilder().addComponents(
											buttons.slice(i, i + 5),
										),
									);
								}

								return resultArray;
						  })(
								new ButtonBuilder()
									.setEmoji("⏪")
									.setLabel("Back")
									.setCustomId(`embedEdit${name}s`)
									.setStyle(ButtonStyle.Primary),
								...selectedButtonArray,
								new ButtonBuilder()
									.setCustomId("embedDeleteComponent")
									.setEmoji(emoji)
									.setLabel(`Delete ${name}`)
									.setStyle(ButtonStyle.Secondary),
								new ButtonBuilder()
									.setCustomId("embedEditUp")
									.setEmoji("🔼")
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId("embedEditDown")
									.setEmoji("🔽")
									.setStyle(ButtonStyle.Primary),
						  )
						: [
								new ActionRowBuilder().addComponents(
									new ButtonBuilder()
										.setEmoji("⏪")
										.setLabel("Back")
										.setCustomId("embedBack")
										.setStyle(ButtonStyle.Primary),
									new ButtonBuilder()
										.setCustomId("embedAddComponent")
										.setEmoji(emoji)
										.setLabel(`Add ${name}s`)
										.setStyle(ButtonStyle.Secondary),
									new ButtonBuilder()
										.setCustomId("embedRemoveComponents")
										.setEmoji(emoji)
										.setLabel(`Remove ${name}s`)
										.setStyle(ButtonStyle.Secondary),
								),
						  ];

				name = name.toLowerCase();

				if (embedData[`${name}s`].length)
					this.components.push(
						new ActionRowBuilder().addComponents(
							new SelectMenuBuilder()
								.setCustomId("embedEdit")
								.setPlaceholder(`${emoji} Edit ${name}...`)
								.setOptions(
									embedData[`${name}s`].map((type, index) => ({
										...selectMenuOptionFunction(type, index),
										default: index === selected,
										emoji: emoji,
									})),
								)
								.setMinValues(1)
								.setMaxValues(1),
						),
					);
			}
		};
	}
}

const EmbedFileMessageBuilder = new EmbedClassBuilder(
	"file",
	"📁",
	"🗃️",
	(fileData, selected) =>
		`> Link: ${!selected ? "[" : ""}${cut(fileData.link, selected ? 53 : 67)}${
			!selected ? "](" : ""
		}${!selected ? fileData.link : ""}${!selected ? ")" : ""}\n> Type: ${
			fileData.type
		}\n> Size: ${(fileData.size / 1000000).toPrecision(1)}MB`,
	(fileData, index) => ({
		label: cut(fileData.name, 100),
		value: `${index}`,
		description: cut(fileData.link, 100),
	}),
	[
		new ButtonBuilder()
			.setCustomId("embedFileEditEdit")
			.setEmoji("📁")
			.setLabel("Edit File")
			.setStyle(ButtonStyle.Secondary),
	],
).class;

const EmbedEmbedMessageBuilder = new EmbedClassBuilder(
	"embed",
	"🎨",
	"💬",
	(embedData, selected) => {
		const properties =
			Object.values(embedData).filter((value) => value).length - 1;
		return `> \`${properties}\` Propert${
			properties === 1 ? "y" : "ies"
		}\n> Description: ${cut(
			embedData.description,
			selected ? 46 : 61,
		)}\n> Colour: \`${colourMatch(
			embedData.color.toString(16),
		)} ${embedData.color.toString(16)}\`\n`;
	},
	(embedData, index) => ({
		label: embedData.title,
		value: `${index}`,
		description: cut(embedData.description, 100),
	}),
	[
		new ButtonBuilder()
			.setCustomId("embedEdit1")
			.setLabel("📝 Basic Elements")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("embedEdit2")
			.setLabel("📝 Footer and Images")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("embedEdit3")
			.setLabel("📝 Author")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("embedFieldsAdd")
			.setLabel("📝 Insert Field")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("embedFieldsEdit")
			.setLabel("📝 Edit Field")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId("embedFieldsRemove")
			.setLabel("📝 Remove Fields")
			.setStyle(ButtonStyle.Secondary),
	],
).class;

const EmbedComponentMessageBuilder = new EmbedClassBuilder(
	"component",
	"📋",
	"📋",
	(componentData) =>
		`**Action Row - ${
			componentData.components.length
		} component${wordNumberEnding(
			componentData.components.length,
		)}**\n${(() => {
			let description = "";
			for (const component of componentData.components) {
				description += `> ${
					component.type === 2 ? "⏸️ Button" : "📋 Select Menu"
				} - ${component.label ?? component.placeholder}\n`;
			}
			if (!componentData.components.length) description += "*No components*\n";
			return description;
		})()}`,
	(componentData, index) => ({
		label: componentData.label ?? componentData.placeholder ?? "Component",
		value: `${index}`,
		description: cut(componentData.description, 100),
	}),
	[],
).class;

class CommandCategoriesMessageBuilder {
	embeds: EmbedBuilder[];
	components: ActionRowBuilder[];
	constructor(interaction, client: Client) {
		const botData = JSON.parse(readFileSync("./data/bot.json").toString());

		let description = `This is a list of command categories for <@${
			process.env.clientID
		}>. Select a category in the select menu below to view individual commands.\n\nThere are currently **\`${
			commandCategories.length
		}\`** command categories and **\`${commandCategories
			.map(
				(category) =>
					readdirSync(
						`./src/commands/${/\w+$/.exec(category)[0].toLowerCase()}`,
					).length,
			)
			.reduce((a, e) => a + e, 0)}\`** total commands.\n`;

		for (const category of commandCategories) {
			const categoryName = /\w+$/.exec(category)?.[0]?.toLowerCase();

			let categorySettings;

			try {
				categorySettings = JSON.parse(
					readFileSync(
						`./src/commands/${categoryName}/settings.json`,
					).toString(),
				);
			} catch (error) {}

			description += `\n**${categorySettings?.name ?? category}**\n> ${
				categorySettings?.description ??
				"*There is currently no description for this category.*"
			}\n`;

			const categoryCommands = readdirSync(`./src/commands/${categoryName}`)
				.filter((command) => command.endsWith(".js"))
				.map((command) => command.match(/.+(?=\.js)/)[0])
				.sort((a, b) => {
					const aTotalUses = botData.commandUsage[a]?.length ?? 0;

					const bTotalUses = botData.commandUsage[b]?.length ?? 0;

					return bTotalUses - aTotalUses;
				})
				.map((command) => require(`./commands/${categoryName}/${command}`));

			const popularCommands = categoryCommands.slice(0, 3).map((command) => {
				const popularCommandID = commandIDMap[command.data.name];

				return `**${
					popularCommandID
						? `</${command.data.name}:${popularCommandID}>`
						: `\`${command.data.type === 1 || !command.data.type ? "/" : ""}${
								command.data.name
						  }\``
				}**`;
			});

			description += `> Most popular command${wordNumberEnding(
				popularCommands.length,
			)}: ${popularCommands.join(", ")}.\n`;

			description += `> \`${categoryCommands.length} command${wordNumberEnding(
				categoryCommands.length,
			)}.\`\n`;
		}

		this.embeds = [
			new EmbedBuilder()
				.setTitle("Commands")
				.setDescription(description)
				.setColor("Blue")
				.setAuthor({
					name: client.user?.username,
					iconURL: client.user.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setFooter({
					text: `Requested by ${interaction.user.username}`,
					iconURL: interaction.user.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setTimestamp(Date.now()),
		];

		console.log(commandCategories);

		this.components = [
			new ActionRowBuilder().addComponents(
				new SelectMenuBuilder()
					.setCustomId("commandCategories")
					.setMinValues(1)
					.setMaxValues(1)
					.setPlaceholder("💻 Select a category...")
					.setOptions(
						commandCategories.map((category) => ({
							label: category.match(
								/(?<=\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪).+/,
							)[0],
							value: category,
							emoji: category.match(
								/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/,
							)[0],
						})),
					),
			),
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setEmoji("◀")
					.setStyle(ButtonStyle.Primary)
					.setCustomId("help"),
				new ButtonBuilder()
					.setEmoji("🔎")
					.setLabel("Search")
					.setStyle(ButtonStyle.Success)
					.setCustomId("commandSearch"),
			),
		];
	}
}

class CommandCategoryMessageBuilder {
	embeds: EmbedBuilder[];
	components: ActionRowBuilder[];
	constructor(categoryName, interaction, client, search, sort) {
		const botData = JSON.parse(readFileSync("./data/bot.json").toString());

		const commands = (
			Array.isArray(categoryName)
				? categoryName
				: readdirSync(`./src/commands/${categoryName}`)
						.filter((command) => command.endsWith(".js"))
						.map(
							(command) =>
								require(`./commands/${categoryName}/${
									command.match(/.+(?=\.js)/)[0]
								}`).data.name,
						)
		)
			.sort((a, b) => {
				const aTotalUses = botData.commandUsage[a]?.length ?? 0;

				const bTotalUses = botData.commandUsage[b]?.length ?? 0;

				return sort === "popularity" || !sort
					? bTotalUses - aTotalUses
					: sort === "a-z"
					? a > b
						? 1
						: a < b
						? -1
						: 0
					: b > a
					? 1
					: b < a
					? -1
					: 0;
			})
			.sort((a) => {
				let commandData;
				if (Array.isArray(categoryName)) {
					for (const commandCategory of commandCategories) {
						try {
							commandData = require(`./commands/${/\w+$/
								.exec(commandCategory)[0]
								.toLowerCase()}/${a.replace(/ /g, "").toLowerCase()}`);

							break;
						} catch (error) {}
					}
				} else {
					commandData = require(`./commands/${categoryName}/${a
						.toLowerCase()
						.replace(/ /g, "")}`);
				}

				return commandData.data.type === 2 ? -1 : 0;
			});

		let slashCommand;
		let userCommand;
		let messageCommand;

		let description = `> In this menu you can view individual commands. Use the select menu below to select a command and get more information about it.\n\n${
			Array.isArray(categoryName) && !categoryName.length ? "*No results*" : ""
		}`;

		for (const command of commands) {
			let commandData;

			if (Array.isArray(categoryName)) {
				for (const commandCategory of commandCategories) {
					try {
						commandData = require(`./commands/${commandCategory
							.match(/\w+$/)[0]
							.toLowerCase()}/${command.replace(/ /g, "").toLowerCase()}`);
						break;
					} catch (error) {
						continue;
					}
				}
			} else {
				commandData = require(`./commands/${categoryName}/${command
					.toLowerCase()
					.replace(/ /g, "")}`);
			}

			if (
				!slashCommand &&
				(commandData.data.type === 1 || !commandData.data.type)
			) {
				description += "**`Slash Commands:`**\n";
				slashCommand = true;
			} else if (!userCommand && commandData.data.type === 2) {
				description += "**`User Commands:`**\n";
				userCommand = true;
			} else if (!messageCommand && commandData.data.type === 3) {
				description += "**`Message Commands:`**\n";
				messageCommand = true;
			}

			const commandID = commandIDMap[command];

			description += `**${
				commandID
					? `</${commandData.data.name}:${commandID}>`
					: `${
							commandData.data.type === 1 || !commandData.data.type ? "/" : ""
					  }${commandData.data.name}`
			}**${
				commandData.data.type === 1 || !commandData.data.type
					? " - *Slash Command*"
					: commandData.data.type === 2
					? " - *User Command*"
					: " - *Message Command*"
			}`;

			description += `\n> ${
				commandData.description ?? commandData.data.description ?? ""
			}`;

			description += "\n\n";
		}

		const footer = interaction.message?.embeds?.[0]?.data?.footer ?? {
			text: `Requested by ${interaction.user.username}`,
			// eslint-disable-next-line camelcase
			icon_url: interaction.user.displayAvatarURL({
				size: 4096,
				extension: "png",
			}),
		};

		const author = interaction.message?.embeds?.[0]?.data?.author ?? {
			name: client.user?.username,
			// eslint-disable-next-line camelcase
			icon_url: client.user.displayAvatarURL({
				size: 4096,
				extension: "png",
			}),
		};

		let categorySettings: {name: string};
		try {
			categorySettings = JSON.parse(
				readFileSync(`./src/commands/${categoryName}/settings.json`).toString(),
			);
		} catch (error) {}

		this.embeds = [
			new EmbedBuilder()
				.setTitle(
					`Commands - ${
						categorySettings?.name ??
						(Array.isArray(categoryName)
							? `🔎 Showing results for "${search}"`
							: categoryName)
					}`,
				)
				.setDescription(description)
				.setColor("Blue")
				.setAuthor({
					name: author.name,
					iconURL: author.icon_url,
				})
				.setFooter({
					text: footer.text,
					iconURL: footer.icon_url,
				})
				.setTimestamp(Date.now()),
		];

		this.components = [
			new ActionRowBuilder().addComponents(
				new SelectMenuBuilder()
					.setCustomId("commandCategories")
					.setMinValues(1)
					.setMaxValues(1)
					.setPlaceholder("💻 Select a category...")
					.setOptions([
						{label: "Search", value: "search", emoji: "🔎"},
						...commandCategories.map((category) =>
							new SelectMenuOptionBuilder()
								.setLabel(
									category.match(
										/(?<=\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪).+/,
									)[0],
								)
								.setValue(
									category.match(
										/(?<=\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪).+/,
									)[0],
								)
								.setDefault(
									!Array.isArray(categoryName) &&
										RegExp(categoryName, "ig").test(category),
								)
								.setEmoji(
									category.match(
										/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/,
									)[0],
								),
						),
					]),
			),
			...(Array.isArray(categoryName) && !categoryName.length
				? []
				: [
						new ActionRowBuilder().addComponents(
							new SelectMenuBuilder()
								.setMaxValues(1)
								.setMinValues(1)
								.setPlaceholder("📜 Sort by...")
								.setCustomId("sortBy")
								.addOptions(
									{
										label: "Popularity",
										value: "popularity",
										emoji: "👥",
										default: /popularity/.test(sort) || !sort,
									},
									{
										label: "A-Z",
										value: "a-z",
										emoji: "🇦",
										default: /a-z/.test(sort),
									},
									{
										label: "Z-A",
										value: "z-a",
										emoji: "🇿",
										default: /z-a/.test(sort),
									},
								),
						),
						new ActionRowBuilder().addComponents(
							new SelectMenuBuilder()
								.setMaxValues(1)
								.setMinValues(1)
								.setPlaceholder("🤖 Select a command...")
								.setCustomId("commandSelection")
								.addOptions(
									commands.map((command) => {
										let commandData;
										if (Array.isArray(categoryName)) {
											for (const commandCategory of commandCategories) {
												try {
													commandData = require(`./commands/${/\w+$/
														.exec(commandCategory)[0]
														.toLowerCase()}/${command
														.replace(/ /g, "")
														.toLowerCase()}`);
													break;
												} catch (error) {
													continue;
												}
											}
										} else
											commandData = require(`./commands/${categoryName}/${command
												.replace(/ /g, "")
												.toLowerCase()}`);

										return {
											label: `${
												commandData.data.type === 1 || !commandData.data.type
													? "/"
													: ""
											}${commandData.data.name}`,
											value: command,
										};
									}),
								),
						),
				  ]),
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setEmoji("◀")
					.setStyle(ButtonStyle.Primary)
					.setCustomId("commandsBack"),
			),
		];
	}
}

class CommandInformationMessage {
	embeds: EmbedBuilder[];
	components: ActionRowBuilder[];
	constructor(
		command: string,
		interaction: ButtonInteraction | ChatInputCommandInteraction,
		client: Client & {
			commands: Collection<
				string,
				{
					data: SlashCommandBuilder | ContextMenuCommandBuilder;
					description: string;
					usage: string[];
					examples: string[];
					autocomplete?: Function;
					execute: Function;
				}
			>;
		},
	) {
		const commandData = client.commands.get(command);

		const botData = JSON.parse(readFileSync("./data/bot.json").toString());

		const commandUses = botData.commandUsage[command] ?? [];

		const commandUsesYear = commandUses.filter(
			(command) => command.date >= Date.now() - 86400000 * 356,
		);

		const commandUsesMonth = commandUsesYear.filter(
			(command) => command.date >= Date.now() - 86400000 * 30,
		);

		const commandUsesWeek = commandUsesMonth.filter(
			(command) => command.date >= Date.now() - 86400000 * 7,
		);

		const commandUsesDay = commandUsesWeek.filter(
			(command) => command.date >= Date.now() - 86400000,
		);

		const format = new Intl.NumberFormat();

		const commandID = commandIDMap[command];

		let description =
			`> ${
				!(commandData.data instanceof ContextMenuCommandBuilder)
					? "*Slash Command*\n"
					: commandData.data.type === 2
					? "*User Command*\n"
					: "*Message Command*\n"
			}> ${
				commandData.description ??
				(commandData.data instanceof SlashCommandBuilder
					? commandData.data.description
					: "")
			}` +
			`\n> \n> **Total Stats:**\n> Uses: \`${format.format(
				commandUses.length,
			)}\`\n> Uses in the past day: \`${format.format(
				commandUsesDay.length,
			)}\`\n> Uses in the past week: \`${format.format(
				commandUsesWeek.length,
			)}\`\n> Uses in the past month: \`${format.format(
				commandUsesMonth.length,
			)}\`\n> Uses in the past year: \`${format.format(
				commandUsesYear.length,
			)}\`\n> \n> **Your Stats:**\n> Uses: \`${format.format(
				commandUses.filter((command) => command.user === interaction.user.id)
					.length,
			)}\`\n> Uses in the past day: \`${format.format(
				commandUsesDay.filter((command) => command.user === interaction.user.id)
					.length,
			)}\`\n> Uses in the past week: \`${format.format(
				commandUsesWeek.filter(
					(command) => command.user === interaction.user.id,
				).length,
			)}\`\n> Uses in the past month: \`${format.format(
				commandUsesMonth.filter(
					(command) => command.user === interaction.user.id,
				).length,
			)}\`\n> Uses in the past year: \`${format.format(
				commandUsesYear.filter(
					(command) => command.user === interaction.user.id,
				).length,
			)}\`\n\n${
				commandData.usage
					? `**Usage:**\n${(commandID
							? commandData.usage.map((example) =>
									example.replace(/\*\*(.+)\*\*/, `**<$1:${commandID}>**`),
							  )
							: commandData.usage
					  ).join("\n\n")}\n\n`
					: ""
			}`;

		description += commandData.examples
			? `**Usage Example${wordNumberEnding(
					commandData.examples.length,
			  )}:**\n${(commandID
					? commandData.examples.map((example) =>
							example.replace(/\*\*(.+)\*\*/, `**<$1:${commandID}>**`),
					  )
					: commandData.examples
			  ).join("\n\n")}\n\n`
			: "";

		if (
			commandData.data instanceof SlashCommandBuilder &&
			commandData.data.options
		) {
			for (const option of commandData.data.options) {
				if (option instanceof SlashCommandSubcommandBuilder) {
					description += `**${
						commandID
							? `</${commandData.data.name} ${option.name}:${commandID}>`
							: `Sub command option: \`${option.name}\``
					}**\n> ${option.description}\n`;

					if (option.options?.length) {
						description += "> \n> **Options:**\n> ";
						for (let i = 0; i < option.options.length; i++) {
							const subOption = option.options[i];
							description += `*${
								ApplicationCommandOptionType[subOption.type]
							} option - \`${subOption.name}\`*\n> ${subOption.description}${
								subOption.required ? "\n> *Required*" : "\n> *Optional*"
							}${
								(
									subOption as ApplicationCommandOptionBase & {
										autocomplete: boolean;
									}
								).autocomplete
									? "\n> *Autocomplete*"
									: ""
							}`;
							if (i !== option.options.length - 1) {
								description += "\n> \n> ";
							}
						}
						description += "\n\n";
					} else description += "\n";
				} else if (option instanceof SlashCommandSubcommandGroupBuilder) {
					description += `**Sub command group: \`${option.name}\`**\n> ${option.description}\n> \n> **Sub command options:**`;
					for (let i = 0; i < option.options.length; i++) {
						const subcommand = option.options[i];
						description += `\n> ${
							commandID
								? `</${commandData.data.name} ${
										option.name ? `${option.name} ` : ""
								  }${subcommand.name}:${commandID}>`
								: `*Sub command option: \`${subcommand.name}\`*`
						}\n> │ ${subcommand.description}`;
						if (subcommand.options?.length) {
							description += "\n> │\n> │ **Options:**\n> │ ";
							for (let i = 0; i < subcommand.options.length; i++) {
								const subOption = subcommand.options[i];
								description += `*${
									ApplicationCommandOptionType[subOption.type]
								} option - \`${subOption.name}\`*\n> │ ${
									subOption.description
								}${
									subOption.required ? "\n> │ *Required*" : "\n> │ *Optional*"
								}${
									(
										subOption as ApplicationCommandOptionBase & {
											autocomplete: boolean;
										}
									).autocomplete
										? "\n> │ *Autocomplete*"
										: ""
								}`;
								if (i !== subcommand.options.length - 1) {
									description += "\n> │\n> │";
								}
							}
							description += "\n";
						}
						if (i !== option.options.length - 1) {
							description += "\n> ";
						}
					}
					description += "\n";
				} else {
					description += `*${
						ApplicationCommandOptionType[
							(
								option as ToAPIApplicationCommandOptions & {
									type: ApplicationCommandOptionType;
								}
							).type
						]
					} option: \`${
						(
							option as ToAPIApplicationCommandOptions & {
								name: string;
							}
						).name
					}\`*\n> ${
						(
							option as ToAPIApplicationCommandOptions & {
								description: string;
							}
						).description
					}${
						(
							option as ToAPIApplicationCommandOptions & {
								required: boolean;
							}
						).required
							? "\n> *Required*"
							: "\n> *Optional*"
					}${
						(
							option as ToAPIApplicationCommandOptions & {
								autocomplete: boolean;
							}
						).autocomplete
							? "\n> *Autocomplete*"
							: ""
					}\n\n`;
				}
			}
		}

		this.embeds = [
			new EmbedBuilder()
				.setTitle(
					commandID
						? `</${commandData.data.name}:${commandID}>`
						: `${
								!(commandData.data instanceof ContextMenuCommandBuilder)
									? "/"
									: ""
						  }${commandData.data.name}`,
				)
				.setDescription(description)
				.setColor("Blue")
				.setAuthor({
					name: client.user?.username ?? "🌳 Slime Bot [/]",
					iconURL: client.user?.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setFooter({
					text: `Requested by ${interaction.user.username}`,
					iconURL: interaction.user.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				}),
		];
		this.components = [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setEmoji("◀")
					.setStyle(ButtonStyle.Primary)
					.setCustomId("embedInfoBack"),
			),
		];
	}
}

class HelpMessageBuilder {
	embeds: EmbedBuilder[];
	components: ActionRowBuilder[];
	constructor(
		interaction: ChatInputCommandInteraction | ButtonInteraction,
		client: Client,
		serverSettings,
	) {
		this.embeds = [
			new EmbedBuilder()
				.setTitle("📜 Help Menu")
				.setDescription(
					`> The prefixes for this server are \`/\`, ${serverSettings.settings.prefixes
						.map((prefix) => {
							return prefix === `<@${process.env.clientID}>`
								? prefix
								: `\`${prefix}\``;
						})
						.join(
							", ",
						)}.\n> List of commands: </commands:1075750849244045339>\n\nNeed help? Join [the support server](https://www.discord.gg/kzFDGCK7sD)!`,
				)
				.setColor("Blue")
				.setAuthor({
					name: client.user?.username ?? "🌳 Slime Bot [/]#5963",
					iconURL: client.user?.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setFooter({
					text: `Requested by ${interaction.user.username}`,
					iconURL: interaction.user.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setTimestamp(Date.now()),
		];

		this.components = [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("commands")
					.setEmoji("🤖")
					.setLabel("Commands")
					.setStyle(ButtonStyle.Success),
			),
		];
	}
}

class FunctionMessageBuilder {
	files: AttachmentBuilder[];
	embeds: EmbedBuilder[];
	constructor() {
		this.files = [];
		this.embeds = [];
	}
	async create(data: ChatInputCommandInteraction): Promise<void> {
		const input =
			data.options
				.getString("functions")
				?.split(",")
				.map((fx) => parseMath(fx)) ?? [];

		for (const fx of input) {
			try {
				new Parser().evaluate(fx, {x: 1});
			} catch (error) {
				// eslint-disable-next-line no-ex-assign
				error = new ErrorMessageBuilder(
					`Could not evaluate your expression! Make sure your expression is valid.\n${clearFormatting(
						fx,
					)}\n\n**Error:**\n> ${error}`,
				);

				return {embeds: error.embeds, ephemeral: error.ephemeral};
			}
		}

		const xCenter = new Decimal(data.options.getString("x-center") || 0);
		const yCenter = new Decimal(data.options.getString("y-center") || 0);
		const xStep = new Decimal(data.options.getString("x-step") || 1).abs();
		const yStep = new Decimal(data.options.getString("y-step") || 1).abs();

		const canvas = new Canvas(1000, 1000);
		const ctx = canvas.getContext("2d");

		const halfCanvasWidth = new Decimal(canvas.width).dividedBy(2);
		const halfCanvasHeight = new Decimal(canvas.height).dividedBy(2);

		const range = halfCanvasWidth.dividedBy(10);

		ctx.translate(halfCanvasWidth.toNumber(), halfCanvasHeight.toNumber());

		ctx.lineWidth = 1;
		ctx.fillStyle = "#ffffff";

		ctx.fillRect(
			-halfCanvasWidth,
			-halfCanvasHeight,
			canvas.width,
			canvas.height,
		);

		ctx.strokeStyle = "#aaaaaa";

		for (let i = new Decimal(-10); i.lessThan(10); i = i.plus(1)) {
			ctx.beginPath();

			ctx.moveTo(
				-halfCanvasWidth,
				yCenter
					.minus(yCenter.floor())
					.abs()
					.times(range)
					.dividedBy(yStep)
					.plus(i.times(range))
					.minus(yCenter.modulo(yStep).times(25))
					.toNumber(),
			);

			ctx.lineTo(
				halfCanvasWidth.toNumber(),
				yCenter
					.minus(yCenter.floor())
					.abs()
					.times(range)
					.dividedBy(yStep)
					.plus(i.times(range))
					.minus(yCenter.modulo(yStep).times(25))
					.toNumber(),
			);

			ctx.moveTo(
				xCenter
					.minus(xCenter.floor())
					.abs()
					.times(range)
					.dividedBy(xStep)
					.minus(i.times(range))
					.plus(xCenter.modulo(xStep).times(25))
					.toNumber(),
				-halfCanvasHeight,
			);

			ctx.lineTo(
				xCenter
					.minus(xCenter.floor())
					.abs()
					.times(range)
					.dividedBy(xStep)
					.minus(i.times(range))
					.plus(xCenter.modulo(xStep).times(25))
					.toNumber(),
				halfCanvasHeight.toNumber(),
			);

			ctx.closePath();

			ctx.stroke();
		}

		ctx.strokeStyle = "#777777";

		ctx.beginPath();

		ctx.moveTo(
			-halfCanvasWidth,
			new Decimal(yCenter.times(range).dividedBy(yStep)).toNumber(),
		);

		ctx.lineTo(
			halfCanvasWidth.toNumber(),
			new Decimal(yCenter.times(range).dividedBy(yStep)).toNumber(),
		);

		ctx.moveTo(
			new Decimal(xCenter.times(range).dividedBy(xStep).times(-1)).toNumber(),
			-halfCanvasHeight,
		);

		ctx.lineTo(
			new Decimal(xCenter.times(range).dividedBy(xStep).times(-1)).toNumber(),
			halfCanvasHeight.toNumber(),
		);

		ctx.closePath();

		ctx.stroke();

		let size = new Decimal(20);

		const sizeFunc = (text: string) => {
			while (ctx.measureText(text).width > 40) {
				size = size.minus(1);
				ctx.font = `${size}px "Odin Rounded Light"`;
			}
			return `${size}px "Odin Rounded Light"`;
		};

		// eslint-disable-next-line quotes
		ctx.font = '20px "Odin Rounded Light"';

		ctx.fillStyle = "#000000";

		const xLimit = xCenter
			.plus(xCenter.modulo(xStep))
			.plus(xStep.times(11))
			.minus(xStep);

		for (
			let i = new Decimal(
				xCenter.minus(xCenter.modulo(xStep)).minus(xStep.times(10)),
			);
			i.lessThanOrEqualTo(xLimit);
			i = i.plus(xStep)
		) {
			const xText = `${i.toFixed(`${xStep}`.length - 1)}`;
			ctx.font = sizeFunc(xText);

			const xLocation = new Decimal(-500).plus(
				xCenter
					.minus(xStep.times(10))
					.minus(i)
					.abs()
					.dividedBy(xStep)
					.times(range)
					.minus(new Decimal(ctx.measureText(xText).width).dividedBy(2)),
			);

			if (!i.equals(0) && xLocation.lessThanOrEqualTo(canvas.width)) {
				ctx.fillText(
					xText,
					xLocation.toNumber(),
					new Decimal(25)
						.plus(yCenter.times(range).dividedBy(yStep))
						.toNumber(),
				);
			}
		}

		const yLimit = yCenter
			.plus(yCenter.modulo(yStep))
			.plus(yStep.times(11))
			.minus(yStep);

		for (
			let i = new Decimal(
				yCenter.minus(yCenter.modulo(yStep)).minus(yStep.times(10)),
			);
			i.lessThanOrEqualTo(yLimit);
			i = i.plus(yStep)
		) {
			const yText = `${i.toFixed(`${yStep}`.length - 1)}`;
			ctx.font = sizeFunc(yText);

			const yLocation = new Decimal(
				yCenter
					.times(range)
					.plus(yStep.times(10))
					.minus(i.times(range))
					.dividedBy(yStep),
			);

			if (!i.equals(0) && yLocation.lessThanOrEqualTo(canvas.height)) {
				ctx.fillText(
					yText,
					new Decimal(-25)
						.minus(new Decimal(ctx.measureText(yText).width).dividedBy(2))
						.minus(new Decimal(range).times(xCenter).dividedBy(xStep))
						.toNumber(),
					yLocation.toNumber(),
				);
			}
		}

		const interval = new Decimal(0.0001);

		const functions: {
			[key: string]: {
				roots: {value: string | Decimal; errorRange: number | Decimal}[];
				lastCheckedValue: {value: Decimal; range: Decimal} | null;
				yIntercept: {y: Decimal | null};
			};
		} = {};

		ctx.fillStyle = "#a1a1a1";

		for (
			let x = new Decimal(xCenter).minus(
				new Decimal(Math.ceil(xStep.toNumber())).times(10),
			);
			new Decimal(x).lessThanOrEqualTo(
				new Decimal(xCenter).plus(new Decimal(xStep).ceil().times(10)),
			);
			x = x.plus(interval.times(new Decimal(xStep)))
		) {
			for (let i = 0; i < input.length; i++) {
				const fx = input[i];

				functions[fx] ??= {
					roots: [],
					lastCheckedValue: null,
					yIntercept: {y: null},
				};

				const parser = new Parser();

				const y = new Decimal(
					parser.evaluate(
						fx.replace(
							/x/g,
							`(${findNumber(x, interval.toNumber(), true, true, fx)})`,
						),
					),
				);

				if (
					y.abs().lessThanOrEqualTo(interval.times(10)) &&
					(!functions[fx].lastCheckedValue ||
						x
							.minus(functions[fx].lastCheckedValue.value)
							.abs()
							.greaterThan(functions[fx].lastCheckedValue.range))
				) {
					const root:
						| Decimal
						| {
								x: Decimal | string;
								y: Decimal;
								range: Decimal;
						  } = findRoot(
						fx,
						new Decimal(
							findNumber(x, interval.toNumber(), true, true, fx),
						).minus(interval),
						interval.times(1000),
						interval.dividedBy(10),
						true,
						5,
					);

					functions[fx].lastCheckedValue = root
						? {value: x, range: interval}
						: null;

					if (root && !(root instanceof Decimal))
						root.x = findNumber(new Decimal(root.x), interval, false, true, fx);

					if (!(root instanceof Decimal)) {
						const object = {
							value: root?.x,
							errorRange: /π|e/.test(root?.x.toString() ?? "")
								? 0
								: new Decimal(root?.y ?? 0).abs(),
						};

						if (root && !includes(functions[fx].roots, object)) {
							functions[fx].roots.push(object);
						}
					}
				}

				ctx.strokeStyle = colourArray[i % colourArray.length];

				ctx.beginPath();

				ctx.moveTo(
					x
						.times(range)
						.dividedBy(xStep)
						.minus(xCenter.dividedBy(xStep).times(range))
						.toNumber(),
					y
						.times(-range)
						.dividedBy(yStep)
						.plus(yCenter.dividedBy(yStep).times(range))
						.toNumber(),
				);

				ctx.arc(
					x
						.times(range)
						.dividedBy(xStep)
						.minus(xCenter.dividedBy(xStep).times(range))
						.toNumber(),
					y
						.times(-range)
						.dividedBy(yStep)
						.plus(yCenter.dividedBy(yStep).times(range))
						.toNumber(),
					1,
					0,
					Math.PI * 2,
				);

				if (x.equals(0)) {
					functions[fx].yIntercept = {y};
				}

				ctx.closePath();

				ctx.stroke();
			}
		}

		for (const fx in functions) {
			const roots = functions[fx].roots.map((root) =>
				new Parser().evaluate(parseMath(`${root.value}`)),
			);

			for (const value of [...roots, functions[fx].yIntercept]) {
				const yLocation = new Decimal(value.y ?? value)
					.times(-range)
					.dividedBy(yStep)
					.plus(yCenter.dividedBy(yStep).times(range));

				const xLocation = new Decimal(value.y ?? value)
					.times(range)
					.dividedBy(xStep)
					.minus(xCenter.dividedBy(xStep).times(range));

				const yZero = new Decimal(0).plus(
					xCenter.dividedBy(xStep).times(range),
				);

				const xZero = new Decimal(0).minus(
					xCenter.dividedBy(xStep).times(range),
				);

				ctx.beginPath();

				ctx.arc(
					(value.y ? xLocation : xZero).toNumber(),
					(value.y ? yZero : yLocation).toNumber(),
					5,
					0,
					Math.PI * 2,
				);

				ctx.closePath();

				ctx.fill();
			}
		}

		this.embeds = [
			new EmbedBuilder()
				.setTitle(`\`${mathParse(input.join(", "))}\``)
				.setDescription(
					`**Functions:**${Object.values(
						objectMap(
							functions,
							(fx, index, key) =>
								`\n\n**\`${colourMatch(
									colourArray[index % colourArray.length],
								)} f(x) = ${mathParse(key)}:\`**\n> **Roots:** ${
									fx.roots?.length ? "" : "*No Roots*"
								}${(fx.roots ?? []).map(
									(root) =>
										`\n> \`(${root.value}/0)\` Range of error: \`${new Decimal(
											root.errorRange,
										).abs()}\``,
								)}\n> \n> **Y-Intercept:** ${
									isNaN(fx.yIntercept?.y)
										? "*No Y-Intercept*"
										: `\`(0/${fx.yIntercept.y})\``
								}`,
						),
					).join("")}`.slice(0, 4096),
				)
				.setColor("Transparent"),
		];

		this.files = [
			new AttachmentBuilder(canvas.toBuffer(), {
				name: `Slime-Bot-Function-Image-${new Date(Date.now())}.png`,
			}),
		];
	}
}

export {
	ErrorMessageBuilder,
	SuccessMessageBuilder,
	InteractionInformationMessageBuilder,
	PollMessageBuilder,
	EmbedsMessageBuilder,
	EmbedMessageBuilder,
	EmbedFileMessageBuilder,
	EmbedEmbedMessageBuilder,
	EmbedComponentMessageBuilder,
	CommandCategoriesMessageBuilder,
	CommandCategoryMessageBuilder,
	CommandInformationMessage,
	HelpMessageBuilder,
	FunctionMessageBuilder,
};
