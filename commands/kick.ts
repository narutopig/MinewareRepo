const { MessageEmbed } = require('discord.js');
module.exports = {
    'name': 'kick',
    'description': 'Kick someone',
    'arguments': 'User (mention)',
    'permissions': 'KICK_MEMBERS',
    execute(message,args,client){
        let target = message.mentions.members.first();
        if (!message.member.hasPermission('KICK_MEMBERS')){
            message.channel.send(`You need the ${this.permissions} permission(s) to use this command.`);
            return;
        }
        if (!target){
            message.channel.send(`Please mention someone to ${this.name}`);
            return;
        }
        if (target.user.id == message.author.id){
            message.channel.send(`You can\'t ${this.name} yourself.`);
            return;
        }
        if (!target.manageable){
            message.channel.send(`I cannot ${this.name} that person`);
            return;
        }
        if (target.hasPermission('ADMINISTRATOR')){
            message.channel.send(`I cannot ${this.name} administrators`);
            return;
        }
        let reason = 'None';
        if (args[1]){
            reason = args[1];
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(`${this.name}`)
            .setDescription(`Kicked ${target} (${target.displayName})`)
            .setColor("#ff0000")
            .addFields(
                {name: 'Reason', value: reason, inline: false}
            )
            .setFooter(`Banned by ${message.author.username}`);
        target.kick(reason = reason);
    }
}