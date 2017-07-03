const config = require('./config/config')
const Discord = require('discord.js')
const mc = require('minecraft-protocol')
const discordClient = new Discord.Client()

const mcClient = mc.createClient({
    host: config.mcHost,
    port: config.mcPort,
    username: config.mcUsername,
    password: config.mcPassword,
    version: config.mcVersion
})

let webhook
discordClient.on('ready', () => {
    discordClient.user.setGame('CivClassic')
    webhook = new Discord.WebhookClient(config.webhookId, config.webhookToken)
    console.log(`Logged in to Discord as ${discordClient.user.tag}!`)
})

discordClient.on('message', async msg => {
    if (msg.author.bot) return
    if (!msg.content.startsWith('!')) return

    var str = msg.content.substring(1)
    handleChatMessage(str)
})

discordClient.login(config.botToken)

mcClient.on('chat', packet => {
    var msg = ''
    var json = JSON.parse(packet.message)
    if(json.text) {
        msg += json.text
    }
    if(json.extra) {
        json.extra.forEach(function(m) {
            if(m.text) {
                msg += m.text
            }
        }, this)
    }
    handleChatMessage(msg)
})

mcClient.on('success', packet => {
    console.log(`Logged in to ${config.mcHost}${config.mcPort===25565?'':':'+config.mcPort} with ${packet.username}`)
})

function truncate(str, len) {
    return str.toString().substring(0, len)
}

async function sendSnitchMessage(user, snitchName, worldName, x, y, z) {
    await discordClient.channels.get(config.botchannel).send(`\`${user} entered ${snitchName} at ${x}, ${y}, ${z}\``)
}

async function sendChatMessage(channel, username, message) {
    var name = username
    if(channel != null) {
        name = `[${channel}] ${name}`
    }
    
    await webhook.edit(truncate(name, 32), `https://crafatar.com/renders/head/${username}`)
    await webhook.send(message)
}

var snitch = /^ \* (\w+) entered snitch at (\w+) \[(\w+) (\d+) (\d+) (\d+)\]/
function handleSnitchMessage(msg) {
    var matches = snitch.exec(msg)
    sendSnitchMessage(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6])
}

var nl_msg = /^\[(\w+)\] (\w+): (.+)/
function handleNameLayerMessage(msg) {
    var matches = nl_msg.exec(msg)
    sendChatMessage(matches[1], matches[2], matches[3])
}

var l_msg = /^(\w+): (.+)/
function handleLocalMessage(msg) {
    var matches = l_msg.exec(msg)
    sendChatMessage(null, matches[1], matches[2])
}

function handleChatMessage(msg) {
    if(snitch.test(msg)) {
        handleSnitchMessage(msg)
    } else if(nl_msg.test(msg)) {
        handleNameLayerMessage(msg)
    } else if(l_msg.test(msg)) {
        handleLocalMessage(msg)
    }
}