import { ModalSubmitInteraction } from "discord.js";
import { SlimeBot } from "../../classes/SlimeBot.js";
import { Component } from "./Component.js";

export interface Modal extends Component {
    execute(interaction: ModalSubmitInteraction, bot?: SlimeBot): Promise<void>;
}