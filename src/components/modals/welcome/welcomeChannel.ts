import {EmbedBuilder} from "discord.js";
import {ErrorMessageBuilder} from "../../../classes.js";
import settings from "../../../schemas/settings.js";

export default {
	data: {name: "welcomeChannel"},
	async execute(interaction) {
		const settingsSchema = await settings.findOne({
			server: interaction.guild.id,
		});

		const input = await interaction.fields.getTextInputValue("channel");

		const reg = new RegExp(`^.*${input}.*$`, "ig");

		let channels = await interaction.member.guild.channels.fetch();

		channels = [...channels.values()];

		let welcomeChannel;

		for (const channel of channels) {
			if (reg.test(channel.name)) {
				welcomeChannel = channel;
				break;
			}
		}

		if (welcomeChannel) {
			await settings.findOneAndUpdate(
				{server: interaction.guild.id},
				{
					welcomeMSG: {
						channel: welcomeChannel,
						enabled: settingsSchema.welcomeMSG?.enabled,
						data: settingsSchema.welcomeMSG?.data,
					},
				},
			);
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("✅ Settings updated")
						.setDescription(
							`> Welcome messages will be sent in ${welcomeChannel}`,
						)
						.setColor("Green"),
				],
				ephemeral: true,
			});
		} else {
			await interaction.reply(
				new ErrorMessageBuilder("That channel does not exist"),
			);
		}
	},
};
