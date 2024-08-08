export enum Message {
    PingCommandName = "pingCommandName",
    Ping = "ping",
    PingResult = "pingResult",

    ReloadBotCommandName = "reloadBotCommandName",
    ReloadedBotSuccessfully = "reloadedBotSuccessfully",
    ReloadAllCommandName = "reloadAllCommandName",
    ReloadedAllBotsSuccessfully = "reloadedAllBotsSuccessfully",

    ExecuteCommandName = "executeCommandName",
    ExecuteCode = "executeCode",
    CodeToExecute = "codeToExecute",
    ExecutedCode = "executedCode",

    StopBotCommandName = "stopBotCommandName",
    StoppingBot = "stoppingBot",
    StopAllCommandName = "stopAllCommandName",
    StoppingAllBots = "stoppingAllBots"
}