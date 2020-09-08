module.exports = {
    'name': 'announce',
    'description': 'Make an announcement!',
    execute(message,args,client){
        if (!message.member.hasPermission('MANAGE_CHANNELS')){
            message.channel.send(`You need the \`MANAGE_CHANNELS\` permission to use this command`);
            return;
        }
        let time = Math.floor(Date.now() / 1000);
        let name = message.member.user.tag;
        if (announceCooldowns[name] == null){
            announceCooldowns[name] = time;
        }
        else{
            if (time - announceCooldowns[name] <= 60){
                message.channel.send(`You need to wait \`${60 - (time - announceCooldowns[name])}s\` before using this command again`);
                return;
            }
            announceCooldowns[name] = time;
        }
        if (args.length < 2){
            message.channel.send('Please provide a message to send.');
            return;
        }
        let channel = message.mentions.channels.first();
        let msg = args.slice(1).join(' ');
        if (args[1].startsWith('-P')){
            msg = args.slice(2).join(' ');
            msg = '@everyone\n' + msg;
        }
        if (!channel){
            message.channel.send('Enter a valid channel please.');
            return;
        }
        channel.send(msg);
    }
}