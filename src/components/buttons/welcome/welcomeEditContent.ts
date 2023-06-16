import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
	EmbedBuilder,
} from "discord.js";

export default {
	data: {name: "welcomeEditContent"},
	async execute(interaction) {
		if (interaction.message.interaction.user.id !== interaction.user.id) {
			await interaction.reply(
				new ErrorMessageBuilder("This is not your settings menu!"),
			);
		} else {
			interaction.showModal(
				new ModalBuilder()
					.setTitle("Welcome Message Content")
					.setCustomId("welcomeEditContent")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setPlaceholder("Message Content Here.")
								.setLabel("Message Content")
								.setCustomId("messageContentInput")
								.setStyle(TextInputStyle.Short)
								.setRequired(false),
						),
					),
			);
		}
	},
};
