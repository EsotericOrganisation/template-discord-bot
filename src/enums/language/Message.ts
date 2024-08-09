export type Message =
    | "execute-command-name"
    | "execute-command-description"
    | "execute-code"
    | "code-to-execute"
    | "executed-code"

    | "ping-command-name"
    | "ping-command-description"
    | "ping"
    | "ping-result"

    | "reload-all-command-name"
    | "reload-all-command-description"
    | "reloaded-all-bots-successfully"

    | "reload-bot-command-name"
    | "reload-bot-command-description"
    | "reloaded-bot-successfully"

    | "stop-all-command-name"
    | "stop-all-command-description"
    | "stop-all-command-permanently-option-name"
    | "stop-all-command-permanently-option-description"
    | "stopping-all-bots"

    | "stop-bot-command-name"
    | "stop-bot-command-description"
    | "stop-bot-command-permanently-option-name"
    | "stop-bot-command-permanently-option-description"
    | "stopping-bot"