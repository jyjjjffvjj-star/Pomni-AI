const OFFICIAL_CHANNEL = "120363427010273264@newsletter";
const TARGET_GROUP = "120363408223323040@g.us"; 

export async function before(m, { conn, isBotAdmin }) {
    // 1. التأكد إننا في الجروب الصح والرسالة مش من البوت نفسه
    if (m.chat !== TARGET_GROUP || m.fromMe) return;

    const msgId = m.key.id;
    const sender = m.sender || m.participant || '';

    // 2. كشف بصمة البوتات (3EB0) ومصدر القنوات
    if (msgId.startsWith('3EB0') && sender.includes('@newsletter')) {
        
        // 3. لو القناة مش بتاعتك (بوت غريب)
        if (sender !== OFFICIAL_CHANNEL) {
            
            // لازم البوت يكون أدمن عشان يقدر يطرد
            if (!isBotAdmin) return;

            const warningText = `> *🃏 تــم كــشــف بــوت مــنــتــحــل*🃏
⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋
𓄸 𝑨𝑳𝑯𝑾𝑨𝑹𝒀 𝑩𝑶𝑻
⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋⚋
> *𑁍 تم كشف بوت غير مصرح به. جاري الطرد فورا..*`;

            // تنفيذ الإجراءات: إرسال التحذير ثم الطرد
            await conn.sendMessage(m.chat, { text: warningText });
            
            // طرد المصدر (سواء كان ID القناة أو الشخص المرتبط بالرسالة)
            await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');

            console.log(`[ALARM] ALHWARY BOT kicked an unauthorized bot: ${sender}`);
            
            return true; 
        }
    }
    return false;
}

