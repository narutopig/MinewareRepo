import { MessageEmbed } from 'discord.js';
module.exports = {
    'name': 'vote',
    'description': 'top.gg links',
    'arguments': 'server | bot (optional)',
    'permissions': 'None',
    execute(message,args: string[],client){
        let mode: string;
        if (args[0]) mode = args[0].toLowerCase();
        switch (mode){
            case 'bot':
                let embed = new MessageEmbed()
                    .setColor('#00ffff')
                    .addFields(
                        {name: 'Vote for the bot!', value: '', inline: false}
                    );
                return message.channel.send(embed);
            case 'server':
                embed = new MessageEmbed()
                    .setColor('#00ffff')
                    .addFields(
                        {name: 'Vote for the bot!', value: '', inline: false}
                    );
                return message.channel.send(embed);
            default:
                embed = new MessageEmbed()
                    .setColor('#00ffff')
                    .addFields(
                        {name: 'Vote for the bot!', value: '', inline: false}
                    );
                return message.channel.send(embed);
        }
    }
}