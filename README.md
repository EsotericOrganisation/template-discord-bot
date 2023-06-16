# 🌳 Slime Bot V1 Archive

## Old Description

A Discord bot made by `Caet 😺🐈🐈#5014`

## Features

```js
Embed Builder 💬
Advanced Poll Command 📊
Graphing Calculator 📈
Many Fun Commands 😃
```

### Altered DiscordJS Code

1. `node_modules/discord-api-types/payloads/v10/_interactions/responses.d.ts:14:5` - Added inverse keys and properties to enum `InteractionType`.
2. `node_modules/discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/shared.d.ts:17:5` - Added inverse keys and properties to enum `ApplicationCommandOptionType`.
3. `node_modules/discord.js/typings/index.d.ts:4950:3` & `node_modules/discord.js/src/util/Colors.js:73:3` - Added `Transparent (0x2f3136)` and `TransparentBright (0xf2f3f5)` colours to colours declaration.
4. `node_modules/discord.js/typings/index.d.ts:4834:3` - Changed type of partials to `(Partials | string)[]`.
5. `node_modules/discord.js/typings/index.d.ts:4837:3` - Changed type of intents to `string[] | BitFieldResolvable<GatewayIntentsString, number>`.
6. `node_modules/discord-api-types/payloads/common.d.ts:10:4` - Added `[key: string]: bigint;` to the PermissionsFlagsBits declaration.
