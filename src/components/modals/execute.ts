import { Modal } from "../../types/components/Modal.js";

export default {
    id: "execute",
    async execute(interaction, bot) {
        const codeToExecute = interaction.fields.getTextInputValue("code-to-execute");

        eval(codeToExecute);

        await interaction.reply({ content: bot.languageManager.getMessageByDiscordUser("executed-code", interaction.user), ephemeral: true });
    },
} as Modal