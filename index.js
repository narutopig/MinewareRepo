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
let bugCooldowns = new Map();

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function help(message){
    let embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Help')
        .setAuthor('Mineware Bot')
        .addFields(
            {name: 'help', value: 'Brings up this message', inline: false},
            {name: 'hi', value: 'Says hello', inline: false},
            {name: 'purge', value: 'Deletes some amount of messages. Requires the \`MANAGE_MESSAGES\` permission', inline: false},
            {name: 'stats', value: 'Brings up stats like the server members, uptime, etc', inline: false},
            {name: 'covid', value: 'Gets the Covid-19 stats for the US or a state when given a statecode', inline: false},
            {name: 'bug', value: 'Submit a bug', inline: false}
        )
        .setTimestamp()
        .setFooter(`Type ${prefix}bug to report any bugs!`, client.user.avatar_url);
    message.channel.send(embed);
}
function hello(message){
    message.channel.send('Hello!');
}
function purge(message,args){
    if (message.member.hasPermission('MANAGE_MESSAGES')){
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
    else{
        message.channel.send('You can\' do that!');
    }
}
function stats(message){
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let uptime = `${days}d ${hours}h ${minutes}m`;
    if (minutes == 0){
        uptime = 'Less than a minute'
    }
    let ping = client.ws.ping.toString() + ' ms';
    let memberCount = message.guild.memberCount;
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Stats')
        .setAuthor('Mineware Bot')
        .addFields(
            {name: 'Members', value: memberCount, inline: false},
            {name: 'Ping', value: ping, inline: false}
        )
        .setTimestamp()
        .setFooter(`Uptime: ${uptime}`, client.user.avatar_url);

    message.channel.send(embed);
}
async function covid(message, args){ // sends a discord.MessageEmbed
    let url = `https://api.covidtracking.com/v1/us/current.json`;
    if (args.length > 0) {
        url = `https://api.covidtracking.com/v1/states/${args[0].toLowerCase()}/current.json`;
    }
    try{
        let json = await fetch(url);
        let data = await json.json();
        if (url.startsWith('https://api.covidtracking.com/v1/us/')){
            data = data[0];
        }
        let covidEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Covid-19 Stats')
            .setAuthor('Mineware Bot')
            .addFields(
                {name: 'Positive:', value: formatNumber(data.positive), inline: false},
                {name: 'Negative:', value: formatNumber(data.negative), inline: false}
            )
            .addFields(
                {name: 'Deaths:', value: formatNumber(data.death), inline: false},
            )
            .setTimestamp()
            .setFooter(`Data from ${url}`, client.user.avatar_url);
        message.channel.send(covidEmbed);
    }
    catch(err){
        message.channel.send('Invalid url, try using a statecode (e.g AK for Alaska, CA for California)');
        console.log(err);
    }
}

function bug(message,args){
    let time = Math.floor(Date.now() / 1000);
    let name = message.member.user.tag;
    if (bugCooldowns[name] == null){
        bugCooldowns[name] = time;
    }
    else{
        if (time - bugCooldowns[name] <= 30){
            message.channel.send(`You need to wait \`${30 - (time - bugCooldowns[name])}s\` before using this command again`);
            return;
        }
        bugCooldowns[name] = time;
    }
    console.log(bugCooldowns[name]);
    let msg = args.join(' ');
    let bugEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Bug Report')
        .setAuthor(name)
        .addFields(
            {name: 'Message:', value: msg, inline: false}
        )
        .setFooter(`Sent by ${name}`,message.author.avatar_url);
    client.users.cache.get('537498289600200724').send(bugEmbed);
}

function announce(message,args){
    if (!message.member.hasPermission('MANAGE_CHANNELS')) return;
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

function rules(message){
    let author = message.author;
    var data = fs.readFileSync('rules.txt', 'utf8');
    author.send(data);
}
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
    let command = message.content.split(' ')[0].slice(1);
    let args = message.content.split(' ').slice(1);
    switch (command.toUpperCase()){
        case 'HELP':
            help(message);
            break;
        case 'HI':
            hello(message);
            break;
        case 'PURGE':
            purge(message,args);
            break;
        case 'STATS':
            stats(message);
            break;
        case 'COVID':
            covid(message,args);
            break;
        case 'BUG':
            bug(message,args);
        case 'ANNOUNCE':
            announce(message,args);
            break;
        case 'RULES':
            rules(message);
            break;
    }
    console.log(`Author: ${message.author.toString()} Command: ${message.content}`);
})
console.log(pkg);
client.login(token);
