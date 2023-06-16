import {
	EmbedBuilder,
	SelectMenuBuilder,
	SelectMenuOptionBuilder,
	ButtonStyle,
	ButtonBuilder,
	ActionRowBuilder,
} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import settings from "../../../schemas/settings.js";

const Welcomechannel = new ButtonBuilder()
	.setCustomId("welcomeChannel")
	.setLabel("💬 Channel")
	.setStyle(ButtonStyle.Secondary);

const enable = new ButtonBuilder().setCustomId("welcomeToggle");

const preview = new ButtonBuilder()
	.setCustomId("welcomePreview")
	.setLabel("👤 Preview")
	.setStyle(ButtonStyle.Secondary);

const edit = new ButtonBuilder()
	.setCustomId("welcomeEdit")
	.setLabel("📝 Edit Message")
	.setStyle(ButtonStyle.Secondary);

export default {
	data: {
		name: "welcomeToggle",
	},
	async execute(interaction) {
		if (interaction.message.interaction?.user.id !== interaction.user.id) {
			await interaction.reply(
				new ErrorMessageBuilder("This is not your settings menu."),
			);
		} else {
			const settingsSchema = await settings.findOne({
				server: interaction.guild.id,
			});

			const menu = new SelectMenuBuilder()
				.setCustomId("settings")
				.setMinValues(1)
				.setMaxValues(1)
				.setOptions(
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
				);

			if (!settingsSchema.welcomeMSG?.enabled) {
				await settings.findOneAndUpdate(
					{server: interaction.guild.id},
					{
						welcomeMSG: {
							enabled: true,
							channel: settingsSchema.welcomeMSG?.channel,
						},
					},
				);
				enable
					.setCustomId("welcomeToggle")
					.setLabel("✅ Enabled")
					.setStyle(ButtonStyle.Success);

				interaction.message.edit({
					components: [
						new ActionRowBuilder().addComponents(menu),
						new ActionRowBuilder().addComponents(
							enable,
							preview,
							Welcomechannel,
							edit,
						),
					],
				});

				if (!settingsSchema.welcomeMSG?.channel) {
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle("✅ Settings Updated")
								.setDescription(
									"> Welcome messages have been enabled on this server. Please select a channel for them to be sent in.",
								)
								.setColor("Green"),
						],
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle("✅ Settings Updated")
								.setDescription(
									`> Welcome messages have been enabled on this server. They will be sent in the <#${settingsSchema.welcomeMSG.channel}> channel.`,
								)
								.setColor("Green"),
						],
						ephemeral: true,
					});
				}
			} else {
				await settings.findOneAndUpdate(
					{server: interaction.guild.id},
					{
						welcomeMSG: {
							enabled: false,
							channel: settingsSchema.welcomeMSG?.channel,
							data: settingsSchema.welcomeMSG?.data,
						},
					},
				);
				enable.setLabel("❌ Disabled").setStyle(ButtonStyle.Danger);

				interaction.message.edit({
					components: [
						new ActionRowBuilder().addComponents(menu),
						new ActionRowBuilder().addComponents(
							enable,
							preview,
							Welcomechannel,
							edit,
						),
					],
				});

				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle("✅ Settings Updated")
							.setDescription(
								"> Welcome messages have been disabled on this server.",
							)
							.setColor("Green"),
					],
					ephemeral: true,
				});
			}
		}
	},
};
