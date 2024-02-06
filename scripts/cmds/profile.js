module.exports = {
  config: {
    name: "profile",
    aliases: ["pp", "dp"],
    version: "1.0",
    author: "RUBISH",
    countDown: 5,
    role: 0,
    shortDescription: "View profile picture",
    longDescription: "View the profile picture of a user.",
    category: "Utility",
    guide: {
      en: "{pn} [@tag|uid|fbLink] (or reply to a message)",
    },
  },

  onStart: async function ({ api, event, args, message, usersData, getLang }) {
    const { getStreamFromURL, findUid } = global.utils;

    try {
      let uid, userName;

      if (event.type === "message_reply") {
        ({ uid, userName } = await getUserInfoFromReply(api, event));
      } else {
        ({ uid, userName } = await getUserInfoFromInput(api, event, args, usersData));
      }

      const avt = await usersData.getAvatarUrl(uid);
      const replyMessage = `✅ Here's the profile picture of ${userName} ( ${uid} )`;
      
      message.reply({
        body: replyMessage,
        attachment: await getStreamFromURL(avt),
      });
    } catch (e) {
      console.error(e);
      message.reply(getLang("error"));
    }
  },
};

async function getUserInfoFromReply(api, event) {
  const uid = event.messageReply.senderID;
  const user = await api.getUserInfo(uid);
  const userName = user[uid].name;
  return { uid, userName };
}

async function getUserInfoFromInput(api, event, args, usersData) {
  const input = args.join(" ");
  let uid, userName;

  if (event.mentions && Object.keys(event.mentions).length > 0) {
    ({ uid, userName } = await getUserInfoFromMentions(api, event));
  } else if (/^\d+$/.test(input)) {
    ({ uid, userName } = await getUserInfoFromID(api, input));
  } else if (input.includes("facebook.com")) {
    ({ uid, userName } = await getUserInfoFromFacebookLink(api, input, usersData));
  } else {
    ({ uid, userName } = await getUserInfoFromSender(api, event));
  }

  return { uid, userName };
}

async function getUserInfoFromMentions(api, event) {
  const uid = Object.keys(event.mentions)[0];
  const user = await api.getUserInfo(uid);
  const userName = user[uid].name;
  return { uid, userName };
}

async function getUserInfoFromID(api, userId) {
  const user = await api.getUserInfo(userId);
  const userName = user[userId].name;
  return { uid: userId, userName };
}

async function getUserInfoFromFacebookLink(api, link, usersData) {
  const { findUid } = global.utils;
  let linkUid;

  try {
    linkUid = await findUid(link);
  } catch (error) {
    console.error(error);
    throw new Error("⚠ |  I couldn't find this ID/Link\n\nplease try again With UID \n\nExample ➾ .profile 100091338002191");
  }

  if (linkUid) {
    const user = await api.getUserInfo(linkUid);
    const userName = user[linkUid].name;
    return { uid: linkUid, userName };
  }
}

async function getUserInfoFromSender(api, event) {
  const uid = event.senderID;
  const user = await api.getUserInfo(uid);
  const userName = user[uid].name;
  return { uid, userName };
}