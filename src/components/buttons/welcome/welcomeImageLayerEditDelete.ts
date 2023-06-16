import {EmbedBuilder} from "discord.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeImageLayerEditDelete"},
	async execute(interaction) {
		interaction.deferUpdate();
		const embedData = interaction.message.embeds[0].data;
		const settingsData = await settings.findOne({server: interaction.guild.id});
		const imgNum = parseInt(embedData.title.match(/\d+/)[0]) - 1;
		let layerNum = parseInt(embedData.footer.text.match(/\d+/)[0]) - 1;
		settingsData.welcomeMSG.data.images[imgNum].layers.splice(layerNum, 1);
		await settings.updateOne(
			{server: interaction.guild.id},
			{welcomeMSG: settingsData.welcomeMSG},
		);
		layerNum = 0;
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
		if (settingsData.welcomeMSG.data.images[imgNum].layers.length === 0) {
			descArray.shift();
			descArray.push(
				"This image has no layers. Use the button below to add a layer.",
			);
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
	},
};
