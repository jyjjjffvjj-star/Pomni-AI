import { jidDecode } from "@whiskeysockets/baileys";
import { addKicked } from "../../nova/dataUtils.js"; 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const IMAGE_URL = "https://i.ibb.co/C33RB5zx/1000072528.jpg";

const context = (jid) => ({
    mentionedJid: [jid],
    externalAdReply: {
        title: "💣 | الـقـنـبـلـة الـمـوقـوتـة ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘",
        body: "الـهـوارِي بـوت بـدأ الـعـد الـتـنـازلـي لـلـإبـادة ⚡",
        thumbnailUrl: IMAGE_URL,
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

export async function execute({ sock, msg }) {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || jid;
    const botJid = (jidDecode(sock.user.id)?.user || sock.user.id.split("@")[0]) + "@s.whatsapp.net";

    try {
        await sock.sendMessage(jid, { react: { text: '⏳', key: msg.key } });
        const prompt = await sock.sendMessage(jid, {
            text: "*⌛️ الـهـوارِي بـوت يـنـتـظـر تـوقـيـت الـانـفـجـار (1-60 ثانية)*",
            contextInfo: context(sender)
        }, { quoted: msg });

        const listener = async ({ messages }) => {
            const m = messages[0];
            if (!m.message || m.key.remoteJid !== jid || (m.key.participant || m.key.remoteJid) !== sender) return;
            const text = (m.message.conversation || m.message.extendedTextMessage?.text || "").trim();
            if (text === "كنسل") {
                sock.ev.off("messages.upsert", listener);
                return await sock.sendMessage(jid, { edit: prompt.key, text: "❌ *تـم إلـغـاء الـعـمـلـيـة بـأمـر الـهـوارِي بـوت.*" });
            }
            const countNum = parseInt(text);
            if (isNaN(countNum) || countNum < 1 || countNum > 60) return;
            sock.ev.off("messages.upsert", listener);

            for (let i = countNum; i >= 0; i--) {
                await sock.sendMessage(jid, { edit: prompt.key, text: `*⚠️ الـهـوارِي بـوت يـفـجـر الـقـروب بـعـد: [ ${i} ] 💣*` });
                await sleep(1000);
            }
            await sock.sendMessage(jid, { edit: prompt.key, text: "*💣💥 تـم الـتـفـجـيـر بـواسـطـة الـهـوارِي بـوت!*" });
            const group = await sock.groupMetadata(jid);
            const toKick = group.participants.filter(p => p.id !== botJid).map(p => p.id);
            if (toKick.length > 0) {
                await sock.groupParticipantsUpdate(jid, toKick, 'remove');
                addKicked(toKick);
            }
        };
        sock.ev.on("messages.upsert", listener);
    } catch (error) { console.error(error); }
}

export const NovaUltra = { command: "بوم", description: "تدمير المجموعة عبر الـهـوارِي بـوت", elite: "on", group: true, prv: false, lock: "off" };
export default { NovaUltra, execute };
