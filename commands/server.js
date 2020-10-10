module.exports = {
    'name': 'server',
    'description': 'Join the support server!',
    'arguments': 'None',
    'permissions': 'None',
    async execute(message,args,client){
        message.channel.send(`Join the Utilibot Support Server with this link!\n${'https://discord.gg/XM8pSBw'}`)
    }
}
