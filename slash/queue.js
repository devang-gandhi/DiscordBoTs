const { SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription("Display current songs which are in queue..")
    .addNumberOption((option) => option.setName('page').setDescription('Page number of queue').setMinValue(1)),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue || !queue.playing){
            return await interaction.editReply('There are no songs in the queue you smart ass!')
        }

        const totalpages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber('page') || 1) - 1
        
        if(page > totalpages)
            return await interaction.editReply(`Invaild page smart ass. There are only a total of ${totalpages} pages of songs.`)
        
        const queuestring = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `***${page * 10 + i + 1}. \`[${song.duration}]\` ${song.title} ~~ <@${song.requestedBy.id}>`
        }).join("\n")

        const currentsong = queue.current

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`***Current Playing***\n` + 
                    (currentsong ? `\`[${currentsong.duration}]\` ${currentsong.title} -- <@${currentsong.requestedBy.id}>` : "None") +
                    `\n\n***Queue***\n${queuestring}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalpages}`
                    })
                    .setThumbnail(currentsong.setThumbnail)
            ]
        })
    }   
}