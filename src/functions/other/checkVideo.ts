import Parser from "rss-parser";
const parser = new Parser();
import fs from "fs";
import {EmbedBuilder} from "discord.js";
import {SlimeBotClient} from "../../types";

export default (client: SlimeBotClient) => {
	client.checkVideos = async () => {
		const data = await parser.parseURL(
			"https://www.youtube.com/feeds/videos.xml?channel_id=UCxadpGtkbIDcnKaddRFWV8g",
		);
		const rawData = fs.readFileSync(`./data/video.json`);

		const jsonData = JSON.parse(rawData.toString());
		if (jsonData.id !== data?.items[0]?.id && data) {
			// New video or video not sent
			fs.writeFileSync(
				`./data/video.json`,
				JSON.stringify({id: data?.items[0]?.id}),
			);

			// 1005884609281654805
			const guild = await client.guilds
				.fetch("806810303458836481")
				.catch(console.error);

			const channel = await guild.channels
				.fetch("1005884609281654805")
				.catch(console.error);

			const {title, link, id, author} = data?.items[0];

			const embed = new EmbedBuilder()
				.setTitle(title)
				.setURL(link)
				.setTimestamp(Date.now())
				.setImage(`https://img.youtube.com/vi/${id.slice(9)}/maxresdefault.jpg`)
				.setColor("Red")
				.setAuthor({
					name: author,
					iconURL:
						"https://yt3.ggpht.com/ytc/AMLnZu_fMIQMCUWuys0SGS5MAUyCElpx7Np5QTBJ1yYI=s600-c-k-c0x00ffffff-no-rj-rp-mo",
					url: "https://www.youtube.com/channel/UCxadpGtkbIDcnKaddRFWV8g/?sub_confirmation=1",
				})
				.setFooter({
					text: client.user.username,
					iconURL: client.user.displayAvatarURL({
						size: 4096,
						extension: "png",
					}),
				});

			await channel
				.send({
					embeds: [embed],
					content: "<@&1005886678789001216> **Cæt** has uploaded a new video!",
				})
				.catch(console.error);
		}
	};
};
