import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
	EmbedBuilder,
} from "discord.js";

export default {
	data: {name: "welcomeEmbedAdd"},
	async execute(interaction) {
		if (interaction.message.interaction.user.id !== interaction.user.id) {
			await interaction.reply(
				new ErrorMessageBuilder("This is not your settings menu!"),
			);
		} else {
			interaction.showModal(
				new ModalBuilder()
					.setTitle("Add Embed")
					.setCustomId("welcomeEmbedAdd")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setLabel("Embed ID")
								.setPlaceholder("Embed name or ID here")
								.setStyle(TextInputStyle.Short)
								.setCustomId("addEmbedNumber"),
						),
					),
			);
		}
	},
};
