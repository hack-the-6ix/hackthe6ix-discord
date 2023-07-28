const util = require('../util');
const jutil = require('util');

const WatchController = require('../controllers/WatchController');
const {CommandType} = require("wokcommands");

module.exports = {
    guildOnly: true,
    description: 'Lists all active meeting watches.',
    category: 'Organizer',
    type: CommandType.LEGACY,
    callback: async ({ args, text, message, member, channel, client }) => {
        const [userID, discordUser, isSlash] = await util.getCommandMetadata(member, message, channel);

        if(util.isUserAdmin(discordUser)){
            return await util.handleReturn(isSlash, message, discordUser, jutil.inspect(WatchController.getWatches()));
        }
        else {
            return await util.handleReturn(isSlash, message, discordUser, "This command is only available to organizers.");
        }
    }
}