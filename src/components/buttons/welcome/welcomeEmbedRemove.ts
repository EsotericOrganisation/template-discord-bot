import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export default {
	data: {name: "welcomeEmbedRemove"},
	async execute(interaction) {
		interaction.showModal(
			new ModalBuilder()
				.setTitle("Remove Embed")
				.setCustomId("welcomeEmbedRemove")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setLabel("Embed ID")
							.setPlaceholder("Embed name or ID here")
							.setStyle(TextInputStyle.Short)
							.setCustomId("removeEmbedNumber"),
					),
				),
		);
	},
};
