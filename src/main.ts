import { SlimeBotManager } from "./classes/bot/SlimeBotManager.js";
import { configFilePath } from "./constants.js";

const botManager = new SlimeBotManager();
await botManager.run(configFilePath);