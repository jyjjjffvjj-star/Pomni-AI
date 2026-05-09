/**
 * 🛡️ مـنـظـومـة الـردع الـتـلـقـائـي لـلـروابـط (Anti-Link Pro)
 * تـحـت حـمـايـة ALHWARY BOT - الـمـطـور الـهـواري 𓄂
 */

const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return true; // يعمل في المجموعات فقط
    
    const chat = global.db.data.chats[m.chat];
    // تأكد أن ميزة الأنتي لينك مفعلة في الجروب (مثلاً عبر أمر .antilink on)
    if (!chat?.antilink) return true; 

    const containsLink = linkRegex.exec(m.text);

    if (containsLink && !isAdmin) { 
        if (isBotAdmin) {
            const user = m.sender;
            
            // 1. إرسال رسالة الردع باسم الهواري مزخرف
            await conn.sendMessage(m.chat, {
                text: `*🚨 مـنـظـومـة الـردع الـتـلـقـائـي 🚨*\n\n` +
                      `*⚠️ تـم رصـد مـحـاولـة تـخـريـب مـن:* @${user.split('@')[0]}\n` +
                      `*🚫 الـعـقـوبـة:* الـطـرد الـفـوري + مـسـح الأثـر\n\n` +
                      `*🛡️ الـحـارس الـصـامـت: الـﮪـواري 𓄂*`,
                mentions: [user]
            });

            // 2. مسح الرسالة نهائياً
            await conn.sendMessage(m.chat, { delete: m.key });

            // 3. تنفيذ الطرد الفوري
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            
            return false; // منع معالجة الرسالة كأمر
        } else {
            // تنبيه في حال عدم وجود رتبة للبوت
            return m.reply('*🛡️ عذراً، يجب رفع البوت أدمن لتفعيل منظومة الردع الخاصة بـ الـﮪـواري.*');
        }
    }
    return true;
}

