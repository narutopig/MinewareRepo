module.exports = {
    'name': 'announce',
    'description': 'Make an announcement!',
    'arguments': 'Words',
    'permissions': 'MANAGE_CHANNELS',
    execute(message,args,client){
        if (!message.member.hasPermission('MANAGE_CHANNELS')){
            message.channel.send(`You need the \`MANAGE_CHANNELS\` permission to use this command`);
            return;
        }
        let flag = args[0];
        let isFlag = false;
        if (flag.startsWith('-')){
            isFlag = true;
        }
        if (args.length < 2){
            message.channel.send('Please provide a message to send.');
            return;
        }
        let channel = message.mentions.channels.first();
        let msg = args.slice(1).join(' ');
        if (isFlag){
            switch (flag){
                case '-e':
                    msg = '@everyone\n' + msg;
                    break;
                case '-h':
                    msg = '@here\n' + msg;
                    break;
                default:
                    let rolename = flag.slice(1);
                    let role = message.guild.roles.cache.find("name",rolename);
                    if (role != undefined){
                        msg = `${role.toString()}\n${msg}`;
                    }
                    else{
                        message.channel.send('Role not found.');
                        return;
                    }
            }
            msg = args.slice(2).join(' ');
           
        }
        if (!channel){
            message.channel.send('Enter a valid channel please.');
            return;
        }
        channel.send(msg);
    }
}