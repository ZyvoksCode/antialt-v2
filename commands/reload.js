const { MessageEmbed } = require('discord.js')
const config = require('../config.json');

module.exports = {
	name: 'reload',
    description: 'Reload command.',
    usage: '< command >',
    permissions: "developer",
    dev: true,
	execute(client, message, args) {
        if (message.author.id !== config.owner) return message.channel.send(
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

            const commandName = args[0];
            if(!client.commands.has(commandName)) {
                return message.channel.send(
                    new MessageEmbed()
                    .setColor("#ff0000")
                    .setAuthor("Error", config.no, "https://antialt.xyz/")
                    .setDescription(`I can't find command \`${commandName}\` `)
                    .setFooter(`Invoked by ${message.author.tag}.`)
                    );
            }
            delete require.cache[require.resolve(`./${commandName}.js`)];
            client.commands.delete(commandName);
            const props = require(`./${commandName}.js`);
            client.commands.set(commandName, props);
            message.channel.send(
                new MessageEmbed()
                .setColor("#00ff00")
                .setAuthor("Success!", config.yes, "https://antialt.xyz/")
                .setDescription(`Reloaded command **${commandName}**!`)
                .setFooter(`Invoked by ${message.author.tag}.`)
                );
         }
    };