import {EmbedEmbedMessageBuilder} from "../../../classes.js";
import embedSchema from "../../../schemas/embedSchema.js";

export default {
	data: {name: "embedEditEmbeds"},
	async execute(interaction, client) {
		interaction.deferUpdate();
		const count =
			interaction.message.embeds[0].data.description.match(/\d+/)[0];
		const embedProfile = await embedSchema.findOne({
			author: interaction.user.id,
			customID: count,
		});
		interaction.message.edit(
			new EmbedEmbedMessageBuilder(embedProfile, null, client),
		);
	},
};
