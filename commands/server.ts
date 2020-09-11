module.exports = {
    'name': 'server',
    'description': 'Join the support server!',
    'arguments': 'None',
    'permissions': 'None',
    execute(message,args,client){
        message.channel.send(`Join the Support Server with this link!\n${'https://discord.gg/J5VHMyz'}`)
    }
}