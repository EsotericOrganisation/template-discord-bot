import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export default {
	data: {name: "welcomeImageAdd"},
	async execute(interaction) {
		interaction.showModal(
			new ModalBuilder()
				.setTitle("Add Image")
				.setCustomId("welcomeImageAdd")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setLabel("Image Name")
							.setRequired(true)
							.setCustomId("welcomeImageName")
							.setPlaceholder("Image Name here")
							.setStyle(TextInputStyle.Short),
					),
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
