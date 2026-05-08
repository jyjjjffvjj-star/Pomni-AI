export default async function before(m, { conn, bot }) {
  if (!m.text || m.isBaileys) return false; 

  const text = m.text.toLowerCase().trim();
  const devNumber = '201556853817'; 
  
  const toxicWords = ["فاشل", "غبي", "وسخ", "قذر", "زفت", "خرا", "خول", "أحبه", "متناك", "شرموط", "يا ابن", "عرص", "منيوك"];

  const isMentioningDev = m.mentionedJid && m.mentionedJid.some(jid => jid.includes(devNumber));
  const isReplyingToDev = m.quoted && m.quoted.sender.includes(devNumber);

  // --- 1. حماية المطور (أقصى جراءة وابتزاز) ---
  if ((isMentioningDev || isReplyingToDev) && toxicWords.some(word => text.includes(word))) {
    const devProtectorReplies = [
      `يا @${m.sender.split('@')[0]} بتغلط في المطور؟ طب كسمك يا منيوك ده أنت لولا سيده كان زمانك بتمص برا 👞`,
      `إلا المطور يا نجس! جزمته في بؤك وبؤ اللي خلفوك، اتلم يا ابن المتناكة بدل ما أفضحك 💦`,
      `بص يا لبوة، المطور ده سيدك وسيد بلدك، الرد على أسيادك بيبقى بالجزمة يا خول 🐍`,
      `شكلك نسيت نفسك يا @${m.sender.split('@')[0]}، اللي يغلط في الهواري بندوس على قفاه ونمسح بكرامته الأرض 👢`
    ];
    await conn.sendMessage(m.chat, { text: devProtectorReplies[Math.floor(Math.random() * devProtectorReplies.length)], mentions: [m.sender] }, { quoted: m });
    return true;
  }

  // --- 2. ميزة التحفيل والتهزيق (أقصى جراءة) ---
  const trollWords = ["هزقه", "اشتمه", "غلس عليه", "تفه عليه", "روق عليه", "هينه"];
  if (m.mentionedJid && m.mentionedJid.length > 0 && trollWords.some(word => text.includes(word))) {
    const target = m.mentionedJid[0]; 
    const roastReplies = [
      `يا @${target.split('@')[0]} المطور بيقولك: "جهز نفسك يا منيوك عشان هشقك نصين وأخليك عبرة" 👞`,
      `يا @${target.split('@')[0]} أنت عيل سيس ولبوة ومحتاج تتربى، غور بدل ما أسحب داتا أهلك 🤢`,
      `بص يا @${target.split('@')[0]}، المطور بيقولك "افتح رجلك يا روح أمك العملية بدأت" 🖕`,
      `يا @${target.split('@')[0]} المطور بيقولك الكلب اللي زيك مكانه تحت رجلي وهو بيفشخك 🗑️`
    ];
    await conn.sendMessage(m.chat, { text: roastReplies[Math.floor(Math.random() * roastReplies.length)], mentions: [target] }, { quoted: m });
    return true;
  }

  // --- 3. فلتر شتيمة الأم (الخط الأحمر - نصيحة) ---
  const momInsults = ["امك", "أمك", "كسمك", "كسم"];
  if (momInsults.some(word => text.includes(word))) {
    await m.reply("*ما تبطل يا علق بطل تشتم بالأم.. احترم الناس عشان الناس تحترمك يا نجس ✨*");
    return true;
  }

  // --- 4. قائمة الردود الذكية (الخرابة بجرأة) ---
  const triggers = {
    "ما تيجي": [
      "*أخدك في الخرابة أفشخك ثانية وأرجعك تعيط يا قمر 😉🔥*", 
      "*ما تيجي وأنا أروق على طيزك في الخرابة ونعمل أحلى واجب 😉*"
    ],
    "ما تقلع": ["*إيه؟ عايزني أعملها معاك وأفشخك ولا إيه يا شبح؟ 😉🔥*"],
    "دزي": ["*دزي في كسمك يا روح أمك، هو أنت حمل العملية في الخرابة؟ 😂🔥*"],
    "صلوا على النبي": ["*اللهم صل وسلم وبارك على نبينا محمد ﷺ ✨*"]
  };

  for (let key in triggers) {
    if (text.includes(key)) {
      const replies = triggers[key];
      await m.reply(replies[Math.floor(Math.random() * replies.length)]);
      return true;
    }
  }

  // --- 5. فلتر الشتائم العادية (طلبك الأخير: بطل تشتم) ---
  const insults = ["حمار", "كلب", "غبي", "وسخ", "قذر", "حيوان", "زفت", "بضان", "خرا", "انقلع", "غور", "هبل"];
  if (insults.some(word => text.includes(word))) {
    await m.reply("*استهدى بالله كدا وبطل تشتم يا بابا، الكلمة الطيبة صدقة ✨*");
    return true;
  }

  return false;
}
