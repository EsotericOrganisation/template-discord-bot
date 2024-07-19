import { BotConfiguration } from "../../types/bot/BotConfiguration.js";
import { Configuration } from "../../types/bot/Configuration.js";
import { DiscordUserID } from "../../types/user/DiscordUserID.js";
import { SlimeBot } from "./SlimeBot.js";

export class SlimeBotManager {

    private botConfig: Configuration;
    public readonly slimeBots: Map<DiscordUserID, SlimeBot> = new Map();
    public readonly permanentlyStoppedBotIDs: DiscordUserID[] = [];

    public constructor() {}

    public async run(configFilePath: string) {
        await this.setConfig(configFilePath);

        const { discordBotConfigurations } = this.botConfig;

        for (const discordBotConfiguration of discordBotConfigurations) {
            this.addBot(discordBotConfiguration);
        }
    }

    public async stop(permanently: boolean) {
        for (const [, bot] of this.slimeBots) {
            await bot.stop(permanently);

            if (permanently) {
                this.removeBotFromMap(bot);
            }
        }
    }

    public async reload(configFilePath: string) {
        await this.setConfig(configFilePath);

        for (const [id, bot] of this.slimeBots) {
            const searchedBot = this.botConfig.discordBotConfigurations.find((configuration) => configuration.discordBotClientID === id);

            if (!searchedBot) {
                await bot.stop(true);
            }
        }

        for (const botConfig of this.botConfig.discordBotConfigurations) {
            const id = botConfig.discordBotClientID;

            if (this.permanentlyStoppedBotIDs.includes(id)) {
                continue;
            }

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

    public removeBotFromMapByID(botDiscordUserID: DiscordUserID) {
        this.slimeBots.delete(botDiscordUserID);
    }

    public removeBotFromMap(bot: SlimeBot) {
        this.removeBotFromMapByID(bot.discordBotClientID);
    }

    private addBot(botConfig: BotConfiguration) {
        const newBot = new SlimeBot(this, botConfig);
        newBot.run();        

        this.addBotToMap(newBot);
    }
}