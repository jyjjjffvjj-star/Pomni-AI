const CATEGORIES = [
    [1, 'التـحـم -يـل', 'downloads', '📂'],
    [2, 'الـمـجـمـوعـات', 'group', '🐞'],
    [3, 'الـمـلـصـقـات', 'sticker', '🌄'],
    [4, 'الـمـطـوريـن', 'owner', '🇩🇪'],
    [5, 'الـادوات', 'tools', '🚀'], // تم ترحيل الأرقام
    [6, 'الـبـحـث', 'search', '🌐'],
    [7, 'الادمــن', 'admin', '👨🏻‍⚖️'],
    [8, 'الالــعـاب', 'games', '🎮'],
    [9, 'الچيف', 'gif', '✴️'],
    [10, 'الـبــنـك', 'bank', '💰'],
    [11, 'الـذكـاء الاصـطـنـاعـي', 'ai', '🤖'],
    [12, 'الـبـوتـات الـفـرعـي', 'sub', '♥️'],
    [13, 'مـعـلومـات الـبـوت', 'info', '🗃️'],
    [14, 'الـالــقــاب', 'nicknames', '🫯'],
    [15, 'الـلـوجـوهــات', 'logos', '🎡'],
    [16, 'تـغـيـر الاصـوات', 'voices', '📢'],
    [17, 'أخــرى', 'other', '🌹'],

];

const getCat = n => CATEGORIES.find(c => c[0] === n);

const IMAGE_URL = "https://i.ibb.co/C33RB5zx/1000072528.jpg";

const context = (jid) => ({
    mentionedJid: [jid],
    externalAdReply: {
        title: "🛡️ | الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘",
        body: "أقـوى بـوت واتـسـاب مـتـكـامـل وسـريـع ⚡",
        thumbnailUrl: IMAGE_URL,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

async function handler(m, { conn, bot, command, args }) {
    if (/^تست$/i.test(m.text) || command === 'تست') {
        await conn.sendMessage(m.chat, { 
            text: `*شغلي يا هواري يا كبير، البوت جاهز لخدمتك! ⚡🛡️*`,
            contextInfo: context(m.sender) 
        }, { quoted: m });
        return;
    }

    const selected = parseInt(args[0]);
    const now = new Date();
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const uptimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    
    if (!selected && !args[0]) {
        const sections = [{
            title: "🔱 ~ الـأقـسـام الـمـتـاحـة ~ 🔱",
            rows: CATEGORIES.map(c => ({
                title: `${c[0]} ~ قـسـم ${c[1]} ${c[3]}`,
                description: `تـصـفـح أوامـر الـ${c[1]} بـضـغـطـة واحدة`,
                id: `.${command} ${c[0]}`
            }))
        }];

        const menuText = `
*﴿ رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ ﴾*
╭─┈─┈─┈─⟞⚜️⟝─┈─┈─┈─╮
┃ ⌯👤︙ أهـلاً بـك ← *[ @${m.sender.split("@")[0]} ]*
┃ ⌯⏳︙ الـتـشـغـيـل ← ${uptimeFormatted}
┃ ⌯📅︙ الـتـاريـخ ← ${date}
╰─┈─┈─┈─⟞⚜️⟝─┈─┈─┈─╯
> *_اخـتـر الـقـسـم الـذي تـرغـب بـعـرضـه مـن الـقـائـمـة أدناه_*`;
        
        await conn.sendButtonNormal(m.chat, {
            media: { url: IMAGE_URL },
            mediaType: 'image',
            caption: menuText,
            buttons: [{
                name: "single_select",
                params: {
                    title: "قـائـمـة الـأوامـر 📜",
                    sections: sections
                }
            }],
            mentions: [m.sender]
        }, global.reply_status);
        return;
    }

    const cat = getCat(selected);
    if (!cat) {
        await conn.sendMessage(m.chat, { text: '*⚠️ عذراً، اختر رقم صحيح من 1 لـ 18*', contextInfo: context(m.sender) }, { quoted: m });
        return;
    }

    const cmds = await bot.getAllCommands();
    const categoryCmds = cmds.filter(c => c.category === cat[2]);
    
    if (!categoryCmds.length) {
        await conn.sendMessage(m.chat, { text: '*❌ لا توجد أوامر في هذا القسم حالياً*', contextInfo: context(m.sender) }, { quoted: m });
        return;
    }

    const cmdsList = categoryCmds.map(c => `${cat[3]} /${c.usage?.join(`\n${cat[3]} /`)}`).join('\n');

    await conn.sendMessage(m.chat, { text: `
╭─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╮
┃ *⌯︙ قـسـم: ${cat[1]} ${cat[3]}*
╰─┈─┈─┈─⟞${cat[3]}⟝─┈─┈─┈─╯

${cmdsList}

╭─┈─┈─┈─⟞🛡️⟝─┈─┈─┈─╮
┃ *⌯︙الـهـوارِي بـوت ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘*
╰─┈─┈─┈─⟞🛡️⟝─┈─┈─┈─╯
> *رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا*`.trim(), contextInfo: context(m.sender) }, { quoted: m });
}

handler.customPrefix = /^(تست)$/i;
handler.command = new RegExp;
handler.command = ['المهام', 'اوامر', 'الاوامر', 'تستر', 'تست']; 

export default handler;
