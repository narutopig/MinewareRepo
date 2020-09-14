module.exports = {
    'name': 'website',
    'description': 'Link to UtiliBot developer blog',
    'arguments': 'None',
    'permissions': 'None',
    async execute(message,args,client){
        message.channel.send('So you want to go to the blog huh? Here you go! https://utilibot.blogspot.com/')
    }
}
