module.exports = {
    'name': 'eval',
    'description': 'Runs JS/TS code (only for owner :D)',
    'arguments': 'expression(s) (js stuff)',
    'permissions': 'Own the bot',
    execute(message,args,client) {
        if (!(message.author.id == '537498289600200724')) return;
        try {
            eval(args.join(' '));
        } catch (err) {
            message.channel.send(err);
        }
    }
}