export default async function before(m, { conn, bot }) {
  if (!m.text) return false; 

  const text = m.text.toLowerCase().trim();
  const devNumber = '2348090757706'; // <--- حطي رقمك هنا من غير علامة +
  const toxicWords = ["فاشل", "غبي", "وسخ", "قذر", "زفت", "خرا", "خول", "أحبه", "متناك", "شرموط", "يا ابن"];

  // --- 1. حماية المطور (منشن بالرقم أو رد على رسالته) ---
  const isMentioningDev = m.mentionedJid && m.mentionedJid.includes(`${devNumber}@s.whatsapp.net`);
  const isReplyingToDev = m.quoted && m.quoted.sender === `${devNumber}@s.whatsapp.net`;

  if ((isMentioningDev || isReplyingToDev) && toxicWords.some(word => text.includes(word))) {
    const devProtectorReplies = [
      `يا @${m.sender.split('@')[0]} بتغلط في المطور وهو سيدك؟ ده أنت عيل أحبه ومحتاج تتربى! 👞`,
      `إلا المطور يا ابن الوسخة! بترد عليه بقلة أدب وهو اللي معلم عليك؟ تفو عليك 💦`,
      `يا نجس، المطور خط أحمر.. والرد على أسيادك بيبقى بالأدب يا خول 🐍`,
      `شكلك نسيت نفسك يا @${m.sender.split('@')[0]}، اللي يغلط في المطور بندوس عليه بالجزمة 👢`
    ];
    await conn.sendMessage(m.chat, { text: devProtectorReplies[Math.floor(Math.random() * devProtectorReplies.length)], mentions: [m.sender] }, { quoted: m });
    return true;
  }

  // --- 2. ميزة التحفيل والتهزيق بالمنشن (لما تقولي للبوت "هزقه") ---
  const trollWords = ["هزقه", "اشتمه", "غلس عليه", "تفه عليه", "روق عليه", "هينه"];
  if (m.mentionedJid && m.mentionedJid.length > 0 && trollWords.some(word => text.includes(word))) {
    const target = m.mentionedJid[0]; 
    const roastReplies = [
      `يا @${target.split('@')[0]} المطور بيقولك: "يا ابن الوسخة اتلم بدل ما يمسح بكرامتك الأرض" 👞`,
      `يا @${target.split('@')[0]} أنت عيل "أحبه" ومحتاج تتربى، غور يا روح أمك من هنا 🤢`,
      `بص يا @${target.split('@')[0]}، المطور بيقولك "يا ابن المتناكة بطل تنطط" عشان هو اللي عمل لشكلك قيمة 🖕`,
      `يا @${target.split('@')[0]} المطور باعتلك: "يا ابن الشرموطة لو شفتك في حتة هعمل منك شاورما" 🔪`,
      `يا @${target.split('@')[0]} يا "ابن المتناكة" المطور بيقولك الكلب اللي زيك آخره يتهزأ كدا 🗑️`,
      `يا @${target.split('@')[0]} "يا أحبه" بطل تنطط زي النسوان، المطور هو اللي ممشيك يا نجس 🐍`,
      `يا @${target.split('@')[0]} المطور بيقولك "يا ابن الوسخة" أنت ميت في عيني ووجودك زي قلته يا خول 💩`,
      `يا @${target.split('@')[0]} المطور بيقولك: "يا كسمك اتلم" بدل ما يخليك عبرة لمن اعتبر ⚡`
    ];
    await conn.sendMessage(m.chat, { text: roastReplies[Math.floor(Math.random() * roastReplies.length)], mentions: [target] }, { quoted: m });
    return true;
  }

  // --- 3. قائمة الردود الذكية ---
  const triggers = {
    "السلام عليكم": ["*وعليكم السلام يا ريس، نورت الجروب والله ❤️*"],
    "صباح الخير": ["*صباح القشطة يا عسل 🍯*"],
    "مساء الخير": ["*أحلى مسا على عيونك يا غالي 🌙*"],
    "عامل ايه": ["*زي الفل طول ما أنت بخير يا شق ❤️*"],
    "شغال يا جميل": ["*شغال يا قلب الجميل، البوت تحت أمرك وسامعك ✅🚀*"],
    "يا اسطى": ["*قلب الأسطى، اؤمر يا شق؟ ⚡*"],
    "احبك": ["*وأنا أموت فيك يا رايق ❤️*"],
    "صلوا على النبي": ["*اللهم صل وسلم وبارك على نبينا محمد ﷺ ✨*"]
  };

  for (let key in triggers) {
    if (text.includes(key)) {
      const replies = triggers[key];
      await m.reply(replies[Math.floor(Math.random() * replies.length)]);
      return true;
    }
  }

  // --- 4. فلتر الشتائم بالأهل ---
  const familyInsults = ["يا ابن", "يا بن", "امك", "ابوك", "خالتك", "اهلك", "عرضك", "اختك"];
  for (let word of familyInsults) {
    if (text.includes(word)) {
      await m.reply("*عيب يا بابا تجيب سيرة الأهل، صلي على النبي واهدى ✨*");
      return true;
    }
  }

  // --- 5. فلتر الشتائم العادية ---
  const insults = ["حمار", "كلب", "غبي", "وسخ", "قذر", "حيوان", "زفت", "بضان", "خرا", "انقلع", "غور", "هبل"];
  for (let word of insults) {
    if (text.includes(word)) {
      await m.reply("*استهدى بالله كدا وصلي على النبي، الكلمة الطيبة صدقة ✨*");
      return true;
    }
  }

  return false;
}
