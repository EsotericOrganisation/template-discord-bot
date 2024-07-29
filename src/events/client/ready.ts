import { DiscordClientEvent } from "../../types/events/DiscordClientEvent.js";

export default {
    name: "ready",
    async execute(bot) {
        console.log(bot.user.displayName + " is ready & online.");
    },
} as DiscordClientEvent