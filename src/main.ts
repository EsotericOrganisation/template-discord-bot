import { BotManager } from "./classes/bot/BotManager.js";
import { configFilePath } from "./constants.js";

const botManager = new BotManager();
await botManager.run(configFilePath);