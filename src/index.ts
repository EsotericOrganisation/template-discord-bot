import configFile from "../config/config.json";
import { SlimeBot } from "./classes/SlimeBot";
import { BotConfiguration } from "./types/BotConfiguration";

const config = configFile as BotConfiguration;

const { discordBotToken } = config

const slimeBot = new SlimeBot(discordBotToken);

slimeBot.login();