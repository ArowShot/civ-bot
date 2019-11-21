const path = require('path')
const fs = require('fs')
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

let webhooks = {}
let channel
discordClient.on('ready', async () => {
    discordClient.user.setActivity(`${config.mcHost}${config.mcPort===25565?'':':'+config.mcPort}`)
    channel = discordClient.channels.get(config.botchannel)
    var whfile = path.join(__dirname, 'config', 'webhooks.json')
    var wh = {}
    if(fs.existsSync(whfile)) {
        wh = JSON.parse(fs.readFileSync(whfile))
    }
    if(wh.primaryId && wh.primaryToken && wh.secondaryId && wh.secondaryToken) {
        webhooks.primary = new Discord.WebhookClient(wh.primaryId, wh.primaryToken)
        webhooks.secondary = new Discord.WebhookClient(wh.secondaryId, wh.secondaryToken)
    } else {
        try {
            webhooks.primary = await channel.createWebhook('primary webhook', 'https://crafatar.com/renders/head/8667ba71b85a4004af54457a9734eed7')
            webhooks.primary.edit('primary webhook', 'https://crafatar.com/renders/head/8667ba71b85a4004af54457a9734eed7')
            webhooks.secondary = await channel.createWebhook('secondary webhook', 'https://crafatar.com/renders/head/8667ba71b85a4004af54457a9734eed7')
            webhooks.secondary.edit('secondary webhook', 'https://crafatar.com/renders/head/8667ba71b85a4004af54457a9734eed7')
        } catch(e) {
            console.error(e)
        }
        wh = {
            primaryId: webhooks.primary.id,
            primaryToken: webhooks.primary.token,
            secondaryId: webhooks.secondary.id,
            secondaryToken: webhooks.secondary.token,
        }
        fs.writeFileSync(whfile, JSON.stringify(wh))
    }
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
    console.log(`[CHAT]: ${msg}`)
    handleChatMessage(msg)
})

mcClient.on('success', packet => {
    console.log(`Logged in to ${config.mcHost}${config.mcPort===25565?'':':'+config.mcPort} with ${packet.username}`)
})

function truncate(str, len) {
    return str.toString().substring(0, len)
}

async function sendSnitchMessage(user, action, snitchName, worldName, x, y, z) {
    await channel.send(`\`${user} ${action} ${snitchName} at ${x}, ${y}, ${z}\``)
}

let usePrimary = false
let lastUsedName = ''
async function sendChatMessage(channel, username, message) {
    var name = username
    if(channel != null) {
        name = `[${channel}] ${name}`
    }
    if(lastUsedName != name)
        usePrimary = !usePrimary
    lastUsedName = name

    let webhook
    if(usePrimary)
        webhook = webhooks.primary
    else
        webhook = webhooks.secondary
    
    try {
        await webhook.edit(truncate(name, 32), `https://crafatar.com/renders/head/8667ba71b85a4004af54457a9734eed7`)
        await webhook.send(message)
    } catch(e) {
        console.error(e)
    }
}

var snitch = /^(.+)\* (\w+) (entered|logged out in|logged in to) snitch at (.*) \[(\w+) (\d+) (\d+) (.+)\]/
function handleSnitchMessage(msg) {
    var matches = snitch.exec(msg)
    sendSnitchMessage(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6], matches[7])
}

var nl_msg = /^\[(.+)\] (\w+): (.+)/
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