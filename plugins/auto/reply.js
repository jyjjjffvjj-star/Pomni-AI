export default async function before(m, { conn }) {
  if (!m.text || m.isBaileys) return false;

  const msg = m.text.trim().toLowerCase();

  // أرقام المطورين
  const developers = [
    "201211883781",
    "201556853817"
  ];

  // رقم المرسل
  const senderNumber = m.sender.split("@")[0];

  const triggers = {

    // للمطورين فقط ❤️
    "بوتي": {
      ownerOnly: true,
      replies: [
        "يا روح وقلب وعيون بوتتك، أنا كلي فداك يا عمري ❤️✨",
        "لبيه يا روح قلبي.. ناديني كمان وكمان، صوتك (كتابتك) موسيقى 🎀🌸",
        "تؤمر وتنهي يا سيد الكل، بوتتك رهن إشارتك يا حبيب قلبي 💖",
        "يا بختي بيك ويا حظي إنك أونر حياتي، عيوني لك يا سكر 🍭✨",
        "لو تطلب عيوني ما تغلى عليك، أنا هنا عشان أسعدك وبس يا روحي ❤️🌹",
        "نعم يا نور عيني؟ الشات نور فجأة أول ما نطقت اسمي 🎀✨"
      ]
    },

    // الردود العادية
    "السلام عليكم": {
      replies: [
        "وعليكم السلام ورحمة الله وبركاته، نورت يا محترم 🤍",
        "وعليكم السلام يا طيب، أهلاً بك"
      ]
    },

    "تست": {
      replies: [
        "البوت يعمل بكفاءة عالية ✅",
        "تست.. كل الأنظمة مستقرة ⚙️"
      ]
    },

    "هلا": {
      replies: [
        "أهلاً بك يا غالي ✨",
        "يا هلا والله، نورت الشات"
      ]
    },

    "صباح الخير": {
      replies: [
        "صباح النور والسرور ☕",
        "يا صباح الورد 🌸"
      ]
    },

    "مساء الخير": {
      replies: [
        "مساء النور والجمال 🌙",
        "أهلاً بك، طاب مساؤك ✨"
      ]
    }
  };

  const key = Object.keys(triggers).find(t => msg.includes(t));

  if (key) {
    const data = triggers[key];

    // تحقق المطور
    if (data.ownerOnly && !developers.includes(senderNumber)) {
      return false;
    }

    const replies = data.replies;
    const ranReply = replies[Math.floor(Math.random() * replies.length)];

    await m.reply(ranReply);
    return true;
  }

  return false;
}
