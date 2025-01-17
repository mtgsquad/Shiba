const { Client, Message, MessageEmbed } = require("discord.js");
const WelcomeConfig = require("../../database/Welcome");

module.exports = {
  name: "welcome",
  guildOnly: true,
  userPermissions: ["MANAGE_GUILD"],
  category: `Guild Config`,
  description: `Update the welcome system for the guild.`,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const data = await WelcomeConfig.findOne({ guildId: message.guild.id });
    if (!args[0])
      return message.reply({
        embed: client.embed(
          {
            author: {
              name: "Welcome System Sub-Commands",
              icon_url: client.user.displayAvatarURL(),
            },
            fields: [
              {
                name: "set-channel",
                value: "Set the channel for users to be welcomes in.",
              },
              {
                name: "set-role",
                value: "Sets the role the user will recieve when they join.",
              },
              {
                name: "set-message",
                value:
                  "Sets the message the user with be welcomed with. Use {guild} to say the guild name and {user} to mention the user joining. `EX: *welcome message Welcome {user} to {guild}`",
              },
              {
                name: "enable",
                value: "Enables the welcome system.",
                inline: true,
              },
              {
                name: "disable",
                value: "Disables the welcome system.",
                inline: true,
              },
            ],
          },
          message
        ),
        allowedMentions: { repliedUser: false },
      });
    if (args[0].toLowerCase() === "set-channel") {
      const channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);
      if (!channel)
        return message.reply({
          allowedMentions: {
            parse: ["everyone", "users", "roles"],
            repliedUser: false,
          },
          embed: client.embed({ description: `Invalid channel.` }, message),
        });
      if (!data) {
        await WelcomeConfig.create({
          guildId: message.guild.id,
          channelId: channel.id,
        });
        message.reply({
          embed: client.embed(
            { description: `Channel set to <#${channel.id}>` },
            message
          ),
          allowedMentions: { repliedUser: false },
        });
      }
      if (data) {
        WelcomeConfig.findOneAndUpdate(
          { guildId: message.guild.id },
          { channelId: channel.id }
        );
        message.reply({
          embed: client.embed(
            { description: `Channel set to <#${channel.id}>` },
            message
          ),
          allowedMentions: { repliedUser: false },
        });
      }
    }
    if (args[0].toLowerCase() === "set-role") {
      const role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.has(args[1]);
      if (!role)
        message.reply({
          embed: client.embed({ description: `Invalid Channel.` }, message),
          allowedMentions: { repliedUser: false },
        });
      await WelcomeConfig.findOneAndUpdate(
        { guildId: message.guild.id },
        { roleId: role.id }
      );
      message.reply({
        embed: client.embed({ description: `Role set to ${role}.` }, message),
        allowedMentions: { repliedUser: false },
      });
    }
    if (args[0].toLowerCase() === "set-message") {
      const msg = args.slice(1).join(" ");
      if (!msg)
        return message.reply({
          embed: client.embed(
            {
              description: `Provide a welcome message.\nDon't forget you can use {guild} to use the guild name.\nYou can also use {user} to mention the user that is joining.`,
            },
            message
          ),
          allowedMentions: { repliedUser: false },
        });
      await WelcomeConfig.findOneAndUpdate(
        { guildId: message.guild.id },
        { message: msg }
      );
      message.reply({
        embed: client.embed(
          { description: `Welcome message set to ${msg}.` },
          message
        ),
        allowedMentions: { repliedUser: false },
      });
    }
    if (args[0].toLowerCase() === "enable") {
      await WelcomeConfig.findOneAndUpdate(
        { guildId: message.guild.id },
        { toggled: true }
      );
      message.reply({
        embed: client.embed(
          { description: `Welcome system enabled.` },
          message
        ),
        allowedMentions: { repliedUser: false },
      });
    }
    if (args[0].toLowerCase() === "disable") {
      await WelcomeConfig.findOneAndUpdate(
        { guildId: message.guild.id },
        { toggled: false }
      );
      message.reply({
        embed: client.embed(
          { description: `Welcome system disabled.` },
          message
        ),
        allowedMentions: { repliedUser: false },
      });
    }
  },
};
