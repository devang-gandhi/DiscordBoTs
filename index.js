const Discord = require('discord.js');
const dotenv = require('dotenv');
const { REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const fs = require('fs')
const { Player} = require('discord-player');

dotenv.config()
const token = process.env.TOKEN;

const LOAD_SLASH = process.argv[2] == "load"

const client_id = '950801883549814854'
const guild_id = '933374755497734154'

const client = new Discord.Client({
    intents : [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality:'highestaudio',
        highWaterMark: 1 << 25
    } 
})

let commands = []

const slashfiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'))

for(const file of slashfiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if(LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if(LOAD_SLASH){
    const rest = new REST({ version: '9'}).setToken(token)
    console.log('Ready to run slash commands...');
    rest.put(
        Routes.applicationGuildCommands(client_id, guild_id), {body: commands})
    .then(() => {
        console.log('successfully loaded!');
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
}
else{
    client.on("ready", () => {
        console.log(`Log in as ${client.user.tag}`);
        client.user.setStatus('idle');
    })

    client.on("interactionCreate", (interaction) => {
        async function handlecommand() {
            if(!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)

            if(!slashcmd) interaction.reply("Please enter valid slash command you noobie!");

            await interaction.deferReply()
            await slashcmd.run({client, interaction})
        }

        handlecommand()
    })

    client.login(token)
}