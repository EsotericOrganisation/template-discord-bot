import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export default {
	data: {name: "welcomeImageRemove"},
	async execute(interaction) {
		interaction.showModal(
			new ModalBuilder()
				.setTitle("Remove Image")
				.setCustomId("welcomeImageRemove")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setLabel("Image Name")
							.setCustomId("imageName")
							.setStyle(TextInputStyle.Short)
							.setPlaceholder("Image Name Here")
							.setRequired(true),
					),
				),
		);
	},
};
