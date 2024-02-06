const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "pro",
    version: "1.0",
    author: "SiAM",
    countDown: 5,
    category:"s",
    role: 2
  },

  onStart: async function({ api, args, message, event }) {
    const threadID = event.threadID;
    const approvedIDsPath = path.join(__dirname, "assist_json", "approved_main.json");
    const pendingIDsPath = path.join(__dirname, "assist_json", "pending_main.json");

    if (args[0] === "add" && args[1]) {
      const id = args[1];
      const messageFromAdmin = args.slice(2).join(" ");

      let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath));
      if (approvedIDs.includes(id)) {
        message.reply("This thread ID is already approved to use main cmds from bot");
      } else {
        approvedIDs.push(id);
        fs.writeFileSync(approvedIDsPath, JSON.stringify(approvedIDs));
        api.sendMessage(`📌 Request Accepted📌\npro Cmds Unlocked\n\nyour request for use main cmds from bot has been approved by BotAdmin\nNow all locked commands will work for this thread.\n\nMessage from admin: ${messageFromAdmin} \n\n If you don't know how to use this bot then join the Marin support Box \nType : /support \nto join.`, id);
        message.reply("This Thread has been approved now to use main command");

        // Remove from pending IDs list
        let pendingIDs = JSON.parse(fs.readFileSync(pendingIDsPath));
        if (pendingIDs.includes(id)) {
          pendingIDs.splice(pendingIDs.indexOf(id), 1);
          fs.writeFileSync(pendingIDsPath, JSON.stringify(pendingIDs));
        }
      }
    } else if (args[0] === "remove" && args[1]) {
      const id = args[1];
      const reason = args.slice(2).join(" ");

      let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath));
      if (!approvedIDs.includes(id)) {
        message.reply("this thread id is not approved, so no need to remove ");
      } else {
        approvedIDs.splice(approvedIDs.indexOf(id), 1);
        fs.writeFileSync(approvedIDsPath, JSON.stringify(approvedIDs));
        api.sendMessage(`⚠️Warning ⚠️\nNow this Thread ID's permission has been disapproved or removed to use main commands from bot by Admin.\n\nReason: ${reason}\nContact SiAM for more \nFB: https://www.facebook.com/Siam.The.Fox\n\n Also you can join support box for more info \nType: /support\nto join`, id);
        message.reply("The thread ID has been removed from using main commend");
      }



                      } else if (args[0] === "disapproved" && args[1] && args[2]) {
      const id = args[1];
      const reason = args.slice(2).join(" ");

      let pendingIDs = JSON.parse(fs.readFileSync(pendingIDsPath));
      if (!pendingIDs.includes(id)) {
        message.reply("This thread ID is not pending approval.");
      } else {
        // Remove from pending IDs list
        pendingIDs.splice(pendingIDs.indexOf(id), 1);
        fs.writeFileSync(pendingIDsPath, JSON.stringify(pendingIDs));
        api.sendMessage(`⚠️ Warning ⚠️\nYour thread ID's permission to use main commands from bot has been disapproved by Admin. all pro cmds will be locked\n\nReason: ${reason}\nContact nihan for more information.\n\nor join the support box for more info \nType: /supportgc\to join `, id);
        message.reply("The thread ID has been disapproved for using main commands.");
          }






    } else if (args[0] === "check") {
      let approvedIDs = JSON.parse(fs.readFileSync(approvedIDsPath));
      if (approvedIDs.includes(threadID)) {
        message.reply("main is currently on for this thread.");
      } else {
        message.reply("main cmds is currently off for this thread.");
      }
    } else {
      message.reply(`Invalid command usage. Use "/help main" to see how to use this command.`);
    }
  },
};
