const invitelink = 'https://discord.com/api/oauth2/authorize?client_id=743529355107500033&permissions=8&scope=bot';
module.exports = {
    'name': 'invite',
    'description': 'Invite the bot',
    'arguments': 'None',
    'permissions': 'None',
    execute(message,args,client){
        message.channel.send(`Use this link to invite me to your server!\n${invitelink}`);
    }
}