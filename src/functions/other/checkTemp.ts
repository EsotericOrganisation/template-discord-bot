import {Message} from "discord.js";
import {ErrorMessageBuilder, PollMessageBuilder} from "../../classes.js";
import temp from "../../schemas/temp.js";
import {SlimeBotClient} from "../../types";

export const callback = async (client: SlimeBotClient) => {
	client.checkTemp = async () => {
		const tempArray = await temp.find();

		for (const temporary of tempArray) {
			if (Date.now() - temporary.date >= temporary.lifeSpan * 1000) {
				await temp.deleteOne(temporary);

				switch (temporary.type) {
					case "waitingForUpload":
						client.channels.fetch(temporary.match.channel).then((channel) =>
							channel.messages
								.fetch(temporary.data.message)
								.then(async (message) => {
									await message.reply(
										new ErrorMessageBuilder(
											"User took too long to upload a valid file.",
										),
									);
								}),
						);
						break;
					case "poll":
						await client.channels
							.fetch(temporary.data.channel)
							.then((channel) =>
								channel?.messages
									.fetch(temporary.data.message)
									.then(async (message: Message) => {
										await message.edit(
											await new PollMessageBuilder().create({message}, client),
										);
									}),
							);
				}
			}
		}
	};
};
