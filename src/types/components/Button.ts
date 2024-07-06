import { ButtonInteraction } from "discord.js";
import { SlimeBot } from "../../classes/SlimeBot.js";
import { Component } from "./Component.js";

export interface Button extends Component {
    execute(interaction: ButtonInteraction, bot?: SlimeBot): Promise<void>;
}