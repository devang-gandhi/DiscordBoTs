const { SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the currently playing song.. '),

    run: async({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue)  return await interaction.editReply("Smart bitch and candy ass, Please add songs in queue. There are songs to play in queue..")

        const song = queue.current
        queue.skip()

        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`${song.title} has been skipped!`).setThumbnail(song.thumbnail)
            ]
        })
    }
}