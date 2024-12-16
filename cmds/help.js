const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/message');

module.exports = {
  name: 'help',
  description: 'Show available commands with descriptions',
  role: 1,
  author: 'Kylepogi',
  
  execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../cmds');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

   
    const commands = commandFiles.map((file) => {
      const command = require(path.join(commandsDir, file));
      return {
        title: `『${command.name.charAt(0).toUpperCase() + command.name.slice(1)}』`,
        description: command.description,
        payload: `${command.name.toUpperCase()}_PAYLOAD`
      };
    });

    const totalCommands = commands.length;
    const commandsPerPage = 5;
    const totalPages = Math.ceil(totalCommands / commandsPerPage);
    let page = parseInt(args[0], 10);

 
    if (isNaN(page) || page < 1) page = 1;

    // Display all commands if "help all" is provided
    if (args[0]?.toLowerCase() === 'all') {
      const helpTextMessage = `All 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n\n📖 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱: ${totalCommands}\n\n${commands.map((cmd, index) => `${index + 1}. ${cmd.title}\n📖 ${cmd.description}`).join('\n\n')}`;
      return sendMessage(senderId, { text: helpTextMessage }, pageAccessToken);
    }


    const startIndex = (page - 1) * commandsPerPage;
    const commandsForPage = commands.slice(startIndex, startIndex + commandsPerPage);

    if (commandsForPage.length === 0) {
      return sendMessage(senderId, {
        text: `❌ Oops! Page ${page} doesn't exist. There are only ${totalPages} page(s) available.`,
      }, pageAccessToken);
    }

    const helpTextMessage = `📜 𝙀𝙙𝙪𝙘-𝘽𝙤𝙩 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨 𝙇𝙞𝙨𝙩\n📖Page: 『${page}/${totalPages}』\n📌Total Command: (${totalCommands})\n࿇══━━━━✥◈✥━━━━══࿇\n${commandsForPage.map((cmd, index) => `${startIndex + index + 1}. ${cmd.title}\n📌description: ${cmd.description}`).join('\n\n')}\n࿇══━━━━✥◈✥━━━━══࿇\n📌 𝗧𝗶𝗽: Use "help [page]" to switch pages, or "help all" to see all commands!`;


    const quickReplies = commandsForPage.map((cmd) => ({
      content_type: "text",
      title: cmd.title.replace(' ', ''),
      payload: cmd.payload
    }));


    sendMessage(senderId, {
      text: helpTextMessage,
      quick_replies: quickReplies
    }, pageAccessToken);
  }
};
