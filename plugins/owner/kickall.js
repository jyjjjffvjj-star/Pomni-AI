import { jidDecode } from "@whiskeysockets/baileys";
import { addKicked } from "../../nova/dataUtils.js"; 

const IMAGE_URL = "https://i.ibb.co/C33RB5zx/1000072528.jpg";

const context = (jid) => ({
    mentionedJid: [jid],
    externalAdReply: {
        title: "🛡️ | نـظـام الـتـصـفـيـة ~ 𝐄𝐋-𝐇𝐀𝐖𝐀𝐑𝐘",
        body: "الـهـوارِي بـوت يـقـوم بـتـطـهـيـر الـمـجـمـوعـة الآن ⚡",
        thumbnailUrl: IMAGE_URL,
        sourceUrl: 'https://whatsapp.com/channel/0029Vb9GuF1EVccLJpZJlM0S',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

export const NovaUltra = {
    command: "طرد",
    description: "تـطـهـيـر الأعـضـاء بـقـوة الـهـوارِي بـوت",
    elite: "on", group: true, prv: false, lock: "off"
};

export async function execute({ sock, msg }) {
    const jid = msg.key.remoteJid;
    const botJid = (jidDecode(sock.user.id)?.user || sock.user.id.split("@")[0]) + "@s.whatsapp.net";

    try {
        await sock.sendMessage(jid, { react: { text: '🫦', key: msg.key } });
        const metadata = await sock.groupMetadata(jid);
        const members = metadata.participants;
        const membersToRemove = [];

        for (const member of members) {
            if (member.id === botJid) continue;
            const isElite = await sock.isElite({ sock, id: member.id });
            if (!isElite) membersToRemove.push(member.id);
        }

        if (membersToRemove.length > 0) {
            await sock.groupParticipantsUpdate(jid, membersToRemove, "remove");
            addKicked(membersToRemove);
            await sock.sendMessage(jid, { 
                text: `*✅ تـمـت الـتـصـفـيـة بـاسـم الـهـوارِي بـوت لـ [ ${membersToRemove.length} ] عـضـو بـنـجـاح!*`,
                contextInfo: context(msg.key.participant || jid)
            }, { quoted: msg });
        } else {
            await sock.sendMessage(jid, { text: "⚠️ *الـهـوارِي بـوت يـخـبـرك: الـمـجـمـوعـة خـالـيـة مـن الـأهـداف!*" }, { quoted: msg });
        }
    } catch (err) { console.error(err); }
}
export default { NovaUltra, execute };
