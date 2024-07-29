import { ClientEvents } from "discord.js";
import { Bot } from "../../classes/bot/Bot.js";
import { Event } from "./Event.js";

export interface DiscordClientEvent extends Event {
    readonly name: keyof ClientEvents
    execute(bot?: Bot, ...args: ClientEvents[keyof ClientEvents]): Promise<void>;
}