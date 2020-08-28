const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
let rawdata = fs.readFileSync('./resources/config.json');
let config = JSON.parse(rawdata);
rawdata = fs.readFileSync('./resources/package.json');
let pkg = JSON.parse(rawdata);
rawdata = fs.readFileSync('./resources/eco.json');
let eco = JSON.parse(rawdata);
const https = require('https');
const client = new Discord.Client();

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
    /*
    var bug = args.slice(1).join(" ");
    const user = client.users.cache.get('537498289600200724');
    user.send(bug);
    */
    message.channel.send('This command is being worked on right now!');
}

module.exports = {hello,help,purge,stats,covid,bug};
