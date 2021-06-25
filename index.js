const Discord = require('discord.js');
const client = new Discord.Client();
const { readdirSync } = require("fs");
const { join } = require("path");
const log = (text) => console.log(`> ${text}`);
const firebase = require('firebase');
const express = require('express');
const app = express();
const http = require('http').createServer(app);


// Configuração da Firebase
var firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();


app.get('/', (req, res) => {
  res.sendStatus(200);
})

app.get('/verifyLicense/:user/:key', async (req, res) => {
  let user = req.params.user, key = req.params.key;
  let db = await database.ref(`Licenses/${user}`).once('value');
  let dbref = database.ref(`Licenses/${user}`)

  if(db.val() == null) {
    res.send("false");
    return;
  }
  if(db.val().key != key) {
    res.send("false");
    return;  
  }
  res.send('true');
})


client.commands = new Discord.Collection();
const commandFiles = readdirSync(join(__dirname, "Commands")).filter(file => file.endsWith(".js"));
log("Carregando um total de "+commandFiles.length+" comandos...");
for(const file of commandFiles) {
    const command = require(join(__dirname, "Commands", `${file}`));
    client.commands.set(command.name, command);
}
log(`Comandos carregados!`);

client.on('message', async (message) => {
    if(message.author.bot) return
    if(message.channel.type == "dm") return

    let prefix = process.env.PREFIX;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmds = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if(!message.content.toLowerCase().startsWith(prefix)) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;

    if(!cmds) return message.channel.send(`Desculpe, o comando **${prefix}${command}** não existe`)
    cmds.execute(client, message, args, database);
});

http.listen(3000, () => {
  console.log("Página iniciada na porta [ 3000 ]")
})

client.login(process.env.TOKEN)