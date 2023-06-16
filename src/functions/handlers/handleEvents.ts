import fs from "fs";
import mongoose from "mongoose";
import {forFolder} from "../../functions.js";
import {SlimeBotClient} from "../../types.js";

const {connection} = mongoose;

export const handleEvents = (client: SlimeBotClient) => {
	client.handleEvents = async () => {
		const eventFolders = fs.readdirSync("./dist/events");

		for (const folder of eventFolders) {
			switch (folder) {
				case "client":
					forFolder("events/client", "cyanBright", (event) => {
						if (event.once) {
							client.once(event.name, (...args) =>
								event.execute(...args, client),
							);
						} else {
							client.on(event.name, (...args) =>
								event.execute(...args, client),
							);
						}
					});
					break;

				case "mongo":
					forFolder("events/mongo", "greenBright", (event) => {
						if (event.once) {
							connection.once(event.name, (...args) =>
								event.execute(...args, client),
							);
						} else {
							connection.on(event.name, (...args) =>
								event.execute(...args, client),
							);
						}
					});
					break;

				case "process":
					forFolder("events/process", "blueBright", (event) => {
						if (event.once) {
							process.once(event.name, (...args) => event.execute(...args));
						} else {
							process.on(event.name, (...args) => event.execute(...args));
						}
					});
					break;

				default:
					break;
			}
		}
	};
};
