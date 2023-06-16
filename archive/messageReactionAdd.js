const {pollMessage, ErrorMessageBuilder} = require("../src/classes");
const {wordNumberEnding} = require("../src/functions");
const {emojiArray} = require("../src/util");

module.exports = {
	name: "messageReactionAdd",
	async execute(event, member, client) {
		if (
			[...event.users.cache.values()].map((e) => e.id).length !== 1 &&
			event.message.embeds[0].data.author.name === "Slime Bot Poll"
		) {
			const {title, description, footer, fields} = event.message.embeds[0].data;

			const options = [];

			let currentEmojiIndex = 0;

			for (let i = 2; i < fields.length; i++) {
				for (let e = currentEmojiIndex; e < emojiArray.length; e++) {
					const element = emojiArray[e];

					const reg = new RegExp(
						`^(${element}|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)(?= )(.+)`,
					);

					currentEmojiIndex++;
					if (
						reg.test(fields[i].name) ||
						/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)$/.test(
							fields[i].name,
						) ||
						fields[i].name.length === 1
					) {
						if (/^(🔟|🇦|🇧|🇨|🇩|🇪)/.test(fields[i].name)) {
							const diff = emojiArray.indexOf(
								fields[i].name.match(
									/^(1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/,
								)[0],
							);

							const length = options.length;

							for (let e = 1; e <= diff - length; e++) {
								options.push(null);
							}
						}

						options.push(
							(fields[i].name.match(reg)?.[0] ?? fields[i].name).trim(),
						);

						break;
					} else {
						options.push(null);
					}
				}
			}

			if (
				options
					.filter((option) => option)
					.map(
						(option) =>
							option.match(
								/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/,
							)[0],
					)
					.indexOf(event._emoji.name) !== -1
			) {
				const requiredRole = fields[1].value.match(/(`None`|<@&\d+>)/)[0];

				member = await event.message.guild.members.fetch(member.id);

				if (
					member.roles.cache.has(requiredRole.match(/\d+/)?.[0]) ||
					/`None`/.test(fields[1].value)
				) {
					const maxOptions = fields[1].value.match(/`(Unlimited|\d+)`/)[0];

					const memberReactions = [
						...event.message.reactions.cache.values(),
					].filter(
						(reaction) =>
							reaction.users.cache.has(member.id) &&
							options
								.filter((option) => option)
								.map(
									(option) =>
										option.match(
											/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/,
										)[0],
								)
								.indexOf(reaction._emoji.name) !== -1,
					).length;

					const maxOptionsInt =
						maxOptions === "`Unlimited`"
							? 15
							: parseInt(maxOptions.match(/\d+/)[0]);

					if (memberReactions <= maxOptionsInt) {
						const poll = new pollMessage(
							{
								title: title,
								description: description,
								options: options,
								maxOptions: maxOptions,
								footer: {
									text: footer.text,
									iconURL: footer.icon_url,
								},
								requiredRole: requiredRole,
								ping: event.message.content,
								attachments: [...event.message.attachments.values()].map(
									(e) => e.attachment,
								),
								duration: fields[1].value.match(/(?<=\*Poll ends:\* ).+/)[0],
							},
							event.message.author,
							fields[0].value,
							[...event.message.reactions.cache.values()],
						);

						await poll.init(
							client,
							[...event.message.reactions.cache.values()],
							options,
						);

						await event.message.edit(poll);
					} else {
						const userReactions = [
							...event.message.reactions.cache.values(),
						].filter(
							(reaction) =>
								reaction.users.cache.has(member.id) &&
								options
									.map(
										(option) =>
											option.match(
												/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🇦|🇧|🇨|🇩|🇪)/,
											)[0],
									)
									.indexOf(reaction._emoji.name) !== -1,
						);

						for (const reaction of userReactions.values()) {
							if (reaction._emoji.name === event._emoji.name)
								await reaction.users.remove(member.id);
						}

						await member.send(
							new ErrorMessageBuilder(
								`You may not choose more than **${maxOptions}** option${wordNumberEnding(
									maxOptions,
								)} for this poll!`,
								true,
							),
						);
					}
				} else {
					const userReactions = event.message.reactions.cache.filter(
						(reaction) => reaction.users.cache.has(member.id),
					);

					for (const reaction of userReactions.values()) {
						if (reaction._emoji.name === event._emoji.name)
							await reaction.users.remove(member.id);
					}

					const role = event.message.guild.roles.cache.get(
						requiredRole.match(/\d+/)[0],
					);

					await member.send(
						new ErrorMessageBuilder(
							`You must have the **${role.name}** role to participate in this poll!`,
							true,
						),
					);
				}
			}
		} else if (
			event.message.embeds[0].data.author.name === "Slime Bot Poll - Ended"
		) {
			const userReactions = event.message.reactions.cache.filter((reaction) =>
				reaction.users.cache.has(member.id),
			);

			for (const reaction of userReactions.values()) {
				if (reaction._emoji.name === event._emoji.name)
					await reaction.users.remove(member.id);
			}

			await member.send(
				new ErrorMessageBuilder("Sorry, this poll has ended.", true),
			);
		}
	},
};
