import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export default {
	data: {name: "welcomeImageLayerRemove"},
	async execute(interaction) {
		interaction.showModal(
			new ModalBuilder()
				.setTitle("Remove Layer")
				.setCustomId("welcomeImageLayerRemove")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Layer Name")
							.setPlaceholder("Layer Name.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerRemoveName"),
					),
				),
		);
	},
};
