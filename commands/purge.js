let purgeCooldowns = new Map();
module.exports = {
    'name': 'purge',
    'description': 'Deletes messages',
    execute(message,args,client){
        if (!message.member.hasPermission('MANAGE_MESSAGES')){
            message.channel.send(`You need the \`MANAGE_MESSAGE\` permission to use this command`);
            return;
        }
        if (!args[0]) return;
        let time = Math.floor(Date.now() / 1000);
        let name = message.member.user.tag;
        if (purgeCooldowns[name] == null){
            purgeCooldowns[name] = time;
        }
        else{
            if (time - purgeCooldowns[name] <= 60){
                message.channel.send(`You need to wait \`${60 - (time - purgeCooldowns[name])}s\` before using this command again`);
                return;
            }
            purgeCooldowns[name] = time;
        }
        try{
            let amt = parseInt(args[0]);
            if (amt < 1){
                message.channel.send('Value must be at least 1');
            }
            let val = Math.min(100,amt);
            let temp = amt;
            while (temp > 0){
                temp = temp - val;
                message.channel.bulkDelete(val);
                val = Math.min(100,amt);
            }
            console.log(val,temp);
            message.channel.send('Success!');
        }
        catch(err){
            console.log(err);
            message.channel.send('Something went wrong');
        }
    }
}