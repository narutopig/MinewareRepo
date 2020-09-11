const path = require('path');
const { MessageEmbed } = require('discord.js');
import {readFileSync, writeFileSync } from "fs";
const srjson = readFileSync(path.join(__dirname,'./resources/selfrole.json'));
let sr = JSON.parse(srjson);
let roleList = [];
module.exports = {
    'name': 'selfrole',
    'description': 'Give yourself a role!',
    'arguments': 'Role(s) (not mentions)',
    'permissions': 'None',
    execute(message,args,client){
        console.log(roleList);
        switch (args[0].toLowerCase()){
            case 'add':
                if (!message.member.hasPermission("ADMINISTRATOR")){
                    message.channel.send("You don\'t that the necessary permissions");
                    return;
                }
                roleList.push(args[1]);
                message.channel.send('sadfjslfdjlkfflkjdlfkflkd');
                break;
            case 'self':
                const role = message.guild.roles.cache.find(r => r.name == args[1]);
                message.member.roles.add(role);
                message.channel.send('sdlkfjsklfkjd');
                break;
        }
    }
}