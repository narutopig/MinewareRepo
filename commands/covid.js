const Discord = require('discord.js');
const fetch = require('node-fetch');
const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
module.exports = {
    'name': 'covid',
    'description': 'Gets COVID-19 statistics',
    execute: async function(message,args,client){
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
}