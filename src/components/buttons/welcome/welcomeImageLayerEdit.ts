import {
	ModalBuilder,
	TextInputBuilder,
	ActionRowBuilder,
	TextInputStyle,
} from "discord.js";

export default {
	data: {name: "welcomeImageLayerEdit"},
	async execute(interaction) {
		interaction.showModal(
			new ModalBuilder()
				.setTitle("Edit Layer")
				.setCustomId("welcomeImageLayerEdit")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Layer Name")
							.setPlaceholder("Layer Name.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerEditNumber"),
					),
				),
		);
	},
};
