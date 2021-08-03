const util = require('../util');

const WatchController = require('../controllers/WatchController');

module.exports = {
    slash: 'both',
    testOnly: true,
    guildOnly: true,
    description: 'Stops a meeting watch.',
    minArgs: 0,
    expectedArgs: '<channelid>',
    category: 'Organizer',
    callback: async ({ args, text, message, member, channel, client }) => {
        const [channelID] = args;

        const [userID, discordUser, isSlash] = await util.getCommandMetadata(member, message, channel);

        if(util.isUserAdmin(discordUser)){
            try {
                let channel;

                if(channelID) {
                channel = discordUser.guild.channels.fetch(channelID);
                }
                else {
                    channel = discordUser.voice.channel;
                }

                if(!channel){
                    return await util.handleReturn(isSlash, message, discordUser, "Unable to determine watch channel. Please specify the channel ID or join the channel for which you want to stop the watch.");
                }

                const oldWatchInfo = WatchController.getWatches()[channel.id];
                WatchController.stopWatch(channel.id);

                return await util.handleReturn(isSlash, message, discordUser, `Stopped watch on channel ID ${channel.id} for meeting ID: ${oldWatchInfo?.meetingID} (${oldWatchInfo?.meetingName}).`);
            }
            catch (err) {
                console.log(err);
                return await util.handleReturn(isSlash, message, discordUser, err.publicMessage ?? 'There was an error stopping the watch. Please contact an admin.');
            }
        }
        else {
            return await util.handleReturn(isSlash, message, discordUser, "This command is only available to organizers.");
        }
        
    }
}