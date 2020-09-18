const dotenv = require('dotenv');
dotenv.config();
const { MessageEmbed, MessageAttachment } = require('discord.js');
const snoowrap = require('snoowrap');
const Jimp = require('jimp');
const path = require('path');

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
    topPosts.forEach((post) => {
        data.push({
                link: post.permalink,
                title: post.title,
                score: post.score,
                comments: post.num_comments,
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
    async execute(message,args,client) {
        const subreddit = args[0];
        let postNum;
        if (args[1]) postNum = parseInt(args[1]);
        if (postNum == NaN) {
            postNum = 10;
        }
        const posts = await getPosts(subreddit,postNum)
            .then(async function (posts){
                const post = posts[getRandomInt(posts.length)];
                const image = await Jimp.read(post.thumbnail);
                image.resize(300,Jimp.AUTO);
                image.write(path.join(__dirname,'resources/temp.jpg'));
                const embed = new MessageEmbed()
                    .setTitle(`${post.title}`)
                    .setURL(`https://www.reddit.com${post.link}`)
                    .setColor('#ff00ff')
                    .attachFiles([path.join(__dirname,'resources/temp.jpg')])
                    .setImage('attachment://temp.jpg')
                    .setFooter(`⬆️${post.score} 💬${post.comments}`);
                return message.channel.send(embed);
            })
            .catch(function(err){
                console.log(err);
                return message.channel.send('Something went wrong');
            });
    }
}