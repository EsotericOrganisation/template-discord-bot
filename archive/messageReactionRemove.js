const {pollMessage} = require("../src/classes");
const {emojiArray} = require("../src/util");

module.exports = {
	name: "messageReactionRemove",
	async execute(event, member, client) {
		member = await event.message.guild.members.fetch(member.id);

		const requiredRole =
			event.message.embeds[0].data.fields[1].value.match(
				/(`None`|\d+(?=>))/,
			)[0];

		if (
			event.message.embeds[0].data.author.name === "Slime Bot Poll" &&
			(member.roles.cache.has(requiredRole) ||
				event.message.embeds[0].data.fields[1].value.match(/`None`/))
		) {
			const {title, description, footer, fields} = event.message.embeds[0].data;

			const maxOptions = fields[1].value.match(/`(Unlimited|\d+)`/)[0];

			const requiredRole = fields[1].value.match(/(`None`|<@&\d+>)/)[0];

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
			}
		}
	},
};
