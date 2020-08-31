module.exports = (client) => {
  const url = require("url");
  const path = require("path");

  const Discord = require("discord.js");


  const express = require("express");
  const app = express();
  const moment = require("moment");
  require("moment-duration-format");

  const passport = require("passport");
  const session = require("express-session");
  const SQLiteStore = require("connect-sqlite3")(session);
  const Strategy = require("passport-discord").Strategy;

  const helmet = require("helmet");

  const md = require("marked");

  const config = require("./config.json")

    const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
    const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

    app.use("/public", express.static(path.resolve(`${dataDir}${path.sep}public`)));

    passport.serializeUser((user, done) => {
      done(null, user);
    });
    
    passport.deserializeUser((obj, done) => {
      done(null, obj);
    });

    function checkAuth(req, res, next) {
      if (req.isAuthenticated()) return next();
      res.redirect("/login");
    }

    const renderTemplate = (res, req, template, data = {}) => {
      const baseData = {
        bot: client,
        path: req.path,
        user: req.user
      };
      res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    };

passport.use(new Strategy({
  prompnt: "none",
  access_type: "offline",
  clientID: client.user.id,
  clientSecret: config.dashboard.secret,
  callbackURL: config.dashboard.callback,
  scope: ["identify", "guilds"]
},
(accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
}));

app.use(session({
  store: new SQLiteStore({ 
    dir: "./data"
  }),
  secret: "taviisgey",
  resave: false,
  saveUninitialized: false,
}));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(passport.initialize());
app.use(passport.session());

app.locals.domain = config.dashboard.domain;


var bodyParser = require("body-parser");
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


    app.get("/login", (req, res, next) => {
      next();
    },
    passport.authenticate("discord"));

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), (req, res) => {
        res.redirect("/");
    });
  
    app.get("/logout", function(req, res) {
      req.session.destroy(() => {
        req.logout();
        res.redirect("/"); //Inside a callback… bulletproof!
      });
    });

    app.get("/dashboard", checkAuth, (req, res) => {
      const perms = Discord.Permissions;
      renderTemplate(res, req, "dashboard.ejs", {perms});
    });

    app.get("/", (req, res) => {
      renderTemplate(res, req, "index.ejs");
    });

    // The Admin dashboard is similar to the one above, with the exception that
    // it shows all current guilds the bot is on, not *just* the ones the user has
    // access to. Obviously, this is reserved to the bot's owner for security reasons
  
    // Simple redirect to the "Settings" page (aka "manage")
    app.get("/dashboard/:guildID", checkAuth, (req, res) => {
      const guild = client.guilds.cache.get(req.params.guildID);
      if (!guild) return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=718189569693974639&permissions=8&scope=bot&guild_id=${req.params.guildID}`);
      const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
      if (!isManaged && !req.session.isAdmin) res.redirect("/");
      renderTemplate(res, req, "guild/choose.ejs", {guild});
    });
  
    // Settings page to change the guild configuration. Definitely more fancy than using
    // the `set` command!
    app.get("/dashboard/:guildID/basic", checkAuth, (req, res) => {
      const guild = client.guilds.cache.get(req.params.guildID);
      if (!guild) return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=718189569693974639&permissions=8&scope=bot&guild_id=${req.params.guildID}`);
      const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
      if (!isManaged && !req.session.isAdmin) res.redirect("/");
      client.settings.ensure(guild.id, client.defaultSettings);
      renderTemplate(res, req, "guild/basic.ejs", {guild});
    });

    app.get("/dashboard/:guildID/action", checkAuth, (req, res) => {
      const guild = client.guilds.cache.get(req.params.guildID);
      if (!guild) return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=718189569693974639&permissions=8&scope=bot&guild_id=${req.params.guildID}`);
      const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
      if (!isManaged && !req.session.isAdmin) res.redirect("/");
      client.settings.ensure(guild.id, client.defaultSettings);
      renderTemplate(res, req, "guild/action.ejs", {guild});
    });

    // When a setting is changed, a POST occurs and this code runs
    // Once settings are saved, it redirects back to the settings page.
    app.post("/dashboard/:guildID/post", checkAuth, (req, res) => {
      const guild = client.guilds.cache.get(req.params.guildID);
      if (!guild) return res.send("You're gay :(")
      const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
      if (!isManaged && !req.session.isAdmin) res.redirect("/");
      client.settings.set(guild.id, req.body);
    });
  
    // Resets the guild's settings to the defaults, by simply deleting them.
    app.get("/dashboard/:guildID/reset", checkAuth, async (req, res) => {
      const guild = client.guilds.cache.get(req.params.guildID);
      if (!guild) return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=718189569693974639&permissions=8&scope=bot&guild_id=${req.params.guildID}`);
      const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
      if (!isManaged && !req.session.isAdmin) res.redirect("/");
      client.settings.delete(guild.id);
      res.redirect("/dashboard");
    });

    app.get("/invite", (req, res) => {
      res.redirect("https://discord.com/api/oauth2/authorize?client_id=718189569693974639&permissions=8&scope=bot");
    });

    app.get("/support", (req, res) => {
      res.redirect("https://discord.gg/8jQP52j");
    });

    app.get("/donate", (req, res) => {
      res.redirect("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WUS2AQYDGT7VS&source=url");
    });

    app.get("/docs", (req, res) => {
      res.redirect("/");
    });
    
    app.get("/vote", (req, res) => {
      res.redirect("https://top.gg/bot/718189569693974639/vote");
    });

    app.use(function (req, res, next) {
      const error = "404 - Not Found";
      renderTemplate(res, req, "err.ejs", {error});
    })

    app.use(function (err, req, res, next) {
      const error = "500 - Internal Server Error";
      renderTemplate(res, req, "err.ejs", {error});
    })

    client.site = app.listen(config.dashboard.port);
  }; 
