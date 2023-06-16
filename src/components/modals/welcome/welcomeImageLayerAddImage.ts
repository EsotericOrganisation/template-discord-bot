import {EmbedBuilder} from "discord.js";
import {SuccessMessageBuilder, ErrorMessageBuilder} from "../../../classes.js";
import settings from "../../../schemas/settings.js";
import {isValidURL} from "../../../functions.js";

export default {
	data: {name: "welcomeImageLayerAddImage"},
	async execute(interaction) {
		const settingsData = await settings.findOne({server: interaction.guild.id});

		const link = interaction.fields.getTextInputValue(
			"welcomeImageLayerAddImageURL",
		);
		const x = interaction.fields.getTextInputValue(
			"welcomeImageLayerAddImageX",
		);
		const y = interaction.fields.getTextInputValue(
			"welcomeImageLayerAddImageY",
		);

		const width = parseInt(
			interaction.fields.getTextInputValue("welcomeImageLayerAddImageWidth"),
		);

		const height = parseInt(
			interaction.fields.getTextInputValue("welcomeImageLayerAddImageHeight"),
		);

		if (
			!isValidURL(link) &&
			link !== "{user.icon}" &&
			link !== "{guild.icon}"
		) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid link."),
			);
		} else if (!parseInt(x) && x !== "<center>" && parseInt(x) !== 0) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid x location."),
			);
		} else if (!parseInt(y) && y !== "<center>" && parseInt(y) !== 0) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid y location"),
			);
		} else if (!parseInt(width)) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid width."),
			);
		} else if (!parseInt(height)) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid height."),
			);
		} else {
			await interaction.reply(
				new SuccessMessageBuilder("The layer has successfully been created."),
			);

			settingsData.welcomeMSG.data.images[
				parseInt(interaction.message.embeds[0].data.title.match(/[0-9]/)[0]) - 1
			].layers.push({
				text: link,
				x: x,
				y: y,
				width: width,
				height: height,
				type: "image",
			});

			await settings.updateOne(
				{server: interaction.guild.id},
				{welcomeMSG: settingsData.welcomeMSG},
			);
			const descArray = [];

			descArray.push("**Layers:**");

			const input =
				interaction.message.embeds[0].data.title.match(/[0-9]/)[0] - 1;

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
			});
		}
	},
};
