import {EmbedBuilder} from "discord.js";
import settings from "../../../schemas/settings.js";

const isValidURL = (urlString) => {
	const urlPattern =
		/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;
	return !!urlPattern.test(urlString);
};

export default {
	data: {name: "welcomeImageLayerEditImage"},
	async execute(interaction) {
		const text = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditImageURL",
		);
		const x = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditImageX",
		);
		const y = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditImageY",
		);
		const width = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditImageWidth",
		);
		const height = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditImageHeight",
		);

		const num =
			parseInt(interaction.message.embeds[0].data.title.match(/\d+/)[0]) - 1;

		const layerNum =
			parseInt(interaction.message.embeds[0].data.footer.text.match(/\d+/)[0]) -
			1;

		const settingsData = await settings.findOne({server: interaction.guild.id});

		const check = (text, x, y, width, height) => {
			const e = settingsData.welcomeMSG.data.images[num].layers[layerNum];
			const obj = {};
			obj.type = "image";

			if (
				!isValidURL(text) &&
				text !== "{user.icon}" &&
				text !== "guild.icon"
			) {
				obj.text = e.text;
			} else obj.text = text;

			if (!parseInt(width)) {
				obj.width = e.width;
			} else obj.width = width;

			if (!parseInt(height)) {
				obj.height = e.height;
			} else obj.width = width;

			if (!parseInt(x) && x !== "0" && x !== "<center>") {
				obj.x = e.x;
			} else obj.x = x;

			if (!parseInt(y) && y !== "0" && y !== "<center>") {
				obj.y = e.y;
			} else obj.y = y;

			return obj;
		};

		settingsData.welcomeMSG.data.images[num].layers[layerNum] = check(
			text,
			x,
			y,
			width,
			height,
		);

		await settings.updateOne(
			{server: interaction.guild.id},
			{welcomeMSG: settingsData.welcomeMSG},
		);

		const descArray = [];

		descArray.push("**Layers:**");

		for (
			let i = 0;
			i < settingsData.welcomeMSG.data.images[num].layers.length;
			i++
		) {
			const index = settingsData.welcomeMSG.data.images[num].layers[i];

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
