module.exports = {
  config: {
    name: "off",
    version: "1.0",
    author: "nihan",
    countDown: 0,
    role: 2,
    shortDescription: "Turn off bot",
    longDescription: "Turn off bot",
    category: "owner",
    guide: "{p}{n}"
  },
  onStart: async function ({event, api}) {
    api.sendMessage("╔════ஜ۩۞۩ஜ═══╗\n\n📴Successfully Turned Off Archives System ✅\n╚════ஜ۩۞۩ஜ═══╝",event.threadID, () =>process.exit(0))}
};