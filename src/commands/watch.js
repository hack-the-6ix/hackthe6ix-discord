const util = require('../util');

const MeetingController = require('../controllers/MeetingController');
const WatchController = require('../controllers/WatchController');

module.exports = {
    guildOnly: true,
    description: 'Start a watch for meeting stastics.',
    minArgs: 1,
    expectedArgs: '<meetingid> <channelid>',
    category: 'Organizer',
    callback: async ({ args, text, message, member, channel, client }) => {
        const [meetingID, channelID] = args;

        const [userID, discordUser, isSlash] = await util.getCommandMetadata(member, message, channel);

        if(util.isUserAdmin(discordUser)){
            try {
                const meetingInfo = await MeetingController.getMeetingInfo(meetingID);
                let channel;

                if(channelID) {
                channel = discordUser.guild.channels.fetch(channelID);
                }
                else {
                    channel = discordUser.voice.channel;
                }

                if(!channel){
                    return await util.handleReturn(isSlash, message, discordUser, "Unable to determine watch channel. Please specify the channel ID or join the channel for which you want to start the watch.", true);
                }

                await WatchController.startWatch(channel.id, meetingID, meetingInfo.name);

                return await util.handleReturn(isSlash, message, discordUser, `Started watch for meeting ID: ${meetingID} (${meetingInfo.name}).`);
            }
            catch (err) {
                console.log(err);
                return await util.handleReturn(isSlash, message, discordUser, err.publicMessage ?? 'There was an error starting the watch. Please contact an admin.', true);
            }
        }
        else {
            return await util.handleReturn(isSlash, message, discordUser, "This command is only available to organizers.");
        }
    }
}