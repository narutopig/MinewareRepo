module.exports = {
    'name': 'ban',
    'description': 'Ban someone',
    'arguments': 'User (mention)',
    'permissions': 'BAN_MEMBERS',
    execute(message,args,client){
        if (!message.member.hasPermission('BAN_MEMBERS')){
            message.channel.send(`You need the ${this.permissions} permission(s) to use this command!`);
            return;
        }
        let member = message.mentions.users.first();
        if (!member){
            message.channel.send('That\'s not a valid user!');
            return;
        }
        if (member.permissions.has('ADMINISTRATOR')){
            message.channel.send(`You cannot ${this.name} administrators`);
            return;
        }
        let reason = '';
        if (args[1]){
            reason = args[1];
        }
        try{
            member.ban(reason);
        }
        catch{
            message.channel.send('I can\'t ban that user');
        }
    }
}