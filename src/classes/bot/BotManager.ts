import { BotConfiguration } from "../../types/bot/BotConfiguration.js";
import { Configuration } from "../../types/bot/Configuration.js";
import { DiscordUserID } from "../../types/user/DiscordUserID.js";
import { BotLogger } from "../logging/BotLogger.js";
import { Bot } from "./Bot.js";

export class BotManager {

    private logger: BotLogger = new BotLogger("bot-manager");

    private botConfig: Configuration;
    public readonly bots: Map<DiscordUserID, Bot> = new Map();
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
        for (const [, bot] of this.bots) {
            await bot.stop(permanently);

            if (permanently) {
                this.removeBotFromMap(bot);
            }
        }
    }

    public async reload(configFilePath: string) {
        await this.setConfig(configFilePath);

        for (const [id, bot] of this.bots) {
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

            const bot = this.bots.get(id);
            if (!bot) {
                this.bots.set(id, new Bot(this, botConfig));
            }
        }

        for (const [, bot] of this.bots) {
            await bot.reload();
        }
    }

    private async readConfig(configFilePath: string) {
        return (await import("../../../" + configFilePath, {with: {type: "json"}})).default as Configuration;
    }

    private async setConfig(configFilePath: string) {
        this.botConfig = await this.readConfig(configFilePath);
    }

    private addBotToMap(bot: Bot) {
        this.bots.set(bot.discordBotClientID as DiscordUserID, bot);
    }

    public removeBotFromMapByID(botDiscordUserID: DiscordUserID) {
        this.bots.delete(botDiscordUserID);
    }

    public removeBotFromMap(bot: Bot) {
        this.removeBotFromMapByID(bot.discordBotClientID);
    }

    private addBot(botConfig: BotConfiguration) {
        const newBot = new Bot(this, botConfig);
        newBot.run();        

        this.addBotToMap(newBot);
    }
}