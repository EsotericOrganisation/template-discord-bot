import { ChatInputCommandInteraction, ButtonInteraction, ModalSubmitInteraction } from "discord.js";
import { DiscordClientEvent } from "../../types/events/DiscordClientEvent.js";
import { DiscordUserID } from "../../types/user/DiscordUserID.js";

export default {
	name: "interactionCreate",
	async execute(bot, interaction) {
		if (interaction instanceof ChatInputCommandInteraction) {
			const { commands } = bot;
			const { commandName } = interaction;

			const command = commands.get(commandName);

			if (command.isBotAdminOnly) {
				const botAdminDiscordUserIDs = bot.adminDiscordUserIDs;

				if (!botAdminDiscordUserIDs.includes(interaction.user.id as DiscordUserID)) {
					return;
				}
			}

			await command.execute(interaction, bot);
		} else if (interaction instanceof ButtonInteraction) {
			const { buttons } = bot;
			const { customId } = interaction

			const button = buttons.get(customId);

			await button.execute(interaction, bot);
		} else if (interaction instanceof ModalSubmitInteraction) {
			const { modals } = bot;
			const { customId } = interaction;

			const modal = modals.get(customId);

			await modal.execute(interaction, bot);
		};
	}
} as DiscordClientEvent;