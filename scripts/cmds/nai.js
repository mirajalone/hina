const axios = require("axios");

module.exports = {
  config: {
    name: "nai",
    aliases: ["gpt"],
    version: "1.0",
    author: "Nihan", // api by Nihan
    countDown: 2,
    role: 0,
    longDescription: { en: "" },
    category: "Ai",
    guide: { en: ">" },
  },

  onStart: async function ({ api, event, args }) {
    const { messageID, threadID } = event;
    const tid = threadID,
      mid = messageID;

    const content = encodeURIComponent(args.join(" "));

    if (!content) {
      return api.sendMessage("Please, provide a query.", tid, mid);
    }

    try {
      api.sendTypingIndicator(event.threadID, true);

      const response = await fetchGpt4Response(content);

      if (response) {
        const messageText = `${response}`;
        api.setMessageReaction("✅️", event.messageID, (err) => {}, true);
        api.sendMessage(messageText, tid, mid);
      } else {
        api.sendMessage("An unexpected error occurred.", tid, mid);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching the data.", tid, mid);
    }
  },
};

async function fetchGpt4Response(content) {
  try {
    const res = await axios.get(`https://quaint-garters-lamb.cyclic.app//api/gpt4?query=${content}`);
    if (res.data && res.data.reply) {
      return res.data.reply;
    } else if (res.data && res.data.error) {
      throw new Error(res.data.error);
    } else {
      throw new Error("No reply from Gpt4.");
    }
  } catch (error) {
    throw new Error(`Error fetching Gpt4 response: ${error.message}`);
  }
}