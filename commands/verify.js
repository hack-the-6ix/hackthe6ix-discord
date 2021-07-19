const fs = require('fs');
const path = require('path');
const UserController = require('../controllers/UserController');

const rolesMap = JSON.parse(fs.readFileSync(path.join("data", "rolesmap.json")).toString())

function handleReturn (isSlash, message, reply) {
    if(isSlash){
        return reply;
    }
    else {
        message.reply(reply);
        return reply;
    }
}

module.exports = {
    slash: 'both',
    testOnly: true,
    description: 'Verify yourself and associate your Discord account with your Hack the 6ix account.',
    minArgs: 1,
    expectedArgs: '<email>',
    category: 'Setup',
    callback: async ({ args, text, message, member, channel, client }) => {
        const [email] = args;

        let userID;
        let discordUser;
        let isSlash;

        if(message){
            userID = message.member.id;
            discordUser = message.member;
            isSlash = false;
        }
        else {
            userID = member.user.id;
            discordUser = await channel.guild.members.fetch(userID);
            isSlash = true;
        }

        try {
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

            return handleReturn(isSlash, message, "Successfully verified!");
        }
        catch (e) {
            console.log(e);
            return handleReturn(isSlash, message, e.message ?? 'There was an error verifying you. Please contact an organizer.');
        }
    }
}