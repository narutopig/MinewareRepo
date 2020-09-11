module.exports = {
    'name': 'purge',
    'description': 'Deletes messages',
    'arguments': 'amt [int]',
    'permissions': 'MANAGE_MESSAGES',
    execute(message,args,client){
        if (!message.member.hasPermission('MANAGE_MESSAGES')){
            message.channel.send(`You need the \`MANAGE_MESSAGE\` permission to use this command`);
            return;
        }
        if (!args[0]) return;
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
            message.channel.send('Success!');
        }
        catch(err){
            console.log(err);
            message.channel.send('Something went wrong');
        }
    }
}