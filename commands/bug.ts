const {MessageEmbed} = require('discord.js');
let bugCooldowns = new Map();
module.exports = {
    'name': 'bug',
    'description': 'Report a bug',
    'arguments': 'Words (list)',
    'permissions': 'None',
    execute(message,args,client){
        if (args.length == 0){
            message.channel.send('Please provide a message');
            return;
        }
        let time = Math.floor(Date.now() / 1000);
        let name = message.member.user.tag;
        if (bugCooldowns[name] == null){
            bugCooldowns[name] = time;
        }
        else{
            if (time - bugCooldowns[name] <= 30){
                message.channel.send(`You need to wait \`${30 - (time - bugCooldowns[name])}s\` before using this command again`);
                return;
            }
            bugCooldowns[name] = time;
        }
        let msg = args.join(' ');
        let bugEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Bug Report')
            .setAuthor(name)
            .addFields(
                {name: 'Message:', value: msg, inline: false}
            )
            .setFooter(`Sent by ${name}`,message.author.avatar_url);
        client.channels.cache.get("752559463474397357").send(bugEmbed);
    }
}