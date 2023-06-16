import {AttachmentBuilder, EmbedBuilder} from "discord.js";
import {Canvas, loadImage} from "@napi-rs/canvas";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "guildMemberAdd"},
	async execute(event) {
		const settingsData = await settings.findOne({server: event.guild.id});

		if (settingsData?.welcome?.enabled) {
			const reply = {files: [], embeds: []};

			for (const index of settingsData.welcome.data.images) {
				const canvas = new Canvas(index.width, index.height);
				const context = canvas.getContext("2d");
				for (const e of index.layers) {
					if (e.type === "image") {
						if (e.text === "{user.icon}") {
							e.text = event.user.displayAvatarURL({
								size: 4096,
								extension: "png",
							});
						} else if (e.text === "{guild.icon}") {
							e.text = event.guild.iconURL({
								size: 4096,
								extension: "png",
							});
						}
						if (e.x === "<center>") {
							e.x = index.width / 2 - e.width / 2;
						}
						if (e.y === "<center>") {
							e.y = index.height / 2 - e.height / 2;
						}

						context.drawImage(
							await loadImage(e.text),
							parseInt(e.x),
							parseInt(e.y),
							e.width,
							e.height,
						);
					} else {
						e.text = e.text;

						let fontSize = parseInt(e.font.match(/\d+/)[0]);
						const font = e.font.match(/\D+/)[0];

						let xCenter = false;
						let yCenter = false;

						if (e.x === "<center>") {
							e.x = Math.floor(
								(index.width - context.measureText(e.text).width) / 2,
							);
							xCenter = true;
						}

						if (e.y === "<center>") {
							e.y = Math.floor((index.height - fontSize) / 2);
							yCenter = true;
						}

						context.font = e.font;

						do {
							fontSize--;
							context.font = `${fontSize}${font}`;
						} while (
							context.measureText(e.text).width + e.x >
							Math.floor(index.width * 0.9)
						);

						if (xCenter) {
							e.x = Math.floor(
								(index.width - context.measureText(e.text).width) / 2,
							);
						}

						if (yCenter) {
							e.y = Math.floor((index.height - fontSize) / 2);
						}

						context.fillStyle = e.colour;

						context.fillText(e.text, parseInt(e.x), parseInt(e.y));
					}
				}
				const attachment = new AttachmentBuilder(await canvas.encode("png"), {
					name: "welcome-image.png",
				});

				reply.files.push(attachment);
			}

			if (settingsData.welcome.data.content) {
				const content = settingsData.welcome.data.content;

				reply.content = content;
			}

			for (const e of settingsData.welcome.data.embeds) {
				const embedData = await settings.findOne({
					customID: e.ID,
					author: e.User,
				});

				const embed = new EmbedBuilder()
					.setTitle(rpl(embedData.EmbedTitle, event))
					.setDescription(rpl(embedData.EmbedDescription, event))
					.setAuthor(objRpl(embedData.Author, event))
					.setFooter(objRpl(embedData.Footer, event))
					.addFields(arrObjRpl(embedData.Fields, event))
					.setColor(embedData.EmbedColour)
					.setImage(rpl(embedData.Image, event))
					.setThumbnail(rpl(embedData.Thumbnail, event))
					.setURL(rpl(embedData.EmbedURL, event))
					.setTimestamp(embedData.Timestamp);

				reply.embeds.push(embed);
			}

			const channel = await event.guild.channels.fetch(
				settingsData.welcome?.channel,
			);

			channel.send(reply);
		}
	},
};
