const fs = require('fs');
const path = require('path');
const UserController = require('../controllers/UserController');
const { handleCommandError } = require('../util');
const util = require('../util');

const rolesMap = JSON.parse(fs.readFileSync(path.join("data", "rolesmap.json")).toString())

module.exports = {
    guildOnly: true,
    description: 'Verify yourself and associate your Discord account with your Hack the 6ix account.',
    minArgs: 1,
    expectedArgs: '<email>',
    category: 'Setup',
    callback: async ({ args, text, message, member, channel, client }) => {
        const [email] = args;

        const [userID, discordUser, isSlash] = await util.getCommandMetadata(member, message, channel);

        try {
            if(message.channel.id !== process.env.VERIFICATION_CHANNEL_ID){
                return await util.handleReturn(isSlash, message, discordUser, "You may only verify in the verification channel!");
            }
            if(discordUser.roles.cache.has(process.env.VERIFIED_ROLE_ID)){
                return await util.handleReturn(isSlash, message, discordUser, "You have already verified!");
            }

            const verifyData = await UserController.verifyUser(email, userID, `${discordUser.user.username}#${discordUser.user.discriminator}`);

            for(const role of verifyData.roles){
                try {
                    if(rolesMap[role]){
                        await discordUser.roles.add(rolesMap[role]);
                    }
                }
                catch(ignored){
                    //ignored
                }                
                
            }

            if(verifyData.suffix) {
                await discordUser.setNickname(`${verifyData.firstName} (${verifyData.suffix})`);
            }
            else {
                await discordUser.setNickname(`${verifyData.firstName} ${verifyData.lastName}`);
            }

            return await util.handleReturn(isSlash, message, discordUser, "Successfully verified!");
        }
        catch (e) {
            console.log(e);
            return await util.handleReturn(isSlash, message, discordUser, e.publicMessage ?? 'There was an error verifying you. Please contact an organizer.');
        }
    },
    error: async (data) => {
        await handleCommandError(data);
    }
}