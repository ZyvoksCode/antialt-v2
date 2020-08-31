const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const fs = require("fs");
const path = require('path');
 
module.exports = {
	name: 'whitelist',
    description: 'Bypass one member for fulling AntiAlt requirements!',
    usage: '< id >',
    permissions: "Ban Members or role named 'Moderator'.",
    example: ["714550610489508050", "98249872647512355"],
	execute(client, message, args) {
        if(!message.member.hasPermission("BAN_MEMBERS") && !member.roles.cache.some("Moderator")) return message.channel.send(
            new MessageEmbed()
            .setColor("#ff0000")
            .setAuthor("You don't have permissions to use this command!", config.no, "https://antialt.xyz/")
            .setDescription(`Permissions: ${module.exports.permissions}`)
            .setFooter(`Invoked by ${message.author.tag}.`)
            );
        if(!args[0] || !args[0].length === 17 || !args[0].length === 18) return message.channel.send(
            new MessageEmbed()
            .setColor("#ff0000")
            .setAuthor("Invalid usage!", config.no, "https://antialt.xyz/")
            .setDescription(`Usage: \`${config.prefix}${module.exports.name} ${module.exports.usage}\``)
            .setFooter(`Invoked by ${message.author.tag}.`)
            );
        const member = client.users.cache.get(args.join(' '));
        if (message.guild.member(member)) return message.channel.send(
            new MessageEmbed()
            .setColor("#ff0000")
            .setAuthor(`${member.tag} is already on this server. You can't whitelist this member!`, config.no, "https://antialt.xyz/")
            .setFooter(`Invoked by ${message.author.tag}.`)
            );

        if(member) {
            message.channel.createInvite({ maxUses: 1, maxAge: 0 }).then(invite => member.send(
                new MessageEmbed()
                .setColor("#00ff00")
                .setAuthor(`${message.author.tag} whitelisted you on ${message.guild.name}! 🎉`, config.yes, "https://antialt.xyz/")
                .setDescription(`One-time invite: ${invite.url}`)
                .setFooter(`Invoked by ${message.author.tag}.`)
                ));
        }

            const dir = path.resolve(__dirname, '../data/wl.json');
            const file = fs.readFileSync(dir);
            const obj = JSON.parse(file);
            let guildArray = obj[message.guild.id];
            if(!guildArray) guildArray = [];
                guildArray.push(args[0]);
            obj[message.guild.id] = guildArray;
            fs.writeFileSync(dir, JSON.stringify(obj, null, 2), 'utf-8');

            message.channel.send(
                new MessageEmbed()
                .setColor("#00ff00")
                .setAuthor(`Success! Whitelisted ${args[0]}!`, config.yes, "https://antialt.xyz/")
                .setFooter(`Invoked by ${message.author.tag}.`)
                );
            
    }};