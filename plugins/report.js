let handler = async (m, { conn, text, command }) => {
    // ⚠️ ضع رقمك هنا (تأكد من كتابته بشكل صحيح)
    const developerNumber = '201234567890@s.whatsapp.net'; 

    if (!text) {
        // هنا قمنا بتغيير طريقة عرض المثال عشان نتفادى الـ undefined
        return m.reply(`*⚠️ يـرجـى كـتـابـة الـبـلاغ بـعـد الأمـر*\n\n*مثال:*\n.${command} مشكله في أمر التحميل لا يعمل`);
    }

    if (text.length < 10) {
        return m.reply('*⚠️ الـرجاء توضيح المشكلة أكثر (أكثر من 10 أحرف)*');
    }

    const reporterName = m.pushName || 'مستخدم';
    const location = m.isGroup ? `الـمـجـمـوعـة: ${(await conn.getName(m.chat))}` : 'الـمـحـادثـة الـخـاصـة';

    const reportToDev = `
*🚨 ┫ بـلاغ جـديـد وصـل ┣ 🚨*

*👤 مـن:* ${reporterName}
*🆔 المعرف:* @${m.sender.split('@')[0]}
*🌐 الـمـكـان:* ${location}

*📝 الـرسـالـة:*
"${text}"`.trim();

    try {
        await conn.sendMessage(developerNumber, {
            text: reportToDev,
            mentions: [m.sender]
        });

        await m.reply('*✅ تـم إرسـال بـلاغـك للمـطـور بـنـجـاح. شـكراً لـك!*');

    } catch (e) {
        console.error(e);
        m.reply('*❌ فشل الإرسال، تأكد من إعداد رقم المطور في الكود.*');
    }
};

handler.help = ['ابلاغ', 'مشكله'];
handler.tags = ['info'];
handler.command = /^(ابلاغ|مشكله|بلاغ|report)$/i;

export default handler;
