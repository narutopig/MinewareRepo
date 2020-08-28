const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
let rawdata = fs.readFileSync('./resources/config.json');
let config = JSON.parse(rawdata);
rawdata = fs.readFileSync('./package.json');
let pkg = JSON.parse(rawdata);
rawdata = fs.readFileSync('./resources/eco.json');
let eco = JSON.parse(rawdata);
const client = new Discord.Client();
const token = config.token;
const https = require('https');
const cmds = require('./cmds.js');

client.on('ready', function(){
    console.log('Logged in.')
    client.user.setActivity(`${config.prefix}help | v${pkg.version}`);
});

client.on('message', function(message){
    message.channel.send(client.channels.get("735598139100233740").id);
    if (!message.guild) return;
    if (message.author.bot){
        return;
    }
    if (message.member.roles.cache.some(role => role.name === 'Muted')){
        message.delete();
    }
    if (!message.content.startsWith(config.prefix)) return;
    var command = message.content.split(' ')[0].slice(1);
    var args = message.content.split(' ').slice(1);
    switch (command.toUpperCase()){
        case 'HELP':
            cmds.help(message);
            break;
        case 'HI':
            cmds.hello(message);
            break;
        case 'PURGE':
            cmds.purge(message,args);
            break;
        case 'STATS':
            cmds.stats(message);
            break;
        case 'COVID':
            cmds.covid(message);
            break;
        case 'BUG':
            bug(message,args);
    }
    console.log(`Command: ${command}\nArgs: ${args}`);
})
console.log(config);
console.log(pkg);
client.login(process.env.TOKEN);
