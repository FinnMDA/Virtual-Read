const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const db = require("./db");
const { tiktokUrl } = require("./lib/tiktok");
const { handleManhwaQueries } = require("./lib/manhwaQueries");
const humanResponses = {
  greetings: ["Hey! 👋", "Halo, apa kabar? 😊", "Hai! Ada yang bisa dibantu?"],
  thanks: ["Sama-sama! 😊", "Dengan senang hati! 😄", "No worries!"],
  howAreYou: [
    "Aku baik, bagaimana denganmu? 😄",
    "Lagi bagus nih, kamu sendiri gimana?",
    "Baik dong! 😄",
  ],
  goodbye: [
    "Sampai jumpa lagi! 👋",
    "Dadah! Semoga harimu menyenangkan! 😊",
    "Bye! Jangan lupa kabarin lagi ya!",
  ],
  random: [
    "Aku bot yang ramah nih 😎",
    "Senang ngobrol sama kamu! 😁",
    "Ada lagi yang bisa kubantu? 🧐",
  ],
};w
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "User",
  }),
});

client.once("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.initialize();

client.on("message", async (message) => {
  try {
    // Menangani permintaan terkait manhwa dan TikTok
    await handleManhwaQueries(message, client, db);
    await tiktokUrl(message, client);

    // Command .help
    if (message.body === ".help") {
      await client.sendMessage(
        message.from,
        "---- Menu ---- \n1. .sticker\n2. .chi\n3. .rulesgroup\n4. .sjk\n5. .sticker\n6. .download\n7.everyone "
      );
    }

    if (message.body === ".List") {
      client.sendMessage(
        message.from,
        "---- Menu List ---- \n1. .manhwa\n2. .manhua\n3. .genre"
      );
    }

    if (message.body === ".genre") {
      client.sendMessage(
        message.from,
        "---- Menu Genre ---- \n1. .manhwa\n2. .kultivasi_modern\n3. .kultivasi\n4. .fantasi\n5. .hunter\n6. .necromancer\n7. .matrialart"
      );
    }

    // Command .sjk
    if (message.body === ".sjk") {
      const media = await MessageMedia.fromFilePath("source/img/sjk.jpg");
      if (media) {
        await client.sendMessage(message.from, media);
      } else {
        await client.sendMessage(message.from, "Gambar tidak ditemukan.");
      }
    }

    // Command .chi
    if (message.body === ".chi") {
      const media = await MessageMedia.fromFilePath("source/img/chi.jpg");
      if (media) {
        await client.sendMessage(message.from, media);
      } else {
        await client.sendMessage(message.from, "Gambar tidak ditemukan.");
      }
    }

    // Command .rulesgroup
    if (message.body === ".rulesgroup") {
      const linkGroup = "https://chat.whatsapp.com/IguqWeQw5K1AyTmyYgVxRD";
      const imagePath = "source/img/sjk.jpg";
      const caption = `*Aturan Grup "Visual Read"*\n\n1. *Salam dan Sapa*: Setiap anggota baru diharapkan untuk memperkenalkan diri saat pertama kali bergabung. Mari kita buat suasana grup yang hangat dan ramah!\n2. *Topik Utama*: Fokus utama grup ini adalah berbagi dan berdiskusi tentang manhwa. Namun, diskusi santai mengenai topik lain juga diperbolehkan asalkan tetap dalam batas yang wajar.\n3. *Bagikan dengan Bijak*: Ketika membagikan link atau file manhwa, pastikan tidak melanggar hak cipta dan gunakan platform resmi jika memungkinkan.\n4. *Spoiler Alert!*: Jika ingin membahas detail penting dari suatu manhwa, gunakan tanda peringatan *[SPOILER]* untuk menghargai anggota lain yang belum membaca.\n5. *Hormati Sesama Anggota*: Tidak ada tempat untuk penghinaan, serangan pribadi, atau komentar yang bersifat diskriminatif. Mari kita jaga suasana grup tetap positif dan menghormati perbedaan pendapat.\n6. *Tidak Ada Spam*: Hindari mengirim pesan berantai, iklan, atau spam. Grup ini bertujuan untuk diskusi yang bermakna dan menyenangkan.\n7. *Santai dan Menikmati*: Aturan di sini tidak terlalu ketat, jadi santai saja dan nikmati pembahasan manhwa dengan anggota lain!\n8. *Feedback dan Saran*: Jika ada saran atau kritik mengenai grup, jangan ragu untuk disampaikan. Tujuan kita adalah membuat grup ini nyaman bagi semua.\n\n---\n\nSemoga aturan ini bisa membuat grup tetap harmonis dan menyenangkan!\n\n${linkGroup}`;

      const media = await MessageMedia.fromFilePath(imagePath);
      if (media) {
        await client.sendMessage(message.from, media, { caption });
      } else {
        await client.sendMessage(
          message.from,
          "Gambar aturan grup tidak ditemukan."
        );
      }
    }

    // Command .sticker (jika tipe pesan gambar)
    if (message.body.startsWith(".sticker") && message.type === "image") {
      const media = await message.downloadMedia();
      if (media) {
        await client.sendMessage(message.from, media, {
          sendMediaAsSticker: true,
          stickerAuthor: "Bot Ganteng",
          stickerName: "ada-ada saja",
        });
      } else {
        await client.sendMessage(
          message.from,
          "Gagal mengunduh gambar untuk dijadikan stiker."
        );
      }
    }

    // Command .everyone (untuk mention semua peserta di grup)
    if (message.body === ".everyone") {
      const chat = await message.getChat();

      if (chat.isGroup) {
        let text = "";
        let mentions = [];

        for (let participant of chat.participants) {
          mentions.push(`${participant.id.user}@c.us`);
          text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
      } else {
        await client.sendMessage(
          message.from,
          "Perintah ini hanya bisa digunakan di grup."
        );
      }
    }
  } catch (error) {
    console.error("Error handling message:", error);
    await client.sendMessage(
      message.from,
      "Terjadi kesalahan saat memproses permintaanmu."
    );
  }
});
