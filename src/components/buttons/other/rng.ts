import {ButtonStyle} from "discord-api-types/v9";
import {ActionRowBuilder, EmbedBuilder, ButtonBuilder} from "discord.js";
import {RNG} from "../../../functions.js";

export default {
	data: {
		name: "rng",
	},
	async execute(interaction) {
		await interaction.deferUpdate();

		const embed = interaction.message.embeds[0].data;
		const min = embed.title.match(/[0-9.]+|NaN/)[0];
		const max = embed.title.match(/[0-9.]+(?=\)$)|NaN/)[0];

		await interaction.message.edit({
			embeds: [
				new EmbedBuilder()
					.setTitle(`🎲 RNG(${min}, ${max})`)
					.setDescription(
						`> RNG(${min}, ${max}) = ${RNG(
							parseInt(max),
							parseInt(min),
							/\./.test(embed.description),
						)}`,
					)
					.setColor("Transparent"),
			],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setEmoji("🎲")
						.setLabel("Generate more")
						.setStyle(ButtonStyle.Secondary)
						.setCustomId("rng"),
				),
			],
		});
	},
};
