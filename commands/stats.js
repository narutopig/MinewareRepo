const Discord = require('discord.js');
module.exports = {
    'name': 'stats',
    'description': 'Gets bot stats',
    execute(message,args,client){
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let uptime = `${days}d ${hours}h ${minutes}m`;
        if (minutes == 0){
            uptime = 'Less than a minute'
        }
        let ping = client.ws.ping.toString() + ' ms';
        let memberCount = message.guild.memberCount;
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Stats')
            .setAuthor(`${client.user.username}`)
            .addFields(
                {name: 'Members', value: memberCount, inline: false},
                {name: 'Ping', value: ping, inline: false}
            )
            .setTimestamp()
            .setFooter(`Uptime: ${uptime}`, client.user.avatar_url);

        message.channel.send(embed);
    }
}