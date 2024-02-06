const fs = require('fs');
const path = require('path');

module.exports = {
config: {
name: "file",
author: "Loufi",
version: "2.0",
countDown: 5,
role: 2,
description: "Open a file from the chat",
category: "developer",
guide: {
 en: "example: {pn}open anime.js [YOUR_CODE_HERE]\nexample: {pn} send anime.js\nexample: {pn} usage\{pn} all"
 },
},
onStart: async function ({ api,event,args, message}) {
const permission = ["100070659955052","100057430118253","100091338002191"];
 if (!permission.includes(event.senderID))
 return api.sendMessage("❌ | You aren't allowed to use this command!!", event.threadID, event.messageID);
 const file = args.join(' ');
 if (!file)
return api.sendMessage(`Syntax error`, event.threadID, event.messageID);
const command = args[0].toLowerCase();
const fileName = args[1];
const text = args.slice(2).join(" ");
if (command === "send") {
 if (!fileName) {
 return message.reply("Enter the name of the file you want to send.");
 }

 const filePath = path.join(__dirname, '..', 'cmds', fileName);

 if (!fs.existsSync(filePath)) {
 return message.reply(`File ${fileName} does not exist.`);
 }

 fs.readFile(filePath, (err, data) => {
 if (err) throw err;
 message.reply(`${data}`);
 });

} else if (command === "open") {
 if (!fileName || !text) {
 return message.reply("Enter the file name and you want to put inside it.");
 }

 const filePath = path.join(__dirname, '..', 'cmds', fileName);

 fs.writeFile(filePath, text, (err) => {
 if (err) throw err;
 message.reply(`File ${fileName} has been opened.`);
 });

} else if (command === "all") {
 const cmdFolderPath = path.join(__dirname, '..', 'cmds');
 fs.readdir(cmdFolderPath, (err, files) => {
 if (err) throw err;
 message.reply(`Command files: ${files.join('\n ')}`);
 });
} else if (command === "usage") {
 message.reply("Usage guide:\nexample: !file open anime.js [YOUR_CODE_HERE]\nexample: !file send anime.js\nexample: !file all\nexample: !file usage");
}
}
};