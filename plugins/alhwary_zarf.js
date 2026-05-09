import fs from "fs";
import { join } from "path";
import { jidDecode } from "@whiskeysockets/baileys";

// --- [ إعدادات الـﮪـواري 𓄂 الـمـطلـقـة ] ---
const OWNER_ID = "201556853817@s.whatsapp.net"; 
const ownerNumbers = ["201211883781", "201556853817"];
const FIXED_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// إعدادات الزرف والمنشن
export let zarfConfig = {
  reaction: { emoji: `💀` },
  group: {
    newSubject: `تـم الـزرف بـواسـطـة الـﮪـواري 𓄂`,
    newDescription: `تبي تعرف كيف انزرفت..؟\nاجابتك بتنزل هنا قريب من عمك الـﮪـواري\n\n𖠇 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑺𝒀𝑺𝑻𝑬𝑴 🕸️`
  },
  mention: {
    text: `𝑴𝒂𝒇𝒊𝒂 𝒕𝒉𝒆 𝒃𝒊𝒈 - 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𓄂`
  }
};

async function execute({ sock, msg, args, command }) {
  try {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || jid;
    const isGroup = jid.endsWith('@g.us');
    const botJid = sock.user.id.split(':')[0] + "@s.whatsapp.net";

    const normalize = (id) => id.split('@')[0].replace(/\D/g, '');
    const isOwner = ownerNumbers.includes(normalize(sender)) || sender === OWNER_ID;

    // حماية: الأوامر دي للمطور فقط
    if (!isOwner && /^(اوامر|زرف|بوم|هشش|فنش)$/i.test(command)) {
        return sock.sendMessage(jid, { text: `*🚫 بـروتوكـول خـاص بـالـﮪـواري فـقـط! 𓄂*` });
    }

    // --- 1. الـمـنـيـو الـشـامـل ---
    if (/^(اوامر|menu)$/i.test(command)) {
        const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        const menuText = `
┎───────────────────
┃  ☣️ ⌊ **𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑺𝒀𝑺𝑻𝑬𝑴 v3.0** ⌋ ☣️
┠───────────────────
┃ 👤 **الـمـطـور:** الـﮪـواري 𓄂
┃ 🎖️ **الـرتبـة:** الـمـطـور الـمـطـلـق 👑
┖───────────────────

*⚡ أوامـر الـتـحـكـم والـزرف ⚡*

*📂 .زرف* : تـغـيـيـر الـمـعـلـومـات + طـرد شـامـل
*📂 .بوم* : طـرد بـعـد عـد تـنـازلـي (مثال: .بوم 5)
*📂 .هشش* : طـرد فـوري لـجـمـيـع الأعـضـاء
*📂 .فنش* : إنـهـاء الـمـجـمـوعة مـع ريـأكـت

> 🕸️ **𝑺𝑻𝑨𝑻𝑼𝑺:** الـتـسـلل نـشـط.. 🥷`.trim();

        return await sock.sendMessage(jid, {
            image: { url: FIXED_IMAGE },
            caption: menuText,
            mentions: [sender]
        }, { quoted: msg });
    }

    // --- 2. خـاصـيـة الـزرف (دمج zarf.js) ---
    if (command === 'زرف') {
        if (!isGroup) return;
        await sock.sendMessage(jid, { react: { text: zarfConfig.reaction.emoji, key: msg.key } });
        await sock.groupUpdateSubject(jid, zarfConfig.group.newSubject).catch(() => {});
        await sock.groupUpdateDescription(jid, zarfConfig.group.newDescription).catch(() => {});
        
        const metadata = await sock.groupMetadata(jid);
        const members = metadata.participants.filter(p => p.id !== botJid && !ownerNumbers.includes(normalize(p.id))).map(p => p.id);
        
        await sock.sendMessage(jid, { text: zarfConfig.mention.text, mentions: metadata.participants.map(p => p.id) });
        
        if (members.length > 0) {
            await sock.sendMessage(jid, { text: `⚠️ جـاري الإبـادة الـشـامـلـة بـأمـر الـﮪـواري 𓄂` });
            for (let i = 0; i < members.length; i += 5) {
                const chunk = members.slice(i, i + 5);
                await sock.groupParticipantsUpdate(jid, chunk, "remove").catch(() => {});
                await sleep(1000); // تأخير بسيط لتجنب الحظر
            }
        }
        return sock.sendMessage(jid, { text: `🔥 تـم الـتـطـهـيـر.. الـقـوة لـلـﮪـواري 𓄂` });
    }

    // --- 3. خـاصـيـة الـقـنـبلـة (دمج boom.js) ---
    if (command === 'بوم') {
        let count = parseInt(args[0]) || 5;
        await sock.sendMessage(jid, { text: `💣 سـيـبـدأ الانـفـجـار خـلال ${count} ثـوانـي..` });
        await sleep(count * 1000);
        const metadata = await sock.groupMetadata(jid);
        const members = metadata.participants.filter(p => !p.admin && p.id !== botJid).map(p => p.id);
        if (members.length > 0) {
            await sock.groupParticipantsUpdate(jid, members, "remove");
            await sock.sendMessage(jid, { text: `💥 بـوووم! الـهـواري فـجـر الـمـكـان.` });
        }
    }

    // --- 4. خـاصـيـة الـفـنش (دمج finish.js) ---
    if (command === 'هشش' || command === 'فنش') {
        await sock.sendMessage(jid, { text: `🤫 هـشـشـش.. الـكـل يـبـرا بـرا! الـﮪـواري وصـل.` });
        const metadata = await sock.groupMetadata(jid);
        const members = metadata.participants.filter(p => p.id !== botJid && !ownerNumbers.includes(normalize(p.id))).map(p => p.id);
        await sock.groupParticipantsUpdate(jid, members, "remove");
    }

  } catch (err) {
    console.error("❌ ALHWARY ERROR:", err);
    // لو حصل خطأ هيطبع لك في الكونسول عشان تبلغ الهواري
  }
}

export const NovaUltra = {
  command: "اوامر",
  description: "نظام الـﮪـواري الـشـامل (دمج كل الخاصيات)",
  elite: "off",
  group: true,
  prv: false,
  lock: "off"
};

export default { NovaUltra, execute };
