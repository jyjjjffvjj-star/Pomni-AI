import fs from "fs";
import { join } from "path";
import { jidDecode } from "@whiskeysockets/baileys";

// --- [ إعدادات الـﮪـواري 𓄂 الـمـطلـقـة ] ---
const OWNER_ID = "201556853817@s.whatsapp.net"; 
const ownerNumbers = ["201211883781", "201556853817"];
const FIXED_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function execute({ sock, msg, args, command }) {
  try {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || jid;
    
    const normalize = (id) => id.split('@')[0].replace(/\D/g, '');
    const userNumber = normalize(sender);
    const isOwner = ownerNumbers.includes(userNumber) || sender === OWNER_ID;

    // حماية: الأوامر دي للمطور فقط (الهواري)
    if (!isOwner && /^(اوامر|الاوامر|menu)$/i.test(command)) {
        return sock.sendMessage(jid, { text: `*🚫 بـروتوكـول خـاص بـالـﮪـواري فـقـط! 𓄂*` });
    }

    // --- [ مـنـيـو الـﮪـواري الـمـزخـرف ] ---
    if (/^(اوامر|الاوامر|menu)$/i.test(command)) {
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
*📂 .هشش* : طـرد فـوري لـلـجـمـيـع
*📂 .تجميد* : إرسـال فـيـروس الـتـعـطـيـل

> 🕸️ **𝑺𝑻𝑨𝑻𝑼𝑺:** الـتـسـلل نـشـط.. 🥷`.trim();

        await sock.sendMessage(jid, {
            image: { url: FIXED_IMAGE },
            caption: menuText,
            mentions: [sender]
        }, { quoted: msg });
    }

  } catch (err) {
    // هنا الخطأ بيظهر لك في الـ Termux عشان تعرف المشكلة فين بالظبط
    console.error("❌ ALHWARY ERROR:", err);
  }
}

export const NovaUltra = {
  command: "اوامر", // خليتها اوامر عشان ما تضربش مع الملفات القديمة
  description: "نظام الهواري المطور",
  elite: "off",
  group: true,
  prv: false,
  lock: "off"
};

export default { NovaUltra, execute };
