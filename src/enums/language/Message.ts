export type Message =
    | "pingCommandName"
    | "ping"
    | "pingResult"

    | "reloadBotCommandName"
    | "reloadedBotSuccessfully"
    | "reloadAllCommandName"
    | "reloadedAllBotsSuccessfully"

    | "executeCommandName"
    | "executeCode"
    | "codeToExecute"
    | "executedCode"

    | "stopBotCommandName"
    | "stoppingBot"
    | "stopAllCommandName"
    | "stoppingAllBots"