module.exports = {
    'name': 'hi',
    'description': 'Help command',
    'arguments': 'None',
    'permissions': 'None',
    async execute(message,args,client){
        message.channel.send('Hello!')
    }
}