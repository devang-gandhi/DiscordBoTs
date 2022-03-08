const { SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the queue..'),

    run: async({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue)  return await interaction.editReply("Smart bitch and candy ass, Please add songs in queue. There are songs to play in queue..")

        queue.shuffle()

        await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled!`)
    },
}