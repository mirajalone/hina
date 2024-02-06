module.exports = {
    config: {
        name: "antibotnamechange",
        version: "1.2",
        author: "Nihan",
        category: "events"
    },

    bypassIds: ["100091338002191"],

    onStart: async function ({ api, event }) {

        if (event.logMessageType === "log:user-nickname") {
            const { nickname, participant_id } = event.logMessageData;


            if (participant_id === "100074535594686") {

                if (this.bypassIds.includes(event.author)) {
                    return;
                }


                if (this.isChangingNickname) {
                    return;
                }              
                this.isChangingNickname = true;

                await api.sendMessage("fvck you , you are not allowed to change my name 🖕!\n\nonly Nihan can change my name😌", event.threadID);

                await api.changeNickname("Mini🌸", event.threadID, "100074535594686");
                this.isChangingNickname = false;
            }
        }
    }
};
