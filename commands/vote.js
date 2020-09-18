const { MessageEmbed } = require('discord.js');
module.exports = {
    'name': 'vote',
    'description': 'top.gg links',
    'arguments': 'server | bot (optional)',
    'permissions': 'None',
    execute(message,args,client){
        let mode;
        if (args[0]) mode = args[0].toLowerCase();
        let embed = new MessageEmbed();
        switch (mode){
            case 'bot':
                embed.setColor('#00ffff');
                embed.addFields(
                    {name: 'Vote for the bot!', value: '[Click here](https://top.gg/bot/743529355107500033)', inline: false}
                );
                return message.channel.send(embed);
            case 'server':
                embed.setColor('#00ffff')
                embed.addFields(
                    {name: 'Vote for the server!', value: '[Click here](https://top.gg/servers/751181472047562762)', inline: false}
                );
                return message.channel.send(embed);
            default:
                embed = new MessageEmbed()
                embed.setColor('#00ffff')
                embed.addFields(
                    {name: 'Vote for the bot!', value: '[Click here](https://top.gg/bot/743529355107500033)', inline: false},
                    {name: 'Vote for the server!', value: '[Click here](https://top.gg/servers/751181472047562762)', inline: false}
                );
                return message.channel.send(embed);
        }
    }
}