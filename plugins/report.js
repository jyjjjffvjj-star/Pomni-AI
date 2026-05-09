let handler = async (m, { conn, text, command }) => {
    
    // ⚠️ عدل الرقم ده لرقمك أنت (بدون + وبدون مسافات)
    // لازم ينتهي بـ @s.whatsapp.net
    let devNum = '201012345678@s.whatsapp.net'; 

    if (!text) return m.reply(`*⚠️ يـرجـى كـتـابـة الـبـلاغ بـعـد الأمـر*\n\n*مثال:*\n.${command} البوت لا يستجيب لأمر التحميل`);

    if (text.length < 8) return m.reply('*⚠️ البلاغ قصير جداً، يرجى التوضيح أكثر.*');

    // تجهيز نص البلاغ للمطور
    let report = `*🚨 [ بـلاغ جـديـد ] 🚨*\n\n` +
                 `*👤 مـن:* ${m.pushName || 'مستخدم'}\n` +
                 `*📱 الـرقم:* wa.me/${m.sender.split('@')[0]}\n` +
                 `*🌐 الـمـكـان:* ${m.isGroup ? 'جروب' : 'الخاص'}\n\n` +
                 `*📝 الـرسـالـة:*\n${text}`;

    try {
        // محاولة الإرسال بأبسط طريقة ممكنة لتجنب الكراش
        await conn.sendMessage(devNum, { text: report }, { quoted: m });
        
        // لو نجح هيرد على المستخدم بـ ✅
        await m.reply('*✅ تم إرسال بلاغك بنجاح، سيتم الرد عليك قريباً.*');

    } catch (e) {
        // لو فشل هيطبع الخطأ في الكونسول عشان تعرف السبب
        console.error("Error in Report Command:", e);
        await m.reply('*❌ فشل إرسال البلاغ. تأكد أن رقم المطور في الكود صحيح.*');
    }
};

handler.help = ['ابلاغ'];
handler.tags = ['info'];
handler.command = /^(ابلاغ|مشكله|بلاغ|report)$/i;

export default handler;
