import { BotConfiguration } from "../../types/bot/BotConfiguration.js";
import { Configuration } from "../../types/bot/Configuration.js";
import { DiscordUserID } from "../../types/user/DiscordUserID.js";
import { SlimeBot } from "./SlimeBot.js";

export class SlimeBotManager {

    private botConfig: Configuration;
    private readonly slimeBots: Map<DiscordUserID, SlimeBot> = new Map();

    public constructor() {}

    public async run(configFilePath: string) {
        await this.setConfig(configFilePath);

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

    public async reload(configFilePath: string) {
        await this.setConfig(configFilePath);

        for (const [id, bot] of this.slimeBots) {
            const searchedBot = this.botConfig.discordBotConfigurations.find((configuration) => configuration.discordBotClientID === id);

            if (!searchedBot) {
                bot.stop();
            }
        }

        for (const botConfig of this.botConfig.discordBotConfigurations) {
            const id = botConfig.discordBotClientID;

            const bot = this.slimeBots.get(id);
            if (!bot) {
                this.slimeBots.set(id, new SlimeBot(this, botConfig));
            }
        }

        for (const [, bot] of this.slimeBots) {
            await bot.reload();
        }
    }

    private async readConfig(configFilePath: string) {
        return (await import("../../../" + configFilePath, {with: {type: "json"}})).default as Configuration;
    }

    private async setConfig(configFilePath: string) {
        this.botConfig = await this.readConfig(configFilePath);
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
        const newBot = new SlimeBot(this, botConfig);
        newBot.run();        

        this.addBotToMap(newBot);
    }

    private removeBot(botDiscordUserID: DiscordUserID) {
        const bot = this.getBotFromMap(botDiscordUserID);
        bot.stop();

        this.removeBotFromMap(botDiscordUserID);
    }
}