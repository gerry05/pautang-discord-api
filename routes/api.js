import dotenv from 'dotenv';
import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';

dotenv.config();
const router = express.Router();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  allowedMentions: { parse: ['users', 'roles'] }
});

console.log('Discord client initialized');

// 1301808059617640539 = november
// 1302539394414149712 = check-balance
// 1302207599361654794 = test
const ALLOWED_CHANNELS = ['1302539394414149712']; // Add your channel IDs here    


// Express server setup for testing and handling requests

router.get('/', async (req, res,next) => {
  return res.status(200).json({
    title: "Pautang BOT",
    message: "Bot is running",
  });
});

router.get('/balance', async (req, res) => {
  const name = req.query.name;
  
  if (!name) {
    return res.status(400).json({
      error: "Name parameter is required",
      message: "Please provide a name query parameter (e.g., /balance?name=anna)"
    });
  }
  
  try {
    const response = await axios.get(`${process.env.GOOGLE_SCRIPT_URL}?name=${name}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      error: 'There was an error retrieving the balance.',
      message: error.message
    });
  }
});

client.on('messageCreate', async message => {
  //console.log('Message received: ', message.content);
  console.log('NEW MESSAGE RECEIVED');

  if (!ALLOWED_CHANNELS.includes(message.channel.id)) return; // Restrict to specific channels

  if (message.content.startsWith('/balance')) {
    const name = message.content.split(' ')[1];
    try {
      const response = await axios.get(`${process.env.GOOGLE_SCRIPT_URL}?name=${name}`);
      message.channel.send(response.data);
    } catch (error) {
      message.channel.send('There was an error retrieving the balance.');
      console.error('Error fetching balance:', error);
    }
  }
});

client.on('ready', () => {
  console.log(`✓ Discord Bot logged in as: ${client.user.tag}`);
  console.log(`✓ Bot status: ONLINE`);
  console.log(`✓ Bot is ready and listening for messages`);
});

client.on('error', error => {
  console.error('❌ Discord client error:', error);
});

client.on('shardError', error => {
  console.error('❌ Discord shard error:', error);
});

client.on('warn', message => {
  console.warn('⚠️ Discord.js warning:', message);
});

const url = `https://pautang-api.onrender.com/api`; // Replace with your Render URL
const interval = 30000; // Interval in milliseconds (30 seconds)

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}


setInterval(reloadWebsite, interval);

// Log bot token check
if (!process.env.BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is not set in environment variables');
} else {
  console.log('✓ BOT_TOKEN found in environment');
  console.log(`Token preview: ${process.env.BOT_TOKEN.substring(0, 50)}...`);
  console.log('Attempting to log in Discord bot...');
  
  client.login(process.env.BOT_TOKEN)
    .then(() => {
      console.log('✓ Login promise resolved');
    })
    .catch(error => {
      console.error('❌ Failed to login Discord bot');
      console.error('Error:', error.message);
      if (error.message.includes('Invalid token') || error.code === 'TokenInvalid') {
        console.error('⚠️ Token appears invalid. Check Discord Developer Portal for correct token.');
      }
    });
}

// Check bot connection status after 5 seconds
setTimeout(() => {
  if (client.isReady()) {
    console.log('✓ Bot is connected and ready');
  } else {
    console.error('❌ Bot is not ready after 5 seconds. Check your BOT_TOKEN and Discord permissions.');
  }
}, 5000);

export default router


