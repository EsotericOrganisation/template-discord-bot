import {SuccessMessageBuilder} from "../../../classes.js";
import embedSchema from "../../../schemas/embedSchema.js";

export default {
	data: {
		name: "embedDeletionConfirm",
	},
	async execute(interaction) {
		await embedSchema.deleteMany({
			author: interaction.user.id,
		});
		await interaction.reply(
			new SuccessMessageBuilder("Embeds successfully deleted."),
		);
	},
};
