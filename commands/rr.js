const fs = require('fs');
const rrjson = fs.readFile('./resources/rr.json');
let rrdata = JSON.parse(rrjson);
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
        channel.send(words.jin(' '))
            .then(message => {o
                rrdata[message.guild.id.toString()]['messages'].push(message.id.toString());
                rrdata[message.guild.id.toString()]['roles'].push(role.id.toString());
            });
    }
}