import {EmbedBuilder} from "discord.js";
import {fontArray} from "../../../bot.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeImageLayerEditText"},
	async execute(interaction) {
		const text = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditTextText",
		);
		const colour = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditTextTextColour",
		);
		const font = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditTextTextFont",
		);
		const x = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditTextX",
		);
		const y = await interaction.fields.getTextInputValue(
			"welcomeImageLayerEditTextY",
		);

		const num =
			parseInt(interaction.message.embeds[0].data.title.match(/[0-9]+/)[0]) - 1;

		const layerNum =
			parseInt(
				interaction.message.embeds[0].data.footer.text.match(/[0-9]+/)[0],
			) - 1;

		const settingsData = await settings.findOne({server: interaction.guild.id});

		const check = (text, colour, font, x, y) => {
			const e = settingsData.welcomeMSG.data.images[num].layers[layerNum];
			const obj = {};
			obj.type = "text";

			if (!text) {
				obj.text = e.text;
			} else obj.text = text;

			if (!/^#[0-9A-F]{6}$/i.test(colour)) {
				obj.colour = e.colour;
			} else obj.colour = colour;

			if (
				!/^[0-9]+px .+$/.test(font) ||
				!fontArray.includes(`${font.match(/px .+/)[0]}`)
			) {
				obj.font = e.font;
			} else obj.font = font;

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
			colour,
			font,
			x,
			y,
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
