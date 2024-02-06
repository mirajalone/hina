const axios = require('axios');

// Define a sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  config: {
    name: "sicbo",
    aliases: ['bet', 'slot'],
    version: "1.5",
    author: "Shikaki",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: {
      en: "Play Sic Bo Game",
    },
    longDescription: {
      en: "Play Sic Bo Game and Bet",
    },
    guide: {
      en: `
Usage: {pn} <bet amount>
slot <bet amount>
bet <bet amount>
`,
    },
  },

onStart: async function ({ message, event, usersData, args }) {
    const { senderID } = event;

    // Introduce a 1-second delay before executing the command
    await sleep(1000); // 1000 milliseconds (1 second)

    // Check if the player's balance is stored as a string
    const userData = await usersData.get(senderID);

    let balance = parseFloat(userData.money || "0"); // Initialize balance to 0 if not present

    // Check if the balance is greater than 0
    if (balance <= 0) {
        return message.reply("You don't have enough money to play.");
    }

    // Interpret and convert bet input
    const betInput = args[0]; // No need for parsing, keep it as a string

    // Check if betInput is a valid number
    if (!/^\d+(\.\d+)?$/.test(betInput)) {
        return message.reply("Invalid bet amount. Please enter a valid bet.");
    }

    let numericBet = parseFloat(betInput);

    // Check if it's a valid numeric bet
    if (isNaN(numericBet) || numericBet <= 0) {
        return message.reply("Invalid bet amount. Please enter a valid bet.");
    }

    // Define the max money limit (1e104)
    const maxMoney = 1e104;

    if (balance >= maxMoney) {
        return message.reply(`You have already gained the max money: ${formatNumberWithFullForm(maxMoney)}`);
    }

    // Check if the user is trying to bet more than they have
    if (numericBet > balance) {
        return message.reply("You don't have enough money to place this bet.");
    }

    // Simulate a Sic Bo roll (randomly generate three dice values between 1 and 6)
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;

    const total = dice1 + dice2 + dice3;
    const resultMsg = `Dice Roll: ${dice1} + ${dice2} + ${dice3} = ${total}`;

    // Calculate a random number between 0 and 1
    const random = Math.random();

    // Set the win percentage
    const winPercentage = 0.50;

    // Determine if the player wins or loses based on the random number
    const isWin = random <= winPercentage;

    let finalMsg = ''; // Initialize finalMsg

    finalMsg += '----------------------\n';
    finalMsg += '|      🎲 Sic Bo Game      |\n';
    finalMsg += '----------------------\n';
    finalMsg += `| ${resultMsg} |\n`;
    finalMsg += '----------------------\n\n';

    // Calculate reward here
    let reward = 0;

    if (isWin) {
      reward = numericBet * 2; // Double the bet

      // Check if the user will exceed the max money limit
      if (balance + reward > maxMoney) {
        return message.reply(`You have already gained the max money: ${formatNumberWithFullForm(maxMoney)}`);
      }

      balance = balance + reward;

      // Update the user's balance
      await usersData.set(senderID, {
        money: balance.toString(), // Convert the balance to a string for storage
        // You can also update other user data if needed
      });

      finalMsg += '🎉 Congratulations, you win!\n';
      finalMsg += '----------------------\n';
      finalMsg += `💸 Bet: $${formatNumberWithFullForm(numericBet)}\n`;
      finalMsg += '----------------------\n';
      finalMsg += `💰 Reward: $${formatNumberWithFullForm(reward)}\n`;
      finalMsg += '----------------------\n';
      finalMsg += `💼 Money after bet: $${formatNumberWithFullForm(balance)}\n`; // Added Money after bet
      finalMsg += '----------------------\n';
    } else {
      // Calculate the amount lost
      let lostAmount = numericBet;

      // Check if the user has enough money to deduct the lost amount
      if (balance >= lostAmount) {
        balance = balance - lostAmount;
      } else {
        lostAmount = balance; // User loses all their money
        balance = 0;
      }

      // Update the user's balance
      await usersData.set(senderID, {
        money: balance.toString(), // Convert the balance to a string for storage
        // You can also update other user data if needed
      });

      finalMsg += '❌ Oops, you lost!\n';
      finalMsg += '----------------------\n';
      finalMsg += `💸 Bet: $${formatNumberWithFullForm(numericBet)}\n`;
      finalMsg += '----------------------\n';
      finalMsg += `💰 Money lost: $${formatNumberWithFullForm(numericBet)}\n`; // Added Money lost
      finalMsg += '----------------------\n';
      finalMsg += `💼 Money after bet: $${formatNumberWithFullForm(balance)}\n`; // Added Money after bet
    }

    // Send the final message to the user
    if (message) {
      message.reply(finalMsg, { typing: true });
    }
  },
};


// Function to format a number with full forms (e.g., 1 Thousand, 133 Million, 76.2 Billion)
function formatNumberWithFullForm(number) {
  const fullForms = [
    "",
    "Thousand",
    "Million",
    "Billion",
    "Trillion",
    "Quadrillion",
    "Quintillion",
    "Sextillion",
    "Septillion",
    "Octillion",
    "Nonillion",
    "Decillion",
    "Undecillion",
    "Duodecillion",
    "Tredecillion",
    "Quattuordecillion",
    "Quindecillion",
    "Sexdecillion",
    "Septendecillion",
    "Octodecillion",
    "Novemdecillion",
    "Vigintillion",
    "Unvigintillion",
    "Duovigintillion",
    "Tresvigintillion",
    "Quattuorvigintillion",
    "Quinvigintillion",
    "Sesvigintillion",
    "Septemvigintillion",
    "Octovigintillion",
    "Novemvigintillion",
    "Trigintillion",
    "Untrigintillion",
    "Duotrigintillion",
    "Googol",
  ];

  // Calculate the full form of the number (e.g., Thousand, Million, Billion)
  let fullFormIndex = 0;
  while (number >= 1000 && fullFormIndex < fullForms.length - 1) {
    number /= 1000;
    fullFormIndex++;
  }

  // Format the number with two digits after the decimal point
  const formattedNumber = number.toFixed(2);

  // Add the full form to the formatted number
  return `${formattedNumber} ${fullForms[fullFormIndex]}`;
}
