import tsConfigFile from "../tsconfig.json" with { type: "json" };

export const ascendDirectoryString = "..";
export const pathSeparator = "/";

export const restVersion = "10";

export const commandPrefix = "/";

export const configFolderName = "config";
export const configFolderPath = configFolderName;

export const configFileName = "config.json";
export const configFilePath = configFolderName + pathSeparator + configFileName;

export const dataFolderName = "data";
export const dataFolderPath = dataFolderName;

export const botDataFolderName = "discord-bots"
export const botDataFolderPath = dataFolderName + pathSeparator + botDataFolderName;

export const userDataFolderName = "users";

export const languagesFolderName = "languages";
export const languagesFolderPath = languagesFolderName;

export const logsFolderName = "logs";
export const logsFolderPath = logsFolderName;

export const defaultDistributableFolderPath = "dist";
export const distributableFolderPath = tsConfigFile.compilerOptions.outDir ?? defaultDistributableFolderPath;

export const commandsFolderName = "commands";
export const eventsFolderName = "events";
export const componentsFolderName = "components";

export const clientEventsFolderName = "client";
export const processEventsFolderName = "process";

export const buttonsFolderName = "buttons";
export const menusFolderName = "menus";
export const modalsFolderName = "modals";

export const commandsFolderPath = distributableFolderPath + pathSeparator + commandsFolderName;

export const eventsFolderPath = distributableFolderPath + pathSeparator + eventsFolderName;

export const componentsFolderPath = distributableFolderPath + pathSeparator + componentsFolderName;

export const buttonsFolderPath = componentsFolderPath + pathSeparator + buttonsFolderName;
export const menusFolderPath = componentsFolderPath + pathSeparator + menusFolderName;
export const modalsFolderPath = componentsFolderPath + pathSeparator + modalsFolderName;