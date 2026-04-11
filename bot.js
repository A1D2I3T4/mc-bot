const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// 💬 Chat storage
let chatLog = [];

// 🌐 Web server (dashboard instead of plain text)
app.get("/", (req, res) => {
  const players = Object.keys(currentBot?.players || {});

  res.send(`
    <html>
      <head>
        <title>Bot Dashboard</title>
        <meta http-equiv="refresh" content="2">
      </head>
      <body style="background:black; color:lime; font-family:monospace;">
        <h1>🤖 Live Chat</h1>
        <pre>${chatLog.join("\n")}</pre>

        <h2>👥 Players Online</h2>
        <pre>${players.join("\n")}</pre>
      </body>
    </html>
  `);
});

// 👥 Players API
app.get("/players", (req, res) => {
  const players = Object.keys(currentBot?.players || {});
  res.json(players);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// Minecraft bot
const mineflayer = require('mineflayer');
const PASSWORD = '20112011adi';

let currentBot = null;

function createBot() {
  console.log("🚀 Starting bot...");

  const bot = mineflayer.createBot({
    host: 'jonarchy.com',
    port: 25565,
    username: 'DeathVoxelBOT',
    version: false
  });
bot.on("death", () => {
  console.log("💀 Bot died... respawning!");
  
  setTimeout(() => {
    bot.respawn();
  }, 1000); // small delay to avoid bugs
});
  currentBot = bot; // 🔥 important for web access

  let selectedAccount = false;
  let registered = false;
  let logged = false;

  // === GREETING SYSTEM ===
  const greetings = [
    "{player}..... Sub to DeathVoxel on Youtube!",
    " Found your stash {player}... just kidding!",
    " A player joined! Who is it? It's {player}⚡⚡",
    " Meet {player} ⚡ !!! Be friendly!",
    " Make space for ⚡ {player}!",
    " I notice a player count increase:⚡ {player} came!!!",
    "⚡ {player} has come! beware!",
    " Everyone meet the KING: {player}!!!",
    " ⚡ Welcome {player} to Jonarchy!!!! ⚡ ",
    "oh! {player} came and I didn't even notice! Sorry :)",
    " :::::: {player} :::::: logged in! Welcome!",
    " Say hello to {player}!!. Make him feel comfortable :)",
    "⚡ Welcome, {player}. The server watches.",
    "☠ {player} joined. Chaos level increased.",
    "👁 {player} entered the grid.",
    "🔥 {player} just spawned. Good luck.",
    " ⚡ {player} has joined the arena!!!",
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

    // 💬 STORE CHAT
    chatLog.push(msg);
    if (chatLog.length > 50) chatLog.shift();

    const lower = msg.toLowerCase();

    // Select NON-premium account
    if (lower.includes('premium account') && !selectedAccount) {
      selectedAccount = true;
      setTimeout(() => {
        bot.chat('/nlogin click notification 1 2');
      }, 2000);
    }

    // Register
    if (lower.includes('/register') && !registered) {
      registered = true;
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
    }

    // Login
    if (lower.includes('/login') && !logged && !lower.includes('success')) {
      logged = true;
      setTimeout(() => {
        bot.chat(`/login ${PASSWORD}`);
      }, 2000);
    }

    // Success login
    if (lower.includes('successfully logged') || lower.includes('logged in')) {
      console.log('🎉 Logged in successfully!');
    }

    // === GREETING SYSTEM ===
    if (lower.includes('joined the game')) {
      const player = msg.split(' ')[0];
      const now = Date.now();

      if (now - lastGreet < 3000) return;
      lastGreet = now;

      let message;

      if (seenPlayers.has(player)) {
        message = `👁 ${player}... you returned.`;
      } else {
        message = greetings[Math.floor(Math.random() * greetings.length)]
          .replace("{player}", player);
        seenPlayers.add(player);
      }

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
    bot.chat(' Sub to this Channel on YT and GET FREE KITS: https://www.youtube.com/@DeathVoxel');
    setTimeout(() => {
      bot.chat('SHOP CHEAP KITS ON: jonarchyshop.weebly.com');
    }, 3000);
  }, 5 * 60 * 1000);
}

// Start bot
createBot();
