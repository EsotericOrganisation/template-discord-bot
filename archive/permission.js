const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	PermissionsBitField,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("permission")
		.setDescription("This command requires a permission!")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const {roles} = interaction.member;
		const role = await interaction.guild.roles
			.fetch("1005885499363311626")
			.catch(console.error);

		const testRole = await interaction.guild.roles
			.create({
				name: "Test",
				permissions: [PermissionsBitField.Flags.KickMembers],
			})
			.catch(console.error);
		// Has role
		if (roles.cache.has("1005885499363311626")) {
			await interaction.deferReply({
				fetchReply: true,
			});

			await roles.remove(role).catch(console.error);
			await interaction.editReply({
				content: `Removed: ${role.name} role from you.`,
			});
		} else {
			await interaction.reply({
				content: `You do not have the ${role.name} role.`,
			});
		}

		await roles.add(testRole).catch(console.error);

		await testRole
			.setPermissions([PermissionsBitField.Flags.BanMembers])
			.catch(console.error);

		const channel = await interaction.guild.channels.create({
			name: "test",
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: testRole.id,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
			],
		});

		await channel.permissionOverwrites
			.edit(testRole.id, {SendMessages: false})
			.catch(console.error);
	},
};
