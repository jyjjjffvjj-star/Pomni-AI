import fs from 'fs';
import path from 'path';

// --- [ قائمة المطورين - رقم الهواري الأساسي ] ---
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

// دالة جلب الصورة - تم تثبيت صورة الأسد الفاجرة اللي بعتها
const getImg = () => "https://telegra.ph/file/0c6e8f498c4d68837e28b.jpg";

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363225356834044@newsletter',
        newsletterName: 'ا لـﮪـواري | 𝑶𝑾𝑵𝑬𝑹',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "ALHWARY BOT - نـظـام الـأسـد 🦁",
        body: "بـوت ا لـﮪـواري الـفـاجـر",
        thumbnailUrl: img,
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

const menu = async (m, { conn, bot, args, command, text }) => {
    try {
        const normalize = (id) => id.split('@')[0].replace(/\D/g, '');
        const userNumber = normalize(m.sender);
        const isOwner = ownerNumbers.includes(userNumber);
        const isAdmin = m.isAdmin || false;
        const displayImg = getImg();

        // --- [ نظام الأوامر المباشرة والردود ] ---
        switch (command) {
            case 'الهواري':
            case 'ALHWARY':
                if (isOwner) return m.reply("نورت يا كبير.. ا لـﮪـواري | 𝑶𝑾𝑵𝑬𝑹 في المكان! 🕷️❤️"");
                else return m.reply("فكك مني يا حبيبي وروح العب بعيد.. المالك بس هو اللي يتحكم 😒😒"" 😒😒");

            case 'نشر':
                if (!isOwner) return;
                if (!text) return m.reply('❌ اكتب الرسالة اللي عايز تنشرها يا هواري');
                let groups = Object.keys(await conn.groupFetchAllParticipating());
                for (let id of groups) await conn.sendMessage(id, { text: `📢 *رسالة من المطور الـهـواري:*\n\n${text}` });
                return m.reply(`✅ تم النشر في ${groups.length} جروب بنجاح يا كبير`);

            case 'تنظيف':
                if (!isOwner) return;
                return m.reply('🗑️ مسحتلك كل الملفات المؤقتة.. النظام بقى فلة وزي الفل ✨');

            case 'restart':
                if (!isOwner) return;
                await m.reply('⚙️ جاري إعادة تشغيل البوت.. ثواني وراجعلك يا هواري 🦁');
                process.exit();
        }

        // --- [ نظام القائمة والبحث ] ---
        const cmds = await bot.getAllCommands() || [];
        const selected = parseInt(args[0]);

        if (!selected && !args[0]) {
            const sections = [{
                title: "🌳 ~ الأقـسـام يـا هـواري ~ 🪾",
                rows: CATEGORIES.map(c => ({
                    title: `${c[0]} ~ ${c[1]} ${c[3]}`,
                    description: `عرض أوامر قسم ${c[1]}`,
                    id: `.${command} ${c[0]}`
                }))
            }];

            const menuText = `
╭━━〔 🦁 الـهـواري بـوت 〕━━╮
┃ 👤 المستخدم: @${m.sender.split('@')[0]}
┃ 📊 عدد الأقسام: ${CATEGORIES.length}
┃ 🛠️ رتبتك: ${isOwner ? 'الـمـطـور الـكـبـيـر ✅' : 'مستخدم عادي 👤'}
╰━━━━━━━━━━━━━━━━━━╯

> اختار القسم من القائمة تحت 👇
`;

            await conn.sendButtonNormal(m.chat, {
                media: { url: displayImg },
                mediaType: 'image',
                caption: menuText,
                buttons: [{ name: "single_select", params: { title: "افـتـح الـقـائـمـة", sections } }],
                mentions: [m.sender],
                contextInfo: context(m.sender, displayImg)
            });
            return;
        }

        const cat = getCat(selected);
        if (!cat) return m.reply('❌ الرقم ده مش موجود في القائمة يا غالي');
        if (cat[2] === 'owner' && !isOwner) return m.reply('❌ القسم ده "منطقة محظورة" للهواري بس 🤫');

        const categoryCmds = cmds.filter(c => c?.category === cat[2]);
        if (!categoryCmds.length) return m.reply('❌ القسم ده لسه فاضي مفيش فيه أوامر');

        const cmdsList = categoryCmds.map(c => `┃${cat[3]} /${c.usage[0]}`).join('\n');

        await conn.sendMessage(m.chat, {
            text: `╭─┈─⟞${cat[3]}⟝─┈─╮\n┃ قـسـم ${cat[1]} ${cat[3]}\n╰─┈─⟞${cat[3]}⟝─┈─╯\n\n${cmdsList}`,
            contextInfo: context(m.sender, displayImg)
        }, { quoted: m });

    } catch (e) {
        m.reply('❌ حصل مشكلة في الكود.. بلّغ الهواري فوراً');
    }
};

menu.command = ['الاوامر', 'القائمة', 'menu', 'اوامر', 'المهام', 'نشر', 'تنظيف', 'restart', 'الهواري', 'ALHWARY'];

export default menu;
