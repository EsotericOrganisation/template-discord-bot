import configFile from "../config/config.json" with { type: "json" };
const config = configFile as Configuration;

import { SlimeBotManager } from "./classes/bot/SlimeBotManager.js";
import { Configuration } from "./types/bot/Configuration.js";

const botManager = new SlimeBotManager(config);
botManager.run();