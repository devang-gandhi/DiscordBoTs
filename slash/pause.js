const { SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the music..'),

    run: async({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue)  return await interaction.editReply("Smart bitch and candy ass, Please add songs in queue. There are songs to play in queue..")

        queue.setPaused(true)

        await interaction.editReply('Music has been paused! Use `/resume` to resume the music')
    }
}