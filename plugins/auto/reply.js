export default async function before(m, { conn, bot }) {
  if (!m.text) return false; 

  const text = m.text.toLowerCase().trim();

  // --- 1. ميزة التحفيل والتهزيق المصري (الردود القوية بالمنشن) ---
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
      `يا @${target.split('@')[0]} المطور بيقولك "يا ابن الوسخة" أنت ميت في عيني ووجودك زي قلته يا خول 💩`
    ];
    await conn.sendMessage(m.chat, { text: roastReplies[Math.floor(Math.random() * roastReplies.length)], mentions: [target] }, { quoted: m });
    return true;
  }

  // --- 2. فلتر الدفاع عن المطور (صاحب البوت) ---
  const devTerms = ["المطور", "صانع البوت", "صاحب البوت", "مبرمج"];
  const badWords = ["فاشل", "غبي", "وسخ", "قذر", "زفت", "خرا", "خول", "أحبه", "متناك"];
  if (devTerms.some(t => text.includes(t)) && badWords.some(w => text.includes(w))) {
    const devDefense = [
      "*إلا المطور يا روح أمك! ده اللي عملني ونفخ في صورتي، اتلم أحسنلك ⚡*",
      "*المطور بتاعي سيدك وتاج راسك، لو مش عاجبك روح اشرب من الترعة يا " + (text.includes("أحبه") ? "أحبه" : "زفر") + " 🌊*",
      "*تصدق إنك عيل قليل الذوق؟ المطور بيتعب عشانك وأنت بتقل أدبك؟ جاتك خيبة 🙄*"
    ];
    await m.reply(devDefense[Math.floor(Math.random() * devDefense.length)]);
    return true;
  }

  // --- 3. فلتر الشتائم بالأهل ---
  const familyInsults = ["يا ابن", "يا بن", "امك", "ابوك", "خالتك", "اهلك", "عرضك", "اختك"];
  for (let word of familyInsults) {
    if (text.includes(word)) {
      const moralReplies = [
        "*عيب يا بابا تجيب سيرة الأهل، صلي على النبي واهدى ✨*",
        "*الأهل خط أحمر، اذكر الله وخلي لسانك نضيف 🤍*"
      ];
      await m.reply(moralReplies[Math.floor(Math.random() * moralReplies.length)]);
      return true;
    }
  }

  // --- 4. فلتر الشتائم العادية ---
  const insults = ["حمار", "كلب", "غبي", "وسخ", "حيوان", "بضان", "انقلع"];
  for (let word of insults) {
    if (text.includes(word)) {
      await m.reply("*استهدى بالله كدا وصلي على النبي، الكلمة الطيبة صدقة ✨*");
      return true;
    }
  }

  // --- 5. قائمة الردود الذكية ---
  const triggers = {
    "السلام عليكم": ["*وعليكم السلام يا ريس، نورت الجروب والله ❤️*"],
    "صباح الخير": ["*صباح القشطة يا عسل 🍯*"],
    "مساء الخير": ["*أحلى مسا على عيونك يا غالي 🌙*"],
    "عامل ايه": ["*زي الفل طول ما أنت بخير يا شق ❤️*"],
    "يا اسطى": ["*قلب الأسطى، اؤمر يا شق؟ ⚡*"],
    "احبك": ["*وأنا أموت فيك يا رايق ❤️*"],
    "صلوا على النبي": ["*اللهم صل وسلم وبارك على نبينا محمد ﷺ ✨*"],
    "فينكم": ["*موجودين في المطبخ بنعمل شاي، تشرب؟ ☕*"]
  };

  for (let key in triggers) {
    if (text.includes(key)) {
      const replies = triggers[key];
      await m.reply(replies[Math.floor(Math.random() * replies.length)]);
      return true;
    }
  }

  return false;
}
