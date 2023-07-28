const ADMIN_ROLES = process.env.ADMIN_ROLE_IDS.split(",");

function setupRolesMap() {
    const rolesData = process.env.DISCORD_ROLES_MAP.split(",");
    const rolesMap = {};
    for(let i=0;i<rolesData.length/2;++i) {
        rolesMap[rolesData[i*2]] = rolesData[i*2 + 1];
    }

    return rolesMap;
}

const rolesMap = setupRolesMap();

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

Utils.processVerification = async (verifyData, discordUser, revert=false, unsetNickOnRevert=true) => {
    try {
        if(revert) {
            await discordUser.roles.remove(process.env.VERIFIED_ROLE_ID, "Reverting user verification.");
        }
        else {
            await discordUser.roles.add(process.env.VERIFIED_ROLE_ID, "Verified user.");
        }
    }
    catch(ignored){
        console.log(ignored);
    }

    for(const role of verifyData.roles){
        try {
            if(rolesMap[role]){
                if(revert) {
                    await discordUser.roles.remove(rolesMap[role], "Removing aux. roles on revert verify.");
                }
                else {
                    await discordUser.roles.add(rolesMap[role], "Adding aux. roles on verify.");
                }
            }
        }
        catch(ignored){
            //ignored
        }

    }

    if(revert) {
        await discordUser.setNickname(null, "Reverting Discord verification.")
    }
    else {
        if(verifyData.suffix) {
            await discordUser.setNickname(`${verifyData.firstName} (${verifyData.suffix})`, "Setting user info on verify.");
        }
        else {
            await discordUser.setNickname(`${verifyData.firstName} ${verifyData.lastName}`, "Setting user info on verify.");
        }
    }
}
module.exports = Utils;