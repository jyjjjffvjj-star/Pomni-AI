let handler = async (m, { conn }) => {
  // الكود الأساسي يعمل تلقائياً عند قراءة الشات
};

handler.before = async function (m, { conn }) {
  // 1. فلاتر الأمان والتأكد من وجود نص
  if (m.fromMe || !m.text) return false;

  // تحديد رقم البوت
  const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';

  // 2. الشروط: هل تم منشن البوت؟ أو هل تم عمل ريبلاي عليه؟
  const isMentioned = m.mentionedJid && m.mentionedJid.includes(botNumber);
  const isReplyToBot = m.quoted && m.quoted.sender === botNumber;

  // لو مفيش منشن ولا ريبلاي، اخرج فوراً ومتعملش حاجة
  if (!isMentioned && !isReplyToBot) return false;

  // تنظيف النص المبعوث من المنشن عشان جوجل يفهمه صافي
  let userQuery = m.text.replace(new RegExp(`@${botNumber.split('@')[0]}`, 'g'), '').trim();
  if (!userQuery) userQuery = "أهلاً";

  // تفعيل تأثير "جاري الكتابة..." عشان يبان بشري
  await conn.sendPresenceUpdate('composing', m.chat);

  try {
    // 3. فحص الشتائم وقصف الجبهات
    const badWords = ["كسم", "عرص", "خول", "حمار", "غبي", "وسخ", "شرموط", "ابن الوسخة", "متناك"];
    const userIsInsulting = badWords.some(word => userQuery.toLowerCase().includes(word));

    // تحديد التوجيهات لجوجل جيميناي
    let systemInstruction = "أنت شاب مصري جدع وعفوي جداً اسمك الهواري، بتدردش مع أصحابك في شات الواتساب بكلام عامي مصري خفيف ومرح ومبتتكلمش برسمية تانية خالص.";
    if (userIsInsulting) {
      systemInstruction = "المستخدم بيشتمك ويغلط فيك. رد عليه فوراً بقصف جبهة شرس وتريقة وسخرية لاذعة جداً بالعامية المصرية عشان يتلم، بس من غير ما تستخدم ألفاظ إباحية صريحة عشان جوجل ميحظرش الرد.";
    }

    // 4. إرسال الطلب لرابط جوجل جيميناي المباشر بمفتاحك
    const apiKey = "AIzaSyDHLKb3RIovMjzLfPZr71UGjmYEVy5NZJQ";
    let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }
        ]
      })
    });

    let json = await response.json();
    let replyText = json.candidates?.[0]?.content?.parts?.[0]?.text;

    // ردود بديلة وسريعة لو السيرفر علق
    if (!replyText) {
      replyText = userIsInsulting ? "احترم نفسك ياض وشوف بتكلم مين! 🤫" : "معاك يا حبيب قلبي سامعك، قولي في إيه؟ ✨";
    }

    // 5. إرسال الرد في الشات
    await m.reply(replyText);

  } catch (error) {
    console.error("خطأ الهواري:", error);
  }

  return true;
};

export default handler;
