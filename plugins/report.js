/**
 * نظام البلاغات والمشاكل - ALHWARY BOT
 * مخصص للتواصل المباشر مع مطور البوت
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // ⚠️ ضـع رقـمـك هـنـا بـدلاً مـن هـذا الرقم (بدون علامة +)
    const developerNumber = '201556853817@s.whatsapp.net'; 

    // التحقق من وجود نص
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `*⚠️ يـرجـى كـتـابـة الـبـلاغ بـعـد الأمـر*\n\n*مثال:*\n${usedPrefix + command} أمر التحميل من اليوتيوب لا يعمل`
        }, { quoted: m });
    }

    // التحقق من طول النص لمنع السبام
    if (text.length < 10) {
        return m.reply('*⚠️ الـرجاء توضيح المشكلة أكثر (أكثر من 10 أحرف) لكي نستطيع مساعدتك.*');
    }

    // تجهيز بيانات البلاغ
    const reporterName = m.pushName || 'مستخدم غير معروف';
    const location = m.isGroup ? `الـمـجـمـوعـة: ${(await conn.getName(m.chat))}` : 'الـمـحـادثـة الـخـاصـة';
    const reportTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const reportToDev = `
*🚨 ┫ بـلاغ جـديـد وصـل ┣ 🚨*

*👤 مـن:* ${reporterName}
*🆔 الـمـعـرف:* @${m.sender.split('@')[0]}
*🌐 الـمـكـان:* ${location}
*⏰ الـوقـت:* ${reportTime}

*📝 الـرسـالـة:*
"${text}"
`.trim();

    // إرسال البلاغ للمطور في الخاص
    try {
        await conn.sendMessage(developerNumber, {
            text: reportToDev,
            mentions: [m.sender],
            contextInfo: {
                externalAdReply: {
                    title: "📩 بـلاغ مـن مـسـتـخـدم",
                    body: "إضغط للرد على المستخدم بسرعة",
                    thumbnailUrl: "https://i.ibb.co/C33RB5zx/1000072528.jpg",
                    sourceUrl: `https://wa.me/${m.sender.split('@')[0]}`,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        });

        // رسالة تأكيد للمستخدم
        await m.reply(`*✅ تـم إرسـال بـلاغـك للمـطـور بـنـجـاح.*\n\n*شكرًا لتعاونك، سيتم مراجعة المشكلة والرد عليك قريباً.*`);

    } catch (e) {
        console.error(e);
        m.reply('*❌ حدث خطأ أثناء إرسال البلاغ، حاول مرة أخرى لاحقاً.*');
    }
};

// تعريفات الأمر
handler.help = ['ابلاغ', 'مشكله'];
handler.tags = ['info'];
handler.command = /^(ابلاغ|مشكله|بلاغ|report)$/i;

export default handler;
