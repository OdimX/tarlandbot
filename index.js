// Load up the discord.js library
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

                                                                      //Commands list




  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("[+] PING");
    m.edit(`Pong => ${m.createdTimestamp - message.createdTimestamp}ms`);
  }



  if(command === "kick") {
    // Only admins and mods

    if(!message.member.roles.some(r=>["Admin's","Dev"].includes(r.name)) )
      return message.reply("[-] Vous n'avez pas la permission d'utiliser cette commande !");

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("[-] Selectionnez un utilisateur valide !");
    if(!member.kickable)
      return message.reply("[-] Une restriction vous empeche de bannir cet utilisateur !");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Sans Raison";

    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} Kick par ${message.author.tag} Raison : ${reason}`);
  }



  if(command === "ban") {
    if(!message.member.roles.some(r=>["Admin's","Dev"].includes(r.name)) )
      return message.reply("[-] Vous n'avez pas la permission d'utiliser cette commande !");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("[-] Selectionnez un utilisateur valide !");
    if(!member.bannable)
      return message.reply("[-] Une restriction vous empeche de bannir cet utilisateur !");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Sans Raison";

    await member.ban(reason)
      .catch(error => message.reply(`Desole ${message.author} je ne peux bannir cet utilisateur car : ${error}`));
    message.reply(`${member.user.tag} Ban par ${message.author.tag} Raison : ${reason}`);
  }

  if(command === "purge") {
    const deleteCount = parseInt(args[0], 10);

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("[-] Selectionnez une entree entre 2 et 100 !");

    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`[-] Ce message ne peut etre supprime car : ${error}`));
    return message.reply("[~] Ce chat viens de subir une purge !");
  }
});

client.login(config.token);
