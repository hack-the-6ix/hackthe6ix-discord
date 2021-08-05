const ADMIN_ROLES = process.env.ADMIN_ROLE_IDS.split(",");
const Utils = {};

Utils.createHeaders = () => {
    return {
        'x-api-token': process.env.API_TOKEN
    }
}

Utils.handleReturn = async (isSlash, message, discordUser, reply, isError=false) => {
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
        catch(ignored){
            
        }
    }
}
Utils.getCommandMetadata = async (member, message, channel) => {
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
}
    
Utils.isUserAdmin = (discordUser) => {
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

Utils.handleCommandError = async ({error, message, command, info}, returnMessage="There was an error. Please contact an organizer or administrator.") => {
    if(error === "INVALID ARGUMENTS"){
        return await Utils.handleReturn(false, message, message.member, "Invalid arguments. Please check the command's instructions and try again.");
    }
    else {
        return await Utils.handleReturn(false, message, message.member, returnMessage);
    }
}
module.exports = Utils;