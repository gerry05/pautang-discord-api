const {BOT_TOKEN,GOOGLE_SCRIPT_URL} = require('./config.json');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');
const app = express();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});


const ALLOWED_CHANNELS = ['1302207599361654794']; // Add your channel IDs here

// Express server setup for testing and handling requests
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

client.on('messageCreate', async message => {
  console.log('Message received: ', message.content);

  if (!ALLOWED_CHANNELS.includes(message.channel.id)) return; // Restrict to specific channels

  if (message.content.startsWith('/balance')) {
    const name = message.content.split(' ')[1];
    try {
      const response = await axios.get(`${GOOGLE_SCRIPT_URL}?name=${name}`);
      message.channel.send(response.data);
    } catch (error) {
      message.channel.send('There was an error retrieving the balance.');
      console.error('Error fetching balance:', error);
    }
  }
});

client.login(BOT_TOKEN);
