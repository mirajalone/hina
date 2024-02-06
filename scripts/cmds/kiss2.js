const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Jimp = require("jimp");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "kiss2",
    version: "1.0",
    author: "nihan",
    countDown: 6,
    role: 0,
    shortDescription: "kiss edit use /help kiss\nto see how to use the commond ",
    longDescription: "Single Mention: create a kiss edit with sender id and mention id [in single mention sender user pic will set as boy in template].\nor\nDouble Mention [@tag1 @tag2] : create a kiss edit with two mentioned profile pictures [in double mention first mentioned id will set as girl and 2nd mentioned will be set as boy in edit template]",
    category: "NSFW",
    guide: {
      en: "{pn} @tag |{pn} @tag1 @tag2"
    }
  },

  onStart: async function ({ api, args, message, event, threadsData, usersData }) {
    const { getPrefix } = global.utils;
       const p = getPrefix(event.threadID);
    const approvedmain = JSON.parse(fs.readFileSync(`${__dirname}/assist_json/approved_main.json`));
    const bypassmain = JSON.parse(fs.readFileSync(`${__dirname}/assist_json/bypass_id.json`));
    const bypassmUid = event.senderID;
    if (bypassmain.includes(bypassmUid)) {
      console.log(`User ${bypassmUid} is in bypass list. Skipping the main approval check.`);
    } else {
      const threadmID = event.threadID;
      if (!approvedmain.includes(threadmID)) {
        const msgSend = message.reply(`cmd 'kiss' is locked 🔒...\n Reason : Bot's main cmd \nyou need permission to use all main cmds.\n\nType ${p}requestMain to send a request to admin`);
        setTimeout(async () => {
          message.unsend((await msgSend).messageID);
        }, 40000);
        return;
      }
    }  

    let uid1 = null, uid2 = null;
    const input = args.join(' ');

    if (event.mentions && Object.keys(event.mentions).length === 2) {
        uid1 = Object.keys(event.mentions)[0];
        uid2 = Object.keys(event.mentions)[1];
    } else if (event.mentions && Object.keys(event.mentions).length === 1) {
        uid1 = event.senderID;
        uid2 = Object.keys(event.mentions)[0];
    } else {
        return message.reply('This Command will only work with mention.\nPlease use👇\nSingle Mention: for use your own id as a boy in template and mention id will be girl in template.\nDouble Mention: first @tag1 will be girl and @tag2 will be boy in template\n Thank You❤️');
    }

    //only nihan 
    if ((uid1 === '100081658294585' || uid2 === '100081658294585') && (uid1 !== '100010335499038' && uid2 !== '100010335499038')) {
  uid1 = '100010335499038';
  uid2 = '100081658294585';
  message.reply("sorry🥱💁\n\nI only love nihan 😌💗");
    }

    const profilePicUrl1 = `https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const profilePicUrl2 = `https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const userInfo1 = await api.getUserInfo(uid1);
const userInfo2 = await api.getUserInfo(uid2);
const userName1 = userInfo1[uid1].name;
const userName2 = userInfo2[uid2].name;

    const profilePicStream1 = await getStreamFromURL(profilePicUrl1);
    const profilePicStream2 = await getStreamFromURL(profilePicUrl2);

    const templateURL = "https://i.ibb.co/p4crnGh/Picsart-23-04-14-16-41-11-937.jpg";


    const processingMessage = await message.reply("Image is Processing.\nPlease wait up to 30s");


    axios.all([axios.get(profilePicUrl1, { responseType: "arraybuffer" }), axios.get(profilePicUrl2, { responseType: "arraybuffer" }), axios.get(templateURL, { responseType: "arraybuffer" })])
    .then(axios.spread(async (profilePic1Response, profilePic2Response, templateResponse) => {
      const profilePic1 = await Jimp.read(profilePic1Response.data);
profilePic1.circle();
      profilePic1.rotate(26);

      const profilePic2 = await Jimp.read(profilePic2Response.data);
profilePic2.circle();
      const template = await Jimp.read(templateResponse.data);

      profilePic1.resize(500, 500);
      profilePic2.resize(350, 350);

      template.composite(profilePic1, 200, 300);
      template.composite(profilePic2, 600, 150);

      const outputBuffer = await template.getBufferAsync(Jimp.MIME_PNG);
      fs.writeFileSync(`${uid1}_${uid2}_kiss.jpg`, outputBuffer);

message.reply({
    body: `${userName1}\n🫦\n${userName2}\nEnjoy the kiss! 😘`,
    attachment: fs.createReadStream(`${uid1}_${uid2}_kiss.jpg`)
}, () => fs.unlinkSync(`${uid1}_${uid2}_kiss.jpg`));
      message.unsend((await processingMessage).messageID);
    })).catch((error) => {
      console.log(error);
      message.reply("There was an error processing the image.");
    });
  }
};

