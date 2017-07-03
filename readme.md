## civ-bot
![a](https://david-dm.org/ArowShot/civ-bot.svg)

### Setup
1. Install [node.js](https://nodejs.org/)
2. Clone or download this repository `git clone https://github.com/ArowShot/civ-bot.git`
3. Run `npm install`
4. Copy `config/config.example.json` to `config/config.json`
5. Configure config using guide below

Then to start the bot any time run `npm start`

### Config
```javascript
{
	// The bot token from https://discordapp.com/developers/applications/me
    "botToken": "",
    // ID of discord channel the bot resides in (right click -> Copy ID with dev mode on)
    "botchannel": "",
    // Username (e-mail) of minecraft account used to sit on the server
    "mcUsername": "",
    // Password of minecraft account used to sit on the server
    "mcPassword": "",
    // IP of minecraft server (default civclassic)
    "mcHost": "mc.civclassic.com",
    // Port of minecraft server
    "mcPort": 25565,
    // Version of minecraft server
    "mcVersion": "1.10.2",
    // Webhook ID used for sending messages from in-game chat
    "webhookId": "",
    // Token for webhook
    "webhookToken": ""
}
```

### Finding webhook ID and token
1. Right click on the channel the bot will send messages to
2. Click Edit Channel
3. Go to Webhooks section
4. Click Create Webhook (don't change name or avatar)
5. Copy the Webhook URL
6. The token is everything after the last '/' and the id is the number before it

#### Example
If the URL is
> https://discordapp.com/api/webhooks/331266697807921154/CBxdAXFiyxOZI_P-EB___DPMc7myLfcqHOKW1XyerR83YxSCj5EzcrCcMLcdhslUkT1X

then the token is
>CBxdAXFiyxOZI_P-EB___DPMc7myLfcqHOKW1XyerR83YxSCj5EzcrCcMLcdhslUkT1X

and the ID is
>331266697807921154

### Upcoming
- Auto generate webhook if none specified
- Allow messages sent from discord to be sent in-game
- Switch to UUID lookup for Minecraft skins

### Using
- [discord.js](https://github.com/hydrabolt/discord.js) for connecting to Discord API
- [minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol) for connecting to Minecraft servers
- [crafatar](https://crafatar.com/) for the minecraft skin avatars
