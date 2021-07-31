const util = require('../util');
const jutil = require('util');

const WatchController = require('../controllers/WatchController');

module.exports = {
    slash: 'both',
    testOnly: true,
    guildOnly: true,
    description: 'Lists all active meeting watches.',
    category: 'Organizer',
    callback: async ({ args, text, message, member, channel, client }) => {
        const [userID, discordUser, isSlash] = await util.getCommandMetadata(member, message, channel);

        if(util.isUserAdmin(discordUser)){
            return util.handleReturn(isSlash, message, jutil.inspect(WatchController.getWatches()));
        }
        else {
            return util.handleReturn(isSlash, message, "This command is only available to organizers.");
        }
    }
}