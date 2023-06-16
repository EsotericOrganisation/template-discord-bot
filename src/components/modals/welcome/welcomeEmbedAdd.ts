import {EmbedBuilder} from "discord.js";
import embedSchema from "../../../schemas/embedSchema.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeEmbedAdd"},
	async execute(interaction) {
		const settingsData = await settings.findOne({
			server: interaction.guild.id,
		});

		const embedArray = await embedSchema.find({
			author: interaction.user.id,
		});

		const input = interaction.fields.getTextInputValue("addEmbedNumber");
		let deletedEmbed = parseInt(input);

		if (!deletedEmbed) {
			deletedEmbed = await embedSchema.findOne({
				author: interaction.user.id,
				EmbedTitle: `${input}`,
			}).customID;
		}
		if (!deletedEmbed) {
			// For-loop to match the name of every embed of the user to the name provided.
			const NameReg = new RegExp(`^.*${input}.*$`, "gi");
			for (const embedMatch of embedArray) {
				const MatchedName = embedMatch.EmbedTitle.match(NameReg);
				if (MatchedName) {
					deletedEmbed = embedMatch.customID;
					break;
				}
			}
		}

		if (!embedArray[deletedEmbed - 1]) {
			await interaction.reply(
				new ErrorMessageBuilder("That embed does not exist!"),
			);
		} else {
			await settingsData.welcomeMSG.data.embeds.push({
				ID: deletedEmbed,
				User: interaction.user.id,
				Title: embedArray[deletedEmbed - 1].EmbedTitle,
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
							`> Added Embed \`${embedArray[deletedEmbed - 1].EmbedTitle}\`.`,
						),
				],
				ephemeral: true,
			});

			const descArray = [];

			const data = await settings.findOne({
				server: interaction.guild.id,
			});

			for (const index of data.welcomeMSG.data.embeds) {
				descArray.push(`> ${index.Title} - ${index.ID}`);
			}

			if (data.welcomeMSG.data.embeds.length === 0) {
				descArray.push(
					"You have no welcome message embeds. Click the button below to add embeds.",
				);
			}

			await interaction.message.edit({
				embeds: [
					new EmbedBuilder()
						.setTitle("Welcome Message Embeds 📜")
						.setColor("Grey")
						.setDescription(`${descArray.join("\n")}`),
				],
			});
		}
	},
};
