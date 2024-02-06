const choices = [
  { name: "rock", emoji: "✊", image: "https://i.postimg.cc/gjWnNFZG/rock.gif" },
  { name: "paper", emoji: "🖐️", image: "https://i.postimg.cc/vB94rHDP/paper.gif" },
  { name: "scissors", emoji: "✌️", image: "https://i.postimg.cc/8zPf2Sn5/sci.gif" }
];

module.exports = {
  config: {
    name: "rps2",
    aliases: ["rockpaperscissors"],
    description: "Play rock paper scissors game with the chiyoko",
    version: "1.2",
    author: "bhuban",
    countDown: 8,
    category: "games",
    guide: "{prefix}rps <rock|paper|scissors>"
  },

  onStart: async function ({ args, message, event, usersData }) {
    const playerChoice = args[0];

    const validChoices = choices.map(choice => `${choice.name} (${choice.emoji})`);
    const playerChoiceObj = choices.find(choice => choice.name === playerChoice || choice.emoji === playerChoice);
    if (!playerChoiceObj) {
      return message.reply(`Please enter either ${validChoices.join(", ")}.\nou won't get anything`);
    }

    const botChoiceObj = choices[Math.floor(Math.random() * choices.length)];

    const form = {
      body: ``
    };
    form.attachment = [await global.utils.getStreamFromURL(botChoiceObj.image)];
    await message.reply(form);

    const playerWins = (
      (playerChoiceObj.name === "rock" && botChoiceObj.name === "scissors") ||
      (playerChoiceObj.name === "paper" && botChoiceObj.name === "rock") ||
      (playerChoiceObj.name === "scissors" && botChoiceObj.name === "paper")
    );

    const botWins = (
      (botChoiceObj.name === "rock" && playerChoiceObj.name === "scissors") ||
      (botChoiceObj.name === "paper" && playerChoiceObj.name === "rock") ||
      (botChoiceObj.name === "scissors" && playerChoiceObj.name === "paper")
    );

    if (playerChoiceObj.name === botChoiceObj.name) {
      return message.reply(`ɪᴛ'ꜱ ᴀ ᴛɪᴇ! ʏᴏᴜ ʙᴏᴛʜ ᴄʜᴏꜱᴇ ${playerChoiceObj.name} (${playerChoiceObj.emoji}).`);
    }

    if (playerWins) {
      const getCoin = Math.floor(Math.random() * 50) + 1;
      const { senderID } = event;
      const userData = await usersData.get(senderID);
      await usersData.set(senderID, {
        money: userData.money + getCoin,
        data: userData.data
      });
      const newBalance = userData.money + getCoin;
      return message.reply(`𝘾𝙤𝙣𝙜𝙧𝙖𝙩𝙪𝙡𝙖𝙩𝙞𝙤𝙣𝙨! 𝙔𝙤𝙪 𝙬𝙤𝙣 ${getCoin} $. 𝙔𝙤𝙪𝙧 𝙣𝙚𝙬 𝙗𝙖𝙡𝙖𝙣𝙘𝙚 𝙞𝙨 ${newBalance}. $`);
    }

    if (botWins) {
      return message.reply(`𝙎𝙤𝙧𝙧𝙮, 𝙮𝙤𝙪 𝙡𝙤𝙨𝙩. 𝙎𝙚𝙣𝙥𝙖𝙞 𝙞 𝙘𝙝𝙤𝙨𝙚 ${botChoiceObj.name} (${botChoiceObj.emoji}).`);
    }
  }
};