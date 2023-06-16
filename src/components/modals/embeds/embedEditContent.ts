import {EmbedMessageBuilder, SuccessMessageBuilder} from "../../../classes.js";
import {numberEnding} from "../../../functions.js";
import embedSchema from "../../../schemas/embedSchema.js";

export default {
	data: {
		name: "embedEditContent",
	},
	async execute(interaction) {
		const count =
			interaction.message.embeds[0].data.footer.text.match(/\d+/)[0];
		const embedArray = await embedSchema.find({
			author: interaction.user.id,
		});
		embedArray[count - 1].content =
			interaction.fields.getTextInputValue("content");
		await embedSchema.updateOne(
			{author: interaction.user.id, customID: count},
			{content: embedArray[0].content},
		);
		await interaction.message.edit(
			new EmbedMessageBuilder(
				`Currently editing your ${count}${numberEnding(
					count,
				)} embed builder! Select what you would like to do with it below.`,
				embedArray[count - 1],
				interaction,
				embedArray,
			),
		);
		await interaction.reply(
			new SuccessMessageBuilder("Successfully updated the message content!"),
		);
	},
};
