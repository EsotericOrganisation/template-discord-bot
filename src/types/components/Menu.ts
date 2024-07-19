import { StringSelectMenuInteraction } from "discord.js";
import { Bot } from "../../classes/bot/Bot.js";
import { Component } from "./Component.js";

export interface Menu extends Component {
    execute(interaction: StringSelectMenuInteraction, bot?: Bot): Promise<void>;
}