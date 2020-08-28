const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
let rawdata = fs.readFileSync('./resources/config.json');
let config = JSON.parse(rawdata);
rawdata = fs.readFileSync('./resources/package.json');
let pkg = JSON.parse(rawdata);
rawdata = fs.readFileSync('./resources/eco.json');
let eco = JSON.parse(rawdata);
const client = new Discord.Client();
const token = config.token;
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
            {name: 'Ping', value: ping, inline: false},
            {name: 'Uptime', value: uptime, inline: false},
        )
        .addFields(
            {name: 'Members', value: memberCount, inline: false},
        )
        .setTimestamp()
        .setFooter('Brought to you by the Mineware Bot', config.avatar);

    message.channel.send(embed);
}
function covid(message){ // sends a discord.MessageEmbed
// update so that more countries stats can be seen
    let url = `https://api.covidtracking.com/v1/us/current.json`;
    https.get(url,(res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
            let data = json[0];
            const covidEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Covid-19 Stats')
                .setAuthor('Mineware Bot')
                .addFields(
                    {name: "Positive:", value: formatNumber(data.positive), inline: false},
                    {name: "Negative:", value: formatNumber(data.negative), inline: false}
                )
                .addFields(
                    {name: "Deaths:", value: formatNumber(data.death), inline: false},
                    {name: "Recovered", value: formatNumber(data.recovered),inline: false}
                )
                .setTimestamp()
                .setFooter(`Data from ${url}`, config.avatar);
            message.channel.send(covidEmbed);
        }
        catch (error) {
            console.error(error.message);
        };
    });
}).on("error", (error) => {
    console.error(error.message);
});
}
function bug(message,args){
    var bug = args.slice(1).join(" ");
    const user = client.users.cache.get('537498289600200724');
    user.send(bug);
}
client.on('ready', function(){
    console.log('Logged in.')
    client.user.setActivity(`${config.prefix}help | v${pkg.version}`);
});

client.on('message', function(message){
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
            covid(message);
            break;
        case 'BUG':
            bug(message,args);
    }
    console.log(`Command: ${command}\nArgs: ${args}`);
})
console.log(config);
console.log(pkg);
client.login(config.token);
