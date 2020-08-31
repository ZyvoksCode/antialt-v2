const config = require('../config.json');
const { MessageEmbed } = require('discord.js');
const fs = require("fs");
const ms = require("ms");

module.exports = (client, member) => {
    if(member.bot) return;
    if(client.settings.get(member.guild.id, "status") !== "on") return; 
    const embed = new MessageEmbed().setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true }) || "", "https://antialt.xyz/").setFooter("© AntiAlt.xyz", client.user.displayAvatarURL({ dynamic: true })).setTimestamp();
    const time = ms(Date.now()-client.users.cache.get(member.user.id).createdTimestamp, { long: true });

    // poyebany
    if(time.includes("hours") || time.includes("hour") || time.includes("minutes") || time.includes("minute") || time.includes("seconds") || time.includes("second")) {
        alt(member, embed, client, config);
    } else if(time.includes("days") || time.includes("day")) {
        //tu 
        if(client.settings.get(member.guild.id, "days") < time.replace(" days", "").replace(" day", "")) {
        //tu
            return member.send(config.dmtext, embed.setColor("#00FF00").setDescription(`Hey ${member}!\nYour account have more than **${client.settings.get(member.guild.id, "days")} days**, and you can join **${member.guild.name}** without any restrictions.`))
        } else {    
            alt(member, embed, client, config);
        }
    }
    // poyebany

    function alt(member, embed, client, config) {
        const wait = require('util').promisify(setTimeout);
        const obj = JSON.parse(fs.readFileSync(require('path').resolve(__dirname, "../data/wl.json")));
        if(obj[member.guild.id]) var whitelist = (obj[member.guild.id]).find(x => x == member.user.id);

        if(whitelist) {
            member.send(config.dmtext, embed
                .setColor("#D0FF00")
                .setDescription(`Hey ${member}!\nOne of moderators whitelisted you, and you can join **${member.guild.name}** without any restricionts!`)
                )
                if(client.channels.cache.get(client.settings.get(member.guild.id, "logs"))) {
                    client.channels.cache.get(client.settings.get(member.guild.id, "logs")).send("<a:SkypeCool:747119267815620660> **Whitelisted member joined to server!**", new MessageEmbed()
                    .setAuthor(`${member.user.tag} [${member.user.id}]`, member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/8jQP52j")
                    .setColor("#00ff00")
                    .setDescription(`Account was created **${ms(Date.now()-client.users.cache.get(member.user.id).createdTimestamp, { long: true })}** ago.\n${member} can join without any restrictions.`)
                    .setTimestamp()
                    )
                 }
                 return;
        } 

        member.send(config.dmtext, embed
            .setColor("#FF0000")
            .setDescription(`Hey ${member}!\nUnfortunately... Your account must exists long than **${client.settings.get(member.guild.id, "days")} days** to join **${member.guild.name}** without any restrictions.\nIf it's mistake, you can appeal on our support server: https://discord.gg/8jQP52j`)
            );
            wait(350);
            if(client.settings.get(member.guild.id, "action") === "ban") {
                member.ban().catch(() => {
                    client.settings.set(guild.id, ["off"], "status");
                    return client.channels.cache.get(client.settings.get(member.guild.id, "logs")).send(new MessageEmbed().setTimestamp().setAuthor(`I can't ban ${member.tag}, because I don't have permissions!`, config.no, "https://antialt.xyz/").setColor("#FF0000"));
                });
            } else if(client.settings.get(member.guild.id, "action") === "kick") {
                member.kick().catch(() => {
                    client.settings.set(guild.id, ["off"], "status");
                    return client.channels.cache.get(client.settings.get(member.guild.id, "logs")).send(new MessageEmbed().setTimestamp().setAuthor(`I can't kick ${member.tag}, because I don't have permissions!`, config.no, "https://antialt.xyz/").setColor("#FF0000"));
                });
            } else if(client.settings.get(member.guild.id, "action") === "role") {
                if(!client.settings.get(member.guild.id, "arole")) {
                    client.settings.set(guild.id, ["off"], "status");
                    return client.channels.cache.get(client.settings.get(member.guild.id, "logs")).send(new MessageEmbed().setTimestamp().setAuthor(`I can't give role to ${member.tag}, because role doesn't exists/is not setupped!`, config.no, "https://antialt.xyz/").setColor("#FF0000")); 
                }
                    member.roles.add(client.settings.get(member.guild.id, "arole")).catch(() => {
                    client.settings.set(guild.id, ["off"], "status");
                    return client.channels.cache.get(client.settings.get(member.guild.id, "logs")).send(new MessageEmbed().setAuthor(`I can't give role to ${member.tag}, because I don't have permissions!`, config.no, "https://antialt.xyz/").setColor("#FF0000"));
                });
            }

             if(client.channels.cache.get(client.settings.get(member.guild.id, "logs"))) {
                client.channels.cache.get(client.settings.get(member.guild.id, "logs")).send("<:WindowsCritical:747118964127301744> **New alt catched!**", new MessageEmbed()
                .setAuthor(`${member.user.tag} [${member.user.id}]`, member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/8jQP52j")
                .setColor("#FF0000")
                .setDescription(`Account was created **${ms(Date.now()-client.users.cache.get(member.user.id).createdTimestamp, { long: true })}** ago.`)
                .setTimestamp()
                )
             }
             client.channels.cache.get(config.altsc).send("**🤣 New Alt Catched!**", new MessageEmbed()
             .setColor("RANDOM")
             .setAuthor(`${member.user.tag} [ID: ${member.user.id}]`, member.user.displayAvatarURL({ dynamic: true }))
             .setDescription(`Account created **${ms(Date.now()-client.users.cache.get(member.user.id).createdTimestamp, { long: true })} ago**\n Required: **${client.settings.get(member.guild.id, "days")} day(s)**`)
             .setTimestamp());
    }
};
