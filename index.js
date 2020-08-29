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

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function help(message){
    message.channel.send('No help for you nerd');
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
    var uptime = `${days}d ${hours}h ${minutes}m`;
    if (minutes == 0){
        uptime = "Less than a minute"
    }
    var ping = client.ws.ping.toString() + " ms";
    var memberCount = message.guild.memberCount;
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Stats')
        .setAuthor('Mineware Bot')
        .addFields(
            {name: 'Members', value: memberCount, inline: false},
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
                {name: "Positive:", value: formatNumber(data.positive), inline: false},
                {name: "Negative:", value: formatNumber(data.negative), inline: false}
            )
            .addFields(
                {name: "Deaths:", value: formatNumber(data.death), inline: false},
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
    let name = message.member.user.tag;
    let msg = args.join(' ');
    let bugEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Bug Report')
        .setAuthor(name)
        .addFields(
            {name: "", value: msg, inline = false}
        )
        .setFooter(`Sent by ${name}`,message.author.avatar_url);
    client.users.cache.get('537498289600200724').send(embed = bugEmbed);
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
    var command = message.content.split(' ')[0].slice(1);
    var args = message.content.split(' ').slice(1);
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
    }
    console.log(`Command: ${command}\nArgs: ${args}`);
})
console.log(pkg);
client.login(token);
