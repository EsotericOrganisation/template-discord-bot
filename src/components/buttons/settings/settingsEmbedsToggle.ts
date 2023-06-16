import {
	EmbedBuilder,
	SelectMenuBuilder,
	SelectMenuOptionBuilder,
	ActionRowBuilder,
	ButtonStyle,
	ButtonBuilder,
} from "discord.js";
import settings from "../../../schemas/settings.js";

const menu = new SelectMenuBuilder()
	.setCustomId("settings")
	.setMinValues(1)
	.setMaxValues(1)
	.setOptions([
		new SelectMenuOptionBuilder({
			label: "⚙ Return to Settings Home Page",
			value: "0",
		}),
		new SelectMenuOptionBuilder({label: "💬 Embeds", value: "1"}),
		new SelectMenuOptionBuilder({
			label: "👋 Welcome Message",
			value: "2",
		}),
		new SelectMenuOptionBuilder({
			label: "🎥 Youtube Uploads",
			value: "3",
		}),
	]);

const toggle = new ButtonBuilder().setCustomId("settingsEmbedsToggle");

export default {
	data: {
		name: "settingsEmbedsToggle",
	},
	async execute(interaction) {
		if (interaction.message.interaction.user.id !== interaction.user.id) {
			await interaction.reply(
				new ErrorMessageBuilder("This is not your settings menu."),
			);
		} else {
			await interaction.deferReply({ephemeral: true});
			const settingsData = await settings.findOne({
				server: interaction.guild.id,
			});

			if (!settingsData.embeds) {
				await settings.updateOne(
					{server: interaction.guild.id},
					{embeds: true},
				);

				toggle.setLabel("✅ Everyone").setStyle(ButtonStyle.Success);

				await interaction.message.edit({
					components: [
						new ActionRowBuilder().addComponents(menu),
						new ActionRowBuilder().addComponents(toggle),
					],
				});

				await interaction.editReply({
					ephemeral: true,
					embeds: [
						new EmbedBuilder()
							.setTitle("✅ Settings Updated")
							.setDescription("> Embeds have been set to `Everyone`.")
							.setColor("Green"),
					],
				});
			} else {
				await settings.updateOne(
					{server: interaction.guild.id},
					{embeds: false},
				);

				toggle.setLabel("🔨 Admins Only").setStyle(ButtonStyle.Danger);

				await interaction.message.edit({
					components: [
						new ActionRowBuilder().addComponents(menu),
						new ActionRowBuilder().addComponents(toggle),
					],
				});

				await interaction.editReply({
					ephemeral: true,
					embeds: [
						new EmbedBuilder()
							.setTitle("✅ Settings Updated")
							.setDescription("> Embeds have been set to `Admins Only`.")
							.setColor("Green"),
					],
				});
			}
		}
	},
};
