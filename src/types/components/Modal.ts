import { ModalSubmitInteraction } from "discord.js";
import { Bot } from "../../classes/bot/Bot.js";
import { Component } from "./Component.js";

export interface Modal extends Component {
    execute(interaction: ModalSubmitInteraction, bot?: Bot): Promise<void>;
}