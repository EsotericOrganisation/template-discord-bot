import {
	ActionRowBuilder,
	TextInputStyle,
	TextInputBuilder,
	ModalBuilder,
} from "discord.js";

export default {
	data: {name: "welcomeImageLayerAddImage"},
	async execute(interaction) {
		interaction.showModal(
			new ModalBuilder()
				.setTitle("Add Image Layer")
				.setCustomId("welcomeImageLayerAddImage")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Image URL")
							.setPlaceholder("Your image URL here.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddImageURL"),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Position (X)")
							.setPlaceholder("X position.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddImageX"),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Position (Y)")
							.setPlaceholder("Y position.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddImageY"),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Image Width")
							.setPlaceholder("Image length.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddImageWidth"),
					),
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setStyle(TextInputStyle.Short)
							.setLabel("Image Height")
							.setPlaceholder("Image height.")
							.setRequired(true)
							.setCustomId("welcomeImageLayerAddImageHeight"),
					),
				),
		);
	},
};
