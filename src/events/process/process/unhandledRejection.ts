import {Event} from "../../../types";

export const unhandledRejection: Event = {
	name: "unhandledRejection",
	async execute(error: PromiseRejectionEvent) {
		console.error("Unhandled promise rejection:", error);
	},
};
