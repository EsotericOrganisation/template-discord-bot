import {
	EmbedBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	SelectMenuOptionBuilder,
	ButtonBuilder,
	ButtonStyle,
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

export default {
	data: {
		name: "settings",
	},
	async execute(interaction) {
		const settingsSchema = await settings.findOne({
			server: interaction.guild.id,
		});

		switch (interaction.values[0]) {
			case "0":
				let embedSettingsMSG = "💬 **Embeds**: `Admins Only ❌`";

				let welcomeMessageMSG = "👋 **Welcome Message**: `Disabled ❌`";

				let youtubeMessageMSG = "🎥 **Youtube Uploads**: `Disabled ❌`";

				if (settingsSchema.embeds) {
					embedSettingsMSG = "💬 **Embeds**: `Everyone ✅`";
				}

				if (settingsSchema.welcomeMSG?.enabled) {
					welcomeMessageMSG = `👋 **Welcome Message**: <#${settingsSchema.welcomeMSG.channel}> ✅`;
				}

				if (settingsSchema.youtubeMSG?.enabled) {
					youtubeMessageMSG = `🎥 **Youtube Uploads**: \`${settingsSchema.youtubeMSG.channel}\``;
				}

				const embed = new EmbedBuilder()
					.setTitle("⚙ Server Settings")
					.setColor("Grey")
					.setDescription(
						`> ${embedSettingsMSG}\n> \n> ${welcomeMessageMSG}\n> \n> ${youtubeMessageMSG}`,
					);

				interaction.message.edit({
					embeds: [embed],
					ephemeral: false,
					components: [new ActionRowBuilder().addComponents(menu)],
				});

				break;
			case "1": {
				const embed = new EmbedBuilder()
					.setTitle("💬 Embeds")
					.setColor("Grey")
					.setDescription(
						"> Configure who is able to send embeds on your server.",
					);

				const toggle = new ButtonBuilder()
					.setCustomId("settingsEmbedsToggle")
					.setLabel("✅ Everyone")
					.setStyle(ButtonStyle.Success);

				if (!settingsSchema.embeds) {
					toggle.setLabel("🔨 Admins Only").setStyle(ButtonStyle.Danger);
				}

				interaction.message.edit({
					embeds: [embed],
					components: [
						new ActionRowBuilder().addComponents(menu),
						new ActionRowBuilder().addComponents(toggle),
					],
				});

				break;
			}
			case "2": {
				const embed = new EmbedBuilder()
					.setTitle("👋 Welcome Message")
					.setColor("Grey")
					.setDescription("> Configure welcome messages on this server.")
					.addFields({
						name: "💬 Channel",
						value: "> In what channel should the join message be sent?",
					});

				const preview = new ButtonBuilder()
					.setCustomId("welcomePreview")
					.setLabel("👤 Preview")
					.setStyle(ButtonStyle.Secondary);

				const enable = new ButtonBuilder()
					.setCustomId("welcomeToggle")
					.setLabel("✅ Enabled")
					.setStyle(ButtonStyle.Success);

				const edit = new ButtonBuilder()
					.setCustomId("welcomeEdit")
					.setLabel("📝 Edit Message")
					.setStyle(ButtonStyle.Secondary);

				const dmEnable = new ButtonBuilder()
					.setCustomId("welcomeToggleDM")
					.setLabel("✅ Enabled")
					.setStyle(ButtonStyle.Success);

				if (!settingsSchema.welcomeMSG?.enabled)
					enable.setLabel("❌ Disabled").setStyle(ButtonStyle.Danger);

				if (!settingsSchema.welcomeMSG?.dmEnable)
					dmEnable.setLabel("❌ Disabled").setStyle(ButtonStyle.Danger);

				const Welcomechannel = new ButtonBuilder()
					.setCustomId("welcomeChannel")
					.setLabel("💬 Channel")
					.setStyle(ButtonStyle.Secondary);

				interaction.message.edit({
					embeds: [embed],
					components: [
						new ActionRowBuilder().addComponents(menu),
						new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setLabel("💬 Normal Message:")
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(true)
								.setCustomId("normalMessage"),
							enable,
							preview,
							Welcomechannel,
							edit,
						),
						new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setLabel("👤 Private Message:")
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(true)
								.setCustomId("privateMessage"),
							dmEnable,
							new ButtonBuilder()
								.setLabel("👤 Preview")
								.setStyle(ButtonStyle.Secondary)
								.setCustomId("welcomePreviewDM"),
							new ButtonBuilder()
								.setLabel("📝 Edit Message")
								.setStyle(ButtonStyle.Secondary)
								.setCustomId("welcomeEditDM"),
						),
						new ActionRowBuilder().addComponents(
							new ButtonBuilder()
								.setLabel("🎮 Roles:")
								.setStyle(ButtonStyle.Secondary)
								.setDisabled(true)
								.setCustomId("roles"),
							new ButtonBuilder()
								.setLabel("👤 Add Roles")
								.setStyle(ButtonStyle.Secondary)
								.setCustomId("welcomeRoleAdd"),
							new ButtonBuilder()
								.setLabel("🗑 Remove Roles")
								.setStyle(ButtonStyle.Secondary)
								.setCustomId("welcomeRoleRemove"),
						),
					],
				});

				break;
			}
		}
		interaction.deferUpdate();
	},
};
