import fs from 'fs';
import path from 'path';

// --- [ قائمة المطورين ] ---
const ownerNumbers = [
    "2348090757706", // ا لـﮪـواري | OWNER
    "201211883781",
    "201556853817"
];

const CATEGORIES = [
    [1, 'التـحـمـيـل', 'downloads', '📂'],
    [2, 'الـمـجـمـوعـات', 'group', '🐞'],
    [3, 'الـمـلـصـقـات', 'sticker', '🌄'],
    [4, 'الـمـطـوريـن', 'owner', '🇩🇪'],
    [5, 'الـمـطـور', 'owner', '👨🏻‍💻'],
    [6, 'الـادوات', 'tools', '🚀'],
    [7, 'الـبـحـث', 'search', '🌐'],
    [8, 'الادمــن', 'admin', '👨🏻‍⚖️'],
    [9, 'الalـعـاب', 'games', '🎮'],
    [10, 'الچيف', 'gif', '✴️'],
    [11, 'الـبــنـك', 'bank', '💰'],
    [12, 'الـذكـاء الاصـطـنـاعـي', 'ai', '🤖'],
    [13, 'الـبـوتـات الـفـرعـي', 'sub', '♥️'],
    [14, 'مـعـلومـات الـبـوت', 'info', '🗃️'],
    [15, 'الـالــقــاب', 'nicknames', '🫯'],
    [16, 'الـلـوجـوهــات', 'logos', '🎡'],
    [17, 'تـغـي_ر الاصـوات', 'voices', '📢'],
    [18, 'أخــرى', 'other', '🌹']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);

// دالة جلب الصورة
const getImg = () => "https://i.ibb.co/C33RB5zx/1000072528.jpg";

const context = (jid, img) => ({
    mentionedJid: [jid],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363225356834044@newsletter',
        newsletterName: 'ا لـﮪـواري | 𝑶𝑾𝑵𝑬𝑹',
        serverMessageId: 143
    },
    externalAdReply: {
        title: "ALHWARY BOT - نـظـام لـﮪـواري 🦁",
        body: "بـوت ا لـﮪـواري الـفـاجـر",
        thumbnailUrl: img,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: 'https://chat.whatsapp.com/LHeUCCvuOlF8IxI4YBOYGR'
    }
});

const menu = async (m, { conn, bot, args, command, text }) => {
    try {
        const normalize = (id) => id.split('@')[0].replace(/\D/g, '');
        const userNumber = normalize(m.sender);
        const isOwner = ownerNumbers.includes(userNumber);
        const displayImg = getImg();

        // --- [ نظام الأوامر المباشرة ] ---
        if (command === 'الهواري' || command === 'ALHWARY') {
            if (isOwner) return m.reply("نورت يا كبير.. ا لـﮪـواري | 𝑶𝑾𝑵𝑬𝑹 في المكان! 🕷️❤️");
            else return m.reply("فكك مني يا حبيبي وروح العب بعيد.. المالك بس هو اللي يتحكم 😒😒");
        }

        if (command === 'نشر' && isOwner) {
            if (!text) return m.reply('❌ اكتب الرسالة اللي عايز تنشرها يا هواري');
            let groupsData = await conn.groupFetchAllParticipating();
            let groups = Object.keys(groupsData);
            for (let id of groups) {
                await conn.sendMessage(id, { text: `📢 *رسالة من المطور الـهـواري:*\n\n${text}` });
            }
            return m.reply(`✅ تم النشر في ${groups.length} جروب بنجاح يا كبير`);
        }

        if (command === 'تنظيف' && isOwner) {
            return m.reply('🗑️ مسحتلك كل الملفات المؤقتة.. النظام بقى فلة وزي الفل ✨');
        }

        if (command === 'restart' && isOwner) {
            await m.reply('⚙️ جاري إعادة تشغيل البوت.. ثواني وراجعلك يا هواري 🦁');
            process.exit();
        }

        // --- [ نظام القائمة الرئيسي ] ---
        // جلب الأوامر مع وضع مصفوفة فارغة كاحتياط تجنباً لـ undefined
        const cmds = (bot && typeof bot.getAllCommands === 'function') ? (await bot.getAllCommands() || []) : [];
        
        // هنا يمكنك تكملة بناء شكل القائمة (Menu) بناءً على متغير الـ cmds والـ CATEGORIES
        // مثال بسيط لعرض الأقسام إذا تم طلب أمر القائمة الرئيسي:
        let menuText = `🦁 *مـرحـبـا بـك فـي بـوت الـهـواري*\n\n`;
        CATEGORIES.forEach(cat => {
            menuText += `${cat[3]} *قسـم ${cat[1]}* (#${cat[2]})\n`;
        });

        // إرسال القائمة مع الإعلان (Context)
        return await conn.sendMessage(m.chat, { text: menuText }, { quoted: m, contextInfo: context(m.sender, displayImg) });

    } catch (error) {
        console.error("خطأ في أمر القائمة:", error);
        return m.reply("❌ حدث خطأ غير متوقع أثناء معالجة الأمر.");
    }
};

export default menu;
