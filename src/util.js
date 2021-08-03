const ADMIN_ROLES = process.env.ADMIN_ROLE_IDS.split(",");
module.exports = {
    createHeaders() {
        return {
            'x-api-token': process.env.API_TOKEN
        }
    },
    async handleReturn (isSlash, message, discordUser, reply, isError=false) {
        if(isSlash){
            if(isError){
                try {
                    await discordUser.send(reply);
                    return "There was an error. Please check your DMs for more information."
                }
                catch(err){
                    return reply;
                }
            }
            return reply;
        }
        else {
            try {
                await discordUser.send(reply);
            }
            catch(err){
                return reply;
            }
        }
    },
    async getCommandMetadata(member, message, channel) {
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

        return [userID, discordUser, isSlash];
    },
    isUserAdmin(discordUser) {
        if(discordUser.hasPermission("ADMINISTRATOR")){
            return true;
        }

        for(const role of ADMIN_ROLES){
            if(discordUser.roles.cache.has(role)){
                return true;
            }
        }
        return false;
    }
}