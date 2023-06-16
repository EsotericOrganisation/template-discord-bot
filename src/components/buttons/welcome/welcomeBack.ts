import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	SelectMenuBuilder,
	SelectMenuOptionBuilder,
} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeBack"},
	async execute(interaction) {
		if (interaction.message.interaction.user.id !== interaction.user.id) {
			await interaction.reply(
				new ErrorMessageBuilder("This is not your settings menu!"),
			);
		} else {
			const settingsSchema = await settings.findOne({
				server: interaction.guild.id,
			});

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

			if (!settingsSchema.welcomeMSG?.enabled) {
				enable.setLabel("❌ Disabled").setStyle(ButtonStyle.Danger);
			}

			const Welcomechannel = new ButtonBuilder()
				.setCustomId("welcomeChannel")
				.setLabel("💬 Channel")
				.setStyle(ButtonStyle.Secondary);

			interaction.message.edit({
				embeds: [embed],
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
			interaction.deferUpdate();
		}
	},
};
