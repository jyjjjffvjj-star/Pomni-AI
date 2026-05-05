const players = [

/* ⭐ نجوم حالياً */
{ name: "كيليان مبابي", nationality: "🇫🇷 فرنسي", played: "موناكو - باريس سان جيرمان", current: "ريال مدريد" },
{ name: "إيرلينغ هالاند", nationality: "🇳🇴 نرويجي", played: "سالزبورغ - دورتموند - مانشستر سيتي", current: "مانشستر سيتي" },
{ name: "محمد صلاح", nationality: "🇪🇬 مصري", played: "روما - ليفربول", current: "ليفربول" },
{ name: "فينيسيوس جونيور", nationality: "🇧🇷 برازيلي", played: "فلامينغو", current: "ريال مدريد" },
{ name: "هاري كين", nationality: "🏴 إنجليزي", played: "توتنهام", current: "بايرن ميونخ" },
{ name: "نيمار", nationality: "🇧🇷 برازيلي", played: "برشلونة - باريس سان جيرمان", current: "الهلال" },
{ name: "كيفين دي بروين", nationality: "🇧🇪 بلجيكي", played: "تشيلسي - فولفسبورغ", current: "مانشستر سيتي" },
{ name: "ليفاندوفسكي", nationality: "🇵🇱 بولندي", played: "دورتموند - بايرن - برشلونة", current: "برشلونة" },
{ name: "جود بيلينغهام", nationality: "🏴 إنجليزي", played: "دورتموند", current: "ريال مدريد" },
{ name: "بوكايو ساكا", nationality: "🏴 إنجليزي", played: "أرسنال", current: "أرسنال" },

/* 🔥 إضافات نجوم أقوى */
{ name: "جمال موسيالا", nationality: "🇩🇪 ألماني", played: "بايرن ميونخ", current: "بايرن ميونخ" },
{ name: "فيل فودين", nationality: "🏴 إنجليزي", played: "مانشستر سيتي", current: "مانشستر سيتي" },
{ name: "عثمان ديمبيلي", nationality: "🇫🇷 فرنسي", played: "برشلونة - باريس", current: "باريس سان جيرمان" },
{ name: "خفيتشا كفاراتسخيليا", nationality: "🇬🇪 جورجي", played: "نابولي", current: "باريس سان جيرمان" },

/* ⚡ أساطير */
{ name: "ليونيل ميسي", nationality: "🇦🇷 أرجنتيني", played: "برشلونة - باريس - إنتر ميامي", current: "إنتر ميامي" },
{ name: "كريستيانو رونالدو", nationality: "🇵🇹 برتغالي", played: "مان يونايتد - ريال مدريد - يوفنتوس", current: "النصر" },
{ name: "رونالدينيو", nationality: "🇧🇷 برازيلي", played: "برشلونة - ميلان", current: "معتزل" },
{ name: "رونالدو نازاريو", nationality: "🇧🇷 برازيلي", played: "إنتر - ريال مدريد - برشلونة", current: "معتزل" },
{ name: "زين الدين زيدان", nationality: "🇫🇷 فرنسي", played: "يوفنتوس - ريال مدريد", current: "معتزل" },

/* 🔥 مدافعين */
{ name: "فان دايك", nationality: "🇳🇱 هولندي", played: "ساوثهامبتون - ليفربول", current: "ليفربول" },
{ name: "سيرجيو راموس", nationality: "🇪🇸 إسباني", played: "ريال مدريد - باريس", current: "إشبيلية" },
{ name: "أشرف حكيمي", nationality: "🇲🇦 مغربي", played: "ريال مدريد - دورتموند - إنتر - باريس", current: "باريس سان جيرمان" },

/* 🧤 حراس */
{ name: "كورتوا", nationality: "🇧🇪 بلجيكي", played: "تشيلسي - ريال مدريد", current: "ريال مدريد" },
{ name: "نوير", nationality: "🇩🇪 ألماني", played: "شالكه - بايرن ميونخ", current: "بايرن ميونخ" },
{ name: "أليسون", nationality: "🇧🇷 برازيلي", played: "إنتر - ليفربول", current: "ليفربول" },

/* 🌍 إضافات */
{ name: "سون هيونغ مين", nationality: "🇰🇷 كوري", played: "هامبورغ - توتنهام", current: "توتنهام" },
{ name: "ديبالا", nationality: "🇦🇷 أرجنتيني", played: "يوفنتوس - روما", current: "روما" },
{ name: "دي ماريا", nationality: "🇦🇷 أرجنتيني", played: "ريال مدريد - باريس - بنفيكا", current: "بنفيكا" },
{ name: "لامين يامال", nationality: "🇪🇸 إسباني", played: "برشلونة", current: "برشلونة" },
{ name: "غافي", nationality: "🇪🇸 إسباني", played: "برشلونة", current: "برشلونة" },
{ name: "بيدري", nationality: "🇪🇸 إسباني", played: "برشلونة", current: "برشلونة" },

/* 🟣 أساطير إضافية */
{ name: "أندريس إنييستا", nationality: "🇪🇸 إسباني", played: "برشلونة - فيسيل كوبي", current: "معتزل" },
{ name: "تشافي", nationality: "🇪🇸 إسباني", played: "برشلونة", current: "مدرب" }
];

if (!global.playerGame) global.playerGame = { games: {}, score: {} };

/* ================= START ================= */

const handler = async (m, { conn }) => {

  if (global.playerGame.games[m.chat]?.active) {
    return m.reply("⚠️ ║ فـي لـعـبـة شـغـالـة بـالـفـعـل !");
  }

  global.playerGame.games[m.chat] = {
    round: 1,
    active: true
  };

  global.playerGame.score[m.chat] = {};

  return sendRound(m, conn);
};

/* ================= ROUND ================= */

async function sendRound(m, conn) {

  const game = global.playerGame.games[m.chat];

  const q = players[Math.floor(Math.random() * players.length)];

  let wrong = players
    .filter(p => p.name !== q.name)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  let options = [...wrong, q].sort(() => 0.5 - Math.random());

  game.answer = q.name;
  game.active = true;

  await conn.sendButton(m.chat, {
    imageUrl: "https://i.pinimg.com/736x/8a/2b/7d/8a2b7d9a3c6f5f3c2b.jpg",
    bodyText: `╭━━━〔 🎮 تـخـمـيـن الـلاعـب ⚽ 〕━━━╮

📊 ║ الـجـولـة: ${game.round} / 10

╭─〔 🌍 الـمـعـلـومـات 〕─╮
│ ✦ الـجـنـسـيـة: ${q.nationality}
│ ✦ لـعـب فـي: ${q.played}
│ ✦ الـنـادي الـحـالـي: ${q.current}
╰────────────────╯

🎯 ║ اخـتـر الإجـابـة الـصـحـيـحـة 👇

╰━━━〔 🔱 ALHWARY BOT〕━━━╯`,

    footerText: "🔱 ALHWARY BOT",

    buttons: options.map(p => ({
      name: "quick_reply",
      params: {
        display_text: p.name,
        id: p.name
      }
    }))
  }, m);

  game.timeout = setTimeout(() => {
    if (global.playerGame.games[m.chat]) {
      m.reply(`╭━━━〔 ⏳ انـتـهـى الـوقـت 〕━━━╮
❌ ║ الإجـابـة: ${q.name}
╰━━━━━━━━━━━━━━━━━━╯`);
      game.active = false;
    }
  }, 30000);
}

/* ================= CHECK ================= */

handler.before = async (m, { conn }) => {

  const game = global.playerGame?.games?.[m.chat];
  if (!game || !game.active) return;

  const text = m.text?.trim();
  if (!text) return;

  if (text === game.answer) {

    clearTimeout(game.timeout);

    const user = m.sender;

    global.playerGame.score[m.chat][user] =
      (global.playerGame.score[m.chat][user] || 0) + 1;

    m.reply("╭━━━〔 ✅ إجـابـة صـح 〕━━━╮\n🎯 ║ +1 نـقـطـة\n╰━━━━━━━━━━━━━━╯");

    game.round++;

    if (game.round > 10) {

      const results = Object.entries(global.playerGame.score[m.chat])
        .sort((a, b) => b[1] - a[1]);

      const textRes = results
        .map((v, i) => `🥇 ${i + 1} ║ @${v[0].split('@')[0]} ⇢ ${v[1]} نـقـطـة`)
        .join("\n");

      const winner = results[0]?.[0];

      await conn.sendMessage(m.chat, {
        text: `╭━━━〔 🏆 انـتـهـت الـلـعـبـة 〕━━━╮

${textRes}

👑 ║ الـفـائـز: @${winner?.split('@')[0]}

🎁 ║ الـجـوائـز:
✦ +500 XP
✦ +10 Cookies

╰━━━〔 🔱 𝐋𝐞𝐯𝐢 𝐁𝐎𝐓 〕━━━╯`,
        mentions: results.map(v => v[0])
      });

      delete global.playerGame.games[m.chat];
      delete global.playerGame.score[m.chat];
      return;
    }

    return sendRound(m, conn);
  }
};

/* ================= META ================= */

handler.command = ["لاعب", "player"];

handler.category = "🎮 ألعاب البوت";

handler.usage = [
  "لاعب ➜ بدء لعبة تخمين اللاعب (10 جولات)"
];

export default handler;
