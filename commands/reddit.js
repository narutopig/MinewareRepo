const dotenv = require('dotenv');
dotenv.config();
const { MessageEmbed } = require('discord.js');
const snoowrap = require('snoowrap');

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
const getPosts = async (subreddit, posts) => {
    const r = new snoowrap({
        userAgent: process.env.ACCESSTOKEN,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.REFRESHTOKEN
    });
    posts = parseInt(posts);
    if (posts == undefined || posts == NaN) posts = 10;
    if (subreddit.startsWith('/r')) subreddit = subreddit.slice(2);
    const sub = await r.getSubreddit(subreddit);
    const topPosts = await sub.getTop({time: 'week', limit: posts});
    let data = [];
    topPosts.forEach((post) => {
        data.push(post);
    });
    return data;
};

module.exports = {
    'name': 'reddit',
    'description': 'Gets a random post from reddit',
    'arguments': 'subreddit (does\'t need /r), posts (optional)',
    'permissions': 'None',
    async execute(message,args,client) {
        const subreddit = args[0];
        let postNum;
        if (args[1]) postNum = parseInt(args[1]);
        if (postNum == NaN) {
            postNum = 50;
        }
        const posts = await getPosts(subreddit,postNum)
            .then(async function (posts){
                const post = posts[getRandomInt(posts.length)];
                const embed = new MessageEmbed()
                    .setTitle(`${post.title}`)
                    .setURL(`https://www.reddit.com${post.permalink}`)
                    .setColor('#ff00ff')
                    .setImage(post.url)
                    .setFooter(`⬆️${post.score} 💬${post.num_comments}`);
                return message.channel.send(embed);
            })
            .catch(function(err){
                console.log(err);
                return message.channel.send('Something went wrong');
            });
    }
}