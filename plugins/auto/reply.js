export default async function before(m, { conn, bot }) {
  // التحقق من وجود رسالة نصية ومنع البوت من الرد على نفسه
  if (!m.text || m.isBaileys) return false; 

  const text = m.text.toLowerCase().trim();
  const devNumber = '201556853817'; // رقمك يا بطل
  
  // قائمة الشتائم اللي بتفعل حماية المطور
  const toxicWords = ["فاشل", "غبي", "وسخ", "قذر", "زفت", "خرا", "خول", "متناك", "شرموط", "عرص", "كسمك", "يا بن الوسخة", "يا نجس", "لبوة", "منيوك"];

  // كشف إذا كانت الرسالة منشن للمطور أو رد (Reply) عليه
  const isReplyToDev = m.quoted && m.quoted.sender.includes(devNumber);
  const isMentioningDev = m.mentionedJid && m.mentionedJid.some(jid => jid.includes(devNumber));
  const hasToxic = toxicWords.some(word => text.includes(word));

  // --- 1. نظام حماية المطور (الأولوية القصوى) ---
  if ((isReplyToDev || isMentioningDev) && hasToxic) {
    const devProtectorReplies = [
      `يا @${m.sender.split('@')[0]} بتغلط في المطور؟ طب كسمك على كسم اللي رباك يا ابن اللبوة! 👟`,
      `إلا المطور يا منيوك! ده أنت لولا السورس ده كنت زمانك بتلعب في طيزك يا خول 💦`,
      `بص يا بابا، المطور ده سيدك وسيد بلدك، اتلم بدل ما أبعتك لأمك في كيس أسود 💀`,
      `بتغلط في الهواري؟ طب جيت لقضاك يا روح أمك، خد الجزمة دي في بؤك الوسخ ده 👞`
    ];
    await conn.sendMessage(m.chat, { 
      text: devProtectorReplies[Math.floor(Math.random() * devProtectorReplies.length)], 
      mentions: [m.sender] 
    }, { quoted: m });
    return true; // وقف التنفيذ هنا عشان ما يروحش للردود التانية
  }

  // --- 2. نظام الردود الذكية والخرابة ---
  const triggers = {
    "ما تيجي": ["*أخدك في الخرابة أقطعلك خلفك وأرجعك تعيط يا قمر 😉🔥*", "*الخرابة بتنادي، جهز فازلينك عشان الهواري ناوي عليك 😉*"],
    "ما تقلع": ["*أنت شكلك متعود تفتح رجلك، بس هنا الهواري اللي بيفشخك عافية 😉🔥*"],
    "تعالى": ["*لو جيت مش هتعرف ترجع سليم، الخرابة بتنادينا 😂🔥*"],
    "دزي": ["*دزي في كسمك يا روح أمك، هو أنت حمل العملية في الخرابة؟ 😂🔥*"],
    "السلام عليكم": ["*وعليكم السلام يا غالي، نورت شات الهواري ❤️*"]
  };

  for (const key in triggers) {
    if (text.includes(key)) {
      const replies = triggers[key];
      await m.reply(replies[Math.floor(Math.random() * replies.length)]);
      return true;
    }
  }

  // --- 3. فلتر الأهل العام (لو مفيش منشن للمطور) ---
  const familyInsults = ["امك", "ابوك", "خالتك", "اختك", "عرضك"];
  if (familyInsults.some(word => text.includes(word))) {
    await m.reply("*إلا الأهل يا ابن المتناكة! اتلم بدل ما أشرحلك كسمك وأخليه تريند ✨*");
    return true;
  }

  return false;
}
