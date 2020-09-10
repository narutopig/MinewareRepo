const express = require('express');
const server = express();
server.all('/', (req, res)=>{
    res.send('Utilibot is online')
})
module.exports = {
    keepAlive(params) {
        server.listen(3000, ()=>{console.log("Server is Ready!")});
    }
}