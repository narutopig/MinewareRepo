const path = require('path');
import { readFileSync } from "fs";
const random = (max:number) => Math.floor(Math.random() * Math.floor(max));

let advice1 = [];
let advice2 = [];
let advice3 = [];
let file = readFileSync(path.join(__dirname,'/resources/funnyadvice/fa1.txt')).toString();
advice1 = file.split("\n");
file = readFileSync(path.join(__dirname,'/resources/funnyadvice/fa2.txt')).toString();
advice2 = file.split("\n");
file = readFileSync(path.join(__dirname,'/resources/funnyadvice/fa3.txt')).toString();
advice3 = file.split("\n");

module.exports = {
    'name': 'funnyadvice',
    'description': 'random funny advice',
    'arguments': 'None',
    'permissions': 'None',
    async execute(message,args,client){
        let output = '';
        output += advice1[random(advice1.length)] + ' ';
        output += advice2[random(advice2.length)] + ' ';
        output += advice3[random(advice3.length)] + '.';
        message.reply(output);
    }
}

