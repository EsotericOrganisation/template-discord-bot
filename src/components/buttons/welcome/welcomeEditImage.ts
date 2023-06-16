import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeEditImage"},
	async execute(interaction) {
		const settingsData = await settings.findOne({
			server: interaction.guild.id,
		});

		const descArray = [];

		descArray.push("**Images:**\n");

		for (const index of settingsData.welcomeMSG.data.images) {
			descArray.push(
				`**${index.name}**\n> ${index.layers.length} Layers\n> Resolution: ${index.width}x${index.height}`,
			);
		}

		if (settingsData.welcomeMSG.data.images.length === 0) {
			descArray.shift();
			descArray.push(
				"You have no welcome message images. Click the button below to add images.",
			);
		}

		interaction.message.edit({
			embeds: [
				new EmbedBuilder()
					.setTitle("Welcome Message Images 📷")
					.setDescription(`${descArray.join("\n")}`)
					.setColor("Grey"),
			],
			ephemeral: true,
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("welcomeEdit")
						.setLabel("⏪ Back")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId("welcomeImageAdd")
						.setLabel("📷 Add Image")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId("welcomeImageRemove")
						.setLabel("📷 Remove Image")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId("welcomeImageEdit")
						.setLabel("📷 Edit Image")
						.setStyle(ButtonStyle.Secondary),
				),
			],
		});
		interaction.deferUpdate();
	},
};
