require('dotenv/config')();
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
const commandFiles = fs
  .readdirSync('./commands/')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/*
dbl.webhook.on('vote', vote => {
    console.log(`User with ID ${vote.user} just voted!`);
});
*/

client.on('ready', async () => {
  let index = 1;
  console.log(`Logged in as ${client.user.username} on v${pkg.version}`);
  client.user.setActivity(`${prefix}help | ${client.users.cache.size} users`);
  setInterval(() => {
    let activity;
    switch (index) {
      case 0:
        activity = `${client.users.cache.size} users`;
        break;
      case 1:
        activity = `${client.guilds.cache.size} servers`;
        break;
      case 2:
        activity = `v${pkg.version}`;
        break;
    }
    client.user.setActivity(`${prefix}help | ${activity}`);
    index = (index + 1) % 3;
  }, 20000);
});

client.on('message', async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (
    message.member.roles.cache.some(
      (role) => role.name.toUpperCase() == 'MUTED'
    )
  )
    message.delete();
  if (!message.content.startsWith(prefix)) return;
  let string = message.content.replace(/ +/g, ' ');
  let temp = string.split(' ');
  let command = temp[0].slice(prefix.length);
  let args = temp.slice(1);
  try {
    await client.commands
      .get(command.toLowerCase())
      .execute(message, args, client);
  } catch (err) {
    console.log(err);
  } finally {
    console.log(
      `[${message.guild.name}] ${message.author.username}: ${message.content}`
    );
  }
});
client.login(token);
