module.exports = {
    'name': 'rr',
    'description': 'Change the reaction roles',
    'arguments': 'Channel, role, message (list of words)',
    'permissions': 'MANAGE_ROLES',
    execute(message,args,client){
        if (!message.member.hasPermission('MANAGE_ROLES')){
            message.channel.send(`You need the ${this.permissions} permission(s) to use this command!`);
            return;
        }
        const channel = message.mentions.channels.first();
        const role = message.mentions.roles.first();
        const words = args.slice(2);
        if (!words){
            message.channel.send('Please provide a message.');
            return;
        }
        channel.send(words.join(' '))
            .then(message => console.log(message.id));
    }
}