require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
let rawdata = fs.readFileSync('./package.json');
let pkg = JSON.parse(rawdata);
const client = new Discord.Client();
const token = process.env.token;
const prefix = process.env.prefix;
let bugCooldowns = new Map();
let announceCooldowns = new Map();
let purgeCooldowns = new Map();
let invitelink = 'https://discord.com/api/oauth2/authorize?client_id=743529355107500033&permissions=8&scope=bot';
rawdata = fs.readFileSync('./resources/config.json');
let config = JSON.parse(rawdata);

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function help(message,args){
    let embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Help')
        .setAuthor(`${client.user.username}`)
        .setTimestamp()
        .setFooter(`Type ${prefix}bug to report any bugs!`, client.user.avatar_url);
    if (args === undefined || args.length == 0){
        embed.addFields(
            {name: `How to use the command`, value: `Type ${prefix}help [section] to get the commands in that section. For example, ${prefix}help misc`, inline: false},
            {name: `Text`, value: `Text commands (no paramaters)`, inline: false},
            {name: `Moderation`, value: `Moderation commands (needs special permissions)`, inline: false},
            {name: `Bugs`, value: `Report bugs`, inline: false}
        );
    }
    else{
        switch (args[0].toUpperCase()){
            case 'MODERATION':
                embed.addFields(
                    {name: `purge`, value: `Deletes messages`, inline: false},
                    {name: `announce`, value: `Make an announcement`, inline: false}
                );
                break;
            case 'TEXT':
                embed.addFields(
                    {name: `hi`, value: `Hello!`, inline: false},
                    {name: `stats`, value: `Provides some bot stats`, inline: false},
                    {name: `covid`, value: `Gets covid stats for a US state or US`, inline: false}
                )
                break;
            case 'BUGS':
                embed.addFields(
                    {name: `bugs`, value: `Report a bug!`, inline: false}
                )
                break;
            case 'PURGE':
                embed.addFields(
                    {name: `Arguments`, value: `Arguments: amt (int)`, inline: false},
                    {name: `Required Permissions`, value: `None`, inilne: false}
                )
                break;
            case 'ANNOUNCE':
                embed.addFields(
                    {name: `announce`, value: `Arguments: Channel, args (words of the message)`, inline: false},
                    {name: `Required Permissions`, value: `\`MANAGE_CHANNELS\``, inline: false}
                )
                break;
            case 'HI':
                embed.addFields(
                    {name: `hi`, value: `Arguments: None`, inline: false},
                    {name: `Required Permissions`, value: `None`, inline: false}
                )
                break;
            case 'STATS':
                embed.addFields(
                    {name: `stats`, value: `Arguments: None`, inline: false},
                    {name: `Required Permissions`, value: `None`, inline: false}
                )
                break;
            case 'COVID':
                embed.addFields(
                    {name: `covid`, value: `Arguments: statecode (optional)`, inline: false},
                    {name: `Required Permissions`, value: `None`, inline: false}
                )
                break;
            case 'BUG':
                embed.addFields(
                    {name: `bug`, value: `Arguments: args (words)`, inline: false},
                    {name: `Required Permissions`, value: `None`, inline: false}
                )
                break;
        }
    }
    message.channel.send(embed);
}
function hello(message){
    message.channel.send('Hello!');
}
function purge(message,args){
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
        .setAuthor(`${client.user.username}`)
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
    let things = []; // things to get in api
    let isState = false;
    if (args.length > 0 && args[0].length == 2){
        url = `https://api.covidtracking.com/v1/states/${args[0].toLowerCase()}/current.json`;
        isState = true;
    }
    if (isState){
        things = args.slice(1);
    }
    else if (!isState){
        things = args;
    }
    try{
        let json = await fetch(url);
        let data = await json.json();
        if (url.startsWith('https://api.covidtracking.com/v1/us/')){
            data = data[0];
        }
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Covid-19 Stats')
            .setAuthor(`${client.user.username}`)
            .setTimestamp()
            .setFooter(`Data from ${url}`, client.user.avatar_url);
        if (things.length == 0){
            embed.addFields(
                {name: 'Positive:', value: formatNumber(data.positive), inline: false},
                {name: 'Negative:', value: formatNumber(data.negative), inline: false},
                {name: 'Deaths:', value: formatNumber(data.death), inline: false}
            );
        }
        else{
            for (let i = 0; i < things.length; i++){
                let query = things[i];
                let upQuery = query.charAt(0).toUpperCase() + query.slice(1); // uppercase query
                let v = data[query];
                if (v == undefined){
                    v = 'N/A';
                }
                else{
                    v = formatNumber(v);
                }
                embed.addFields(
                    {name: `${upQuery}:`, value: v, inline: false}
                );
            }
        }
        message.channel.send(embed);
    }
    catch(err){
        message.channel.send('Invalid url, try using a statecode (e.g AK for Alaska, CA for California)');
        console.log(err);
    }
}

function bug(message,args){
    if (args.length == 0){
        message.channel.send('Please provide a message');
        return;
    }
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
    let msg = args.join(' ');
    let bugEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Bug Report')
        .setAuthor(name)
        .addFields(
            {name: 'Message:', value: msg, inline: false}
        )
        .setFooter(`Sent by ${name}`,message.author.avatar_url);
    client.channels.cache.get("752559463474397357").send(bugEmbed);
}

function announce(message,args){
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

function invite(message){
    message.channel.send(`Use this link to invite me to your server!\n${invitelink}`);
}

async function aqi(message,args){
    let url = `http://api.waqi.info/feed/${args[0].toLowerCase()}/?token=demo`;
    try{
        let json = await fetch(url);
        let data = await json.json();
        let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Bug Report')
            .setAuthor(client.user.name)
            .addFields(
                {name: 'Status', value: data['status'], inline: false},
                {name: 'AQI', value: data['data']['aqi'], inline: false}
            )
            .setFooter(`Sent by ${client.user.name}`,client.user.avatar_url);
    }
    catch{
        message.channel.send('Invalid city :(');
    }
}
client.on('ready', function(){
    let index = 0;
    const activies = [
        `${client.users.cache.size} users`,
        `${client.guilds.cache.size} servers`,
        `v${pkg.version}`
    ];
    console.log(`Logged in as ${client.user.username}`);
    setInterval(() => {
        client.user.setActivity(`${prefix}help | ${activies[index]}`);
        index = (index + 1) % activies.length;
    }, 20000);
});

client.on('memberjoin', function(member) {
    let hellochannel = member.guild.channels.find(channel => channel.name === "general");
    hellochannel.send(`Welcome to the server ${member.displayName}, hope you have a great time!`)
})

client.on('message', function(message){
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.member.roles.cache.some(role => role.name == 'Muted')) message.delete();
    if (!message.content.startsWith(prefix)) return;

    let string = message.content.replace(/ +/g, ' ');
    let temp = string.split(' ');
    let command = temp[0].slice(1);
    let args = temp.slice(1);
    switch (command.toUpperCase()){
        case 'HELP':
            help(message,args);
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

        case 'INVITE':
            invite(message);
        
        case 'AQI':
            aqi(message,args);
    }
    console.log(`Author: ${message.author.toString()} Command: ${command} Args: ${args}`);
})

console.log(pkg);
client.login(token);
