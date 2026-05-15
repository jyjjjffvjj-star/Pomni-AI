export default async function before(m, { conn }) {
  if (!m.text || m.isBaileys) return false;

  const msg = m.text.trim().toLowerCase();

  // ارقام المطورين
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
        "لبيه يا روح قلبي.. ناديني كمان وكمان، صوتك موسيقى 🎀🌸",
        "تؤمر وتنهي يا سيد الكل، بوتتك رهن إشارتك 💖",
        "يا بختي بيك ويا حظي إنك أونر حياتي 🍭✨",
        "لو تطلب عيوني ما تغلى عليك ❤️🌹",
        "نعم يا نور عيني؟ الشات نور فجأة 🎀✨"
      ]
    },

    // ردود عادية
    "السلام عليكم": {
      replies: [
        "وعليكم السلام ورحمة الله وبركاته 🤍",
        "وعليكم السلام يا طيب ✨"
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
        "يا هلا والله ✨",
        "أهلاً بالغالي 🌸"
      ]
    },

    "صباح الخير": {
      replies: [
        "صباح النور ☕",
        "صباح الورد 🌸"
      ]
    },

    "مساء الخير": {
      replies: [
        "مساء النور 🌙",
        "مساء الجمال ✨"
      ]
    }
  };

  const key = Object.keys(triggers).find(t => msg.includes(t));

  if (!key) return false;

  const data = triggers[key];

  // لو الأمر للمطورين فقط
  if (data.ownerOnly && !developers.includes(senderNumber)) {
    return false;
  }

  const reply =
    data.replies[Math.floor(Math.random() * data.replies.length)];

  await m.reply(reply);

  return true;
}
