import {EmbedBuilder} from "discord.js";

export default {
	data: {name: "welcomeImageLayerHelp"},
	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("👋 Welcome Image Help")
					.setColor("Green")
					.setDescription(
						`**Variables**\n\n**<center>**\n> Centers a layer. Can be used in one or both axes.\n\n**Placeholders**\n\n**{user.name}**\n> The user's name.\n> Type: text.\n> Welcome ${
							interaction.user.username
						} to ${
							interaction.guild
						}!\n\n**{user.tag}**\n> The user's name and tag.\n> Type: text.\n> Welcome ${
							interaction.user.tag
						} to the server!\n\n**{user.ping}**\n> Pings the user.\n> Type: text.\n> Welcome <@${
							interaction.user.id
						}> to the server!\n\n**{member.count}**\n> The amount of members in the server (not including bots).\n> Type: text.\n> Member #${
							interaction.guild.members.cache.filter(
								(member) => !member.user.bot,
							).size
						}\n\n**{guild.name}**\n> The guild name.\n> Type: text.\n> Welcome to ${
							interaction.guild
						}!
						\n**{user.icon}**\n> The user's profile picture.\n> Type: image.\n> ${interaction.user.displayAvatarURL(
							{size: 4096, extension: "png"},
						)}\n\n**{guild.icon}**\n> The guild's profile picture.\n> Type: image.\n> ${interaction.guild.iconURL(
							{size: 4096, extension: "png"},
						)}`,
					),
			],
			ephemeral: true,
		});
	},
};
