import {ContextMenuCommandBuilder, ApplicationCommandType} from "discord.js";
import {UserContextMenuCommand} from "../../types";

export const command: UserContextMenuCommand = {
	data: new ContextMenuCommandBuilder()
		.setName("Get Avatar")
		.setType(ApplicationCommandType.User),
	description: "Returns the avatar of the user selected.",
	usage: [
		// eslint-disable-next-line quotes
		'Right click on a user, hover over "Apps" and left click on "Get Avatar"',
	],
	async execute(interaction) {
		await interaction.reply({
			files: [
				interaction.targetUser.displayAvatarURL({
					size: 4096,
					extension: "png",
				}),
			],
			ephemeral: true,
		});
	},
};
