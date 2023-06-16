import {EmbedBuilder} from "discord.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeImageLayerRemove"},
	async execute(interaction) {
		const settingsData = await settings.findOne({server: interaction.guild.id});

		const image =
			settingsData.welcomeMSG.data.images[
				parseInt(interaction.message.embeds[0].data.title.match(/[0-9]/)[0]) - 1
			];

		let input = interaction.fields.getTextInputValue(
			"welcomeImageLayerRemoveName",
		);

		for (let i = 0; i < image.layers.length; i++) {
			if (new RegExp(`${input}`, "i").test(image.layers[i].text)) {
				input = i;
				break;
			}
		}

		if (!image.layers[parseInt(input)]) {
			await interaction.reply(
				new ErrorMessageBuilder("That layer does not exist!"),
			);
		} else {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("✅ Settings Updated")
						.setColor("Green")
						.setDescription(
							`Layer \`${
								image.layers[parseInt(input)].text
							}\` has successfully been deleted.`,
						),
				],
				ephemeral: true,
			});

			image.layers.splice(input, 1);

			await settings.updateOne(
				{server: interaction.guild.id},
				{welcomeMSG: settingsData.welcomeMSG},
			);

			const descArray = [];

			descArray.push("**Layers:**");

			const num =
				interaction.message.embeds[0].data.title.match(/[0-9]/)[0] - 1;

			for (const index of settingsData.welcomeMSG.data.images[num].layers) {
				switch (index.type) {
					case "image": {
						descArray.push(
							`\n**Image**\n> ${index.text}\n> X: ${index.x}, Y: ${index.y}, Size: ${index.size}`,
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

			if (settingsData.welcomeMSG.data.images[num].layers.length === 0) {
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
