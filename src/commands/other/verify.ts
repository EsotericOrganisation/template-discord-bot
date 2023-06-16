import {
	EmbedBuilder,
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("verify")
		.setDescription("Verification System."),
	usage: ["**/verify**"],
	async execute(interaction) {
		await interaction.reply({
			content: "Sending...",
			ephemeral: true,
		});
		await interaction.channel?.send({
			files: [
				"https://cdn.discordapp.com/attachments/874225432726241290/1014505530288513034/TheSlimySwampVerification.png",
			],
			embeds: [
				new EmbedBuilder()
					.setColor(0x22f9b9)
					.setTitle("✅ Verify")
					.setDescription(
						"> Verify yourself by reacting to the button below! You will receive a role and you\n> will be able to access all other channels.",
					),
			],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("verify")
						.setLabel("Verify Here! ✅")
						.setStyle(ButtonStyle.Primary),
				),
			],
		});
		await interaction.followUp({
			content: "Successfully sent!",
			ephemeral: true,
		});
	},
};
