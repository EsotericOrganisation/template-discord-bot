const {
	SlashCommandBuilder,
	EmbedBuilder,
	SelectMenuBuilder,
	SelectMenuOptionBuilder,
	ActionRowBuilder,
	PermissionFlagsBits,
} = require("discord.js");
const {default: mongoose} = require("mongoose");
const settings = require("../src/schemas/settings");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Modify the server settings.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		const settingsSchema = await settings.findOne({
			server: interaction.guild.id,
		});
		let embedSettingsMSG = "💬 **Embeds**: `Admins Only ❌`";
		let welcomeMessageMSG = "👋 **Welcome Message**: `Disabled ❌`";
		let youtubeMessageMSG = "🎥 **Youtube Uploads**: `Disabled ❌`";
		if (!settingsSchema) {
			const settingsSchema = new settings({
				_id: mongoose.Types.ObjectId(),
				server: interaction.guild.id,
			});
			await settingsSchema.save().catch(console.error);
		}
		if (settingsSchema.embeds) {
			embedSettingsMSG = "💬 **Embeds**: `Everyone ✅`";
		}

		if (settingsSchema.welcomeMSG?.enabled) {
			welcomeMessageMSG = `👋 **Welcome Message**: <#${settingsSchema.welcomeMSG.channel}> ✅`;
		}

		if (settingsSchema.youtubeMSG?.enabled) {
			youtubeMessageMSG = `🎥 **Youtube Uploads**: \`${settingsSchema.youtubeMSG.channel}\``;
		}

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("⚙ Server Settings")
					.setColor("Grey")
					.setDescription(
						`> ${embedSettingsMSG}\n> \n> ${welcomeMessageMSG}\n> \n> ${youtubeMessageMSG}`,
					),
			],
			ephemeral: false,
			components: [
				new ActionRowBuilder().addComponents(
					new SelectMenuBuilder()
						.setCustomId("settings")
						.setMinValues(1)
						.setMaxValues(1)
						.setOptions(
							new SelectMenuOptionBuilder({label: "💬 Embeds", value: "1"}),
							new SelectMenuOptionBuilder({
								label: "👋 Welcome Message",
								value: "2",
							}),
							new SelectMenuOptionBuilder({
								label: "🎥 Youtube Uploads",
								value: "3",
							}),
						),
				),
			],
		});
	},
};
