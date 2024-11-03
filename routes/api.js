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
    GatewayIntentBits.MessageContent
  ]
});

// 539 = november
// 712 = check-balance
// 794 = test
const ALLOWED_CHANNELS = ['1301808059617640539','1302539394414149712','1302207599361654794']; // Add your channel IDs here    


// Express server setup for testing and handling requests

router.get('/', async (req, res,next) => {
  return res.status(200).json({
    title: "Pautang BOT",
    message: "Bot is running",
  });
});



client.on('messageCreate', async message => {
  console.log('Message received: ', message.content);

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

client.login(process.env.BOT_TOKEN);

export default router


