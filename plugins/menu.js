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
    [9, 'الالــعـاب', 'games', '🎮'],
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
const getImg = () => "https://telegra.ph/file/0c6e8f498c4d68837e28b.jpg";

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
        const cmds = await bot.getAllCommands() || [];
        const selected = parseInt(args[0]);

        if (!selected) {
            let sectionsText = CATEGORIES.map(c => `*${c[0]}* - قسم ${c[1]} ${c[3]}`).join('\n');
            
            const menuText = `
╭━━〔 🦁 الـهـواري بـوت 〕━━╮
┃ 👤 المستخدم: @${m.sender.split('@')[0]}
┃ 📊 عدد الأقسام: ${CATEGORIES.length}
┃ 🛠️ رتبتك: ${isOwner ? 'الـمـطـور الـكـبـيـر ✅' : 'مستخدم عادي 👤'}
╰━━━━━━━━━━━━━━━━━━╯

*الـأقـسـام:*
${sectionsText}

> اكتب *.الاوامر* متبوعاً برقم القسم (مثال: .الاوامر 1)
`;

            await conn.sendMessage(m.chat, {
                image: { url: displayImg },
                caption: menuText,
                mentions: [m.sender],
                contextInfo: context(m.sender, displayImg)
            }, { quoted: m });
            return;
        }

        const cat = getCat(selected);
        if (!cat) return m.reply('❌ الرقم ده مش موجود في القائمة يا غالي');
        if (cat[2] === 'owner' && !isOwner) return m.reply('❌ القسم ده "منطقة محظورة" للهواري بس 🤫');

        const categoryCmds = cmds.filter(c => c?.category === cat[2]);
        if (!categoryCmds.length) return m.reply('❌ القسم ده لسه فاضي مفيش فيه أوامر');

        const cmdsList = categoryCmds.map(c => `┃ ${cat[3]} /. ${Array.isArray(c.usage) ? c.usage[0] : c.usage}`).join('\n');

        await conn.sendMessage(m.chat, {
            text: `╭─┈─⟞ ${cat[1]} ${cat[3]} ⟝─┈─╮\n\n${cmdsList}\n\n╰─┈─⟞ ALHWARY ⟝─┈─╯`,
            contextInfo: context(m.sender, displayImg)
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ حصل مشكلة في الكود.. بلّغ الهواري فوراً');
    }
};

menu.command = ['الاوامر', 'القائمة', 'menu', 'اوامر', 'المهام', 'نشر', 'تنظيف', 'restart', 'الهواري', 'ALHWARY'];

export default menu;
