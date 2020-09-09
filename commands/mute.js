module.exports = {
    'name': 'mute',
    'description': 'Mute someone',
    'arguments': 'User (mention)',
    'permissions': 'MANAGE_ROLES',
    execute(message,args,client){
        if (!message.author.hasPermission('MANAGE_ROLES')){
            message.channel.send(`You need the ${this.permissions} permission(s) to use this command!`);
            return;
        }
        const person = message.mentions.users.first();
        if (person.roles.cache.some(role => role.name.toUpperCase() == 'MUTED')){
            message.channel.send('That user is already muted (or has a role named Muted');
            return;
        }
        if (person.hasPermission('ADMINISTRATOR')){
            message.channel.send(`You cannot ${this.name} administrators`);
            return;
        }
        let role = message.guild.roles.find(r => r.name.toUpperCase() == "Muted");
        person.roles.add(role);
        message.channel.send(`Muted ${person.toString()}`);
    }
}