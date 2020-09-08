module.exports = {
    'name': 'hi',
    'description': 'Help command',
    execute(message,args,client){
        message.channel.send('Hello!')
    }
}