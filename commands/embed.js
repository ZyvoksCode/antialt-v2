const { MessageEmbed } = require('discord.js')
const config = require('../config.json');

module.exports = {
	name: 'embed',
    description: 'Send embed message as bot!',
    usage: '< text > [ \'--everyone\' | \'--here\' ]',
    permissions: 'Manage Messages',
    example: ["Hello everyone! Welcome to our server! --everyone", "Check out new giveaway! --here", "Activity Check without ping?"],
	execute(client, message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(
            new MessageEmbed()
            .setColor("#ff0000")
            .setAuthor("You don't have permissions to use this command!", config.no, "https://antialt.xyz/")
            .setDescription(`Permissions: ${module.exports.permissions}`)
            .setFooter(`Invoked by ${message.author.tag}.`)
            );
        if(!args[0]) return message.channel.send(
            new MessageEmbed()
            .setColor("#ff0000")
            .setAuthor("Invalid usage!", config.no, "https://antialt.xyz/")
            .setDescription(`Usage: \`${config.prefix}${module.exports.name} ${module.exports.usage}\``)
            .setFooter(`Invoked by ${message.author.tag}.`)
            );
        if(args.join(' ').includes("--everyone")) {
            var ping = "@everyone";
        } else if(args.join(' ').includes("--here")) {
            var ping = "@here"
        } else {
            var ping = ""
        }
        const embed = new MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setDescription(args.join(' ').replace("--everyone", "").replace("--here", ""))

        message.channel.createWebhook(
            message.author.username, 
            { avatar: message.author.displayAvatarURL({ dynamic: true }) }
            )
        .then(webhook => webhook.send(ping, embed)
        .then( setTimeout(function(){ webhook.delete(); }, 3000) ))
        .then(message.delete());
    }};