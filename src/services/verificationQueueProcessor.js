const util = require("../util");
const QueueController = require('../controllers/QueueController');

const VerificationQueueProcessor = {};

VerificationQueueProcessor.startProcessing = function(client) {
    console.log("Starting verification queue processor.");
    return setInterval(async () => {
        try {
            const queueData = await QueueController.getNext();
            try {
                if(queueData) {
                    console.log(`Processing verification ${queueData.id} for ${queueData.discordID} in guild ${queueData.guildID}.`)
                    const guild = await client.guilds.fetch(queueData.guildID);
                    const discordUser = await guild.members.fetch(queueData.discordID);
                    await util.processVerification(queueData.verifyData, discordUser, queueData.revert);
                }
            }
            catch(e) {
                console.error("Error while processing verification queue.");
                if(e.code === 10007) {
                    console.error("Member is no longer in server. Skipping.")
                }
                else {
                    // only requeue if the queue item is less an hour old
                    if(queueData && queueData.queuedTime && Date.now() - queueData.queuedTime < 60 * 60 * 1000) {
                        await QueueController.requeue(queueData.id);
                    }
                }
            }
        }
        catch(e) {
            console.error("Unable to fetch/update verification queue.");
        }


    }, 500);
}

module.exports = VerificationQueueProcessor;