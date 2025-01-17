const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  userPermissions: "KICK_MEMBERS",
  args: true,
  guildOnly: true,
  category: `Moderation`,
  usage: "*kick [user]",
  description: `Kicks a member from the guild.`,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.guild.me.permissions.has("KICK_MEMBERS"))
      return message.reply({ embed:
        client.embed(
          {
            description: `Shiba does not have the \`KICK_MEMBERS\` permission.`,
          },
          message
        ),
        allowedMentions: { repliedUser: false },
      });
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No Reason Provided";
    if (member.kickable) {
      await member.kick({ reason: reason });
      message.reply({
        allowedMentions: {
          parse: ["everyone", "users", "roles"],
          repliedUser: false,
        },
        embed: client.embed(
          { description: `${member.user.tag} has been kicked` },
          message
        ),
      });
    } else {
      message.reply({
        embed: client.embed(
          { description: `I cannot kick this member.` },
          message
        ),
        allowedMentions: { repliedUser: false },
      });
    }
  },
};
