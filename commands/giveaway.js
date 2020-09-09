const Discord = require("discord.js")

module.export = {
    'name': 'announce',
    'description': 'Make an announcement!',
    'arguments': 'Words',
    'permissions': 'MANAGE_CHANNELS',
    execute(message,args,client){    // args[0]: time, args[1:]: item
      if(!message.member.hasPermission('MANAGE_CHANNELS')){
        message.channel.send('You need the \`MANAGE_CHANNELS`\ permission to use this command!');
        return;
      }
      
      function makeGiveaway(time, item){
        cont giveawayEmbed = 
      }
      
      time = parseInt(args[0])
      
      
    }
}
