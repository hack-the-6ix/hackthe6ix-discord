const axios = require('axios');

const PublicError = require('../errors/PublicError');

const util = require('../util');

const MeetingController = {};

MeetingController.getMeetingInfo = async function(meetingID) {
    try {
        const meetingInfo = await axios({
            url: process.env.API_HOST + "/api/get/meeting",
            method: "POST", 
            headers: {
                ...util.createHeaders()
            },
            data: {
                filter: {
                    _id: meetingID
                }
            }
        });
        if(Array.isArray(meetingInfo.data?.message)){
            if(meetingInfo.data.message.length > 0){
                return meetingInfo.data.message[0];
            }
        }

        throw new Error();
    }
    catch(err){
        throw new PublicError("Unable to fetch the given meeting. Please check the ID and try again.");
    }
}

MeetingController.recordMeetingJoin = async function(meetingID, userID) {
    await axios({
        url: process.env.API_HOST + "/api/action/recordMeetingJoin",
        method: "POST", 
        headers: {
            ...util.createHeaders()
        },
        data: {
            meetingID, userID,
            time: Date.now()
        }
    });
}

MeetingController.recordMeetingLeave = async function(meetingID, userID) {
    await axios({
        url: process.env.API_HOST + "/api/action/recordMeetingLeave",
        method: "POST", 
        headers: {
            ...util.createHeaders()
        },
        data: {
            meetingID, userID,
            time: Date.now()
        }
    });
}

module.exports = MeetingController;