const path = require('path');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const srjson = fs.readFileSync(path.join(__dirname,'./resources/selfrole.json'));
let sr = JSON.parse(srjson);
module.exports = {
    'name': 'selfrole',
    'description': 'Give yourself a role!',
    'arguments': 'Role(s) (not mentions)',
    'permissions': 'None',
    execute(message,args,client){
        sr = JSON.parse(srjson);
        console.log(sr);
        if (!sr[message.guild.id.toString()] || sr[message.guild.id.toString()] == undefined){
            sr[message.guild.id.toString()] = [];
        }
        if (args[0].toLowerCase() == 'add'){
            if (!message.member.hasPermission('MANAGE_ROLES')){
                message.channel.send(`You need the ${this.permissions} permission(s) to use this command!`);
                return;
            }
            let embed = new MessageEmbed()
                .setColor("#00ffff");
            for (const role of args.slice(1)){
                if (message.guild.roles.cache.find(r => r.name == role)){
                    sr[message.guild.id.toString()].push()
                    embed.addFields({name: role, value: 'Success', inline: true});
                }
                else{
                    embed.addFields({name: role, value: 'Failed', inline: true});
                }
            }
            fs.writeFileSync(`${__dirname}/resources/selfrole.json`,sr);
            message.channel.send(embed)
            return;
        }
        const roles = args;
        let embed = new MessageEmbed()
            .setColor("#00ffff");
        for (const role of roles){
            console.log(sr[message.guild.id.toString()]);
            const sr = message.guild.roles.cache.find(r => r.name === role);
            if (sr == undefined){
                embed.addFields({name: role, value: 'Failed', inline: true});
            }
            else{
                if (sr[message.guild.id.toString()].includes(role)){
                    message.member.roles.add(sr);
                    embed.addFields({name: role, value: 'Success', inline: true});
                }
                else{
                    embed.addFields({name: role, value: 'Failed', inline: true});
                }
            }
        }
        message.channel.send(embed);
    }
}