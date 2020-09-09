module.exports = {
    'name': 'rr',
    'description': 'Change the reaction roles',
    'arguments': 'Channel, role, message (list of words)',
    'permissions': 'MANAGE_ROLES',
    execute(message,args,client){
        message.react('😀');
    }
}