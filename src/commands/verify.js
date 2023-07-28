const fs = require('fs');
const path = require('path');
const UserController = require('../controllers/UserController');
const util = require('../util');
const {CommandType} = require("wokcommands");

module.exports = {
    guildOnly: true,
    description: 'Verify yourself and associate your Discord account with your Hack the 6ix account.',
    minArgs: 1,
    expectedArgs: '<email>',
    category: 'Setup',
    type: CommandType.BOTH,
    deferReply: "ephemeral",
    callback: async ({ args, text, message, member, channel, client }) => {
        let email = args[0] || args[args.length-1];
        email = email.trim();
        email = email.replace(/[\u200B-\u200D\uFEFF]/g, '');

        const [userID, discordUser, isSlash] = await util.getCommandMetadata(member, message, channel);

        try {
            if(!isSlash && message.channel.id !== process.env.VERIFICATION_CHANNEL_ID){
                return await util.handleReturn(isSlash, message, discordUser, "You may only verify in the verification channel!");
            }
            if(discordUser.roles.cache.has(process.env.VERIFIED_ROLE_ID)){
                return await util.handleReturn(isSlash, message, discordUser, "You have already verified!");
            }
            if(!email){
               return await util.handleReturn(isSlash, message, discordUser, "Please enter the email associated with your account.");
            }

            const verifyData = await UserController.verifyUser(email, userID, discordUser.user.discriminator === "0" ? discordUser.user.username : `${discordUser.user.username}#${discordUser.user.discriminator}`);

            await util.processVerification(verifyData, discordUser);

            return await util.handleReturn(isSlash, message, discordUser, "Successfully verified!");
        }
        catch (e) {
            console.log(e);
            return await util.handleReturn(isSlash, message, discordUser, e.publicMessage ?? 'There was an error verifying you. Please contact an organizer.');
        }
    }
}
