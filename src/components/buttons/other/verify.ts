export default {
	data: {
		name: "verify",
	},
	async execute(interaction) {
		const {roles} = interaction.member;
		const guest = await interaction.guild.roles
			.fetch("1005885499363311626")
			.catch(console.error);
		const member = await interaction.guild.roles
			.fetch("871479831865475072")
			.catch(console.error);
		if (
			roles.cache.has("1005885499363311626") ||
			!roles.cache.has("871479831865475072")
		) {
			await roles.remove(guest).catch(console.error);
			await roles.add(member).catch(console.error);
			await interaction.reply({
				content: "Successfully verified!",
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: "You are already verified!",
				ephemeral: true,
			});
		}
	},
};
