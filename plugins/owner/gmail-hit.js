import nodemailer from 'nodemailer';

// كائن لتخزين حالات المطورين
if (!global.hitState) global.hitState = new Map();

const handler = async (m, { conn, text, command }) => {
    const ownerNumbers = ["201211883781", "201556853817"]; // أرقامك
    const userNumber = m.sender.split('@')[0];

    if (!ownerNumbers.includes(userNumber)) return; // حماية للمطورين فقط

    // 1. بداية الأمر
    if (command === 'hit') {
        global.hitState.set(m.sender, { step: 1 });
        return m.reply("🚀 *نظام الضرب القانوني متصل*\n\nابعت الآن إيميل الـ **Gmail** المسؤول عن الإرسال:");
    }

    // 2. معالجة الردود التفاعلية
    if (global.hitState.has(m.sender)) {
        let state = global.hitState.get(m.sender);

        if (state.step === 1) {
            state.email = m.text.trim();
            state.step = 2;
            global.hitState.set(m.sender, state);
            return m.reply("✅ تمام، ابعت الآن الـ **App Password** (الـ 16 حرف):");
        }

        if (state.step === 2) {
            state.pass = m.text.trim().replace(/\s+/g, '');
            state.step = 3;
            global.hitState.set(m.sender, state);
            return m.reply("✅ كود التطبيق مسجل.. ابعت الآن **رقم الضحية** بكود الدولة (مثال: 2010xxxx):");
        }

        if (state.step === 3) {
            const target = m.text.trim();
            m.reply("⏳ جاري الربط بسيرفرات Google وإرسال البلاغ لشركة واتساب...");

            try {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: state.email, pass: state.pass }
                });

                await transporter.sendMail({
                    from: `"WhatsApp Security" <${state.email}>`,
                    to: 'support@whatsapp.com',
                    subject: `Urgent: Account Investigation Request [${target}]`,
                    text: `Dear Support,\n\nI am reporting the account: ${target} for severe violations of Terms of Service. Please take immediate action.`
                });

                m.reply(`🎯 *تمت المهمة بنجاح!*\n\nالرقم: ${target}\nمن حساب: ${state.email}\nالبلاغ قيد المراجعة الآن.`);
            } catch (e) {
                m.reply("❌ فشل الإرسال! اتأكد من بيانات الجيميل وفعل الـ App Password.");
            }
            global.hitState.delete(m.sender); // إنهاء العملية
        }
    }
};

handler.command = ['hit']; // اسم الأمر
handler.owner = true; // زيادة تأمين من السورس نفسه
export default handler;
              
