const {EmbedFileMessageBuilder} = require("../../../classes");
const embedSchema = require("../../../schemas/embedSchema");

module.exports = {
	data: {
		name: "embedFileEditDown",
	},
	async execute(interaction, client) {
		const msg = interaction.message;
		const count = parseInt(
			interaction.message.embeds[0].data.description.match(/\d+/)[0],
		);
		const embedProfile = await embedSchema.findOne({
			author: interaction.user.id,
			customID: count,
		});
		const index =
			parseInt(interaction.message.embeds[0].data.footer.text.match(/\d+/)[0]) -
			1;

		if (index !== embedProfile.files.length - 1) {
			[embedProfile.files[index + 1], embedProfile.files[index]] = [
				embedProfile.files[index],
				embedProfile.files[index + 1],
			];
		}
		await embedSchema.updateOne(
			{author: interaction.user.id, customID: count},
			{files: embedProfile.files},
		);
		await interaction.deferUpdate();

		await msg.edit(
			new EmbedFileMessageBuilder(
				embedProfile,
				index === embedProfile.files.length - 1
					? embedProfile.files.length
					: index + 1,
				client,
			),
		);
	},
};
