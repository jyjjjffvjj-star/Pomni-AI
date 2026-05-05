const MENU_TIMEOUT = 120000;

const ownerNumbers = [
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
    [17, 'تـغـيـر الاصـوات', 'voices', '📢'],
    [18, 'أخــرى', 'other', '🌹']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);

if (!global.menus) global.menus = {};
if (!global.errors) global.errors = [];

/**
 * 🧠 تسجيل الأخطاء
 */
global.logError = (info) => {
    global.errors.push({
        file: info.file || 'unknown',
        command: info.command || 'unknown',
        error: info.error?.message || info.error || 'unknown',
        time: Date.now()
    });

    if (global.errors.length > 50) global.errors.shift();
};

const clean = () => {
    const now = Date.now();
    Object.keys(global.menus).forEach(k => {
        if (now - global.menus[k].time > MENU_TIMEOUT) delete global.menus[k];
    });
};

const getImg = (bot) => {
    const images = bot?.config?.info?.images || [];
    return Array.isArray(images) && images.length
        ? images[Math.floor(Math.random() * images.length)]
        : null;
};

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363225356834044@newsletter',
        newsletterName: 'ALHWARY BOT',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "ALHWARY BOT",
        body: "Fast WhatsApp Bot",
        thumbnailUrl: img,
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

const menu = async (m, { conn, bot, args, command }) => {
    try {
        clean();

        const normalize = (id) => id.split('@')[0].replace(/\D/g, '');
        const userNumber = normalize(m.sender);

        const isOwner = ownerNumbers.includes(userNumber);
        const isAdmin = m.isAdmin || false;

        const cmds = await bot.getAllCommands() || [];

        // 🔍 بحث
        if (args[0] && isNaN(args[0])) {
            const search = args.join(' ').toLowerCase();

            const results = cmds.filter(c =>
                Array.isArray(c.usage) &&
                c.usage.some(u => u.toLowerCase().includes(search))
            );

            if (!results.length) return m.reply('❌ مفيش أمر بالاسم ده');

            return m.reply(results.map(c => `/${c.usage.join(', ')}`).join('\n'));
        }

        const selected = parseInt(args[0]);

        // 📜 القائمة
        if (!selected && !args[0]) {

            const sections = [{
                title: "🌳 ~ الاقـسـام ~ 🪾",
                rows: CATEGORIES.map(c => ({
                    title: `${c[0]} ~ ${c[1]} ${c[3]}`,
                    description: `عرض أوامر قسم ${c[1]}`,
                    id: `.${command} ${c[0]}`
                }))
            }];

            const menuText = `
╭━━〔 🤖 ${bot?.config?.info?.nameBot || 'BOT'} 〕━━╮
┃ 👤 المستخدم: @${m.sender.split('@')[0]}
┃ 📊 عدد الأقسام: ${CATEGORIES.length}
╰━━━━━━━━━━━━━━━━━━╯

${CATEGORIES.map(c => `┃ ⌯︙${c[0]} ~ *${c[1]} ${c[3]}*`).join('\n')}

> اختار من تحت 👇
`;

            await conn.sendButtonNormal(m.chat, {
                media: { url: getImg(bot) },
                mediaType: 'image',
                caption: menuText,
                buttons: [{
                    name: "single_select",
                    params: {
                        title: "القائمة",
                        sections
                    }
                }],
                mentions: [m.sender],
                contextInfo: context(m.sender, getImg(bot))
            });

            return;
        }

        const cat = getCat(selected);
        if (!cat) return m.reply('❌ رقم غلط');

        // 🛡️ حماية الأدمن
        if (cat[2] === 'admin' && !isAdmin) {
            return m.reply('❌ انت مش ادمن في الجروب');
        }

        // 🛡️ حماية المطور
        if (cat[2] === 'owner' && !isOwner) {
            return m.reply('❌ هذا القسم مخصص للمطورين فقط');
        }

        const categoryCmds = cmds.filter(c => c?.category === cat[2]);

        if (!categoryCmds.length) return m.reply('❌ القسم فاضي');

        categoryCmds.sort((a, b) => {
            const aName = Array.isArray(a.usage) ? a.usage[0] : '';
            const bName = Array.isArray(b.usage) ? b.usage[0] : '';
            return aName.localeCompare(bName);
        });

        const cmdsList = categoryCmds.map(c => {
            if (!Array.isArray(c.usage)) return `┃${cat[3]} /بدون_اسم`;
            return `┃${cat[3]} /${c.usage.join(`\n┃${cat[3]} /`)}`;
        }).join('\n');

        await conn.sendMessage(m.chat, {
            text: `
╭─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╮
┃ قـسـم ${cat[1]} ${cat[3]}
╰─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╯

${cmdsList}
`.trim(),
            contextInfo: context(m.sender, getImg(bot))
        }, { quoted: m });

    } catch (e) {
        console.log(e);

        global.logError({
            file: __filename,
            command,
            error: e
        });

        m.reply('❌ حصل خطأ وتم تسجيله للمطور');
    }
};

menu.command = ['الاوامر', 'القائمة', 'menu', 'اوامر', 'المهام'];

export default menu;
