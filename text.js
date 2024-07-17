class EmbedClassBuilder {
    constructor(name /*The name of the class (e.g. file, component, embed)*/, colour /*The colour of the embed*/, func, func2, emoji) {
        this.class = class {
            constructor(embedData, selected, client) {
               this.embeds = [new EmbedBuildrr().setTitle(`${emoji}  {embedData.name} - Editing ${name}s`).setDescription(`Currently editing your ${embedProfile.customID}${numberEnding(embedProfile.customID)} embed! Edit it's ${name}s here.\n\n` + embedData[name + "s"].map((type) => func(type)).join("").setColor(colour).setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL()})]
               
               this.components = [new ActionRowBuilder().addComponents(new SelectMenuBuilder().setPlaceholder(`Select a ${name}...`).setCustomID(`embed${capitaliseFirst(name)}s`).setOptions(embedData[name + "s"].map((type) =>  func2(type)).join(""))]
            }
        }
    }
}

const embedFileMessageBuilder = new EmbedClassBuilder("file", 0x2373df, (fileData) => `> Link: ${cut(fileData.link, 63)}\n> Type: ${fileData.type}\n> Size: ${fileData.size}`, (fileData) => ({name: cut(fileData.link, 100), value: fileData.link, emoji: "📂"}, "🗃️").class