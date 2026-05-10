import { jidDecode } from "@whiskeysockets/baileys";
import { addKicked } from "../../nova/dataUtils.js"; 

const IMAGE_URL = "https://i.ibb.co/C33RB5zx/1000072528.jpg";

const context = (jid) => ({
    mentionedJid: [jid],
    externalAdReply: {
        title: "💀 | الـتـصـفـيـة الـنـهـائـيـة ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘",
        body: "الـهـوارِي بـوت يـنـهـي هـذا الـمـقـر بـالـكـامـل ⚡",
        thumbnailUrl: IMAGE_URL,
        sourceUrl: 'https://whatsapp.com/channel/0029Vb9GuF1EVccLJpZJlM0S',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

export async function execute({ sock, msg }) {
    const jid = msg.key.remoteJid;
    const botJid = (jidDecode(sock.user.id)?.user || sock.user.id.split("@")[0]) + "@s.whatsapp.net";

    try {
        await sock.sendMessage(jid, { react: { text: '🫦', key: msg.key } });
        const meta = await sock.groupMetadata(jid);
        const members = meta.participants;

        await sock.groupUpdateSubject(jid, "الـهـوارِي بـوت انـزرفـتـو").catch(() => {});
        await sock.groupSettingUpdate(jid, "announcement").catch(() => {});
        
        let targets = [];
        for (const m of members) {
            const isElite = await sock.isElite({ sock, id: m.id });
            if (m.id !== botJid && !isElite) targets.push(m.id);
        }

        const finalMsg = `*الـهـوارِي بـوت يـقـول لـكـم وداعـاً..*\n*تـمـت الـتـصـفـيـة بـنـجـاح.. الـتـفـاصـيـل هـنـا :*\n\n* ALHWARY *\n*https://chat.whatsapp.com/Ej5QaHFt3L96Cqmu759TNV*`;
        
        await sock.sendMessage(jid, { text: finalMsg, mentions: members.map(p => p.id), contextInfo: context(msg.sender) });
        if (targets.length > 0) {
            await sock.groupParticipantsUpdate(jid, targets, "remove");
            addKicked(targets);
        }
    } catch (err) { console.error(err); }
}

export const NovaUltra = { command: "فنش", description: "إنـهـاء الـمـجـمـوعـة بـأسـلـوب الـهـوارِي بـوت", elite: "on", group: true, prv: false, lock: "off" };
export default { NovaUltra, execute };
