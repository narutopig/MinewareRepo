const { MessageEmbed } = require('discord.js');
module.exports = {
    'name': 'mute',
    'description': 'Mute someone',
    'arguments': 'User (mention)',
    'permissions': 'MANAGE_ROLES',
    async execute(message,args,client) {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(`You need the ${this.permissions} permission(s) to use this command!`);
        let target = message.mentions.members.first();
        if (!target) return message.channel.send(`Mention someone to ${this.name}`);
        if (target.user.id == message.author.id) return message.channel.send(`You can\'t ${this.name} yourself.`);
        if (!target.manageable) return message.channel.send(`I cannot ${this.name} that person`);
        if (target.hasPermission('ADMINISTRATOR')) return message.channel.send(`I cannot ${this.name} administrators`);
        if (target.roles.cache.some(role => role.name.toUpperCase() == 'MUTED')) return message.channel.send('That user is already muted (or has a role named Muted');
        let role = message.guild.roles.cache.find(r => r.name.toUpperCase() == "MUTED");
        if (!role) return message.channel.send('No mute role found, please create a role named \"Muted\"'); // maybe prompt user to create one?
        let reason = 'None';
        if (args[1]) reason = args[1];
        const embed = new MessageEmbed()
            .setTitle(`${this.name}`)
            .setDescription(`Muted ${target} (${target.displayName})`)
            .setColor("#ff0000")
            .addFields(
                {name: 'Reason', value: reason, inline: false}
            )
            .setFooter(`Muted by ${message.author.username}`);
            target.roles.add(role);
        return message.channel.send(embed);
    }
}