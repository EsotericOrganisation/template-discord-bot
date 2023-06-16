import {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from "discord.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeEditContent"},
	async execute(interaction) {
		const input = interaction.fields.getTextInputValue("messageContentInput");

		let data = await settings.findOne({server: interaction.guild.id});

		await settings.updateOne(
			{server: interaction.guild.id},
			{
				welcomeMSG: {
					enabled: data.welcomeMSG.enabled,
					channel: data.welcomeMSG.channel,
					data: {
						content: input,
						embeds: data.welcomeMSG.data.embeds,
						images: data.welcomeMSG.data.images,
						height: data.welcomeMSG.data.height,
						width: data.welcomeMSG.data.width,
					},
				},
			},
		);

		data = await settings.findOne({server: interaction.guild.id});

		const descArray = [];

		descArray.push("> Edit your embed message here.\n");

		descArray.push("`Content 💬`");

		if (data?.welcomeMSG?.data?.content) {
			descArray.push(data.welcomeMSG.data.content);
		}

		descArray.push("`Embeds 📜`");

		for (const element of data?.welcomeMSG?.data?.embeds ?? []) {
			descArray.push(element.name);
		}

		descArray.push("`Images 📷`");

		for (const element of data?.welcomeMSG?.data?.images ?? []) {
			descArray.push(element.name);
		}

		descArray.push(
			`\n**Dimensions**\n Height: \`${data.welcomeMSG?.data.height}\`\n Width: \`${data.welcomeMSG?.data.width}\``,
		);

		interaction.message.edit({
			embeds: [
				new EmbedBuilder()
					.setColor("Grey")
					.setDescription(`${descArray.join("\n")}`)
					.setTitle("Welcome Message 👋"),
			],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setLabel("⏪ Back")
						.setCustomId("welcomeBack")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setLabel("Edit Content 📝")
						.setCustomId("welcomeEditContent")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setLabel("Edit Embeds 📝")
						.setCustomId("welcomeEditEmbed")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setLabel("Edit Pictures📝")
						.setCustomId("welcomeEditImage")
						.setStyle(ButtonStyle.Secondary),
				),
			],
		});

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("✅ Settings Updated")
					.setColor("Green")
					.setDescription(
						`> Welcome message content has been set to \`${input}\``,
					),
			],
			ephemeral: true,
		});
	},
};
