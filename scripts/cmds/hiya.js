const axios = require("axios")
module.exports = {
	config: {
		name: 'hiya',
		version: '1.2',
		author: 'nihan',
		countDown: 0,
		role: 0,
		shortDescription: 'Chat with niha',
		longDescription: {
			vi: 'Chat với simsimi',
			en: 'Chat with hina'
		},
		category: 'AI',
		guide: {
			vi: "   {pn} [on | off]: bật/tắt simsimi"
				+ "\  {pn} <word>: chat nhanh với simsimi"
				+ "\  Ví dụ:\  {pn} hi",
			en: "   {pn} <word>: chat with Nino"
				+ "\  Example:\  {pn} hi"
		}
	},

	langs: {
		vi: {
			turnedOn: 'Bật simsimi thành công!',
			turnedOff: 'Tắt simsimi thành công!',
			chatting: 'Đang chat với simsimi...',
			error: 'Simsimi đang bận, bạn hãy thử lại sau'
		},
		en: {
			turnedOn: 'Turned on Nino no prefix chat successfully!',
			turnedOff: 'Turned off hiya  prefix chat successfully!',
			chatting: 'Already Chatting with hiya..',
			error: 'What?😒'
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
        console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({
        'text': yourMessage,
        'lc': 'en'
    })
);

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.message;
      }