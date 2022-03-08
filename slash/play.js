const { SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const { QueryType} = require('discord-player');

module.exports = {
    data : new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play songs from youtube')
    .addSubcommand((subcommand) => 
        subcommand
            .setName('songs')
            .setDescription('Play a single song from given URL..')
            .addStringOption((option) => option.setName("url").setDescription("Song's URL.").setRequired(true))
    )

    .addSubcommand((subcommand) =>
        subcommand
            .setName('playlists')
            .setDescription('Play entire playlist from given URL..')
            .addStringOption((option) => option.setName("url").setDescription("Playlist's URL..").setRequired(true))
    )

    .addSubcommand((subcommand) =>
    subcommand
        .setName('search')
        .setDescription('Search a song based on keywords..')
        .addStringOption((option) => option.setName("searchterms").setDescription("The searched keywords..").setRequired(true))
    ),

    run: async({client , interaction}) => {
        if(!interaction.member.voice.channel)
            return interaction.editReply('Please shift your ass in the voice-channel to use this command!');
        
        const queue = await client.player.createQueue(interaction.guild)

        if(!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed()

        if(interaction.options.getSubcommand() === 'songs'){
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            if(result.tracks.length === 0)
                return interaction.editReply('No results..')

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`***[${song.title}](${song.url})*** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }
        else if(interaction.options.getSubcommand() === 'playlists'){
            let url = interaction.options.getString('url')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if(result.tracks.length === 0)
                return interaction.editReply('No results..')

            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`***${result.tracks.length} songs from this [${playlist.title}](${playlist.url})*** has been added to the Queue`)
                .setThumbnail(playlist.thumbnail)
        }
        else if(interaction.options.getSubcommand() === 'search'){
            let url = interaction.options.getString('searchterms')
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if(result.tracks.length === 0)
                return interaction.editReply('No results..')

            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`***[${song.title}](${song.url})*** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        }

        if(!queue.playing) await queue.play()
        await interaction.editReply({
            embeds : [embed]
        })
    },
}
