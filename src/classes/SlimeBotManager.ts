import { BotConfiguration } from "../types/bot/BotConfiguration.js";
import { Configuration } from "../types/bot/Configuration.js";
import { DiscordUserID } from "../types/user/DiscordUserID.js";
import { SlimeBot } from "./SlimeBot.js";

export class SlimeBotManager {

    private botConfig: Configuration;

    private slimeBots: Map<DiscordUserID, SlimeBot> = new Map();

    public constructor(botConfig: Configuration) {
        this.botConfig = botConfig;
    }

    public run() {
        const { discordBotConfigurations } = this.botConfig;

        for (const discordBotConfiguration of discordBotConfigurations) {
            this.addBot(discordBotConfiguration);
        }
    }

    public stop() {
        for (const [botDiscordUserID] of this.slimeBots) {
            this.removeBot(botDiscordUserID);
        }
    }

    private addBotToMap(slimeBot: SlimeBot) {
        this.slimeBots.set(slimeBot.discordBotClientID as DiscordUserID, slimeBot);
    }

    private getBotFromMap(botDiscordUserID: DiscordUserID) {
        return this.slimeBots.get(botDiscordUserID);
    }

    private removeBotFromMap(botDiscordUserID: DiscordUserID) {
        this.slimeBots.delete(botDiscordUserID);
    }

    private addBot(botConfig: BotConfiguration) {
        const newBot = new SlimeBot(botConfig);
        newBot.run();        

        this.addBotToMap(newBot);
    }

    private removeBot(botDiscordUserID: DiscordUserID) {
        const bot = this.getBotFromMap(botDiscordUserID);
        bot.stop();

        this.removeBotFromMap(botDiscordUserID);
    }
}