const {createCanvas} = require("@napi-rs/canvas");
const {AttachmentBuilder, EmbedBuilder} = require("discord.js");
const {isValidURL, cut} = require("../src/functions");
const {optionEmojis, emojiArray, rainbowColourArray} = require("../src/util");

// eslint-disable-next-line no-unused-vars
const pollMessage = class {
	/**
	 * Constructor to create a poll message.
	 *@param {{title: String, description: String: options: Array, maxOptions: String, footer: {text: String, iconURL: String}, requiredRole: String, ping: String, attachments: String|Array, duration: String|Number, closed:Boolean}} data
	 *@param {Client} client The bot client.
	 *@param {String} userID The ID of the user who created the poll message.
	 *@param {Array} reactions Reaction data on the message, if provided, the data will be used to show how many reactions there are.
	 */
	constructor(data, client, userID, reactions) {
		let {attachments} = data;

		const {
			title,
			description,
			options,
			maxOptions,
			footer,
			requiredRole,
			ping,
			duration,
			closed,
		} = data;

		this.emojis = [];

		const desc = description ? `${description}\n\n` : "";

		let totalReactions = 0;

		for (let i = 0; i < reactions?.length; i++) {
			if (options.filter((option) => option)[i]) {
				totalReactions += reactions[i].count - 1;
			}
		}

		let currentEmojiIndex = 0;
		const fields = [
			{
				name: "👤 Poll Creator",
				value: footer.text === "Anonymous Poll" ? "Anonymous" : userID,
				inline: true,
			},
			{
				name: "⚙ Poll Settings",
				value: `*Max options:* \`${maxOptions}\`\n*Required role:*${
					requiredRole && requiredRole !== "`None`"
						? ` ${requiredRole}`
						: " `None`"
				}\n${closed ? `*Poll ended* ${duration}` : `*Poll ends:* ${duration}`}`,
				inline: true,
			},
		];

		for (let i = 0; i < 15; i++) {
			if (options[i]) {
				let progressBar =
					(reactions
						? reactions.map((e) => e.count - 1)[currentEmojiIndex] /
						  totalReactions
						: 0) * 10;

				if (!progressBar) progressBar = 0;

				const option = options[i].toLowerCase().trim();
				let emojiOutput;

				for (const optionEmoji in optionEmojis) {
					if (
						option.toLowerCase() === optionEmoji.toLowerCase() &&
						!this.emojis.includes(optionEmojis[optionEmoji])
					) {
						emojiOutput = optionEmojis[optionEmoji];
						break;
					} else {
						const reg =
							/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/gi;

						emojiOutput = !this.emojis.includes(options[i].match(reg)?.[0])
							? options[i].match(reg)?.[0] ?? emojiArray[i]
							: this.emojis.includes(emojiArray[i])
							? emojiArray
									.filter((emoji) => !this.emojis.includes(emoji))
									.sort((a, b) => {
										return (
											Math.abs(i - emojiArray.indexOf(a)) -
											Math.abs(i - emojiArray.indexOf(b))
										);
									})[0]
							: emojiArray[i];
					}
				}

				fields.push({
					name: `${emojiOutput} ${
						(/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/.test(
							options[i],
						)
							? this.emojis.includes(
									options[i].match(
										/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/,
									)[0],
							  )
								? options[i]
								: /(?<=^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)).+/.test(
										options[i],
								  )
								? options[i].match(
										/(?<=^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)).+/,
								  )[0]
								: emojiOutput === options[i]
								? ""
								: options[i]
							: options[i]
						)?.trim() ?? ""
					}`,

					value: `\`${
						"█".repeat(Math.round(progressBar)) +
						" ".repeat(Math.round(10 - progressBar))
					}\` | ${`${reactions ? (progressBar * 10).toFixed(2) : "0.00"}%`} (${
						reactions
							? reactions.map((e) => e.count - 1)[currentEmojiIndex] ?? 0
							: "0"
					})\n\n`,
				});

				this.emojis.push(emojiOutput);

				currentEmojiIndex++;
			}
		}

		this.embeds = [
			new EmbedBuilder()
				.setTitle(title)
				.setDescription(desc === "" ? null : desc)
				.setColor("#5865f2")
				.setAuthor({
					name: closed ? "Slime Bot Poll - Ended" : "Slime Bot Poll",
					iconURL: client.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setFooter(footer)
				.addFields(fields)
				.setThumbnail(null),
		];

		this.files = typeof attachments === "string" ? [] : attachments;

		if (typeof attachments === "string") {
			attachments = attachments.split(",");
			for (const attachment of attachments) {
				if (isValidURL(attachment)) {
					this.files.push(attachment);
				}
			}
		}

		this.content = ping ? `${ping}` : "";
	}

	init = async (client, reactions, options) => {
		const canvas = createCanvas(500, 500);
		const ctx = canvas.getContext("2d");

		options ??= [" "];

		reactions = reactions
			? reactions.filter(
					(reaction) =>
						options
							.filter((option) => option)
							.map(
								(option) =>
									option.match(
										/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/,
									)[0],
							)
							.indexOf(reaction._emoji.name) !== -1,
			  )
			: options.filter((e) => e).map(() => ({count: 2, replaced: true}));

		let totalReactions = 0;

		for (let i = 0; i < reactions.length; i++) {
			if (options.filter((e) => e)[i])
				totalReactions += (reactions?.[i]?.count ?? 1) - 1;
		}

		if (totalReactions === 0) {
			totalReactions = reactions.length;
			reactions = options
				.filter((e) => e)
				.map(() => ({count: 2, replaced: true}));
		}

		let currentAngle = 0;
		let currentReactionIndex = 0;

		ctx.save();

		const emojis = [];

		for (let i = 0; i < options?.length; i++) {
			if (options?.[i]) {
				if (reactions[currentReactionIndex]?.count - 1) {
					ctx.restore();

					const portionAngle =
						((reactions[currentReactionIndex].count - 1) / totalReactions) *
						2 *
						Math.PI;

					ctx.beginPath();

					ctx.arc(250, 250, 250, currentAngle, currentAngle + portionAngle);

					currentAngle += portionAngle;

					ctx.lineTo(250, 250);

					ctx.fillStyle = rainbowColourArray[i];

					ctx.fill();

					ctx.fillStyle = "#FFFFFF";

					ctx.translate(250, 250); // Center the canvas around the center of the pie chart.

					if (totalReactions !== 1) {
						ctx.rotate(currentAngle - portionAngle * 0.5); // Rotate the canvas so the x axis intersects the center radius of one of current sector of the pie chart.

						ctx.translate(250 / 2, 0); // Move the canvas forward so it is now centered around the center point of the current sector of the pie chart.

						ctx.rotate(-(currentAngle - portionAngle * 0.5)); // Rotate the canvas so it is now the normal rotation.
					}

					let emoji = options[i].match(
						/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/gi,
					)?.[0];

					for (const emojiOption in optionEmojis) {
						if (
							options[i].toLowerCase() === emojiOption.toLowerCase() &&
							!emojis.includes(optionEmojis[emojiOption])
						) {
							emoji = optionEmojis[emojiOption];
							break;
						}
					}

					const text =
						(/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/.test(
							options[i],
						)
							? emojis.includes(
									options[i].match(
										/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/,
									)[0],
							  )
								? options[i]
								: /(?<=^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)).+/.test(
										options[i],
								  )
								? options[i].match(
										/(?<=^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)).+/,
								  )[0]
								: emoji === options[i]
								? ""
								: options[i]
							: options[i]
						)?.trim() ?? "";

					const optionEmoji =
						emoji && !emojis.includes(emoji)
							? emoji
							: emojis.includes(emojiArray[i])
							? emojiArray
									.filter((emoji) => !emojis.includes(emoji))
									.sort((a, b) => {
										return (
											Math.abs(i - emojiArray.indexOf(a)) -
											Math.abs(i - emojiArray.indexOf(b))
										);
									})[0]
							: emojiArray[i];

					emojis.push(optionEmoji);

					const optionText = (text ? " " : "") + cut(text, 13, "simple").trim();

					const percentage = reactions[0].replaced
						? ` - ${((0 / totalReactions) * 100).toFixed(2)}%`
						: ` - ${(
								((reactions[currentReactionIndex].count - 1) / totalReactions) *
								100
						  ).toFixed(2)}%`;

					const fontSize =
						(25 / (Math.min(totalReactions, 8) / 2)) *
						(reactions[currentReactionIndex].count - 1 / totalReactions);

					ctx.font = `${fontSize}px Noto Colour Emoji`;

					const emojiLength = ctx.measureText(optionEmoji).width;

					ctx.font = `${fontSize}px Helvetica`;

					const textLength = ctx.measureText(optionText + percentage).width;

					const stringLength = emojiLength + textLength;

					ctx.translate(-(stringLength / 2), fontSize / 2); // Move the canvas back so the text is centered.

					ctx.font = `${fontSize}px Noto Colour Emoji`;

					ctx.fillText(optionEmoji, 0, 0); // Writes the emoji.

					ctx.translate(emojiLength, 0); // Move forward so the text is after the emoji

					ctx.font = `${fontSize}px Helvetica`;

					ctx.fillText(optionText + percentage, 0, 0); // Writes the text.

					ctx.translate(-emojiLength, 0); // Moves back the length of the emoji.

					ctx.translate(stringLength / 2, -fontSize / 2); // Start undoing the whole process (move the canvas forward so it is centered around the center point of the current sector of the pie chart.)

					ctx.rotate(currentAngle - portionAngle * 0.5); // Rotate it and prepare to go back to the center of the pie chart.

					ctx.translate(-(250 / 2), 0); // Go back to the center of the pie chart.

					ctx.rotate(-(currentAngle - portionAngle * 0.5)); // Rotate it normally.

					ctx.translate(-250, -250); // Center the canvas around 0, 0.
				}
				currentReactionIndex++;
			}
		}

		const attachment = new AttachmentBuilder(await canvas.encode("png"), {
			name: "poll-image.png",
		});

		const user = await client.users.fetch("500690028960284672");

		const message = await user.send({files: [attachment]});

		this.embeds[0].data.thumbnail = {
			url: [...message.attachments.values()][0].attachment,
		};
	};
};
