import {EmbedBuilder} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import embedSchema from "../../../schemas/embedSchema.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeEmbedRemove"},
	async execute(interaction) {
		const settingsData = await settings.findOne({
			server: interaction.guild.id,
		});

		const embedArray = settingsData.welcomeMSG.data.embeds;

		const input = interaction.fields.getTextInputValue("removeEmbedNumber");
		let deletedEmbed = input;

		if (!parseInt(deletedEmbed)) {
			deletedEmbed = await embedSchema.findOne({
				author: interaction.user.id,
				EmbedTitle: `${input}`,
			}).customID;
		} else {
			for (let i = 0; i < embedArray.length; i++) {
				const MatchedName = embedArray[i].ID;
				if (MatchedName === parseInt(input)) {
					deletedEmbed = i;
					break;
				}
			}
		}
		if (!deletedEmbed) {
			// For-loop to match the name of every embed of the user to the name provided.
			const NameReg = new RegExp(`${input}`, "i");
			for (let i = 0; i < embedArray.length; i++) {
				const MatchedName = embedArray[i].Title.match(NameReg);
				if (MatchedName) {
					deletedEmbed = i;
					break;
				}
			}
		}

		if (!embedArray[deletedEmbed]) {
			await interaction.reply(
				new ErrorMessageBuilder("That embed does not exist!"),
			);
		} else {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("✅ Settings Updated")
						.setColor("Green")
						.setDescription(
							`> Removed Embed \`${embedArray[deletedEmbed].Title}\`.`,
						),
				],
				ephemeral: true,
			});

			settingsData.welcomeMSG.data.embeds.splice(
				settingsData.welcomeMSG.data.embeds
					.map((e) => e.ID)
					.indexOf(deletedEmbed) - 1,
				1,
			);

			await settings.updateOne(
				{server: interaction.guild.id},
				{welcomeMSG: settingsData.welcomeMSG},
			);

			const descArray = [];

			const data = await settings.findOne({
				server: interaction.guild.id,
			});

			for (const index of data.welcomeMSG.data.embeds) {
				descArray.push(`> ${index.Title}`);
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
