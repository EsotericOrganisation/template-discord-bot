import { existsSync, mkdirSync, renameSync } from "fs";
import { logsFolderPath, pathSeparator } from "../../constants.js";
import winston, { Logger, transports } from "winston";

export class BotLogger {

    private logger: Logger;

    private readonly id: string;
    private readonly name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;

        const logFilesFolderPath = logsFolderPath + pathSeparator + this.id;
        mkdirSync(logFilesFolderPath, { recursive: true })

        const currentDate = new Date();
        const dateString = currentDate.toISOString().split("T")[0];

        let logNumber = 1;
        for (; existsSync(logFilesFolderPath + pathSeparator + dateString + "-" + logNumber + ".log") || (logNumber === 1 && existsSync(logFilesFolderPath + pathSeparator + dateString + ".log")); logNumber++) { console.log(logFilesFolderPath + pathSeparator + dateString + "-" + logNumber) }

        if (logNumber === 2) {
            renameSync(logFilesFolderPath + pathSeparator + dateString + ".log", logFilesFolderPath + pathSeparator + dateString + "-1" + ".log");
        }

        const logFilePath = logFilesFolderPath + pathSeparator + dateString + (logNumber === 1 ? "" : "-" + logNumber) + ".log";

        this.logger = winston.createLogger(
            {
                transports: [
                    new transports.Console({
                        format: winston.format.simple(),
                    }),
                    new transports.File({
                        filename: logFilePath, format: winston.format.simple()
                    })
                ]
            }
        )
    }

    public log(message: string) {
        this.logger.log({ level: "info", message});
    }
}