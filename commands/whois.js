const moment = require('moment');
const ms = require('ms');
const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'whois',
    description: 'Show when user create account.',
    usage: '[ @mention | id ]',
	execute(client, message, args) {
        let infoMem;
        if (!args || args.length < 1) {
            infoMem = message.member;
        } else {
            infoMem = message.mentions.members.first() || message.guild.members.cache.get(args.join(' '));
        }
        (async () => {
            if (!infoMem) {
                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setAuthor("This user does not exists!", config.no, "https://antialt.xyz/")
                    .setFooter(`Invoked by ${message.author.tag}.`)
                    );
            }
        
            if (message.guild.member(infoMem)) {
                const ts = moment(infoMem.user.createdAt);
                const ts2 = moment(infoMem.joinedAt);
                const ca = ts.format("MMM Do, YYYY");
                const ja = ts2.format("MMM Do, YYYY");
                const ago = ms(Date.now()-client.users.cache.get(infoMem.id).createdTimestamp, {long:true});
                const embed = new Discord.MessageEmbed()
                    .setColor(message.member.displayHexColor)
                    .setThumbnail(infoMem.user.displayAvatarURL({ dynamic: true }))
                    .setAuthor(`${infoMem.user.tag}`, infoMem.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                    .addField('**Joined Server**', `${ja}`, true)
                    .addField('**Account Created**', `${ca}\n(${ago} ago)`, true)
                    .setFooter(`ID: ${infoMem.id}`);
                message.channel.send(embed);
            } else {
                return message.channel.send(
                    new MessageEmbed()
                    .setColor("#ff0000")
                    .setAuthor("This user does not exists!", config.no, "https://antialt.xyz/")
                    .setFooter(`Invoked by ${message.author.tag}.`)
                    );
            }
        })();
    }};