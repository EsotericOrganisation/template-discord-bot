import {EmbedBuilder} from "discord.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeImageRemove"},
	async execute(interaction) {
		const settingsData = await settings.findOne({
			server: interaction.guild.id,
		});

		let input = interaction.fields.getTextInputValue("imageName");
		let image;

		for (
			let index = 0;
			index < settingsData.welcomeMSG.data.images.length;
			index++
		) {
			const element = settingsData.welcomeMSG.data.images[index];
			if (new RegExp(`${input}`, "i").test(element.name)) {
				input = index;
				image = element;
				break;
			}
		}

		settingsData.welcomeMSG.data.images.splice(input - 1);

		await settings.updateOne(
			{server: interaction.guild.id},
			{welcomeMSG: settingsData.welcomeMSG},
		);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("✅ Settings Updated")
					.setColor("Green")
					.setDescription(`> The \`${image.name}\` image has been deleted.`),
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

		interaction.message.edit({
			embeds: [
				new EmbedBuilder()
					.setTitle("Welcome Message Images 📷")
					.setDescription(`${descArray.join("\n")}`)
					.setColor("Grey"),
			],
			ephemeral: true,
		});
	},
};
