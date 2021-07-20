module.exports = {
    createHeaders() {
        return {
            'x-api-token': process.env.API_TOKEN
        }
    },
    handleReturn (isSlash, message, reply) {
        if(isSlash){
            return reply;
        }
        else {
            message.reply(reply);
            return reply;
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
        return discordUser.hasPermission("ADMINISTRATOR") || discordUser.roles.cache.has(process.env.ORGANIZER_ROLE_ID);
    }
}