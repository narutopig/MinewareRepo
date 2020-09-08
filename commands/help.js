const Discord = require('discord.js');
module.exports = {
    'name': 'help',
    'description': 'Help command',
    execute(message,args,client){
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help')
            .setAuthor(`${client.user.username}`)
            .setTimestamp()
            .setFooter(`Type ${prefix}bug to report any bugs!`, client.user.avatar_url);
        if (args === undefined || args.length == 0){
            embed.addFields(
                {name: `How to use the command`, value: `Type ${prefix}help [section] to get the commands in that section. For example, ${prefix}help misc`, inline: false},
                {name: `Text`, value: `Text commands (no paramaters)`, inline: false},
                {name: `Moderation`, value: `Moderation commands (needs special permissions)`, inline: false},
                {name: `Bugs`, value: `Report bugs`, inline: false}
            );
        }
        else{
            switch (args[0].toUpperCase()){
                case 'MODERATION':
                    embed.addFields(
                        {name: `purge`, value: `Deletes messages`, inline: false},
                        {name: `announce`, value: `Make an announcement`, inline: false}
                    );
                    break;
                case 'TEXT':
                    embed.addFields(
                        {name: `hi`, value: `Hello!`, inline: false},
                        {name: `stats`, value: `Provides some bot stats`, inline: false},
                        {name: `covid`, value: `Gets covid stats for a US state or US`, inline: false}
                    )
                    break;
                case 'BUGS':
                    embed.addFields(
                        {name: `bugs`, value: `Report a bug!`, inline: false}
                    )
                    break;
                case 'PURGE':
                    embed.addFields(
                        {name: `Arguments`, value: `Arguments: amt (int)`, inline: false},
                        {name: `Required Permissions`, value: `None`, inilne: false}
                    )
                    break;
                case 'ANNOUNCE':
                    embed.addFields(
                        {name: `announce`, value: `Arguments: Channel, args (words of the message)`, inline: false},
                        {name: `Required Permissions`, value: `\`MANAGE_CHANNELS\``, inline: false}
                    )
                    break;
                case 'HI':
                    embed.addFields(
                        {name: `hi`, value: `Arguments: None`, inline: false},
                        {name: `Required Permissions`, value: `None`, inline: false}
                    )
                    break;
                case 'STATS':
                    embed.addFields(
                        {name: `stats`, value: `Arguments: None`, inline: false},
                        {name: `Required Permissions`, value: `None`, inline: false}
                    )
                    break;
                case 'COVID':
                    embed.addFields(
                        {name: `covid`, value: `Arguments: statecode (optional)`, inline: false},
                        {name: `Required Permissions`, value: `None`, inline: false}
                    )
                    break;
                case 'BUG':
                    embed.addFields(
                        {name: `bug`, value: `Arguments: args (words)`, inline: false},
                        {name: `Required Permissions`, value: `None`, inline: false}
                    )
                    break;
            }
        }
        message.channel.send(embed);
    }
}