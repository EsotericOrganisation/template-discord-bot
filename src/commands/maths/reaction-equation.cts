import {Command} from "../../types";
import {SlashCommandBuilder} from "discord.js";

const values = [
	{element: "Aluminium", symbol: "Al", value: 3},
	{element: "Astatine", symbol: "At", value: 1},
	{element: "Barium", symbol: "Ba", value: 2},
	{element: "Beryllium", symbol: "Be", value: 2},
	{element: "Lead", symbol: "Pb", values: [2, 4]},
	{element: "Bromine", symbol: "Br", value: 1},
	{element: "Caesium", symbol: "Cs", value: 1},
	{element: "Calcium", symbol: "Ca", value: 2},
	{element: "Chlorine", symbol: "Cl", value: 1},
	{element: "Iron", symbol: "Fe", values: [2, 3]},
	{element: "Fluorine", symbol: "F", value: 1},
	{element: "Francium", symbol: "Fr", value: 1},
	{element: "Gold", symbol: "Au", value: 1},
	{element: "Iodine", symbol: "I", value: 1},
	{element: "Potassium", symbol: "K", value: 1},
	{element: "Carbon", symbol: "C", value: 4},
	{element: "Copper", symbol: "Cu", values: [2, 1]},
	{element: "Lithium", symbol: "Li", value: 1},
	{element: "Magnesium", symbol: "Mg", value: 2},
	{element: "Sodium", symbol: "Na", value: 1},
	{element: "Phosphorus", symbol: "P", values: [3, 5]},
	{element: "Platinum", symbol: "Pt", value: 1},
	{element: "Radium", symbol: "Ra", value: 2},
	{element: "Rubidium", symbol: "Rb", value: 1},
	{element: "Oxygen", symbol: "O", value: 2},
	{element: "Sulfur", symbol: "S", value: [4, 2, 6]},
	{element: "Silver", symbol: "Ag", value: 1},
	{element: "Nitrogen", symbol: "N", values: [3, 5]},
	{element: "Strontium", symbol: "Sr", value: 2},
	{element: "Hydrogen", symbol: "H", value: 1},
	{element: "Zink", symbol: "Zn", value: 2},
];

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName("reaction-equation")
		.setDescription("Equate a chemical reaction.")
		.addStringOption((option) =>
			option
				.setName("reaction")
				.setDescription("Basic reaction input.")
				.setRequired(true),
		),
	usage: ["**/reaction-equation** `reaction: The reaction to calculate`"],
	async execute(interaction) {
		const input = interaction.options.getString("reaction");
	},
};
