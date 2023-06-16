/**
 * Handy class to create new message for when the user is viewing or editing their embed's files.
 * @param {Object} embedProfile
 * @param {Object} client
 * @param {Number} selected
 * @example await interaction.reply(new EmbedFileMessageBuilder(embedProfile, client))
 
class EmbedFileMessageBuilder {
	constructor(embedProfile, client, selected) {
		let description = `> Currently editing your \`${
			embedProfile.customID
		}${numberEnding(
			embedProfile.customID
		)}\` embed builder. Edit it's files here.\n`;

		embedProfile.files.forEach((file, index) => {
			if (index === selected) {
				description += `\n\`\`\`md\n${index + 1}. ${file.name}\n${`====${"=".repeat(
					file.name.length - 2 + `${index + 1}`.length
				)}`}\n<SELECTED>\n- Link: ${cut(file.link, 53)}\n- Type: ${
					file.type
				}\n- Size: ${`${file.size / 1000000}`.slice(0, 4)} MB\n\`\`\`\n`;
			} else {
				description += `\n${index + 1}. **${file.name}**\n> Link: [${cut(
					file.link,
					67
				)}](${file.link})\n> Type: ${file.type}\n> Size: ${`${
					file.size / 1000000
				}`.slice(0, 4)} MB\n`;
			}
		});

		if (!embedProfile.files.length) description += "\n*No files*";
		this.embeds = [
			new EmbedBuilder()
				.setTitle(
					`${embedProfile.name} - 📝 Edit Files${
						selected ? ` - Editing File ${selected + 1}` : ""
					}`
				)
				.setDescription(description)
				.setColor(embedProfile.embeds[0]?.color ?? "Green")
				.setAuthor({
					name: client.user.username,
					iconURL: client.user.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				})
				.setFooter({
					text: `${
						selected
							? `Editing File ${selected + 1}`
							: `Editing Embed Builder ${embedProfile.customID}`
					}`,
					iconURL:
						"https://cdn.discordapp.com/attachments/1020058739526619186/1051111672938496070/pen_2.png",
				})
				.setTimestamp(Date.now()),
		];

		this.components = !selected
			? [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setEmoji("⏪")
							.setLabel("Back")
							.setCustomId("embedBack")
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId("embedFileAdd")
							.setEmoji("📁")
							.setLabel("Add Files")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId("embedFileRemove")
							.setEmoji("📁")
							.setLabel("Remove Files")
							.setStyle(ButtonStyle.Secondary)
					),
			  ]
			: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setEmoji("⏪")
							.setLabel("Back")
							.setCustomId("embedEditFiles")
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId("embedFileDelete")
							.setEmoji("📁")
							.setLabel("Delete File")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId("embedFileEditEdit")
							.setEmoji("📁")
							.setLabel("Edit File")
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId("embedFileEditUp")
							.setEmoji("🔼")
							.setStyle(ButtonStyle.Primary),
						new ButtonBuilder()
							.setCustomId("embedFileEditDown")
							.setEmoji("🔽")
							.setStyle(ButtonStyle.Primary)
					),
			  ];

		if (embedProfile.files.length)
			this.components.push(
				new ActionRowBuilder().addComponents(
					new SelectMenuBuilder()
						.setCustomId("embedFileEdit")
						.setPlaceholder("📁 Edit File...")
						.setOptions(
							embedProfile.files.map((file, index) => ({
								label: file.name,
								value: `${index}`,
								description: cut(file.link, 100),
								default: index === selected,
								emoji: "📁",
							}))
						)
						.setMinValues(1)
						.setMaxValues(1)
				)
			);
	}
}
*/
