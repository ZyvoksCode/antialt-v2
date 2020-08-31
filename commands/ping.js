const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'ping',
    description: '🏓 Pong...',
    permissions: 'Member',
	execute(client, message, args) {
        message.channel.send('🏓 Pong...').then((msg) => {
            msg.edit(`🏓 Pong!`, new MessageEmbed().setColor(message.member.displayHexColor).setDescription(`<:dot:738030536785657917> **__Bot__ ping:** ${msg.createdTimestamp - message.createdTimestamp}ms\n<:dot:738030536785657917> **__API__ ping:** ${Math.round(client.ws.ping)}ms`));
          });
    }};