import {
	ActionRowBuilder,
	TextInputStyle,
	TextInputBuilder,
	ModalBuilder,
} from "discord.js";

export default {
	data: {name: "welcomeImageLayerEditEdit"},
	async execute(interaction) {
		if (
			/```[\s\S]*text[\s\S]*```/i.test(
				interaction.message.embeds[0].data.description,
			)
		) {
			interaction.showModal(
				new ModalBuilder()
					.setTitle("Edit Text Layer")
					.setCustomId("welcomeImageLayerEditText")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Text")
								.setPlaceholder("Your text here.")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditTextText"),
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Text Colour")
								.setPlaceholder("#ffffff")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditTextTextColour"),
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Text Font")
								.setPlaceholder("60px sans-serif")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditTextTextFont"),
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Position (X)")
								.setPlaceholder("X position.")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditTextX"),
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Position (Y)")
								.setPlaceholder("Y position.")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditTextY"),
						),
					),
			);
		} else {
			interaction.showModal(
				new ModalBuilder()
					.setTitle("Edit Image Layer")
					.setCustomId("welcomeImageLayerEditImage")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Image URL")
								.setPlaceholder("Your image URL here.")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditImageURL"),
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Position (X)")
								.setPlaceholder("X position.")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditImageX"),
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Position (Y)")
								.setPlaceholder("Y position.")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditImageY"),
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Image Width")
								.setPlaceholder("Image length.")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditImageWidth"),
						),
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setStyle(TextInputStyle.Short)
								.setLabel("Image Height")
								.setPlaceholder("Image height.")
								.setRequired(false)
								.setCustomId("welcomeImageLayerEditImageHeight"),
						),
					),
			);
		}
	},
};
