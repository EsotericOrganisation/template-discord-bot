import { Bot } from "../../classes/bot/Bot.js";

export type Event = {
    readonly name: string;
    readonly once?: boolean;
    execute(bot?: Bot, ...args: any[]): void | Promise<void>;
}