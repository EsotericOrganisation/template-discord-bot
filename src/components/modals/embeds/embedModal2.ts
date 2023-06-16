import {EmbedBuilder} from "discord.js";
import {SuccessMessageBuilder} from "../../../classes.js";
import embedSchema from "../../../schemas/embedSchema.js";

export default {
	data: {
		name: "embedModal2",
	},

	async execute(interaction) {
		const embedMessage = interaction.message.embeds[0].data;

		const count =
			interaction.message.embeds[0].data.description.match(/\d+/)[0];

		const embedIndex = embedMessage.footer.text.match(/\d+/)[0] - 1;

		const embed = await embedSchema.findOne({
			author: interaction.user.id,
			customID: count,
		});

		embed.embeds[embedIndex - 1] = {
			...embed.embeds[embedIndex - 1],
			...new EmbedBuilder({
				author: {
					name: interaction.fields.getTextInputValue("embedAuthorName"),
					url: interaction.fields.getTextInputValue("embedAuthorURL"),
					iconURL: interaction.fields.getTextInputValue("embedAuthorIconURL"),
				},
			}).data,
		};

		await embedSchema.updateOne(
			{
				author: interaction.user.id,
				customID: count,
			},
			{
				embeds: embed.embeds,
			},
		);

		await interaction.reply(
			new SuccessMessageBuilder("Embed saved successfully", true),
		);
	},
};
