module.exports = {
    'name': 'help',
    'description': 'Help command',
    execute(message,args,client){
        message.channel.send('Hello!')
    }
}