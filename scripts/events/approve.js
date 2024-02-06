const fs = require('fs');

module.exports = {
    config: {
        name: "approve",
        version: "2.0",
        author: "RUBISH",
        category: "OWNER"
    },

    langs: {
        vi: {
            rubishapproval: `
⚠️❌This Group Is Not Approved Bot Will Leave Under 60 Seconds Please Get Approval By Bot owner 

owner id link.....
﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏

﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏`
        },
        en: {
            rubishapproval: `Hi, Thanks for adding me to the group😊

But you need approval to use the bot🙂
Please contact the admin 📱

💬 m.me/100057430118253

 I have to leave the chat now. Thank you!`
        }
    },

    onStart: async ({ event, api, getLang }) => {
        if (event.logMessageType == "log:subscribe") {
            return async function () {
                const { threadID } = event;

                const allowedGroups = JSON.parse(fs.readFileSync('approve.json'));

                if (!allowedGroups.includes(threadID)) {
                    const botUserID = api.getCurrentUserID();
                    api.sendMessage({
                        body: getLang("rubishapproval"),
                        mentions: [
                            {
                                tag: "Admin",
                                id: botUserID
                            }
                        ]
                    }, threadID);
                    setTimeout(() => {
                        api.removeUserFromGroup(botUserID, threadID);
                    }, 60000);
                }
            };
        }
    }
};