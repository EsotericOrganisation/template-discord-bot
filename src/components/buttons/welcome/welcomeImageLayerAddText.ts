import {
	ModalBuilder,
	TextInputBuilder,
	ActionRowBuilder,
	TextInputStyle,
} from "discord.js";

export default {
	data: {name: "welcomeImageLayerAddText"},
	async execute(interaction) {
		interaction.showModal(
			new ModalBuilder()
				.setTitle("Add Text Layer")
				.setCustomId("welcomeImageLayerAddText")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Text")
							.setPlaceholder("Your text here.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddTextText"),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Text Colour")
							.setPlaceholder("#ffffff")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddTextTextColour"),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Text Font")
							.setPlaceholder("60px sans-serif")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddTextTextFont"),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Position (X)")
							.setPlaceholder("X position.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddTextX"),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Position (Y)")
							.setPlaceholder("Y position.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddTextY"),
					),
				),
		);
	},
};
