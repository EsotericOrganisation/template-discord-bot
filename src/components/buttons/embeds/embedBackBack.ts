import {EmbedsMessageBuilder} from "../../../classes.js";
import embedSchema from "../../../schemas/embedSchema.js";

export default {
	data: {
		name: "embedBackBack",
	},
	async execute(interaction, client) {
		await interaction.deferUpdate();
		const embedArray = await embedSchema.find({author: interaction.user.id});
		const count =
			interaction.message.embeds[0].data.footer.text.match(/\d+/)[0];
		await interaction.message.edit(
			new EmbedsMessageBuilder(
				embedArray,
				interaction,
				client,
				Math.ceil(count / 25),
			),
		);
	},
};
