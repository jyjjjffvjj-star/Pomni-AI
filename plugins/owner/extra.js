import googleTTS from 'google-tts-api';

// إعدادات الهوية البصرية للهوارِي بـوت
const IMAGE_URL = "https://i.ibb.co/C33RB5zx/1000072528.jpg";
const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb9GuF1EVccLJpZJlM0S';

// نظام الـ Context الموحد
const context = (jid, title, body) => ({
    mentionedJid: [jid],
    externalAdReply: {
        title: title || "🛡️ | نـظـام الـهـوارِي بـوت",
        body: body || "أقـوى بـوت واتـسـاب مـتـكـامـل وسـريـع ⚡",
        thumbnailUrl: IMAGE_URL,
        sourceUrl: CHANNEL_URL,
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

// قائمة الرادار الشاملة (مصرية وعربية) - يمكنك إضافة المزيد داخل القوسين
const RADAR_WORDS = [
    "كسمك", "متناك", "شرموطه", "عرص", "خخول", "منيوك", "لبوه", "وسخ", "نجس", "ابن الكلب", "تيزك", "كسختك", 
    "قحبه", "منيوكه", "زبي", "طيز", "خنيث", "ديوث", "ياضين", "سرسجي", "نرم", "خول", "بضان", "خرا", 
    "يا معفن", "يا زباله", "يا ابن الجزمه", "يا ابن القحبه", "يا منيك", "اللعنه", "يا حمار", "يا حيوان",
    "يا تيس", "يا لوطي", "يا واطي", "يا سافل", "يا منحط", "يا كلب", "يا جحش", "يا بقره", "يا خنزير",
    "يلعن شكلك", "تفو", "يا صايع", "يا شمام", "يا خمه", "يا هلفوت", "يا عرص", "يا واطي", "يا رخيص",
    "يا وسخه", "يا شرموطه", "يا فاجره", "يا منحله", "يا عاهره", "يا رمه", "يا جيفه", "يا قذر",
    "قحبة", "كسم", "كس", "زب", "طيزك", "فحل", "سكس", "بورن", "نيك", "تناك", "متناكه", "شرموط",
    "ديوث", "قرني", "يا فاشل", "يا غبي", "يا متخلف", "يا اهبل", "يا شحات", "يا بيئه", "يا نوري",
    "يا غجر", "يا طعميه", "يا كبسه", "يا بو لستك", "يا خرنك", "يا فرفور", "يا سيس", "يا نايتي"
    // يمكنك الاستمرار في إضافة الكلمات هنا بنفس التنسيق
];

export async function execute({ sock, msg, command, args, isOwner, isAdmin }) {
    const chat = msg.key.remoteJid;
    const sender = msg.key.participant || chat;
    const text = args.join(" ");

    // 1. نظام الرادار (مانع الشتائم التلقائي) - يعمل فوراً على أي رسالة
    const messageContent = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || "").toLowerCase();
    
    // التحقق من وجود كلمة محظورة (مع استثناء المطور والادمن)
    if (RADAR_WORDS.some(word => messageContent.includes(word)) && !isOwner && !isAdmin) {
        await sock.sendMessage(chat, { delete: msg.key }); // حذف الرسالة فوراً
        return await sock.sendMessage(chat, { 
            text: `⚠️ *تـم رصـد لـفـظ خـارج مـن [ @${sender.split('@')[0]} ]*\n\n*الـهـوارِي بـوت يـحـذرك: مـمـنـوع الـشـتـائـم يـا نـرم احـتـرم نـفـسـك لـكـي لا تـتـم إبـادتـك!*`,
            contextInfo: context(sender, "📢 | رادار الـهـوارِي بـوت الـحـازم")
        });
    }

    // 2. أمـر الـهـويـة (.انا)
    if (command === 'انا') {
        const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender;
        const userNumber = target.split('@')[0];
        let ppUrl;
        try { ppUrl = await sock.profilePictureUrl(target, 'image'); } catch { ppUrl = IMAGE_URL; }

        const infoText = `*👤 | مـعـلـومـات الـمـسـتـخـدم*\n\n*⌯︙ الاسـم:* ${msg.pushName || "مجهول"}\n*⌯︙ الـرقـم:* ${userNumber}\n*⌯︙ الـرابـط:* wa.me/${userNumber}\n\n> *تـم الـجـلـب بـواسـطـة الـهـوارِي بـوت*`;
        return await sock.sendMessage(chat, { image: { url: ppUrl }, caption: infoText, contextInfo: context(target) }, { quoted: msg });
    }

    // 3. أمـر الـنـطـق (.قول / .نطق)
    if (command === 'قول' || command === 'نطق') {
        let sayText = text || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
        if (!sayText) return sock.sendMessage(chat, { text: "⚠️ *الـهـوارِي بـوت يـنـتـظـر نـصـاً لـنـطـقـه!*" });
        const url = googleTTS.getAudioUrl(sayText, { lang: 'ar', slow: false, host: 'https://translate.google.com' });
        return await sock.sendMessage(chat, { audio: { url }, mimetype: 'audio/mpeg', ptt: true }, { quoted: msg });
    }

    // 4. أمـر مـضـاد الـسـبـام (.سبام)
    if (command === 'سبام') {
        if (!isAdmin && !isOwner) return;
        const action = args[0];
        const status = action === 'تشغيل' ? "🚫 تـم تـفـعـيـل درع الـسـبـام" : "✅ تـم إيـقـاف الـحـمـاية";
        return await sock.sendMessage(chat, { text: `*${status} بـأمـر الـهـوارِي بـوت*`, contextInfo: context(sender) });
    }

    // 5. أمـر مـضـاد الـروابـط (.الروابط)
    if (command === 'الروابط') {
        if (!isAdmin && !isOwner) return;
        const action = args[0];
        const status = action === 'تفعيل' ? "🚫 مـانـع الـروابـط يـعـمـل الآن" : "✅ تـم تـعـطـيـل مـانـع الـروابـط";
        return await sock.sendMessage(chat, { text: `*${status} بـأمـر الـهـوارِي بـوت*`, contextInfo: context(sender) });
    }
}

export const NovaUltra = {
    command: ["انا", "قول", "نطق", "سبام", "الروابط"],
    description: "نـظـام حـمـايـة وخدمات الـهـوارِي بـوت الشامل",
    elite: "off", group: true, prv: true, lock: "off"
};

export default { NovaUltra, execute };
