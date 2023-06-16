const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Info Channel Command")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		await interaction.deferReply();
		const channel = interaction.channel;

		const embed = new EmbedBuilder()
			.setTitle("Welcome! 👋")
			.setDescription(
				"Welcome to The Slimy Swamp! 👋\nThis server is owned and developed by <@500690028960284672> and the admin team. The Slimy Swamp is a community dedicated to creating the best Minecraft multiplayer experience without having to install any mods.",
			)
			.setColor("#32cd32");

		channel.send({
			embeds: [embed],
			files: [
				"https://cdn.discordapp.com/attachments/806814024120533012/1019323723108581426/WelcomeToTheSlimySwamp.png",
			],
		});
	},
};
// Has role
//      if (roles.cache.has("1005885499363311626")) {
//        await interaction.deferReply({
//        fetchReply: true,
//      });
//
//      await roles.remove(role).catch(console.error);
//      await interaction.editReply({
//        content: `Removed: ${role.name} role from you.`,
//      });
//    } else {
//      await interaction.reply({
//        content: `You do not have the ${role.name} role.`,
//      });
//    }
//
//    await roles.add(testRole).catch(console.error);
//
//    await testRole
//        .setPermissions([PermissionsBitField.Flags.BanMembers])
//       .catch(console.error);
//
//      const channel = await interaction.guild.channels.create({
//        name: `test`,
//        permissionOverwrites: [
//          {
//           id: interaction.guild.id,
//            deny: [PermissionsBitField.Flags.ViewChannel],
//          },
//          {
//            id: testRole.id,
//            allow: [PermissionsBitField.Flags.ViewChannel],
//          },
//        ],
//      });
//
//      await channel.permissionOverwrites
//        .edit(testRole.id, { SendMessages: false })
//        .catch(console.error);
//    },
//  };
