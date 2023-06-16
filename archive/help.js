const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Need help? Try this command!"),
	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("🤖 Help Menu")
					.setDescription(
						"If you ever feel confused, use </help:1008815470222266379> to see this menu!",
					)
					.setColor(0x18e1ee)
					.setThumbnail(
						interaction.user.displayAvatarURL({
							size: 4096,
							extension: "png",
						}),
					)
					.setTimestamp(Date.now())
					.addFields([
						{
							name: "💖 Help and Support",
							value:
								"If you ever need help from the owner or an admin, create a ticket in <#807553784657870848>.\n᲼",
							inline: true,
						},
						{
							name: "🌳 Minecraft",
							value:
								"Head over to\n <#806814024120533012> if you need information about the Minecraft Server.\n᲼",
							inline: true,
						},
						{
							name: "💬 </help:1008815470222266379>",
							value: "Shows this menu.\n⠀",
							inline: true,
						},
						{
							name: "🤖 </ping:1008072167348510822>",
							value: "Returns your ping!",
							inline: false,
						},
					]),
			],
		});
	},
};
