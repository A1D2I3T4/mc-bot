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

      // Register (only if server asks)
      if (lower.includes('/register') && !registered) {
        registered = true;
        console.log('📝 Registering...');
        bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
      }

      // Login (only when needed)
      if (lower.includes('/login') && !logged && !lower.includes('success')) {
        logged = true;
        console.log('🔑 Logging in...');
        setTimeout(() => {
          bot.chat(`/login ${PASSWORD}`);
        }, 2000);
      }

      // Detect successful login
      if (lower.includes('successfully logged') || lower.includes('logged in')) {
        console.log('🎉 Logged in successfully!');
      }

      // Welcome players
      if (lower.includes('joined the game')) {
        const player = msg.split(' ')[0];
        setTimeout(() => {
          bot.chat(`Welcome ${player}! 👋`);
        }, 2000);
      }
    });

    // Disconnection handling
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

    // Anti-AFK (jump every 30s)
    setInterval(() => {
      if (!bot.entity) return;
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000);

    // Advertise links every 5 minutes
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
  