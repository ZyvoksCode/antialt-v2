const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const config = require("../config.json");

module.exports = {
    name: "help",
    description: "All bot commands, important links and informations!",
    usage: "[ command ]",
    execute(client, message, args) {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }), "https://antialt.xyz/")
            .setColor(message.member.displayHexColor)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(getAll(client))
            .addField(`<a:link:738023910087327795> **Important Links:**`, "[AntiAlt.xyz (Website)](https://antialt.xyz/) | [Support Server](https://discord.gg/8jQP52j) | [Invite me!](https://antialt.xyz/invite)")
            .setFooter(`Use "${config.prefix}help <command>" to get more informations about command!`, config.info)
            message.channel.send(embed)
        }
    }
}


function getCMD(client, message, input) {
    const embed = new MessageEmbed()
    const cmd = client.commands.get(input.toLowerCase().replace(config.prefix, ""));
        if (!cmd) {
        return message.channel.send(
            new MessageEmbed()
            .setColor("#ff0000")
            .setAuthor("This command does not exists!", config.no, "https://antialt.xyz/")
            .setFooter(`Invoked by ${message.author.tag}.`)
            );
        }
    if (cmd.name) embed.setAuthor(cmd.name, config.info, "https://antialt.xyz");
    if (cmd.usage) embed.addField(`**Usage:**`, `\`${config.prefix}${cmd.name} ${cmd.usage}\``)
    if (cmd.description) embed.addField(`**Desciprtion:**`, `${cmd.description}`);
    if (cmd.example) embed.addField(`**Examples:**`, `\`${config.prefix}${cmd.name} ${cmd.example.join(`\`\n\`${config.prefix}${cmd.name} `)}\``);
    if (cmd.permissions) embed.addField(`**Permissions:**`, `${cmd.permissions}`);

    return message.channel.send(embed.setColor(message.member.displayHexColor).setFooter(`Invoked by ${message.author.tag}.`));
}

function getAll(client) {   
        return client.commands
            .filter(cmd => !cmd.dev)
            .map(cmd => `<:dot:738030536785657917> \`${config.prefix}${cmd.name}\`${cmd.description ? ' - ' + cmd.description : ''}`)
            .join("\n");
}