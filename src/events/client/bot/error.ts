import {Event} from "../../../types";

export const error: Event = {
	name: "error",
	async execute(message) {
		console.error(message);
	},
};
