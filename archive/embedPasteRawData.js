const {ErrorMessageBuilder} = require("../src/classes");
const embedSchema = require("../src/schemas/embedSchema");

module.exports = {
	data: {
		name: "embedPasteRawData",
	},
	async execute(interaction) {
		const countReg = /[0-9]+/;

		const count = parseInt(
			await interaction.message.embeds[0].data.description.match(countReg)[0],
		);

		const embedData = await embedSchema.findOne({
			customID: count,
			author: interaction.user.id,
		});

		if (!embedData) {
			await interaction.reply(
				new ErrorMessageBuilder("This embed does not exist!"),
			);
		} else {
			const replyArray = [];

			if (embedData.Content) {
				replyArray.push(
					`Message Content\n---------------\n${embedData.Content}`,
				);
			}

			if (embedData.EmbedTitle) {
				replyArray.push(`Embed Title\n-----------\n${embedData.EmbedTitle}`);
			}

			if (embedData.EmbedDescription) {
				replyArray.push(
					`Embed Description\n-----------------\n${embedData.EmbedDescription}`,
				);
			}

			if (embedData.EmbedColour) {
				replyArray.push(`Embed Colour\n------------\n${embedData.EmbedColour}`);
			}

			if (embedData.Attachment) {
				replyArray.push(
					`Attachment Link\n---------------\n${embedData.Attachment}`,
				);
			}

			if (embedData.EmbedURL) {
				replyArray.push(`Embed URL\n---------\n${embedData.EmbedURL}`);
			}

			if (embedData.Author?.name) {
				replyArray.push(`Author Name\n-----------\n${embedData.Author.name}`);
			}

			if (embedData.Author?.link) {
				replyArray.push(`Author Link\n-----------\n${embedData.Author.link}`);
			}

			if (embedData.Author?.iconURL) {
				replyArray.push(
					`Author Icon URL\n---------------\n${embedData.Author.iconURL}`,
				);
			}

			if (embedData.Timestamp) {
				replyArray.push(`Timestamp\n---------\n${embedData.Timestamp}`);
			}

			if (embedData.Image) {
				replyArray.push(`Embed Image\n-----------\n${embedData.Image}`);
			}

			if (embedData.Thumbnail) {
				replyArray.push(
					`Embed Thumbnail\n---------------\n${embedData.Thumbnail}`,
				);
			}

			if (embedData.Footer?.text) {
				replyArray.push(`Footer Text\n-----------\n${embedData.Footer.text}`);
			}

			if (embedData.Footer?.iconURL) {
				replyArray.push(
					`Footer Icon URL\n---------------\n${embedData.Footer.iconURL}`,
				);
			}

			if (embedData.Fields.length !== 0) {
				replyArray.push("Fields\n------");
				for (let index = 0; index < embedData.Fields.length; index++) {
					replyArray.push(
						`Field ${index + 1}\n${"-".repeat(
							`Field ${index + 1}`.length,
						)}\n\nField Title:\n${
							embedData.Fields[index].name
						}\n\nField Value:\n${embedData.Fields[index].value}\n\nInline:\n${
							embedData.Fields[index].inline
						}`,
					);
				}
			}

			replyArray.unshift("```asciidoc");
			replyArray.push("```");

			await interaction.reply({
				content: `${replyArray.join("\n\n")}`,
				ephemeral: true,
			});
		}
	},
};
