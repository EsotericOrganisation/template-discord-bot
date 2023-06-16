/* eslint-disable no-unused-vars */
import {getEmbedType} from "../../../functions.js";
import {
	EmbedFileMessageBuilder,
	EmbedComponentMessageBuilder,
	EmbedEmbedMessageBuilder,
} from "../../../classes.js";
import embedSchema from "../../../schemas/embedSchema.js";

export default {
	data: {
		name: "embedEditUp",
	},
	async execute(interaction, client) {
		const embed = interaction.message.embeds[0].data;

		const match = embed.title.match(/(?<= - Editing )\w+(?=s$)/)[0];

		const count = parseInt(embed.description.match(/\d+/)[0]);
		const embedProfile = await embedSchema.findOne({
			author: interaction.user.id,
			customID: count,
		});
		const index = parseInt(embed.footer.text.match(/\d+/)[0]) - 1;

		if (index) {
			[embedProfile[`${match}s`][index], embedProfile[`${match}s`][index - 1]] =
				[
					embedProfile[`${match}s`][index - 1],
					embedProfile[`${match}s`][index],
				];
		}

		await embedSchema.updateOne(
			{author: interaction.user.id, customID: count},
			match === "file"
				? {files: embedProfile.files}
				: match === "embed"
				? {embeds: embedProfile.embeds}
				: {components: embedProfile.components},
		);

		await interaction.deferUpdate();

		await interaction.message.edit(
			getEmbedType(
				match,
				(...args) => new EmbedFileMessageBuilder(...args),
				(...args) => new EmbedEmbedMessageBuilder(...args),
				(...args) => new EmbedComponentMessageBuilder(...args),
				embedProfile,
				index === 0 ? 0 : index - 1,
				client,
			),
		);
	},
};
