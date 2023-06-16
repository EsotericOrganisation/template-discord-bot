import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import embedSchema from "../../../schemas/embedSchema.js";

export default {
	data: {
		name: "embedFieldsAdd",
	},
	async execute(interaction) {
		const embed = interaction.message.embeds[0].data;

		const customID = embed.description.match(/\d+/)[0];

		const embedNumber = embed.footer.text.match(/\d+/)[0];

		const embedData = await embedSchema.findOne({
			author: interaction.user.id,
			customID: customID,
		});

		if (!embedData) {
			return await interaction.reply(
				new ErrorMessageBuilder("This embed does not exist!"),
			);
		}

		await interaction.showModal(
			new ModalBuilder()
				.setCustomId("embedFieldsAdd")
				.setTitle(
					`Field ${
						(embedData.embeds[embedNumber - 1].fields?.length ?? 0) + 1
					}`,
				)
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setCustomId("fieldPosition")
							.setLabel("Field Position")
							.setRequired(false)
							.setStyle(TextInputStyle.Short)
							.setPlaceholder(
								"The position of the field in the embed (default is at the end).",
							),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setCustomId("fieldName")
							.setLabel("Field Name")
							.setRequired(true)
							.setStyle(TextInputStyle.Short)
							.setPlaceholder("The field name."),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setCustomId("fieldValue")
							.setLabel("Field Value")
							.setRequired(true)
							.setStyle(TextInputStyle.Paragraph)
							.setPlaceholder("The field value."),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setCustomId("fieldInline")
							.setLabel("Inline")
							.setRequired(false)
							.setStyle(TextInputStyle.Short)
							.setPlaceholder(
								"Whether the field should be inline (true / false).",
							),
					),
				),
		);
	},
};
