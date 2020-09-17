const dotenv = require('dotenv');
dotenv.config();
const { MessageEmbed } = require('discord.js');
const snoowrap = require('snoowrap');
const { type } = require('os');

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));
const getPosts = async (subreddit, posts) => {
    const r = new snoowrap({
        userAgent: process.env.ACCESSTOKEN,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.REFRESHTOKEN
    });
    if (posts == undefined) posts = 10;
    if (subreddit.startsWith('/r')) subreddit = subreddit.slice(2);
    const sub = await r.getSubreddit(subreddit);
    const topPosts = await sub.getTop({time: 'week', limit: 10});
    let data = [];
    let yes = true;
    topPosts.forEach((post) => {
        data.push({
                link: post.permalink,
                title: post.title,
                score: post.score,
                comments: post.comments,
                thumbnail: post.thumbnail,
            });
    });
    return data;
};

module.exports = {
    'name': 'reddit',
    'description': 'Gets a random post from reddit',
    'arguments': 'subreddit (does\'t need /r), posts (optional)',
    'permissions': 'None',
    execute(message,args,client) {
        const subreddit = args[0];
        let postNum;
        if (args[1]) postNum = parseInt(args[1]);
        if (postNum == NaN) {
            postNum = 10;
        }
        const posts = getPosts(subreddit,postNum)
            .then(function (posts){
                const post = posts[getRandomInt(posts.length)];
                const embed = new MessageEmbed()
                    .setTitle(`${post.title}`)
                    .setURL(`https://www.reddit.com${post.link}`)
                    .setImage(post.thumbnail,1000,1000)
                    .setColor('#ff00ff')
                    .setFooter(`⬆️${post.score}`);
                return message.channel.send(embed);
            })
            .catch(function(err){
                console.log(err);
                return message.channel.send('Something went wrong');
            })
    }
}