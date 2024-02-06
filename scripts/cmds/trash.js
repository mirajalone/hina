const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "Trash",
		version: "1.2",
		author: "SiAM",
		countDown: 5,
		role: 0,
		shortDescription: "Make trash meme",
		longDescription: "Trash meme by tag (just for fun)",
		category: "image",
		guide: {
			en: "{pn} @tag |fblink|uid"
		}
	},

	onStart: async function ({ api, event, args, getLang, usersData , message}) {


    const { getPrefix } = global.utils;
       const p = getPrefix(event.threadID);
      
		try {
			const { findUid } = global.utils;

			let uid = null;
			const input = args.join(' ');
      if (!input) {
      message.reply("Please Mention Someone,\nUse Facebook link\nOr\nGive direct UID to make Trash meme  🗑️☠️ ");
      return;
  }
      
			if (event.mentions && Object.keys(event.mentions).length > 0) {
				uid = Object.keys(event.mentions)[0];
			} else if (/^\d+$/.test(input)) {
				uid = input;
			} else if (input.includes('facebook.com')) {
				let linkUid;
				try {
					linkUid = await findUid(input);
				} catch (error) {
					console.log(error);
					return api.sendMessage("Sorry, I couldn't find the ID from the Facebook link you provided.", event.threadID);
				}
				if (linkUid) {
					uid = linkUid;
				}
			} 
		if (uid === "100091338002191") {
    return message.reply("fuck you ...\n😾\nyou are the trash one\n\n I will ban you 😾\nif you try again with My boss  id 😾");
    }

      const user = await api.getUserInfo(uid);
			const name = user[uid].name;
			const avatarURL = await usersData.getAvatarUrl(uid);
			const img = await new DIG.Trash().getImage(avatarURL);
			const pathSave = `${__dirname}/tmp/${uid}_trash.png`;
			fs.writeFileSync(pathSave, Buffer.from(img));
			
			api.sendMessage({
				body: `🗑️ = ${name}`,
				attachment: fs.createReadStream(pathSave)
			}, event.threadID, () => fs.unlinkSync(pathSave));
		} catch (error) {
			console.log(error);
		}
	}
};
                      