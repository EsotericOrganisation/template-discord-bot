import configFile from "../config/config.json" with { type: "json" };

import { SlimeBot } from "./classes/SlimeBot.js";
import { BotConfiguration } from "./types/BotConfiguration.js";

const config = configFile as BotConfiguration;

const { discordBotToken, adminDiscordUserIDs } = config;

const slimeBot = new SlimeBot(discordBotToken, adminDiscordUserIDs);

slimeBot.run();