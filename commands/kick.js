module.exports = {
    'name': 'kick',
    'description': 'Kick someone',
    'arguments': 'User (mention)',
    'permissions': 'KICK_MEMBERS',
    execute(message,args,client){
        if (!message.member.hasPermission('KICK_MEMBERS')){
            message.channel.send(`You need the ${this.permissions} permission(s) to use this command!`);
            return;
        }
        let member = message.mentions.users.first();
        if (!member){
            message.channel.send('That\'s not a valid user!');
            return;
        }
        if (member.hasPermission('ADMINISTRATOR')){
            message.channel.send(`You cannot ${this.name} administrators`);
            return;
        }
        let reason = '';
        if (args[1]){
            reason = args[1];
        }
        try{
            member.kick(reason);
        }
        catch{
            message.channel.send('I can\'t kick that user');
        }
    }
}