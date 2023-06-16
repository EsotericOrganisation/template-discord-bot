import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeImageEdit"},
	async execute(interaction) {
		let input = interaction.fields.getTextInputValue("welcomeImageEditName");

		const settingsData = await settings.findOne({server: interaction.guild.id});

		for (
			let index = 0;
			index < settingsData.welcomeMSG.data.images.length;
			index++
		) {
			if (
				new RegExp(`${input}`, "i").test(
					settingsData.welcomeMSG.data.images[index].name,
				)
			) {
				input = index;
				break;
			}
		}

		if (!settingsData.welcomeMSG.data.images[input]) {
			await interaction.reply(
				new ErrorMessageBuilder("That image does not exist!"),
			);
		} else {
			const descArray = [];

			descArray.push("**Layers:**");

			for (const index of settingsData.welcomeMSG.data.images[input].layers) {
				switch (index.type) {
					case "image": {
						descArray.push(
							`\n**Image**\n> ${index.text}\n> X: ${index.x}, Y: ${index.y}, Size: ${index.width} x ${index.height}`,
						);
						break;
					}
					case "text": {
						descArray.push(
							`\n**Text**\n> ${index.text}\n> X: ${index.x}, Y: ${index.y}, Font: ${index.font}`,
						);
						break;
					}
				}
			}

			if (settingsData.welcomeMSG.data.images[input].layers.length === 0) {
				descArray.shift();
				descArray.push(
					"This image has no layers. Use the button below to add a layer.",
				);
			}

			interaction.message.edit({
				embeds: [
					new EmbedBuilder()
						.setTitle(
							`${settingsData.welcomeMSG.data.images[input].name} - Image ${
								input + 1
							}`,
						)
						.setDescription(`${descArray.join("\n")}`)
						.setColor("Grey"),
				],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId("welcomeImageEditDimensions")
							.setLabel("📝 Edit Image Dimensions")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId("welcomeImageLayerAddText")
							.setLabel("📝 Add Text Layer")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId("welcomeImageLayerAddImage")
							.setLabel("📝 Add Image Layer")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId("welcomeImageLayerEdit")
							.setLabel("📝 Edit Layer")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId("welcomeImageLayerRemove")
							.setLabel("📝 Remove Layer")
							.setStyle(ButtonStyle.Secondary),
					),
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId("welcomeEditImage")
							.setLabel("⏪ Back")
							.setStyle(ButtonStyle.Primary),

						new ButtonBuilder()
							.setCustomId("welcomeImageLayerHelp")
							.setLabel("❓ Help")
							.setStyle(ButtonStyle.Success),
					),
				],
			});
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle(
							`📩 Viewing Image \`${settingsData.welcomeMSG.data.images[input].name}\``,
						)
						.setColor("Green"),
				],
				ephemeral: true,
			});
		}
	},
};
