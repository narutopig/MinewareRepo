const https = require('https');
const Discord = require("discord.js");
const fs = require('fs');
let rawdata = fs.readFileSync('./resources/config.json');
let config = JSON.parse(rawdata);
function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatTime(){
    var d = new Date();
    var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var time = "[" + time + "]:";
    return time;
}
function getCovidStats(message){ // sends a discoord.MessageEmbed
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
        } catch (error) {
            console.error(error.message);
        };
    });

    }).on("error", (error) => {
        console.error(error.message);
    });
}
exports.formatTime = formatTime;
exports.getCovidStats = getCovidStats;
