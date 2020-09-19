const ytdl = require('ytdl-core');
const path = require('path');
module.exports = {
    'name': 'music',
    'description': 'Plays a Youtube video (only audio)',
    'arguments': 'search terms (list)',
    'permissions': 'None',
    async execute(message,args,client){
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command.');
        // const permissions = voiceChannel.permissionsFor(client.member);
        try {
            const connection = await voiceChannel.join()
            const dispatcher = connection.play(path.join(__dirname,`/resources/songs/${args[0].toLowerCase()}.mp3`));
            dispatcher.on('finish', () => { 
                message.channel.send('Finished playing!');
            }); 
            dispatcher.destroy();
        }
        catch (err){
            console.log(err);
            return message.channel.send('Something went wrong.');
        }
    }
}