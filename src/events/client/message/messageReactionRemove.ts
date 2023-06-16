import {Event, SlimeBotClient} from "../../../types";
import {PollMessageBuilder} from "../../../classes.js";

export const messageReactionRemove: Event = {
	name: "messageReactionRemove",
	async execute(reaction, member, client: SlimeBotClient) {
		const embed = reaction.message.embeds?.[0]?.data;

		member = await reaction.message.guild.members.fetch(member.id);

		const emojis = (embed?.description ?? "").match(
			/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟)/gm,
		);

		if (
			embed?.author?.name === `${client.user?.username ?? ""} Poll` &&
			reaction.me
		) {
			const requiredRole = embed.fields[1].value.match(
				/(`None`|(?<=<@&)\d+(?=>))/,
			)[0];

			if (requiredRole === "`None`" || member.roles.cache.has(requiredRole)) {
				const memberReactions =
					[...reaction.message.reactions.cache.values()].filter((reaction) =>
						emojis.includes(reaction._emoji.name),
					).length && reaction.users.cache.has(member.id);

				const maxOptions =
					parseInt(embed.fields[1].value.match(/(`Unlimited`|\d+)/)[0]) || 10;

				if (memberReactions <= maxOptions) {
					if (emojis.includes(reaction._emoji.name)) {
						await reaction.message.edit(
							await new PollMessageBuilder().create(reaction, client),
						);
					}
				}
			}
		}
	},
};
