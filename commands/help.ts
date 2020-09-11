require('dotenv').config();
import { MessageEmbed } from "discord.js";
module.exports = {
    'name': 'help',
    'description': 'Help command',
    'arguments': 'section [optional], function [optional]',
    'permissions': 'None',
    async execute(message,args,client){
        let embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help')
            .setAuthor(`${client.user.username}`)
            .setTimestamp()
            .setFooter(`Type ${process.env.PREFIX}bug to report any bugs!`, client.user.avatar_url);
        if (args === undefined || args.length == 0){
            embed.addFields(
                {name: `How to use the command`, value: `Type ${process.env.PREFIX}help [section] to get the commands in that section. For example, ${process.env.prefix}help text`, inline: false},
                {name: `Text`, value: `Text commands (no paramaters)`, inline: false},
                {name: `Moderation`, value: `Moderation commands (needs special permissions)`, inline: false},
                {name: 'Other', value: 'Everything else', inline: false}
            );
        }
        else{
            switch (args[0].toUpperCase()){
                case 'MODERATION':
                    embed.addFields(
                        {name: `purge`, value: `Deletes messages`, inline: false},
                        {name: `announce`, value: `Make an announcement`, inline: false},
                        {name: 'ban', value: 'Ban someone', inline: false},
                        {name: 'kick', value: 'Kick someone (not physically lol)', inline: false},
                        {name: 'mute', value: 'Mute someone', inline: false}
                    );
                    break;
                case 'TEXT':
                    embed.addFields(
                        {name: `hi`, value: `Hello!`, inline: false},
                        {name: `stats`, value: `Provides some bot stats`, inline: false},
                        {name: `covid`, value: `Gets covid stats for a US state or US`, inline: false},
                        {name: 'server', value: 'Join the Utilibot Support Server!'},
                        {name: 'invite', value: 'Invite Utilibot to your server!', inline: false},
                        {name: 'bug', value: 'Report a bug', inline: false}
                    )
                    break;
                case 'OTHER':
                    embed.addFields(
                        {name: 'giveaway', value: 'Still in development :smile:', inline: false},
                        {name: 'selfrole', value: 'Give yourself a role', inline: false}
                    )
                default:
                    let cmd = client.commands.get(args[0].toLowerCase());
                    console.log(cmd);
                    try{
                        embed.addFields(
                            {name: `${args[0].toLowerCase()}`, value: `${cmd.description}`, inline: false},
                            {name: `Arguments`, value: `${cmd.arguments}`, inline: false},
                            {name: 'Permissions', value: `${cmd.permissions}`, inline: false}
                        );
                    }
                    catch(err){
                        console.log(err);
                    }
            }
        }
        message.channel.send(embed);
    }
}
