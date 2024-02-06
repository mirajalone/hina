const fs = require('fs');

module.exports = {
    config: {
        name: "antiout",
        version: "1.1",
        author: "SiAM",
      category: "events"
    },

    onStart: async function ({ api, event }) {
        const allowedGroups = JSON.parse(fs.readFileSync('antiout.json'));
        if (!allowedGroups.includes(event.threadID)) {
            return;
        }
        const threadInfo = await api.getThreadInfo(event.threadID);

        if (event.logMessageType === "log:unsubscribe") {
            const logMessageBody = event.logMessageBody.toLowerCase();
            const removedByAdmin = logMessageBody.includes("removed") && logMessageBody.includes("from the group.");

            // Get the name of the user who left the group
            const userId = event.logMessageData.leftParticipantFbId;
            const userInfo = await api.getUserInfo(userId);
            const userName = userInfo[userId].name;

            // Add the user back to the group if they were not removed by an admin
            if (!removedByAdmin && userId !== api.getCurrentUserID()) {
                await api.addUserToGroup(userId, event.threadID);

                // Send a message to the group indicating that the user has been added back
                const message = ` ${userName} আমার পারমিশন ছাড়া গ্রুপ থেকে লিফট নিতে পারবি না`;
                await api.sendMessage(message, threadInfo.threadID);
            } else {
                // Send a message to the group indicating that the user won't be added back
                const message = ` ${userName} তুই গ্রুপে থাকার যোগ্য না`;
                await api.sendMessage(message, threadInfo.threadID);
            }
        }
    }
};