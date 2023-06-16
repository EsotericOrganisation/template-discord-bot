const {EmbedFileMessageBuilder} = require("../../../classes");
const embedSchema = require("../../../schemas/embedSchema");

module.exports = {
	data: {
		name: "embedFileEditUp",
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

		if (index !== 0) {
			[embedProfile.files[index], embedProfile.files[index - 1]] = [
				embedProfile.files[index - 1],
				embedProfile.files[index],
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
				index === 0 ? 0 : index - 1,
				client,
			),
		);
	},
};
