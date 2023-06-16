import {EmbedBuilder} from "discord.js";
import settings from "../../../schemas/settings.js";
import {fontArray} from "../../../bot.js";
import {ErrorMessageBuilder, SuccessMessageBuilder} from "../../../classes.js";

export default {
	data: {name: "welcomeImageLayerAddText"},
	async execute(interaction) {
		const settingsData = await settings.findOne({server: interaction.guild.id});

		const text = await interaction.fields.getTextInputValue(
			"welcomeImageLayerAddTextText",
		);
		const colour = await interaction.fields.getTextInputValue(
			"welcomeImageLayerAddTextTextColour",
		);
		const font = await interaction.fields.getTextInputValue(
			"welcomeImageLayerAddTextTextFont",
		);
		const x = await interaction.fields.getTextInputValue(
			"welcomeImageLayerAddTextX",
		);
		const y = await interaction.fields.getTextInputValue(
			"welcomeImageLayerAddTextY",
		);

		if (
			!/^\d+px .+$/.test(font) ||
			!fontArray.includes(`${font.match(/px .+/)[0]}`)
		) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid font!"),
			);
		} else if (!/^#[0-9A-F]{6}$/i.test(colour)) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid colour hex code!"),
			);
		} else if (!parseInt(x) && x !== "<center>" && parseInt(y) !== 0) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid x location!"),
			);
		} else if (!parseInt(y) && y !== "<center>" && parseInt(y) !== 0) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid y location!"),
			);
		} else {
			await interaction.reply(
				new SuccessMessageBuilder("The layer has successfully been created."),
			);

			settingsData.welcomeMSG.data.images[
				parseInt(interaction.message.embeds[0].data.title.match(/[0-9]/)[0]) - 1
			].layers.push({
				text,
				colour,
				font,
				x,
				y,
				type: "text",
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
						.setTitle(interaction.message.embeds[0].data.title)
						.setDescription(`${descArray.join("\n")}`)
						.setColor("Grey"),
				],
			});
		}
	},
};
