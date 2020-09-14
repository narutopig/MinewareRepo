require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const token = process.env.TOKEN;
const prefix = '$';
// const dblToken = process.env.DBLTOKEN;
// const DBL = require("dblapi.js");
// const dbl = new DBL(dblToken, { webhookPort: 5000, webhookAuth: 'https://utilibotjs.herokuapp.com/' });
let rawdata = fs.readFileSync('./package.json');
let pkg = JSON.parse(rawdata);
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
const formatNumber = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/*
dbl.webhook.on('vote', vote => {
    console.log(`User with ID ${vote.user} just voted!`);
});
*/

client.on('ready', async () => {
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

client.on('memberjoin', async (member) => {
    let hellochannel = member.guild.channels.find(channel => channel.name === "general");
    hellochannel.send(`Welcome to the server ${member.displayName}, hope you have a great time!`)
})

client.on('message', async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.member.roles.cache.some(role => role.name.toUpperCase() == 'MUTED')) message.delete();
    if (!message.content.startsWith(prefix)) return;
    let string = message.content.replace(/ +/g, ' ');
    let temp = string.split(' ');
    let command = temp[0].slice(prefix.length);
    let args = temp.slice(1);
    try {
        client.commands.get(command.toLowerCase()).execute(message, args, client);
    } catch(err) {
        console.log(err);
    } finally {
        console.log(`[${message.guild.name}] ${message.author.username}: ${message.content}`);
    }
});
client.login(token);