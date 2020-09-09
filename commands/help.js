const Discord = require('discord.js');
module.exports = {
    'name': 'help',
    'description': 'Help command',
    'arguments': 'section [optional], function [optional]',
    'permissions': 'None',
    execute(message,args,client){
        const commands = client.commands;
        console.log(commands.entries);
        console.log(commands);
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help')
            .setAuthor(`${client.user.username}`)
            .setTimestamp()
            .setFooter(`Type ${process.env.prefix}bug to report any bugs!`, client.user.avatar_url);
        if (args === undefined || args.length == 0){
            embed.addFields(
                {name: `How to use the command`, value: `Type ${process.env.prefix}help [section] to get the commands in that section. For example, ${process.env.prefix}help text`, inline: false},
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
                        {name: `covid`, value: `Gets covid stats for a US state or US`, inline: false},
                        {name: 'server', value: 'Join the Utilibot Support Server!'},
                        {name: 'invite', value: 'Invite Utilibot to your server!', inline: false}
                    )
                    break;
                case 'BUGS':
                    embed.addFields(
                        {name: `bug`, value: `Report a bug!`, inline: false}
                    )
                    break;
                default:
                    let cmdname = args[0].toLowerCase();
                    console.log(client.commands[cmdname]);
                    try{
                        embed.addFields(
                            {name: `${cmdname}`, value: `${client.commands[cmdname]['description']}`, inline: false},
                            {name: `Arguments`, value: `${client.commands[cmdname]['arguments']}`, inline: false},
                            {name: 'Permissions', value: `${client.commands[cmdname]['permissions']}`, inline: false}
                        );
                    }
                    catch{
                        console.log('There was an error, devs will fix :)');
                    }
            }
        }
        message.channel.send(embed);
    }
}