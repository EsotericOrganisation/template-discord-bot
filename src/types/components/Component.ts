import { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import { SlimeBot } from "../../classes/SlimeBot.js";

export type Component = {
    readonly id: string;
    execute(interaction: MessageComponentInteraction | ModalSubmitInteraction, bot?: SlimeBot): Promise<void>;
}