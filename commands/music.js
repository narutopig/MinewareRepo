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
        switch (args[0].toLowerCase()){
            case 'PLAY':
                voiceChannel.join()
                .then(connection => {
                    try {
                        const dispatcher = connection.play(ytdl(args[1]), {volume: 1});
                    dispatcher.on('finish', () => { 
                        dispatcher.destroy();
                        voiceChannel.leave();
                        return message.channel.send('Finished playing!');
                    }); 
                    } catch (err){
                        console.log(err);
                        dispatcher.destroy();
                        voiceChannel.leave();
                        return message.channel.send('Something went wrong.');
                    }
                });
        }
    }
}