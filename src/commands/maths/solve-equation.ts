import Decimal from "decimal.js";
import {SlashCommandSubcommandBuilder, EmbedBuilder} from "discord.js";
import {ErrorMessageBuilder} from "../../classes.js";
import {
	sum,
	simplify,
	imaginarySquareRoot,
	formatNumber,
} from "../../functions.js";
import {Command} from "../../types";

export const command: Command = {
	data: new SlashCommandSubcommandBuilder()
		.setName("solve-equation")
		.setDescription("Solves a linear or quadratic equation.")
		.addStringOption((option) =>
			option
				.setName("equations")
				.setDescription(
					"List of linear or quadratic equations to solve, separate with commas.",
				)
				.setRequired(true),
		),
	usage: [
		"**/solve-equation** `equations: List of linear or quadratic equations`",
	],
	examples: [
		"**/solve-equation** `equations: 2x² + 2x + 1 = 0, 2x² + 4x + 3x = 0.5x² - 5x + 3`",
	],
	async execute(interaction) {
		await interaction.deferReply();
		const input = interaction.options.getString("equations", true).split(/,/g);

		const resultArray = [];

		for (let equation of input) {
			if (equation.replace(/ /g, "").startsWith("0=") && /=/.test(equation)) {
				const lhs = /.+(?==)/.exec(equation);
				const rhs = /(?<==).+/.exec(equation);

				equation = `${rhs} = ${lhs}`;
			}

			// LHS a.
			let a = new Decimal(
				sum(
					equation
						.match(/(?<=^[^=]*)(\+|-)? ?[0-9.]+(?=x²)/g)
						?.map((number) => parseFloat(number.replace(/ /g, ""))) ?? [],
				),
			);

			// LHS a without number.
			a = a.plus(
				sum(
					equation
						.match(/(?<=^[^=]*)(?<!\d+)(\+|-)? ?x²/g)
						?.map((number) => (/-/.test(`${number}`) ? -1 : 1)) ?? [],
				),
			);

			// LHS b.
			let b = new Decimal(
				sum(
					equation
						.match(/(?<=^[^=]*)[+-]? ?[0-9.]+(?=x(?!²))/g)
						?.map((number) => parseFloat(number.replace(/ /g, ""))) ?? [],
				),
			);

			// LHS b without number.
			b = b.plus(
				sum(
					equation
						.match(/(?<=^[^=]*)(?<!\d+)(\+|-)? ?x(?!²)/g)
						?.map((number) => (/-/.test(`${number}`) ? -1 : 1)) ?? [],
				),
			);

			// LHS c.
			let c = new Decimal(
				sum(
					equation
						.match(/(?<=^[^=]*)(\+|-)? ?[0-9.]+(?![0-9.]+)(?!x)/g)
						?.map((number) => parseFloat(number.replace(/ /g, ""))) ?? [],
				),
			);

			// RHS a.
			a = a.plus(
				sum(
					equation
						.match(/(?<==.*)(\+|-)? ?[0-9.]+(?=x²)/g)
						?.map((number) => parseFloat(`${number}`.replace(/ /g, "")) * -1) ??
						[],
				) ?? 0,
			);

			// RHS a without number.
			a = a.plus(
				sum(
					equation
						.match(/(?<==.*)(?<!\d+)(\+|-)? ?x²/g)
						?.map((number) => (/-/.test(`${number}`) ? 1 : -1)) ?? [],
				),
			);

			// RHS b.
			b = b.plus(
				sum(
					equation
						.match(/(?<==.*)(\+|-)? ?[0-9.]+(?=x(?!²))/g)
						?.map((number) => parseFloat(`${number}`.replace(/ /g, "")) * -1) ??
						[],
				),
			);

			// RHS b without number.
			b = b.plus(
				sum(
					equation
						.match(/(?<==.*)(?<!\d+)(\+|-)? ?x(?!²)/g)
						?.map((number) => (/-/.test(`${number}`) ? 1 : -1)) ?? [],
				),
			);

			// RHS c.
			c = c.plus(
				sum(
					equation
						.match(/(?<==.*)(\+|-)? ?[0-9.]+(?![0-9.]+)(?!x)/g)
						?.map((number) => parseFloat(`${number}`.replace(/ /g, "")) * -1) ??
						[],
				),
			);

			if (!parseFloat(a.toString())) {
				if (!parseFloat(b.toString())) {
					return interaction.editReply(
						new ErrorMessageBuilder(
							"Please provide a valid linear or quadratic equation to solve.",
						),
					);
				}

				const x = c.times(-1).dividedBy(b);

				resultArray.push(
					`__${formatNumber(b)}x${
						parseFloat(c.toString()) ? ` + ${c}` : ""
					} = 0__;\n\nax + b = 0;\nx = __-b__\n⠀ ⠀ a\n\nx = ${x}`,
				);
			} else {
				/**
				 * 2a
				 */
				const _2a = a.times(2);

				/**
				 * -b/(2a)
				 */
				const parabolaCenter = simplify(b.times(-1), _2a, false, true);

				/**
				 * -b/(2a)
				 */
				const parabolaCenterValue = b.times(-1).dividedBy(_2a);

				/**
				 * 4ac
				 */
				const _4ac = a.times(c).times(4);

				/**
				 * b² -4ac
				 */
				const discriminant = new Decimal(b.times(b).minus(_4ac));

				let squareRoot: string | Decimal | [Decimal, Decimal] =
					imaginarySquareRoot(discriminant.toNumber());

				let iCoefficient: string | number | Decimal | [Decimal, Decimal] =
					parseFloat(/-?\d+?(?=i)/.exec(`${squareRoot}`)?.[0] ?? "1");

				iCoefficient = simplify(iCoefficient, _2a, false, true);

				if (iCoefficient instanceof Decimal)
					iCoefficient = iCoefficient.equals(1)
						? ""
						: iCoefficient.equals(-1)
						? "-"
						: iCoefficient;

				squareRoot =
					typeof squareRoot === "string" && /i/.test(squareRoot)
						? `${iCoefficient}i${/√.+/.exec(squareRoot)?.[0] ?? ""}`
						: (() => {
								if (!isNaN(parseFloat(squareRoot.toString())))
									return simplify(
										parseFloat(squareRoot.toString()),
										_2a,
										false,
										true,
									);

								const squareRootCoefficient = parseFloat(
									/-?\d+?(?=√)/.exec(`${squareRoot}`)?.[0] ?? "1",
								);

								const fraction = simplify(
									squareRootCoefficient,
									_2a,
									false,
									true,
								);

								return `${fraction}${squareRoot}`;
						  })();

				const x1 = parabolaCenterValue.plus(discriminant.sqrt().dividedBy(_2a));

				const x2 = parabolaCenterValue.minus(
					discriminant.sqrt().dividedBy(_2a),
				);

				const answers = discriminant.equals(0)
					? 1
					: discriminant.greaterThan(0)
					? 2
					: 0;

				resultArray.push(
					`__${formatNumber(a)}x²${
						parseFloat(b.toString()) ? ` + ${formatNumber(b)}` : ""
					}${parseFloat(b.toString()) ? "x" : ""}${
						parseFloat(c.toString()) ? ` + ${c}` : ""
					} = 0__;\n\nax² + bx + c = 0;\nx₁,₂ = __-b ± √(b²-4ac)__\n⠀⠀⠀⠀⠀⠀⠀2a\n\na = ${a}; b = ${b}; c = ${c};\nb² = ${b.times(
						b,
					)};\n4ac = ${_4ac};\nb² ${
						answers === 1 ? "=" : answers === 2 ? ">" : "<"
					} 4ac ∴ b² - 4ac (discriminant) ${
						answers === 1 ? "=" : answers === 2 ? ">" : "<"
					} 0 ∴ ${
						answers === 1
							? "1 real solution."
							: answers === 2
							? "2 real solutions."
							: "2 imaginary solutions."
					}\n\nx₁,₂ = __-(${b}) ± √((${b})²-4(${a})(${c}))__\n⠀⠀⠀⠀⠀⠀⠀2(${a})\n\nx${
						answers === 1 ? "" : "₁,₂"
					} = ${parabolaCenterValue.equals(0) ? "" : `${parabolaCenter}`}${
						answers === 1 ? "" : " ± "
					}${squareRoot}`,
				);
			}
		}

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(input.join())
					.setDescription(resultArray.join("\n\n"))
					.setColor("Transparent"),
			],
		});
	},
};
