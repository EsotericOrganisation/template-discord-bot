class SettingsMessageBuilder { 
  constructor(settings, interaction) {

  let description = "";

  const botData = JSON.parse(fs.readFileSync(`./src/json/bot.json`));



  for (const properties in settings) {

    const element = settings[properties];

    description += `\n> **${botData.settings[properties].label ?? properties}:** `;

    for (const property in element) {

      const prop = element[property];



      description +=`\`${botData.settings[properties][property].label ?? property}: ` + (prop === true

          ? `✅ Enabled`

          : prop === false

          ? `❌ Disabled`

          : `${prop}`) +

        "`, ";

    }

    description += `\n> `;

  }



  this.embeds = [

    new EmbedBuilder()

      .setTitle(`⚙️ Server Settings`)

      .setDescription(description)

      .setAuthor({

        name: client.user.username,

        iconURL: client.user.displayAvatarURL(),

      })

      .setFooter({

        name: `Requested by ${interaction.user.username}`,

        iconURL: interaction.user.displayAvatarURL(),

      })

      .setColor(`Gray`),

  ];



  this.components = botData.settingArrays.map((settings) => ({

    label: (settings.label ?? "").match(afterEmojiReg)?.[0] ?? settings.label,

    value: settings.label,

    emoji: settings.match(emojiReg)?.[0]

  }))
  }
}