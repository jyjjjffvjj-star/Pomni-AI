> const fs = require('fs'); const finalCode = `const run = async (m, { args, conn, bot }) => {
  if (global.db.noSub) return m.reply("🔒 عذراً، سيستم الهواري للتنصيب مغلق حالياً من قِبل الإدارة.")
  try {
    const num = m.sender.split("@")[0].replace(/[+\\s-]/g, '');

    if (!/^\\d+$/.test(num)) return m.reply("⚠️ رقم الهاتف غير صالح");

    const sub = global.subBots;
    if (!sub) return m.reply("❌ نظام الهواري للبوتات الفرعية غير متاح حالياً");

    const init = await m.reply(\`⏳ جاري تحضير سيرفر الهواري وتنصيب البوت للرقم *\${num}*...\`);

    const state = { uid: null, pairDone: false, resolved: false, pending: null };

    const { images: img } = bot.config.info;

    const cleanup = () => {
      sub.off('pair', handlers.pair);
      sub.off('ready', handlers.ready);
      sub.off('error', handlers.error);
    };

    const handlers = {
      pair: (id, code) => {
        if (state.pairDone) return;
        if (!state.uid) { 
          state.pending = { id, code }; 
          return; 
        }
        if (id !== state.uid) return;
        state.pairDone = true;
        Func.pair(conn, code, num, m, init);
      },
      ready: (id) => {
        if (id !== state.uid || state.resolved) return;
        state.resolved = true;
        Func.ready(conn, num, m, img[Math.floor(Math.random() * img.length)]);
        cleanup();
      },
      error: (id, err) => {
        if (id !== state.uid || state.resolved) return;
        state.resolved = true;
        Func.error(conn, num, err, m);
        cleanup();
      },
    };

    sub.on('pair', handlers.pair);
    sub.on('ready', handlers.ready);
    sub.on('error', handlers.error);

    state.uid = await sub.add(num);

    if (state.pending?.id === state.uid && !state.pairDone) {
      state.pairDone = true;
      Func.pair(conn, state.pending.code, num, m, init);
    }

    setTimeout(() => {
      if (state.resolved) return;
      state.resolved = true;
      Func.timeout(conn, m, state.pairDone);
      cleanup();
    }, 120000);

  } catch (error) {
    await m.reply(error.message);
  }
};

run.command = ["تنصيب"];
run.noSub = true;
run.usage =  ["تنصيب"];
run.category = "sub";
export default run;

const Func = {
  pair: async (conn, code, num, m, reply_status) => {
    await conn.sendButton(m.chat, {
      imageUrl: "https://i.pinimg.com/736x/20/c1/cd/20c1cd046c862caa5a42e07d00042357.jpg",
      bodyText: \`🔐⤿ سـيـسـتـم الـهـواري لـلـبـوتـات الـفـرعـيـه 𑁍\\n⊱⋅ ──────────── ⋅⊰\\n📱 — الرقم: \${num}\\n🔑 — الكود: \${code}\\n⊱⋅ ──────────── ⋅⊰\\n> *_افتح واتساب > الأجهزة المرتبطة > ربط جهاز برقم الهاتف > أدخل الكود_*\`,
      footerText: "@𝑬𝒍𝒉𝒂𝒘𝒂𝒓𝒚_𝑺𝒖𝒃𝑩𝒐𝒕𝒔",
      buttons: [
        { name: "cta_copy", params: { display_text: "⟨🎪| 𝐂𝐨𝐩𝐲 𝐂𝐨𝐝𝐞 |🎪⟩", copy_code: code } },
        { name: "cta_url", params: { display_text: "⟨🫒| 𝐂𝐡𝐚𝐧𝐧𝐞ล 𝐄𝒍𝒉𝒂𝒘𝒂𝒓𝒚 |🫒⟩", url: "https://google.com" } },
      ],
      mentions: [m.sender],
      newsletter: {
        name: '🦅 𝐄𝐋𝐇𝐀𝐖𝐀𝐑𝐘 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        jid: '120363225356834044@newsletter'
      },
      interactiveConfig: {
        buttons_limits: 10,
        list_title: "@𝑬𝒍𝒉𝒂𝒘𝒂𝒓𝒚_𝑺𝒖𝒃𝑩𝒐𝒕𝒔",
        button_title: "Click Here",
        canonical_url: \`https://code.com/\${code}\`
      }
    }, global.reply_status);
  },

  ready: async (conn, num, m, img) => {
    await m.react("✅");
    await conn.sendMessage(m.chat, {
      text: \`✅ — *تـم الاتـصـال بـنـجـاح*\\n\\n📱 الرقم: \${num}\\n> *بوت الهواري الفرعي جاهز للاستخدام الآن*\\n\\n💡 اكتب الأوامر لتجربة النسخة الخاصة بك.\`,
      contextInfo: {
        externalAdReply: {
          title: "🦅 𝐄𝐋𝐇𝐀𝐖𝐀𝐑𝐘-𝐁𝐎𝐓 | تم ربط النسخة بنجاح",
          body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚋𝚢 𝙴𝚕𝚑𝚊𝚠𝚊𝚛𝚢",
          thumbnailUrl: img,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
  },

  error: async (conn, num, err, m) => {
    await m.reply(\`❌ *فشل الاقتران بجهاز الهواري!*\\n\\n📱 الرقم: \${num}\\n⚠️ الخطأ: \${err?.message || 'غير معروف'}\`);
  },

  timeout: async (conn, m, pairDone) => {
    await m.reply(pairDone
      ? \`⏰ تم إرسال كود الهواري لكن لم يتم تأكيد الاتصال.\\nتأكد من إدخال الكود في واتساب جيدا.\`
      : \`⏰ لم يتم استلام كود الاقتران خلال 120 ثانية.\\nالرجاء المحاولة مرة أخرى.\`
    );
  }
};`; fs.writeFileSync('./plugins/subs/sub.js', finalCode); m.reply("🦅 تم التعديل الكامل وحقن اسم الهواري في التوجيه والـ Newsletter وفي كل تفاصيل ملف sub.js بنجاح!");
