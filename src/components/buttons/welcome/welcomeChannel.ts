import {
	ModalBuilder,
	TextInputStyle,
	TextInputBuilder,
	ActionRowBuilder,
	EmbedBuilder,
} from "discord.js";

export default {
	data: {
		name: "welcomeChannel",
	},
	async execute(interaction) {
		if (interaction.message.interaction.user.id !== interaction.user.id) {
			await interaction.reply(
				new ErrorMessageBuilder("This is not your settings menu."),
			);
		} else {
			const modal = new ModalBuilder()
				.setCustomId("welcomeChannel")
				.setTitle("Welcome Channel");

			const channel = new TextInputBuilder()
				.setCustomId("channel")
				.setLabel("Channel")
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setPlaceholder("Channel name or ID.");

			modal.addComponents(new ActionRowBuilder().addComponents(channel));

			await interaction.showModal(modal);
		}
	},
};
