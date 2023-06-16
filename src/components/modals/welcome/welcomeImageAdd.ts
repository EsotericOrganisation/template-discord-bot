import {EmbedBuilder} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeImageAdd"},
	async execute(interaction) {
		const name = interaction.fields.getTextInputValue("welcomeImageName");
		const x = parseInt(
			interaction.fields.getTextInputValue("welcomeXResolution"),
		);
		const y = parseInt(
			interaction.fields.getTextInputValue("welcomeYResolution"),
		);

		if (!x) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid X resolution!"),
			);
		} else if (!y) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid Y resolution!"),
			);
		} else {
			const settingsData = await settings.findOne({
				server: interaction.guild.id,
			});

			settingsData.welcomeMSG.data.images.push({
				name,
				layers: [],
				width: x,
				height: y,
			});

			await settings.updateOne(
				{server: interaction.guild.id},
				{welcomeMSG: settingsData.welcomeMSG},
			);

			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("✅ Settings Updated")
						.setColor("Green")
						.setDescription(
							`> A new image with the name of \`${name}\` has been created.`,
						),
				],
				ephemeral: true,
			});

			const descArray = [];

			descArray.push("**Images:**\n");

			for (const index of settingsData.welcomeMSG.data.images) {
				descArray.push(
					`**${index.name}**\n> ${index.layers.length} Layers\n> Resolution: ${index.width}x${index.height}`,
				);
			}

			if (settingsData.welcomeMSG.data.images.length === 0) {
				descArray.shift();
				descArray.push(
					"You have no welcome message images. Click the button below to add images.",
				);
			}

			await interaction.message.edit({
				embeds: [
					new EmbedBuilder()
						.setTitle("Welcome Message Images 📷")
						.setDescription(`${descArray.join("\n")}`)
						.setColor("Grey"),
				],
				ephemeral: true,
			});
		}
	},
};
