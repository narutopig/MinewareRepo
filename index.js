require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
let rawdata = fs.readFileSync('./package.json');
const server = require('./server');
let pkg = JSON.parse(rawdata);
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

client.on('ready', function(){
    let index = 1;
    const activies = [
        `${client.users.cache.size} users`,
        `${client.guilds.cache.size} servers`,
        `v${pkg.version}`
    ];
    console.log(`Logged in as ${client.user.username} on v${pkg.version}`);
    client.user.setActivity(`${prefix}help | ${activies[0]}`);
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
    if (message.member.roles.cache.some(role => role.name.toUpperCase() == 'MUTED')) message.delete();
    if (!message.content.startsWith(prefix)) return;
    let string = message.content.replace(/ +/g, ' ');
    let temp = string.split(' ');
    let command = temp[0].slice(1);
    let args = temp.slice(1);
    try{
        client.commands.get(command.toLowerCase()).execute(message,args,client);
    }
    catch(err){
        console.log(err);
    }
    finally{
        console.log(`Author: ${message.author.toString()} Command: ${command} Args: ${args}`);
    }
})

server.keepAlive();
client.login(token);