import configFile from "../config/config.json" with { type: "json" };
const config = configFile as Configuration;

import { SlimeBotManager } from "./classes/bot/SlimeBotManager.js";
import { configFilePath } from "./constants.js";
import { Configuration } from "./types/bot/Configuration.js";

const botManager = new SlimeBotManager();
await botManager.run(configFilePath);