const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Web server (keep-alive ping)
app.get("/", (req, res) => {
  res.send("🤖 Minecraft Bot is alive and running!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// Minecraft bot
const mineflayer = require('mineflayer');
const PASSWORD = '20112011adi';

function createBot() {
  console.log("🚀 Starting bot...");

  const bot = mineflayer.createBot({
    host: 'jonarchy.com',
    port: 25565,
    username: 'DeathVoxelBOT',
    version: false
  });

  let selectedAccount = false;
  let registered = false;
  let logged = false;

  // === GREETING SYSTEM ===
  const greetings = [
    "⚡ Welcome, {player}. The server watches.",
    "☠ {player} joined. Chaos level increased.",
    "👁 {player} entered the grid.",
    "🔥 {player} just spawned. Good luck.",
    "🛰 Tracking new entity: {player}",
    ">>> ⚡ WELCOME {player} <<<",
    "[ BOT LOG ] :: {player} joined ::"
  ];

  const seenPlayers = new Set();
  let lastGreet = 0;

  bot.on('login', () => {
    console.log('✅ Bot connected to server');
  });

  bot.on('spawn', () => {
    console.log('🎮 Bot spawned in game');
  });

  bot.on('messagestr', (msg) => {
    console.log("📩", msg);
    const lower = msg.toLowerCase();

    // Select NON-premium account
    if (lower.includes('premium account') && !selectedAccount) {
      selectedAccount = true;
      setTimeout(() => {
        console.log('👉 Selecting NON-premium...');
        bot.chat('/nlogin click notification 1 2');
      }, 2000);
    }

    // Register
    if (lower.includes('/register') && !registered) {
      registered = true;
      console.log('📝 Registering...');
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
    }

    // Login
    if (lower.includes('/login') && !logged && !lower.includes('success')) {
      logged = true;
      console.log('🔑 Logging in...');
      setTimeout(() => {
        bot.chat(`/login ${PASSWORD}`);
      }, 2000);
    }

    // Success login
    if (lower.includes('successfully logged') || lower.includes('logged in')) {
      console.log('🎉 Logged in successfully!');
    }

    // === ADVANCED GREETING (NO DELAY) ===
    if (lower.includes('joined the game')) {
      const player = msg.split(' ')[0];
      const now = Date.now();

      // Cooldown (anti-spam)
      if (now - lastGreet < 3000) return;
      lastGreet = now;

      let message;

      // Returning player detection
      if (seenPlayers.has(player)) {
        message = `👁 ${player}... you returned.`;
      } else {
        message = greetings[Math.floor(Math.random() * greetings.length)]
          .replace("{player}", player);
        seenPlayers.add(player);
      }

      // Rare event (10%)
      if (Math.random() < 0.1) {
        message = `🌌 ${player} has triggered a rare event...`;
      }

      // Instant send ⚡
      bot.chat(message);
    }
  });

  // Reconnect system
  bot.on('end', () => {
    console.log('⚠️ Disconnected. Reconnecting in 10 minutes...');
    setTimeout(createBot, 10 * 60 * 1000);
  });

  bot.on('kicked', (reason) => {
    console.log('🚫 Kicked:', reason);
  });

  bot.on('error', (err) => {
    console.log('💥 Error:', err);
  });

  // Anti-AFK
  setInterval(() => {
    if (!bot.entity) return;
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 30000);

  // Advertisements
  setInterval(() => {
    if (!bot.entity) return;
    bot.chat('https://www.youtube.com/@DeathVoxel');
    setTimeout(() => {
      bot.chat('jonarchyshop.weebly.com');
    }, 3000);
  }, 5 * 60 * 1000);
}

// Start bot
createBot();
  
