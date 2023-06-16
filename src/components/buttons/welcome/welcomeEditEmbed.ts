import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeEditEmbed"},
	async execute(interaction) {
		if (interaction.message.interaction.user.id !== interaction.user.id) {
			await interaction.reply(
				new ErrorMessageBuilder("This is not your settings menu!"),
			);
		} else {
			const descArray = [];

			const settingsData = await settings.findOne({
				server: interaction.guild.id,
			});

			for (const index of settingsData.welcomeMSG.data.embeds) {
				descArray.push(`> ${index.Title} - ${index.ID}`);
			}

			if (settingsData.welcomeMSG.data.embeds.length === 0) {
				descArray.push(
					"You have no welcome message embeds. Click the button below to add embeds.",
				);
			}

			interaction.message.edit({
				embeds: [
					new EmbedBuilder()
						.setTitle("Welcome Message Embeds 📜")
						.setColor("Grey")
						.setDescription(`${descArray.join("\n")}`),
				],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setLabel("⏪ Back")
							.setCustomId("welcomeEdit")
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setLabel("❓ Help")
							.setCustomId("welcomeImageLayerHelp")
							.setStyle(ButtonStyle.Success),
						new ButtonBuilder()
							.setLabel("📝 Add Embed")
							.setCustomId("welcomeEmbedAdd")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setLabel("📝 Remove Embed")
							.setCustomId("welcomeEmbedRemove")
							.setStyle(ButtonStyle.Secondary),
					),
				],
			});
			interaction.deferUpdate();
		}
	},
};
