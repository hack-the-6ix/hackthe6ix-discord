const PublicError = require('../errors/PublicError');
const MeetingController = require('./MeetingController');
const UserController = require('./UserController');

const WatchController = {};

/*
<channelID>: {
    meetingID: <backend meeting ID>
    meetingName: <backend meeting name>
}
 */
let watches = {};

WatchController.startWatch = async function(channelID, meetingID, meetingName) {
    if(watches[channelID]){
        throw new PublicError(`There is already a watch on this channel for meeting ID: ${watches[channelID]["meetingID"]} (${watches[channelID]["meetingName"]}). Please stop it before starting another one.`);
    }
    watches[channelID] = {
        meetingID, meetingName
    }
}

WatchController.stopWatch = function(channelID) {
    delete watches[channelID];
}

WatchController.handleEvent = async function(oldMember, newMember) {
    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;

    const userInfo = await UserController.getUserByDiscordID(newMember.id);

    if(userInfo){
        if(oldUserChannel && watches[oldUserChannel]) {
            // fire a leave event
            await MeetingController.recordMeetingLeave(watches[oldUserChannel]["meetingID"], userInfo._id)
        }

        if(newUserChannel && watches[newUserChannel]){
            // fire a join event
            await MeetingController.recordMeetingJoin(watches[newUserChannel]["meetingID"], userInfo._id)
        }
    }
    else {
        console.log(`Discord user ${newMember.id} not linked, ignoring voice state change.`);
    }
    
}

WatchController.getWatches = function() {
    return watches;
}

module.exports = WatchController;