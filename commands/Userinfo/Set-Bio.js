const { Client, Message, MessageEmbed } = require("discord.js");
const UserinfoConfig = require("../../database/Userinfo");

module.exports = {
  name: "set-bio",
  category: `Userinfo`,
  description: `Sets a bio to be viewed on your userinfo.`,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const bio = args.join(" ");
    const data = await UserinfoConfig.findOne({ userId: message.author.id });
    if (data)
      await UserinfoConfig.findOneAndUpdate(
        { userId: message.author.id },
        { Bio: bio }
      );
    if (!data)
      await UserinfoConfig.create({
        userId: message.author.id,
        Bio: bio,
      });
    message.reply({
      embed: client.embed({ description: `Bio set to: \`${bio}\`` }, message),
      allowedMentions: { repliedUser: false },
    });
  },
};
