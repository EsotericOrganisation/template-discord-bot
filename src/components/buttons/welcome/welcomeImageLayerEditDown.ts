import {EmbedBuilder} from "discord.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeImageLayerEditDown"},
	async execute(interaction) {
		await interaction.deferUpdate();
		const settingsData = await settings.findOne({server: interaction.guild.id});

		const embedData = interaction.message.embeds[0].data;

		let layerNum = parseInt(embedData.footer.text.match(/\d+/)[0]) - 1;

		const imgNum = parseInt(embedData.title.match(/\d+/)[0]) - 1;

		const arr = settingsData.welcomeMSG.data.images[imgNum].layers;

		if (layerNum !== arr.length - 1) {
			[arr[layerNum], arr[layerNum + 1]] = [arr[layerNum + 1], arr[layerNum]];

			settingsData.welcomeMSG.data.images[imgNum].layers = arr;

			await settings.updateOne(
				{server: interaction.guild.id},
				{welcomeMSG: settingsData.welcomeMSG},
			);

			layerNum++;

			const descArray = [];

			descArray.push("**Layers:**");

			for (
				let i = 0;
				i < settingsData.welcomeMSG.data.images[imgNum].layers.length;
				i++
			) {
				const index = settingsData.welcomeMSG.data.images[imgNum].layers[i];

				if (i === layerNum) {
					descArray.push("\n```");
				}

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
				if (i === layerNum) {
					descArray.push("```");
				}
			}
			await interaction.message.edit({
				embeds: [
					new EmbedBuilder()
						.setTitle(interaction.message.embeds[0].data.title)
						.setDescription(`${descArray.join("\n")}`)
						.setColor("Grey")
						.setFooter({
							text: `Editing field ${layerNum + 1}`,
							iconURL: interaction.user.displayAvatarURL({
								size: 4096,
								extension: "png",
							}),
						}),
				],
			});
		}
	},
};
