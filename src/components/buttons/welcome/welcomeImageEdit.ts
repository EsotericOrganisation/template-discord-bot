import {
	ModalBuilder,
	TextInputBuilder,
	ActionRowBuilder,
	TextInputStyle,
} from "discord.js";

export default {
	data: {name: "welcomeImageEdit"},
	async execute(interaction) {
		await interaction.showModal(
			new ModalBuilder()
				.setTitle("Edit Image")
				.setCustomId("welcomeImageEdit")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setLabel("Image Name")
							.setPlaceholder("Image name here")
							.setRequired(true)
							.setCustomId("welcomeImageEditName")
							.setStyle(TextInputStyle.Short),
					),
				),
		);
	},
};
