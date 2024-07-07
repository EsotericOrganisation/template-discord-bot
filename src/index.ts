import configFile from "../config/config.json" with { type: "json" };

import { SlimeBot } from "./classes/SlimeBot.js";
import { BotConfiguration } from "./types/bot/BotConfiguration.js";

const config = configFile as BotConfiguration;

const { discordBotToken } = config;

const slimeBot = new SlimeBot(discordBotToken);

slimeBot.run();