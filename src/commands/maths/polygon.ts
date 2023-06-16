import {Canvas} from "@napi-rs/canvas";
import Decimal from "decimal.js";
import {
	SlashCommandBuilder,
	EmbedBuilder,
	Message,
	AttachmentBuilder,
} from "discord.js";
import {Command} from "../../types";
import {parseMath} from "../../functions.js";

export const polygon: Command = {
	data: new SlashCommandBuilder()
		.setName("polygon")
		.setDescription(
			"Get info about a polygon. Add the inscription level for an input by adding a comma and the level.",
		)
		.addStringOption((option) =>
			option
				.setName("sides")
				.setDescription(
					"The number of sides of the polygon. E.g. a pentagon has 5 sides.",
				),
		)
		.addStringOption((option) =>
			option
				.setName("side-length")
				.setDescription("The length of the sides of the polygon."),
		)
		.addStringOption((option) =>
			option
				.setName("apothem-length")
				.setDescription(
					"The length of the apothem (the shortest distance between the center and the sides).",
				),
		)
		.addStringOption((option) =>
			option
				.setName("radius-length")
				.setDescription(
					"The length of the radius of the polygon (the distance between the center and the corners).",
				),
		)
		.addStringOption((option) =>
			option.setName("polygon-area").setDescription("The area of the polygon."),
		)
		.addStringOption((option) =>
			option
				.setName("incircle-area")
				.setDescription(
					"The area of the incircle (the circle where the length of the radius = the apothem length).",
				),
		)
		.addStringOption((option) =>
			option
				.setName("incircle-circumference")
				.setDescription("The circumference of the incircle."),
		)
		.addStringOption((option) =>
			option
				.setName("circumcircle-area")
				.setDescription(
					"The area of the circumcircle. (the circle where the length of the radius = polygon radius length).",
				),
		)
		.addStringOption((option) =>
			option
				.setName("circumcircle-circumference")
				.setDescription("The circumference of the circumcircle"),
		)
		.addStringOption((option) =>
			option
				.setName("interior-angle-alpha")
				.setDescription(
					"The innermost angle of the triangle which divides the polygon.",
				),
		)
		.addStringOption((option) =>
			option
				.setName("interior-angle-beta")
				.setDescription(
					"The interior angle that the horizontal line makes with the innermost radius.",
				),
		)
		.addStringOption((option) =>
			option
				.setName("interior-angle-gamma")
				.setDescription("The interior angle of the polygon."),
		)
		.addStringOption((option) =>
			option
				.setName("exterior-angle-delta")
				.setDescription("The exterior angle of the polygon."),
		)
		.addStringOption((option) =>
			option
				.setName("inscription-levels")
				.setDescription(
					"The levels of repeated polygon inscription to get info about. Input a comma-separated list.",
				),
		),
	usage: [
		"**/area** `sides: 4` `side-length: 2`",
		"**/area** `sides: 14313` `side-length: 43134`",
	],
	async execute(interaction, client) {
		await interaction.deferReply();

		const {options} = interaction;

		let sides = new Decimal(parseMath(options.getNumber("sides")));

		let sideLength = new Decimal(parseMath(options.getNumber("side-length")));

		let apothemLength = new Decimal(
			parseMath(options.getNumber("apothem-length")),
		);

		let radiusLength = new Decimal(
			parseMath(options.getNumber("radius-length")),
		);

		let polygonArea = new Decimal(parseMath(options.getNumber("polygon-area")));

		let alpha = new Decimal(
			parseMath(options.getNumber("interior-angle-alpha")),
		);

		let gamma = new Decimal(
			parseMath(options.getNumber("interior-angle-gamma")),
		);

		let delta = new Decimal(
			parseMath(options.getNumber("exterior-angle-delta")),
		);

		for (let i = 1; i <= 2; i++) {
			// TODO: Sides from area and side length, Sides from apothem and side length. (Newton-Raphson method)

			if (sides.isNaN())
				sides = !alpha.isNaN()
					? new Decimal(360).dividedBy(alpha)
					: !gamma.isNaN()
					? new Decimal(360).dividedBy(new Decimal(180).minus(gamma))
					: !delta.isNaN()
					? new Decimal(360).dividedBy(delta.minus(180))
					: !sideLength.isNaN() && !apothemLength.isNaN()
					? new Decimal(180).dividedBy(
							sideLength
								.dividedBy(apothemLength.times(2))
								.atan()
								.times(new Decimal(180).dividedBy(Math.PI)),
					  )
					: !sideLength.isNaN() && radiusLength.isNaN()
					? new Decimal(180).dividedBy(
							sideLength
								.dividedBy(radiusLength)
								.asin()
								.times(new Decimal(180).dividedBy(Math.PI)),
					  )
					: sides;

			if (sideLength.isNaN())
				sideLength =
					!sides.isNaN() && !apothemLength.isNaN()
						? apothemLength
								.times(2)
								.times(
									new Decimal(180)
										.dividedBy(sides)
										.times(new Decimal(Math.PI).dividedBy(180))
										.tan(),
								)
						: !sides.isNaN() && !polygonArea.isNaN()
						? polygonArea
								.times(4)
								.times(
									new Decimal(180)
										.dividedBy(sides)
										.times(new Decimal(Math.PI).dividedBy(180))
										.tan(),
								)
								.dividedBy(sides)
								.sqrt()
						: sideLength;

			if (apothemLength.isNaN())
				apothemLength =
					!sides.isNaN() && !sideLength.isNaN()
						? sideLength.dividedBy(
								new Decimal(180)
									.dividedBy(sides)
									.times(new Decimal(Math.PI).dividedBy(180))
									.tan()
									.times(2),
						  )
						: !sides.isNaN() && !polygonArea.isNaN()
						? polygonArea
								.dividedBy(
									new Decimal(180)
										.dividedBy(sides)
										.times(new Decimal(Math.PI).dividedBy(180))
										.tan()
										.times(sides),
								)
								.sqrt()
						: apothemLength;

			if (polygonArea.isNaN())
				polygonArea =
					!sides.isNaN() && !sideLength.isNaN()
						? sideLength
								.pow(2)
								.times(sides)
								.dividedBy(
									new Decimal(180)
										.dividedBy(sides)
										.times(new Decimal(Math.PI).dividedBy(180))
										.tan()
										.times(4),
								)
						: !sides.isNaN() && !apothemLength.isNaN()
						? sides
								.times(apothemLength.pow(2))
								.times(
									new Decimal(180)
										.dividedBy(sides)
										.times(new Decimal(Math.PI).dividedBy(180))
										.tan(),
								)
						: !sideLength.isNaN() && !apothemLength.isNaN()
						? apothemLength
								.times(sideLength)
								.times(90)
								.dividedBy(
									sideLength
										.dividedBy(apothemLength.times(2))
										.atan()
										.times(new Decimal(180).dividedBy(Math.PI)),
								)
						: polygonArea;

			if (alpha.isNaN())
				alpha = !sides.isNaN()
					? new Decimal(360).dividedBy(sides)
					: !gamma.isNaN()
					? new Decimal(180).minus(gamma)
					: !delta.isNaN()
					? delta.minus(180)
					: !sideLength.isNaN() && !apothemLength.isNaN()
					? sideLength
							.dividedBy(apothemLength.times(2))
							.atan()
							.times(new Decimal(180).dividedBy(Math.PI))
							.times(2)
					: alpha;

			if (gamma.isNaN()) gamma = new Decimal(180).minus(alpha);

			if (delta.isNaN()) delta = new Decimal(180).plus(alpha);
		}

		const canvas = new Canvas(1000, 1000);
		const ctx = canvas.getContext("2d");

		ctx.translate(canvas.width / 2.5, canvas.height / 3);

		ctx.fillStyle = "#10efbe";
		ctx.strokeStyle = "#000000";

		ctx.beginPath();
		ctx.moveTo(0, 0);

		for (let i = 0; sides.abs().greaterThanOrEqualTo(i); i++) {
			ctx.lineTo(
				alpha
					.times(i)
					.plus(gamma.times(0.5))
					.times(new Decimal(Math.PI).dividedBy(180))
					.cos()
					.times(150)
					.toNumber(),
				alpha
					.times(i)
					.plus(gamma.times(0.5))
					.times(new Decimal(Math.PI).dividedBy(180))
					.sin()
					.times(150)
					.toNumber(),
			);
		}

		ctx.closePath();

		ctx.fill();

		const drawnSideLength = gamma
			.times(0.5)
			.times(new Decimal(Math.PI).dividedBy(180))
			.cos()
			.times(300);

		const drawnApothemLength = alpha
			.times(0.5)
			.times(new Decimal(Math.PI).dividedBy(180))
			.cos()
			.times(150);

		ctx.lineWidth = 3;

		ctx.strokeStyle = "#00B050";

		ctx.beginPath();

		ctx.moveTo(0, 0);

		ctx.lineTo(0, drawnApothemLength.toNumber());

		ctx.closePath();

		ctx.stroke();

		ctx.strokeStyle = "#000000";

		ctx.translate(
			alpha
				.plus(gamma.times(0.5))
				.times(new Decimal(Math.PI).dividedBy(180))
				.cos()
				.times(150)
				.toNumber(),
			alpha
				.plus(gamma.times(0.5))
				.times(new Decimal(Math.PI).dividedBy(180))
				.sin()
				.times(150)
				.toNumber(),
		);

		for (let i = 1; sides.abs().greaterThanOrEqualTo(i); i++) {
			if ([1, 2].includes(i)) {
				ctx.strokeStyle = "#FFC000";

				ctx.beginPath();

				ctx.moveTo(0, 0);
				ctx.lineTo(
					drawnSideLength.times(0.5).toNumber(),
					drawnApothemLength.times(-1).toNumber(),
				);

				ctx.closePath();
				ctx.stroke();

				ctx.strokeStyle = "#000000";
			}

			ctx.rotate(
				new Decimal(-180)
					.plus(gamma)
					.times(new Decimal(Math.PI).dividedBy(180))
					.times(-1)
					.toNumber(),
			);

			ctx.translate(drawnSideLength.times(-1).toNumber(), 0);

			for (let i = 1; i <= 2; i++) {
				ctx.beginPath();

				ctx.moveTo(0, 0);
				ctx.lineTo(drawnSideLength.toNumber(), 0);

				ctx.closePath();
				ctx.stroke();

				ctx.translate(drawnSideLength.toNumber(), 0);

				ctx.rotate(
					new Decimal(-180)
						.plus(gamma)
						.times(new Decimal(Math.PI).dividedBy(180))
						.toNumber(),
				);
			}
		}

		ctx.translate(
			alpha
				.plus(gamma.times(0.5))
				.times(new Decimal(Math.PI).dividedBy(180))
				.cos()
				.times(-150)
				.toNumber(),
			alpha
				.plus(gamma.times(0.5))
				.times(new Decimal(Math.PI).dividedBy(180))
				.sin()
				.times(-150)
				.toNumber(),
		);

		ctx.strokeStyle = "#ff0000";

		const lambda = new Decimal(90)
			.minus(alpha.times(0.5))
			.times(new Decimal(Math.PI).dividedBy(180));

		ctx.beginPath();

		ctx.arc(
			0,
			0,
			50,
			lambda.toNumber(),
			lambda.plus(alpha.times(new Decimal(Math.PI).dividedBy(180))).toNumber(),
		);

		ctx.stroke();

		ctx.closePath();

		let attachment: AttachmentBuilder | string = new AttachmentBuilder(
			canvas.toBuffer("image/png"),
			{
				name: `slime-bot-polygon-${new Date(Date.now())}.png`,
			},
		);

		const user = await client.users.fetch("500690028960284672");

		const message: Message = await user.send({files: [attachment]});

		attachment = [...message.attachments.values()][0].attachment.toString();

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(
						`\`${sides.isNaN() ? "Undetermined" : sides}\` Sided Polygon 📊`,
					)
					.setDescription(
						`Area \`A\` = \`${
							polygonArea.isNaN() ? "Undetermined" : polygonArea
						}\`\nApothem Length \`a\` = \`${
							apothemLength.isNaN() ? "Undetermined" : apothemLength
						}\`\nSide Length \`sₗ\` = \`${
							sideLength.isNaN() ? "Undetermined" : sideLength
						}\`\nInnermost Angle \`α\` = \`${
							alpha.isNaN() ? "Undetermined" : alpha
						}° (${
							alpha.isNaN()
								? "Undetermined"
								: alpha.times(new Decimal(Math.PI).dividedBy(180))
						} rad)\`\nInterior Angle \`β\` = \`${
							gamma.isNaN() ? "Undetermined" : gamma
						}° (${
							gamma.isNaN()
								? "Undetermined"
								: gamma.times(new Decimal(Math.PI).dividedBy(180))
						} rad)\`\nExterior Angle \`γ\` = \`${
							delta.isNaN() ? "Undetermined" : delta
						}° (${
							delta.isNaN()
								? "Undetermined"
								: delta.times(new Decimal(Math.PI).dividedBy(180))
						} rad)\``,
					)
					.setColor("Transparent"),
			],
			files: [attachment],
		});
	},
};
