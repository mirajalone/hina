const { getStreamsFromAttachment, checkAndTranslate } = global.utils;

module.exports = {
  config: {
    name: "notice",
    aliases: ["notif"],
    version: "1.0",
    author: "NTKhang",
    countDown: 5,
    role: 2,
    shortDescription: "Send notice from admin to all box",
    longDescription: "Send notice from admin to all box",
    category: "owner",
    guide: "{pn} <message>",
    envConfig: {
      delayPerGroup: 250,
    },
  },

  onStart: async function ({ message, api, event, args, commandName, envCommands }) {
    const { delayPerGroup } = envCommands[commandName];
    if (!args[0]) return message.reply("Please enter the message you want to send to all groups");

    // Ensure valid attachments
    const attachments = event.attachments || [];
    const replyAttachments = event.messageReply?.attachments || [];
    const allAttachments = [...attachments, ...replyAttachments];

    const formSend = {
      body: `Notice from SuperAdmin\n────────────────\n${args.join(" ")}`,
      attachment: await getStreamsFromAttachment(allAttachments),
    };

    const allThreadID = (await api.getThreadList(2000, null, ["INBOX"]))
      .filter((item) => item.isGroup === true && item.threadID != event.threadID)
      .map((item) => item.threadID);

    message.reply(`Start sending notice from admin bot to ${allThreadID.length} Chat group`);

    let sendSucces = 0;
    const sendError = [];
    const waitingSend = [];

    for (const tid of allThreadID) {
      try {
        waitingSend.push({
          threadID: tid,
          pending: api.sendMessage(formSend, tid),
        });
        await new Promise((resolve) => setTimeout(resolve, delayPerGroup));
      } catch (e) {
        sendError.push(tid);
      }
    }

    for (const sent of waitingSend) {
      try {
        await sent.pending;
        sendSucces++;
      } catch (e) {
        sendError.push(sent.threadID);
      }
    }

    message.reply(`✅ Sent notice to ${sendSucces} Successful group${sendError.length > 0 ? `\n❌ Error occurs when sent ${sendError.length} the group:\n${sendError.join("\n ")}` : ""}`);
  },
};