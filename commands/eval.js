const { MessageEmbed } = require('discord.js')
const config = require('../config.json');
const { inspect } = require("util");
const hastebin = require("hastebin-gen");


module.exports = {
	name: 'eval',
    description: 'Evalue code in discord.js *v12*',
    usage: '< code >',
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
            try {
                const code = args.join(" ");
                let evaled = eval(code);
           
                if (typeof evaled !== "string")
                  evaled = inspect(evaled);
                  if (evaled.includes(client.token)) return message.channel.send(
                    new MessageEmbed()
                    .setColor("#ff0000")
                    .setAuthor("Error", config.no, "https://antialt.xyz/")
                    .setDescription(`I can't show my token here, due to verified bot terms.`)
                    .setFooter(`Invoked by ${message.author.tag}.`)
                    );
           
                    if(evaled.length >= 1950) {
                      return hastebin(evaled, { extension: "js" }).then(haste => {
                        message.channel.send(
                          new MessageEmbed()
                          .setColor("#ff0000")
                          .setAuthor("Error", config.no, "https://antialt.xyz/")
                          .setDescription(`Result have more than 1950 characters, [click here to show result](${haste})`)
                          .setFooter(`Invoked by ${message.author.tag}.`)
                          );
                    }).catch(error => {
                        console.error(error);
                    });
                    } 

                message.channel.send(
                  new MessageEmbed()
                  .setColor("#00ff00")
                  .setAuthor("Success!", config.yes, "https://antialt.xyz/")
                  .setDescription(`\`\`\`js\n${evaled}\n\`\`\``)
                  .setFooter(`Invoked by ${message.author.tag}.`)
                  );
              } catch (err) {
                message.channel.send(
                  new MessageEmbed()
                  .setColor("#ff0000")
                  .setAuthor("Error", config.no, "https://antialt.xyz/")
                  .setDescription(`\`\`\`js\n${err}\n\`\`\``)
                  .setFooter(`Invoked by ${message.author.tag}.`)
                  );
              }
         }
    };