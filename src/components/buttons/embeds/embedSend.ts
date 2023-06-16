import embedSchema from "../../../schemas/embedSchema.js";
import {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";

export default {
	data: {
		name: "embedSend",
	},
	async execute(interaction) {
		const countReg = /\d+/;

		const count = parseInt(
			interaction.message.embeds[0].data.description.match(countReg)[0],
		);

		const embedProfile = await embedSchema.findOne({
			author: interaction.user.id,
			customID: count,
		});

		if (!embedProfile) {
			await interaction.reply(
				new ErrorMessageBuilder("This embed does not exist!"),
			);
		} else {
			await interaction.showModal(
				new ModalBuilder()
					.setCustomId("embedSend")
					.setTitle("Create your embed here!")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId("channel")
								.setLabel("Channel 💬")
								.setRequired(false)
								.setStyle(TextInputStyle.Short)
								.setPlaceholder(
									"Channel to send the embed in. Leave empty to send here.",
								),
						),
					),
			);
		}
	},
};
