const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// Syarat biar Render gak mati
const app = express();
app.get('/', (req, res) => res.send('Bot Aktif!'));
app.listen(process.env.PORT || 3000);

// Konfigurasi Bot
const token = '8730922956:AAH5EXhC4nM2bQv0dp5zJ12_FouqbnIfbGA'; 
const bot = new TelegramBot(token, { polling: true });

const API_URL = 'https://pacific-pedia.co.id/api/v1/check-id';
const API_KEY = 'PP697CtQIJ6P6m5816';

bot.onText(/\/cek (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const game = match[1]; 
    const userId = match[2];

    bot.sendMessage(chatId, '⌛ Sedang mengecek ID...');

    try {
        const res = await axios.post(API_URL, {
            api_key: API_KEY,
            game: game,
            user_id: userId
        });

        if (res.data && res.data.status) {
            const nick = res.data.data.username || res.data.nickname;
            bot.sendMessage(chatId, `✅ **Data Ditemukan!**\n\n👤 Nick: ${nick}\n🎮 Game: ${game.toUpperCase()}`, { parse_mode: 'Markdown' });
        } else {
            bot.sendMessage(chatId, `❌ Gagal: ${res.data.message || 'ID tidak ditemukan'}`);
        }
    } catch (e) {
        bot.sendMessage(chatId, '🔌 Gangguan koneksi ke server API.');
    }
});
