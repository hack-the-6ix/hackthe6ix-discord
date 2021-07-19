const axios = require('axios');
const util = require('../util');

const UserController = {};

UserController.verifyUser = async function(email, discordID, discordUsername) {
    try {
        const userData = await axios({
            url: process.env.API_HOST + "/api/action/verifyDiscord",
            method: "POST", 
            headers: {
                ...util.createHeaders()
            },
            data: {
                email, discordID, discordUsername
            }
        });

        return userData.data?.message;
    }
    catch(err) {
        if(err.response?.data?.status === 404) {
            throw Error("No unverified user found with the given email. If you previously verified, you can only reverify with the same Discord account. Contact an organizer for assistance if you're not sure what to do.");
        }
        throw err;
    }
}

module.exports = UserController;