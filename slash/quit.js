const { SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('quit')
    .setDescription('Cia from voice channel and clears the queue..'),

    run: async({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue)  return await interaction.editReply("Smart bitch and candy ass, Please add songs in queue. There are songs to play in queue..")

        queue.destroy()

        await interaction.editReply('Bye-bye, Cia folks..')
    }
}