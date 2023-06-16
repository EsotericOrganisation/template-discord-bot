const {
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	EmbedBuilder,
} = require("discord.js");
const {cut, wordNumberEnding} = require("../src/functions");

// eslint-disable-next-line no-unused-vars
class EmbedEmbedMessageBuilder {
	constructor(embedProfile, interaction) {
		let description = "> Edit this embed builder's embeds here.\n\n";
		for (const embed of embedProfile.embeds) {
			description += `**${embed.title}**\n> ${
				Object.keys(embed).length - 1
			} Properties\n> Description: ${cut(embed.description, 61)}\n> Colour: ${
				embed.color
			}\n`;
		}
		if (!embedProfile.embeds.length) description += "*No embeds*";
		this.embeds = [
			new EmbedBuilder()
				.setTitle(`${embedProfile.name} - 🎨 Edit Embeds`)
				.setDescription(description)
				.setColor(embedProfile.embeds[0]?.color ?? "Green")
				.setAuthor({
					name: `Requested by ${interaction.user.username}`,
					iconURL: interaction.user.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setFooter({
					text: `Editing Embed Builder ${embedProfile.customID}`,
					iconURL:
						"https://cdn.discordapp.com/attachments/1020058739526619186/1051111672938496070/pen_2.png",
				})
				.setTimestamp(Date.now()),
		];

		this.components = [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setEmoji("⏪")
					.setLabel("Back")
					.setCustomId("embedBack")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId("embedEmbedAdd")
					.setEmoji("🎨")
					.setLabel("Add Embed")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("embedEmbedRemove")
					.setEmoji("🎨")
					.setLabel("Remove Embed")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("embedEmbedEdit")
					.setEmoji("🎨")
					.setLabel("Edit Embed")
					.setStyle(ButtonStyle.Secondary),
			),
		];
	}
}

// eslint-disable-next-line no-unused-vars
const EmbedComponentMessageBuilder = class {
	constructor(embedProfile, interaction) {
		let description = "> Edit this embed builder's components here.\n\n";
		for (const actionRow of embedProfile.components) {
			description += `\n**Action Row - ${
				actionRow.components.length
			} component${wordNumberEnding(actionRow.components.length)}**\n`;
			for (const component of actionRow.components) {
				description += `> ${
					component.type === 2 ? "⏸️ Button" : "📋 Select Menu"
				} - ${component.label ?? component.placeholder}\n`;
			}
			if (!actionRow.components.length) description += "*No components*\n";
		}
		if (!embedProfile.components.length) description += "*No components*";
		this.embeds = [
			new EmbedBuilder()
				.setTitle(`${embedProfile.name} - 📋 Edit Components`)
				.setDescription(description)
				.setColor(embedProfile.embeds[0]?.color ?? "Green")
				.setAuthor({
					name: `Requested by ${interaction.user.username}`,
					iconURL: interaction.user.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setFooter({
					text: `Editing Embed Builder ${embedProfile.customID}`,
					iconURL:
						"https://cdn.discordapp.com/attachments/1020058739526619186/1051111672938496070/pen_2.png",
				})
				.setTimestamp(Date.now()),
		];

		this.components = [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setEmoji("⏪")
					.setLabel("Back")
					.setCustomId("embedBack")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId("embedComponentAdd")
					.setEmoji("📋")
					.setLabel("Add Component")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("embedComponentRemove")
					.setEmoji("📋")
					.setLabel("Remove Component")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("embedComponentEdit")
					.setEmoji("📋")
					.setLabel("Edit Component")
					.setStyle(ButtonStyle.Secondary),
			),
		];
	}
};
