import {readdirSync} from "fs";
import {forFolder} from "../../functions.js";
import {SlimeBotClient} from "../../types.js";

export const handleComponents = (client: SlimeBotClient) => {
	client.handleComponents = async () => {
		const componentFolder = readdirSync("./dist/components");
		for (const folder of componentFolder) {
			const {buttons, selectMenus, modals} = client;

			switch (folder) {
				case "buttons":
					forFolder("components/buttons", "red", (button) => {
						buttons.set(button.data.name, button);
					});

					break;

				case "selectMenus":
					forFolder("components/selectMenus", "yellow", (menu) => {
						selectMenus.set(menu.data.name, menu);
					});

					break;

				case "modals":
					forFolder("components/modals", "blue", (modal) => {
						modals.set(modal.data.name, modal);
					});
					break;

				default:
					break;
			}
		}
	};
};
