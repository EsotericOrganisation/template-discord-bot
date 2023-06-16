import {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

export default {
	data: {
		name: "commandSearch",
	},
	async execute(interaction) {
		interaction.showModal(
			new ModalBuilder()
				.setTitle("Command Search")
				.setCustomId("commandSearch")
				.addComponents(
					new ActionRowBuilder().addComponents(
						new TextInputBuilder()
							.setLabel("Search a command")
							.setCustomId("command")
							.setPlaceholder("Search a command here...")
							.setStyle(TextInputStyle.Short),
					),
				),
		);
	},
};
