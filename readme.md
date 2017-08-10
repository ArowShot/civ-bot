## civ-bot
[![dependencies Status](https://david-dm.org/arowshot/civ-bot/status.svg)](https://david-dm.org/arowshot/civ-bot)

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
    "mcVersion": "1.10.2"
}
```


### Upcoming
- ~~Auto generate webhook if none specified~~
- Allow messages sent from discord to be sent in-game
- Switch to UUID lookup for Minecraft skins
- Filter group/snitch messages to certain channels depending on the namelayer group

### Using
- [discord.js](https://github.com/hydrabolt/discord.js) for connecting to Discord API
- [minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol) for connecting to Minecraft servers
- [crafatar](https://crafatar.com/) for the minecraft skin avatars
