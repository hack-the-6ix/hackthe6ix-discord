const axios = require('axios');
const util = require("../util");


const QueueController = {};

QueueController.getNext = async function() {
    const verifyData = await axios({
        url: process.env.API_HOST + "/api/action/getNextQueuedDiscordVerification",
        method: "GET",
        headers: {
            ...util.createHeaders()
        }
    });

    return verifyData.data.message;
}

QueueController.requeue = async function(queuedVerificationID) {
    await axios({
        url: process.env.API_HOST + "/api/action/requeueDiscordVerification",
        method: "POST",
        headers: {
            ...util.createHeaders()
        },
        data: {
            queuedVerificationID,
            earliestRetryAt: Date.now() + 30 * 1000
        }
    });

}

module.exports = QueueController;