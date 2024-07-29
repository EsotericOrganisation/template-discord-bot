import { ActionRowBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { Command } from "../types/commands/Command.js";
import { Message } from "../enums/language/Message.js";

export default {
    data: new SlashCommandBuilder()
        .setName("execute")
        .setDescription("Executes code provided through a modal."),
    isBotAdminOnly: true,
    async execute(interaction, bot) {
        const { languageManager } = bot;

        await interaction.showModal(
            new ModalBuilder()
                .setTitle(languageManager.getMessageByDiscordUser(Message.ExecuteCode, interaction.user))
                .setCustomId("execute")
                .setComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setLabel(languageManager.getMessageByDiscordUser(Message.CodeToExecute, interaction.user))
                                .setCustomId("codeToExecute")
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                        )
                )
        );
    },
} as Command;