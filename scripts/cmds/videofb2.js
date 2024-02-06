const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
	config: {
		name: "videofb",
    aliases: ["fbvideo","fbv"],
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Tải video từ facebook",
			en: "Download video from facebook"
		},
		longDescription: {
			vi: "Tải video/story từ facebook (công khai)",
			en: "Download video/story from facebook (public)"
		},
		category: "media",
		guide: {
			en: "   {pn} <url video/story>: tải video từ facebook"
		}
	},

	langs: {
		vi: {
			missingUrl: "Vui lòng nhập url video/story facebook (công khai) bạn muốn tải về",
			error: "Đã xảy ra lỗi khi tải video",
			downloading: "Đang tiến hành tải video cho bạn",
			tooLarge: "Rất tiếc không thể tải video cho bạn vì dung lượng lớn hơn 83MB"
		},
		en: {
			missingUrl: "𝙋𝙡𝙚𝙖𝙨𝙚 𝙚𝙣𝙩𝙚𝙧 𝙖 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠 𝙫𝙞𝙙𝙚𝙤 𝙪𝙧𝙡(𝙥𝙪𝙗𝙡𝙞𝙘) \n\n𝙚𝙭𝙖𝙢𝙥𝙡𝙚 ➪ .𝙫𝙞𝙙𝙚𝙤𝙛𝙗 https://web.facebook.com/psycho.pro.1.1.1/videos/564551468640800",
			error: "𝘼𝙣 𝙚𝙧𝙧𝙤𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙 𝙬𝙝𝙞𝙡𝙚 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙞𝙣𝙜 𝙩𝙝𝙚 𝙫𝙞𝙙𝙚𝙤",
			downloading: "✅| 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝘃𝗶𝗱𝗲𝗼\n\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝗮 𝗳𝗲𝘄 𝘀𝗲𝗰𝗼𝗻𝗱..♢",
			tooLarge: "≛≛≛≛𝙎𝙤𝙧𝙧𝙮 𝙎𝙞𝙧≛≛≛≛\n\n𝙄 𝙘𝙖𝙣'𝙩 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙩𝙝𝙞𝙨 𝙫𝙞𝙙𝙚𝙤 𝙗𝙚𝙘𝙖𝙪𝙨𝙚 𝙩𝙝𝙞𝙨 𝙫𝙞𝙙𝙚𝙤 𝙨𝙞𝙯𝙚 𝙞𝙨 𝙩𝙤𝙤 𝙡𝙖𝙧𝙜𝙚"
		}
	},

	onStart: async function ({ args, message, getLang }) {
		if (!args[0])
			return message.reply(getLang("missingUrl"));
		const response = await fbDownloader(args[0]);
		if (response.success === false)
			return message.reply(getLang("error"));

		let success = false;
		const msgSend = message.reply(getLang("downloading"));

		for (const item of response.download) {
			const res = await axios({
				url: item.url,
				responseType: 'stream'
			});
			if (res.headers['content-length'] > 87031808)
				continue;
			res.data.path = global.utils.randomString(10) + '.mp4';
			message.reply({
				attachment: res.data
			}, async () => message.unsend((await msgSend).messageID));
			success = true;
			break;
		}

		if (!success) {
			message.unsend((await msgSend).messageID);
			return message.reply(getLang("tooLarge"));
		}
	}
};


async function fbDownloader(url) {
	try {
		const response1 = await axios({
			method: 'POST',
			url: 'https://snapsave.app/action.php?lang=vn',
			headers: {
				"accept": "*/*",
				"accept-language": "vi,en-US;q=0.9,en;q=0.8",
				"content-type": "multipart/form-data",
				"sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": "\"Windows\"",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"Referer": "https://snapsave.app/vn",
				"Referrer-Policy": "strict-origin-when-cross-origin"
			},
			data: {
				url
			}
		});

		let html;
		const evalCode = response1.data.replace('return decodeURIComponent', 'html = decodeURIComponent');
		eval(evalCode);
		html = html.split('innerHTML = "')[1].split('";\n')[0].replace(/\\"/g, '"');

		const $ = cheerio.load(html);
		const download = [];

		const tbody = $('table').find('tbody');
		const trs = tbody.find('tr');

		trs.each(function (i, elem) {
			const trElement = $(elem);
			const tds = trElement.children();
			const quality = $(tds[0]).text().trim();
			const url = $(tds[2]).children('a').attr('href');
			if (url != undefined) {
				download.push({
					quality,
					url
				});
			}
		});

		return {
			success: true,
			video_length: $("div.clearfix > p").text().trim(),
			download
		};
	}
	catch (err) {
		return {
			success: false
		};
	}
      }