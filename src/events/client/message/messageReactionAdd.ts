import {wordNumberEnding} from "../../../functions.js";
import {ErrorMessageBuilder, PollMessageBuilder} from "../../../classes.js";
import {Event, SlimeBotClient} from "../../../types";

export const event: Event = {
	name: "messageReactionAdd",
	async execute(reaction, member, client: SlimeBotClient) {
		const embed = reaction.message.embeds?.[0]?.data;

		member = await reaction.message.guild.members.fetch(member.id);

		const emojis = (embed?.description ?? "").match(
			/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟)/gm,
		);

		const userReactions = reaction.message.reactions.cache.filter(
			(reaction) =>
				reaction.users.cache.has(member.id) &&
				emojis?.includes(reaction._emoji.name),
		);

		if (embed?.author?.name === "Slime Bot Poll - Ended") {
			for (const messageReaction of userReactions.values()) {
				if (messageReaction._emoji.name === reaction._emoji.name)
					await messageReaction.users.remove(member.id);
			}

			return member.send(
				new ErrorMessageBuilder("Sorry, this poll has ended.", true),
			);
		}

		if (
			embed?.author?.name === `${client.user?.username} Poll` &&
			reaction.me &&
			[...reaction.users.cache.values()].map((user) => user.id).length !== 1 &&
			new RegExp(`^${reaction._emoji.name}.+`, "gm").test(embed.description)
		) {
			const requiredRole = embed.fields[1].value.match(
				/(`None`|(?<=<@&)\d+(?=>))/,
			)[0];

			if (requiredRole !== "`None`" && !member.roles.cache.has(requiredRole)) {
				for (const messageReaction of userReactions.values()) {
					await messageReaction.users.remove(member.id);
				}

				const role = reaction.message.guild.roles.cache.get(requiredRole);

				return member.send(
					new ErrorMessageBuilder(
						`You must have the **${role.name}** role to participate in this poll!`,
						true,
					),
				);
			}

			const memberReactions =
				[...reaction.message.reactions.cache.values()].filter((reaction) =>
					emojis.includes(reaction._emoji.name),
				).length && reaction.users.cache.has(member.id);

			const maxOptions =
				parseInt(embed.fields[1].value.match(/(`Unlimited`|\d+)/)[0]) || 10;

			if (memberReactions > maxOptions) {
				for (const reaction of userReactions.values()) {
					await reaction.users.remove(member.id);
				}

				return member.send(
					new ErrorMessageBuilder(
						`You may not choose more than **${maxOptions}** option${wordNumberEnding(
							maxOptions,
						)} for this poll!`,
						true,
					),
				);
			}

			await reaction.message.edit(
				await new PollMessageBuilder().create(reaction, client),
			);
		}
	},
};
