import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
export default {
	data: {name: "welcomeImageEditDimensions"},
	async execute(interaction) {
		interaction.showModal(
			new ModalBuilder()
				.setTitle("Add Image")
				.setCustomId("welcomeImageEditDimensions")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setLabel("X Resolution")
							.setRequired(true)
							.setCustomId("welcomeXResolution")
							.setPlaceholder("X Resolution")
							.setStyle(TextInputStyle.Short),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setLabel("Y Resolution")
							.setRequired(true)
							.setCustomId("welcomeYResolution")
							.setPlaceholder("Y Resolution")
							.setStyle(TextInputStyle.Short),
					),
				),
		);
	},
};
