const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Discord.Client();

var seen_words = {};
fs.readFileSync(path.join(__dirname, './seen_words.txt'), {encoding: 'utf8'}).split("\n").forEach(function(phrase) {
  seen_words[phrase] = true;
});

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  // Ignore our own messages
  if (msg.author.id == client.user.id) {
    return;
  }

  var last_word = "";
  msg.content.toUpperCase().replace(/[^0-9A-ZÁÉÍÓÚÄËÏÖÜÂÊÎÔÛÅØŒßÇÃÕÑÀÈÌÒÙÆ™£¢∞ ]/g, '').split(" ").forEach(function(word) {

    if (word.length == 0) {
      return;
    }
    if (word.length == 8) {
      phrase = word.substring(0,4) + " " + word.substring(4,8);
      if (seen_words[phrase] != true) {
        msg.reply(":punch: " + phrase + " :punch:");
        seen_words[phrase] = true;
	fs.createWriteStream(path.join(__dirname, './seen_words.txt'), {flags: 'a'}).end(phrase + "\n");
      }
      last_word = "";
    }

    if (word.length != 4) {
      last_word = "";
      return;

    }
    if (last_word == "") {
      last_word = word;
    } else {
      phrase = last_word + " " + word;
      if (seen_words[phrase] != true) {
        msg.reply(":punch: " + phrase + " :punch:");
        seen_words[phrase] = true;
	fs.createWriteStream(path.join(__dirname, './seen_words.txt'), {flags: 'a'}).end(phrase + "\n");
      }
      last_word = word;
    }
  });
});

client.login('token');
