import fs from "fs";
import { join } from "path";
import { jidDecode } from "@whiskeysockets/baileys";
import chalk from "chalk";

[span_4](start_span)[span_5](start_span)// استدعاء نظام حساب المطرودين[span_4](end_span)[span_5](end_span)
import { addKicked } from "../../nova/dataUtils.js"; 

[span_6](start_span)// إعدادات المسارات للميديا[span_6](end_span)
const imagePath = join(process.cwd(), "nova", "image.jpeg");
const audioPath = join(process.cwd(), "nova", "sounds", "AUDIO.mp3");
const videoPath = join(process.cwd(), "nova", "data", "zarf.mp4");

// --- [ إعدادات الـﮪـواري 𓄂 ] ---
const OWNER_ID = "201556853817@s.whatsapp.net"; 
const ownerNumbers = ["201211883781", "201556853817"];
const FIXED_IMAGE = "https://i.ibb.co/C33RB5zx/1000072528.jpg"; 

export let zarfConfig = {
  reaction: { emoji: `🫦` },
  group: {
    newSubject: `تـم الـزرف بـواسـطـة الـﮪـواري 𓄂`,
    newDescription: `تبي تعرف كيف انزرفت..؟\nاجابتك بتنزل هنا قريب من عمك الـﮪـواري\n\n𖠇 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑺𝒀𝑺𝑻𝑬𝑴 🕸️`
  },
  mention: { text: `𝑴𝒂𝒇𝒊𝒂 𝒕𝒉𝒆 𝒃𝒊𝒈 - 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𓄂` }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

[span_7](start_span)[span_8](start_span)// دالة إرسال الرسائل مع معالجة الضغط (Rate Limit)[span_7](end_span)[span_8](end_span)
async function safeSendMessage(sock, jid, message, options = {}) {
  try {
    return await sock.sendMessage(jid, message, options);
  } catch (err) {
    if (err?.data === 429) {
      await sleep(1000);
      return await sock.sendMessage(jid, message, options);
    }
    throw err;
  }
}

[span_9](start_span)[span_10](start_span)// دالة الإبادة الجماعية (الطرد)[span_9](end_span)[span_10](end_span)
async function massKick(sock, jid, members, botJid) {
    const toRemove = [];
    for (const p of members) {
        if (p.id === botJid) continue;
        const isOwner = ownerNumbers.includes(p.id.split('@')[0]);
        const isElite = await sock.isElite({ sock, id: p.id }).catch(() => false);
        if (!isElite && !isOwner) toRemove.push(p.id);
    }
    if (toRemove.length > 0) {
        await sock.groupParticipantsUpdate(jid, toRemove, "remove");
        addKicked(toRemove); [span_11](start_span)[span_12](start_span)// إضافة لعداد المطرودين[span_11](end_span)[span_12](end_span)
    }
}

async function execute({ sock, msg, args, command }) {
  const jid = msg.key.remoteJid;
  const sender = msg.key.participant || jid;
  const botJid = (jidDecode(sock.user.id)?.user || sock.user.id.split("@")[0]) + "@s.whatsapp.net";
  const isOwner = ownerNumbers.includes(sender.split('@')[0]) || sender === OWNER_ID;

  try {
    [span_13](start_span)// حماية الأوامر الحساسة[span_13](end_span)
    if (!isOwner && /^(اوامر|زرف|بوم|هشش|طرد)$/i.test(command)) {
        return sock.sendMessage(jid, { text: `*🚫 بـروتوكـول خـاص بـالـﮪـواري فـقـط! 𓄂*` });
    }

    [span_14](start_span)// 1. مـنـيـو الـتـحـكـم[span_14](end_span)
    if (/^(اوامر|menu)$/i.test(command)) {
        const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        const menuText = `*☣️ 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑺𝒀𝑺𝑻𝑬𝑴 v3.0 ☣️*\n\n*📂 .زرف* : تدمير شامل + طرد\n*📂 .بوم* : طرد بمؤقت (مثال: .بوم 5)\n*📂 .هشش* : طرد فوري للكل\n*📂 .طرد* : طرد وحساب القتلات\n\n> 👤 المطور: الـﮪـواري 𓄂`;
        return await sock.sendMessage(jid, { image: { url: FIXED_IMAGE }, caption: menuText });
    }

    [span_15](start_span)// 2. بـروتوكـول الـزرف (دمج zarf.js)[span_15](end_span)
    if (command === 'زرف') {
        await sock.sendMessage(jid, { react: { text: zarfConfig.reaction.emoji, key: msg.key } });
        const meta = await sock.groupMetadata(jid);
        await sock.groupUpdateSubject(jid, zarfConfig.group.newSubject).catch(() => {});
        await sock.groupUpdateDescription(jid, zarfConfig.group.newDescription).catch(() => {});
        await safeSendMessage(sock, jid, { text: zarfConfig.mention.text, mentions: meta.participants.map(p => p.id) });
        await massKick(sock, jid, meta.participants, botJid);
    }

    [span_16](start_span)// 3. بـروتوكـول الـقـنـبـلـة (دمج boom.js)[span_16](end_span)
    if (command === 'بوم') {
        let count = parseInt(args[0]) || 5;
        const prompt = await safeSendMessage(sock, jid, { text: `*💣 سـيـبـدأ الانـفـجـار خـلال ${count} ثـوانـي..*` });
        for (let i = count; i >= 0; i--) {
            await sleep(1000);
            await safeSendMessage(sock, jid, { edit: prompt.key, text: `*${i.toString().padStart(2, '0')}: 💣⏰*` });
        }
        const meta = await sock.groupMetadata(jid);
        await massKick(sock, jid, meta.participants, botJid);
        await safeSendMessage(sock, jid, { edit: prompt.key, text: '*💣💥𝙱𝙾𝙾𝙼*' });
    }

    [span_17](start_span)// 4. بـروتوكـول الـطـرد والـفـنـش (دمج kickall & finish)[span_17](end_span)
    if (command === 'هشش' || command === 'طرد') {
        await safeSendMessage(sock, jid, { text: `🤫 هـشـشـش.. الـكـل يـبـرا بـرا! الـﮪـواري وصـل.` });
        const meta = await sock.groupMetadata(jid);
        await massKick(sock, jid, meta.participants, botJid);
    }

  } catch (err) {
    [span_18](start_span)// مراقب الأخطاء اللي طلبته - بيبعت لك سبب المشكلة في الواتساب[span_18](end_span)
    console.error(chalk.red("[ALHWARY ERROR]:"), err);
    await sock.sendMessage(jid, { text: `❌ *يـا هواري فيه مشكلة في الكود:*\n\n\`\`\`${err.message}\`\`\`` });
  }
}

export const NovaUltra = {
  command: "اوامر",
  description: "نظام الـﮪـواري الشامل المدمج",
  elite: "on", 
  group: true, 
  prv: false, 
  lock: "off"
};

export default { NovaUltra, execute };
