import { ClientEvents } from "discord.js";
import { SlimeBot } from "../../classes/bot/SlimeBot.js";
import { Event } from "./Event.js";

export interface DiscordClientEvent extends Event {
    readonly name: keyof ClientEvents
    execute(bot?: SlimeBot, ...args: ClientEvents[keyof ClientEvents]): Promise<void>;
}