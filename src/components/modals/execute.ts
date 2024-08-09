import { Message } from "../../enums/language/Message.js";
import { Modal } from "../../types/components/Modal.js";

export default {
    id: "execute",
    async execute(interaction, bot) {
        const codeToExecute = interaction.fields.getTextInputValue("codeToExecute");

        eval(codeToExecute);

        await interaction.reply({ content: bot.languageManager.getMessageByDiscordUser("executed-code", interaction.user), ephemeral: true });
    },
} as Modal