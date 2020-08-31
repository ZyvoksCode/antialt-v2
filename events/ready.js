const { prefix } = require('../config.json');
const Discord = require('discord.js');
const fs = require("fs");
const wait = require('util').promisify(setTimeout);

module.exports = (client) => {

// when bot is ready, bot join this voice channel.
// set bot status, when ping is < 150, < 300, or highest
setInterval(function(){ 
    if (client.ws.ping <= 150) {
        client.user.setPresence({
            status: "online"
        });
    } else if (client.ws.ping <= 300) {
        client.user.setPresence({
            status: "idle"
        });
    } else {
        client.user.setPresence({
            status: "dnd"
        });
    }
}, 5000);

require("../dashboard.js")(client);  

// Bot Activity with stats

setInterval(function(){ 
    client.user.setActivity(`${prefix}help | AntiAlt.xyz`, { type: 'LISTENING' });
    setTimeout(function(){ 
        client.user.setActivity(`👀 Ping: ${Math.floor(client.ws.ping).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}ms | Servers: ${client.guilds.cache.size.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")} | Users: ${eval(client.guilds.cache.map(g => g.members.cache.filter(m => !m.user.bot).size).join(' + ')).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")}`, { type: 'WATCHING' });
    }, 10000);
}, 20000);

wait(1500);
// message to console
console.log(`-----------------------------------------------\n-  Bot is ready! © AntiAlt & DomeQ.dev 2020\n-  Logged in as ${client.user.tag}\n-----------------------------------------------`);
};