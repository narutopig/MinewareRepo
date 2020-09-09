module.exports = {
    'name': 'mute',
    'description': 'Mute someone',
    'arguments': 'User (mention)',
    'permissions': 'MANAGE_ROLES',
    execute(message,args,client){
        if (!message.member.hasPermission('MANAGE_ROLES')){
            message.channel.send(`You need the ${this.permissions} permission(s) to use this command!`);
            return;
        }
        let target = message.mentions.members.first();
        if (!message.member.hasPermission('BAN_MEMBERS')){
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
        if (target.roles.cache.some(role => role.name.toUpperCase() == 'MUTED')){
            message.channel.send('That user is already muted (or has a role named Muted');
            return;
        }
        let role = message.guild.roles.cache.find(r => r.name.toUpperCase() == "MUTED");
        if (!role){
            message.channel.send('No mute role found, please create a role named \"Muted\"');
            return;
        }
        let reason = 'None';
        if (args[1]){
            reason = args[1];
        }
        target.roles.add(role);
        const embed = new Discord.MessageEmbed()
            .setTitle(`${this.name}`)
            .setDescription(`Muted ${target} (${target.displayName})`)
            .setColor("#ff0000")
            .addFields(
                {name: 'Reason', value: reason, inline: false}
            )
            .setFooter(`Muted by ${message.author.username}`);
        message.channel.send(embed);
    }
}