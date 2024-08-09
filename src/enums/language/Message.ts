export type Message =
    | "ping-command-name"
    | "ping-command-description"
    | "ping"
    | "ping-result"

    | "reload-bot-command-name"
    | "reload-bot-command-description"
    | "reloaded-bot-successfully"
    | "reload-all-command-description"
    | "reload-all-command-name"
    | "reloaded-all-bots-successfully"

    | "execute-command-name"
    | "execute-command-description"
    | "execute-code"
    | "code-to-execute"
    | "executed-code"

    | "stop-bot-command-name"
    | "stop-bot-command-description"
    | "stop-bot-command-permanently-option-name"
    | "stop-bot-command-permanently-option-description"
    | "stopping-bot"
    | "stop-all-command-name"
    | "stop-all-command-description"
    | "stop-all-command-permanently-option-name"
    | "stop-all-command-permanently-option-description"
    | "stopping-all-bots"