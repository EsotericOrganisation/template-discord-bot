import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeEdit"},
	async execute(interaction) {
		let settingsData = await settings.findOne({
			server: interaction.guild.id,
		});

		if (!settingsData.welcomeMSG?.data) {
			await settings.updateOne(
				{server: interaction.guild.id},
				{
					welcomeMSG: {
						channel: settingsData.welcomeMSG.channel,
						enabled: settingsData.welcomeMSG.enabled,
						data: {
							content: "",
							embeds: [],
							images: [],
						},
					},
				},
			);
			settingsData = await settings.findOne({server: interaction.guild.id});
		}

		const descArray = [];

		descArray.push("> Edit your embed message here.\n");

		descArray.push("`Content 💬`");

		if (settingsData?.welcomeMSG?.data?.content) {
			descArray.push(`> ${settingsData.welcomeMSG.data.content}`);
		}

		descArray.push("\n`Embeds 📜`");

		for (const element of settingsData?.welcomeMSG?.data?.embeds ?? []) {
			descArray.push(`> ${element.Title}`);
		}

		descArray.push("\n`Images 📷`");

		for (const element of settingsData?.welcomeMSG?.data?.images ?? []) {
			descArray.push(`> ${element.name}`);
		}

		interaction.message.edit({
			embeds: [
				new EmbedBuilder()
					.setColor("Grey")
					.setDescription(`${descArray.join("\n")}`)
					.setTitle("Welcome Message 👋"),
			],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setLabel("⏪ Back")
						.setCustomId("welcomeBack")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setLabel("❓ Help")
						.setCustomId("welcomeImageLayerHelp")
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setLabel("Edit Content 📝")
						.setCustomId("welcomeEditContent")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setLabel("Edit Embeds 📝")
						.setCustomId("welcomeEditEmbed")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setLabel("Edit Images 📝")
						.setCustomId("welcomeEditImage")
						.setStyle(ButtonStyle.Secondary),
				),
			],
		});
		await interaction.deferUpdate();
	},
};
