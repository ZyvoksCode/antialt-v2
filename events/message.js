const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.mentions.has(client.user) && (message.content === `<@!${client.user.id}>`)) message.channel.send(
        new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`My prefix is \` ${prefix} \`.\nTo get started type \` ${prefix}help \`.`)
    );

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (client.commands.has(command.toLowerCase())) {
        try {
            const cmd = client.commands.get(command.toLowerCase());
            cmd.execute(client, message, args);
        } catch (error) {
            console.error(error)
            err(message, error)
	        message.channel.send(
                new Discord.MessageEmbed().setColor("#ff0000").setDescription("Someting goes wrong...\n\n\n[Support Server](https://discord.gg/8jQP52j)").addField(":warning: **Error:**", `\`\`\`js\n${error}\n\`\`\``));
            }
        } else {
        message.react('❌');
    }
    function err(msg, error) {
        const cert2 = client.channels.cache.get('739758094602469387');
        const owo2 = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setAuthor(`${msg.author.tag} [${msg.author.id}]`, msg.author.displayAvatarURL({ dynamic: true }))
            .setFooter(`${msg.guild.name} [${msg.guild.id}] || Members: ${msg.guild.members.cache.filter(m => !m.user.bot).size} `, msg.guild.iconURL({ dynamic: true }) || "")
            .setDescription(`\`\`\`${msg.content}\`\`\``)
            .addField("Error:", `\`\`\`js\n${error}\n\`\`\``);
        cert2.send("<@&718495532464734228> || <@714550610489508050>", owo2);
    }
};