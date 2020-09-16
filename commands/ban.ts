import { MessageEmbed } from "discord.js";
module.exports = {
    'name': 'ban',
    'description': 'Ban someone',
    'arguments': 'User (mention)',
    'permissions': 'BAN_MEMBERS',
    async execute(message,args,client) {
        let target = message.mentions.members.first();
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(`You need the ${this.permissions} permission(s) to use this command.`);
        if (!target) return message.channel.send(`Please mention someone to ${this.name}`);
        if (target.user.id == message.author.id) return message.channel.send(`You can\'t ${this.name} yourself.`);
        if (!target.manageable) return message.channel.send(`I cannot ${this.name} that person`);
        if (target.hasPermission('ADMINISTRATOR')) return message.channel.send(`I cannot ${this.name} administrators`);
        let reason = 'None';
        if (args[1]) reason = args[1];
        const embed = new MessageEmbed()
            .setTitle(`${this.name}`)
            .setDescription(`Banned ${target} (${target.displayName})`)
            .setColor("#ff0000")
            .addFields(
                {name: 'Reason', value: reason, inline: false}
            )
            .setFooter(`Banned by ${message.author.username}`);
        target.ban(reason = reason);
        return message.channel.send(embed);
    }
}