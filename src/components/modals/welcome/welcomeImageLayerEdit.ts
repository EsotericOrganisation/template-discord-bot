import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeImageLayerEdit"},
	async execute(interaction) {
		const settingsData = await settings.findOne({server: interaction.guild.id});

		const num =
			parseInt(interaction.message.embeds[0].data.title.match(/\d+/)[0]) - 1;

		let input = interaction.fields.getTextInputValue(
			"welcomeImageLayerEditNumber",
		);

		const arr = settingsData.welcomeMSG.data.images[num].layers.map((x) =>
			new RegExp(input, "i").test(x.text),
		);

		for (let e = 0; e < arr.length; e++) {
			if (arr[e]) {
				input = e;
				break;
			}
		}

		if (!settingsData.welcomeMSG.data.images[num].layers[parseInt(input)]) {
			await interaction.reply(
				new ErrorMessageBuilder("That layer does not exist!"),
			);
		} else {
			const descArray = [];

			descArray.push("**Layers:**");

			for (
				let i = 0;
				i < settingsData.welcomeMSG.data.images[num].layers.length;
				i++
			) {
				const index = settingsData.welcomeMSG.data.images[num].layers[i];

				if (i === input) {
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
				if (i === input) {
					descArray.push("```");
				}
			}

			interaction.message.edit({
				embeds: [
					new EmbedBuilder()
						.setTitle(interaction.message.embeds[0].data.title)
						.setColor("Grey")
						.setDescription(descArray.join("\n"))
						.setFooter({
							text: `Editing layer ${parseInt(input) + 1}`,
							iconURL: interaction.user.displayAvatarURL({
								size: 4096,
								extension: "png",
							}),
						}),
				],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setLabel("⏪ Back")
							.setStyle(ButtonStyle.Primary)
							.setCustomId("welcomeImageLayerEditBack"),
						new ButtonBuilder()
							.setLabel("📝 Edit Layer")
							.setStyle(ButtonStyle.Secondary)
							.setCustomId("welcomeImageLayerEditEdit"),
						new ButtonBuilder()
							.setLabel("🗑 Delete Layer")
							.setStyle(ButtonStyle.Danger)
							.setCustomId("welcomeImageLayerEditDelete"),
						new ButtonBuilder()
							.setLabel("🔼")
							.setStyle(ButtonStyle.Primary)
							.setCustomId("welcomeImageLayerEditUp"),
						new ButtonBuilder()
							.setLabel("🔽")
							.setStyle(ButtonStyle.Primary)
							.setCustomId("welcomeImageLayerEditDown"),
					),
				],
			});
		}
	},
};
