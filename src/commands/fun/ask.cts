// ! Command disabled because apparently it costs money.
import {
	SlashCommandBuilder,
	EmbedBuilder,
	ChatInputCommandInteraction,
	Client,
} from "discord.js";
import {ErrorMessageBuilder} from "../../classes.js";
import {generateText} from "../../functions.js";
import {Command} from "../../types";

export const ask: Command = {
	data: new SlashCommandBuilder()
		.setName("ask")
		.setDescription("Ask ChatGPT a question.")
		.addStringOption((option) =>
			option
				.setName("prompt")
				.setDescription("The prompt to send to ChatGPT.")
				.setRequired(true),
		)
		.addNumberOption((option) =>
			option
				.setName("temperature")
				.setDescription(
					"The temperature to configure the model with. Default is 1.0",
				)
				.setMinValue(0)
				.setMaxValue(1),
		),
	usage: [
		"**/ask** `prompt: The prompt to send to ChatGPT` `temperature: The temperature to configure the model with`",
	],
	async execute(interaction: ChatInputCommandInteraction, client: Client) {
		await interaction.deferReply();
		const prompt = interaction.options.getString("prompt", true);
		const temperature = interaction.options.getNumber("temperature");

		try {
			return await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle(`> ${prompt}`)
						.setDescription(await generateText(prompt, temperature ?? 1))
						.setColor("Transparent")
						.setAuthor({
							name: "SlimeGPT",
							iconURL: client.user?.displayAvatarURL({
								size: 4096,
								extension: "png",
							}),
						})
						.setFooter({
							text: `Requested by ${interaction.user.username}, Temperature: ${
								temperature ? temperature.toPrecision(1) : 1.0
							}`,
							iconURL: interaction.user.displayAvatarURL({
								size: 4096,
								extension: "png",
							}),
						})
						.setTimestamp(Date.now()),
				],
			});
		} catch (error) {
			await interaction.editReply(new ErrorMessageBuilder(error, true));
		}
	},
};
