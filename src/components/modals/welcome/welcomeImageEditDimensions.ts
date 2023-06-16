import {EmbedBuilder} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeImageEditDimensions"},
	async execute(interaction) {
		const x = parseInt(
			interaction.fields.getTextInputValue("welcomeXResolution"),
		);
		const y = parseInt(
			interaction.fields.getTextInputValue("welcomeYResolution"),
		);

		const img = interaction.message.embeds[0].data.title.match(/\d+/)[0];

		if (!x) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid x resolution!"),
			);
		} else if (!y) {
			await interaction.reply(
				new ErrorMessageBuilder("Please provide a valid y resolution!"),
			);
		} else {
			const settingsData = await settings.findOne({
				server: interaction.guild.id,
			});

			settingsData.welcomeMSG.data.images[img - 1].width = x;

			settingsData.welcomeMSG.data.images[img - 1].height = y;

			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("✅ Settings Updated")
						.setDescription(
							`**${
								settingsData.welcomeMSG.data.images[img - 1].name
							}**\n> Width: ${x}\n> Height: ${y}`,
						)
						.setColor("Green"),
				],
				ephemeral: true,
			});

			await settings.updateOne(
				{server: interaction.guild.id},
				{welcomeMSG: settingsData.welcomeMSG},
			);
		}
	},
};
