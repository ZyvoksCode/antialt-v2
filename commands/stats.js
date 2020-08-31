const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'stats',
    description: 'Check how many servers or users have bot',
    permissions: 'Member',
	execute(client, message, args) {
        var uptime = process.uptime();
        var days = Math.floor((uptime % 31536000) / 86400);
        var hours = Math.floor((uptime % 86400) / 3600);
        var minutes = Math.floor((uptime % 3600) / 60);
        var seconds = Math.round(uptime % 60);
        var botuptime = (days > 0 ? days + " days, ":"") + (hours > 0 ? hours + " hours, ":"") + (minutes > 0 ? minutes + " minutes, ":"") + (seconds > 0 ? seconds + " seconds":"")
        message.channel.send(new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }), "https://antialt.xyz/")
        .setColor(message.member.displayHexColor)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`<:dot:738030536785657917> **Uptime:** \`${botuptime}\`\n<:dot:738030536785657917> **Ping:** \`${Math.floor(client.ws.ping)}ms\`\n\n<:dot:738030536785657917> **Servers:** \`${client.guilds.cache.size}\`\n<:dot:738030536785657917> **Users:** \`${eval(client.guilds.cache.map(g => g.members.cache.filter(m => !m.user.bot).size).join(' + '))}\`\n<:dot:738030536785657917> **Bots:** \`${eval(client.guilds.cache.map(g => g.members.cache.filter(m => m.user.bot).size).join(' + '))}\`\n<:dot:738030536785657917> **Channels:** \`${client.channels.cache.size}\`\n<:dot:738030536785657917> **Emojis:** \`${client.emojis.cache.size}\``)
        .setFooter(`Invoked by ${message.author.tag}`));
    }};