module.exports = {
  config: {
    name: "outall",
    author: "nihan",
    countDown: 0,
    role: 2,
    shortDescription: " ",
    longDescription: "",
    category: "admin",
    guide: "{pn}"
  },
  onStart: async function ({ api, event, args }) {
    const permission = ["100091338002191"];
             if (!permission.includes(event.senderID))
             return api.sendMessage("Nihan only can use this command", event.threadID, event.messageID);
	return api.getThreadList(100, null, ["INBOX"], (err, list) => {
		if (err) throw err;
		list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? api.removeUserFromGroup(api.getCurrentUserID(), item.threadID) : '');
		api.sendMessage(' Out of the whole group successfully', event.threadID);
	});
}
};