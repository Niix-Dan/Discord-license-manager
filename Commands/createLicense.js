const Discord = require('discord.js')

module.exports = {
    name: 'createlicense',
    description: 'Crie uma nova licença',
    category: 'MOD',
    async execute(client, message, args, database) {
      if(!args[0]) return message.reply("Você não colocou um usuário.");

      let user = args[0]+"_"+generate_token(3)
      let key = generate_token(8)+"."+generate_token(16)+"."+generate_token(8)+"."+generate_token(4)+"."+generate_token(7);
      
      let db = await database.ref(`Licenses/${user}`).once('value');
      let dbref = database.ref(`Licenses/${user}`)

      dbref.set({
        key: key,
        date: Date.now()
      })
      let embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription(`**Licença criada com sucesso!**\n\n> **Enviei os dados no seu privado.**`);
      let license = new Discord.MessageEmbed()
        .setColor('GOLD')
        .setDescription(`**Licença**`)
        .addField(`Usuário`, `**${user}**`)
        .addField(`Chave`, `**${key}**`)
        
      message.channel.send(embed);
      message.author.send(license);
    }
}


function generate_token(length) {
  let chars = [
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
		'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
		'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
		'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
  ]
  let code = "";
  for(let i = 0 ; i < length ; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}