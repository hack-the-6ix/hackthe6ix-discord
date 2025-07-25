require("dotenv").config();
const path = require("path");
const { Client, IntentsBitField, Partials } = require("discord.js");
const WOK = require("wokcommands");

const util = require("./util");

const WatchController = require("./controllers/WatchController");
const UserController = require("./controllers/UserController");
const verificationQueueProcessor = require("./services/verificationQueueProcessor");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

client.on("ready", async () => {
  // The client object is required as the first argument.
  // The second argument is the options object.
  // All properties of this object are optional.

  new WOK({
    client,
    // The name of the local folder for your command files
    commandsDir: path.join(__dirname, "commands"),

    // If your commands should not be ran by a bot, default false
    ignoreBots: true,

    // What built-in commands should be disabled.
    // Note that you can overwrite a command as well by using
    // the same name as the command file name.
    disabledDefaultCommands: [
      WOK.DefaultCommands.ChannelCommand,
      WOK.DefaultCommands.CustomCommand,
      WOK.DefaultCommands.Prefix,
      WOK.DefaultCommands.RequiredPermissions,
      WOK.DefaultCommands.RequiredRoles,
      WOK.DefaultCommands.ToggleCommand
    ],
    defaultPrefix: process.env.COMMAND_PREFIX
  });

  console.log(`Logged in as ${client.user.tag}!`);
  await client.user.setPresence({
    activities: [{ name: "hackers hackin'' 🦈", type: 3 }],
    status: "online"
  });

  verificationQueueProcessor.startProcessing(client);
});

client.on("voiceStateUpdate", (oldMember, newMember) => {
  WatchController.handleEvent(oldMember, newMember);
});

client.on("messageCreate", (message) => {
  if (message.channel.id === process.env.VERIFICATION_CHANNEL_ID) {
    if (message.author.id === client.user.id) {
      return;
    }

    if (util.isUserAdmin(message.member)) {
      return;
    }
    message.delete();
  }
});

client.on("guildMemberAdd", async (member) => {
  let userInfo;

  console.log(member.user.tag + " joined the server");

  try {
    userInfo = await UserController.getUserByDiscordID(member.id);
  } catch (e) {
    console.log(member.user.tag + " user not found");
  }

  if (userInfo) {
    console.log(`${member.user.tag} is linked to ${userInfo.email}`);
    try {
      member.setNickname(userInfo.firstName + " " + userInfo.lastName);
      console.log(
        `${member.user.tag} nickname set to ${userInfo.firstName} ${userInfo.lastName}`
      );
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      console.log(`${member.user.tag} user not linked`);
    } catch (e) {
      console.log(e);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
