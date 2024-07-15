import { StringSelectMenuInteraction } from "discord.js";
import { SlimeBot } from "../../classes/bot/SlimeBot.js";
import { Component } from "./Component.js";

export interface Menu extends Component {
    execute(interaction: StringSelectMenuInteraction, bot?: SlimeBot): Promise<void>;
}