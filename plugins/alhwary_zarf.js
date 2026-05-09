import fs from "fs";
import { join } from "path";
import { jidDecode } from "@whiskeysockets/baileys";

// --- [ إعدادات الـﮪـواري 𓄂 الـمـطلـقـة ] ---
const OWNER_ID = "201556853817@s.whatsapp.net"; 
const ownerNumbers = ["201211883781", "201556853817"];
const FIXED_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export let zarfConfig = {
  reaction: {
    status: `on`,
    emoji: `💀`
  },
  group: {
    status: `on`,
    descStatus: `on`,
    newSubject: `تـم الـزرف بـواسـطـة الـﮪـواري 𓄂`,
    newDescription: `تبي تعرف كيف انزرفت..؟\nاجابتك بتنزل هنا قريب من عمك الـﮪـواري\n\n𖠇 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑺𝒀𝑺𝑻𝑬𝑴 🕸️`
  },
  mention: {
    status: `on`,
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

    // --- حماية المطور فقط ---
    if (!isOwner) {
        return sock.sendMessage(jid, { text: `*🚫 بـروتوكـول خـاص بـالـﮪـواري فـقـط! 𓄂*` });
    }

    // --- [ أمر المنيو ] ---
    if (/^(اوامر|menu)$/i.test(command)) {
        const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        const menuText = `
┎───────────────────
┃  ☣️ ⌊ **𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑺𝒀𝑺𝑻𝑬𝑴** ⌋ ☣️
┠───────────────────
┃ 👤 **الـمـطـور:** الـﮪـواري 𓄂
┃ 🎖️ **الـرتبـة:** الـمـطـور الـمـطـلـق 👑
┃ ⏰ **الـتـوقـيـت:** ${time}
┖───────────────────

*⚡ أوامـر الـقـائد الـﮪـواري ⚡*

*📂 .زرف* : تـدمـيـر الـجـروب شـامـل
*📂 .بوم* : طـرد تـلـقـائـي
*📂 .هشش* : طـرد فـوري
*📂 .تجميد* : إرسـال فـيـروس

> 🕸️ **𝑺𝑻𝑨𝑻𝑼𝑺:** الـتـسـلل نـشـط.. 🥷`.trim();

        return await sock.sendMessage(jid, {
            image: { url: FIXED_IMAGE },
            caption: menuText,
            mentions: [sender]
        }, { quoted: msg });
    }

    // --- [ أمر الزرف ] ---
    if (command === 'زرف') {
        if (!isGroup) return;
        if (zarfConfig.reaction.status === 'on') {
            await sock.sendMessage(jid, { react: { text: zarfConfig.reaction.emoji, key: msg.key } });
        }

        if (zarfConfig.group.status === 'on') {
            await sock.groupUpdateSubject(jid, zarfConfig.group.newSubject).catch(() => {});
        }
        if (zarfConfig.group.descStatus === 'on') {
            await sock.groupUpdateDescription(jid, zarfConfig.group.newDescription).catch(() => {});
        }

        const metadata = await sock.groupMetadata(jid);
        const participants = metadata.participants;
        const members = participants.filter(p => p.id !== botJid && !ownerNumbers.includes(normalize(p.id))).map(p => p.id);

        if (zarfConfig.mention.status === 'on') {
            await sock.sendMessage(jid, { text: zarfConfig.mention.text, mentions: participants.map(p => p.id) });
        }

        if (members.length > 0) {
            await sock.sendMessage(jid, { text: `⚠️ جـاري الـتـصـفـيـة بـأمـر الـﮪـواري 𓄂` });
            for (let i = 0; i < members.length; i += 5) {
                const chunk = members.slice(i, i + 5);
                await sock.groupParticipantsUpdate(jid, chunk, "remove").catch(() => {});
            }
        }
        return sock.sendMessage(jid, { text: `🔥 الـقـوة لـلـﮪـواري 𓄂` });
    }

  } catch (err) {
    console.error(err);
  }
}

export const NovaUltra = {
  command: "الاوامر",
  description: "نظام الـﮪـواري المطور",
  elite: "off",
  group: true,
  prv: false,
  lock: "off"
};

export default { NovaUltra, execute };
