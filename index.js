const { token } = require('./config.json');
const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();
const Enmap = require("enmap");

client.commands = new Discord.Collection();
client.categories = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of client.categories) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
  });

client.settings = new Enmap({ name: "settings", cloneLevel: "deep", fetchAll: false, autoFetch: true });

client.defaultSettings = {
  "status": "off"
};

if (!client.settings.has("default")) client.settings.set("default", client.defaultSettings);

client.login(token);
