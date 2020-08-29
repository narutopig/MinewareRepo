require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
let rawdata = fs.readFileSync('./package.json');
rawdata = fs.readFileSync('./package.json');
let pkg = JSON.parse(rawdata);
const client = new Discord.Client();
const token = process.env.token;
const prefix = process.env.prefix;
const https = require('https');
const cmds = require('./cmds.js');

client.on('ready', function(){
    console.log('Logged in.')
    client.user.setActivity(`${prefix}help | v${pkg.version}`);
});

client.on('message', function(message){
    if (!message.guild) return;
    if (message.author.bot){
        return;
    }
    if (message.member.roles.cache.some(role => role.name === 'Muted')){
        message.delete();
    }
    if (!message.content.startsWith(prefix)) return;
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
console.log(pkg);
client.login(token);
