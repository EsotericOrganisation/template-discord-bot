import { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import { Bot } from "../../classes/bot/Bot.js";

export type Component = {
    readonly id: string;
    execute(interaction: MessageComponentInteraction | ModalSubmitInteraction, bot?: Bot): Promise<void>;
}