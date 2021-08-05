const util = require('../util');
const jutil = require('util');

const WatchController = require('../controllers/WatchController');

module.exports = {
    guildOnly: true,
    description: 'Lists all active meeting watches.',
    category: 'Organizer',
    callback: async ({ args, text, message, member, channel, client }) => {
        const [userID, discordUser, isSlash] = await util.getCommandMetadata(member, message, channel);

        if(util.isUserAdmin(discordUser)){
            return await util.handleReturn(isSlash, message, discordUser, jutil.inspect(WatchController.getWatches()));
        }
        else {
            return await util.handleReturn(isSlash, message, discordUser, "This command is only available to organizers.");
        }
    },
    error: async (data) => {
        await handleCommandError(data);
    }
}