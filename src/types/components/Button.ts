import { ButtonInteraction } from "discord.js";
import { Bot } from "../../classes/bot/Bot.js";
import { Component } from "./Component.js";

export interface Button extends Component {
    execute(interaction: ButtonInteraction, bot?: Bot): Promise<void>;
}