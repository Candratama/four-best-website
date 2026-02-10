import { getDB } from "../src/lib/cloudflare";

const names = [
  "Budi Santoso",
  "Siti Nurhaliza",
  "Andi Wijaya",
  "Dewi Lestari",
  "Rudi Hartono",
  "Maya Sari",
  "Agus Setiawan",
  "Rina Permata",
  "Fajar Nugraha",
  "Lina Kusuma",
  "Hendra Gunawan",
  "Sri Wahyuni",
  "Dedi Firmansyah",
  "Putri Ayu",
  "Bambang Suryanto",
  "Wulan Sari",
  "Joko Susilo",
  "Nita Anggraeni",
  "Yudi Prasetyo",
  "Ratna Dewi",
  "Eko Wahyudi",
  "Fitri Handayani",
  "Rizki Rahman",
  "Sari Indah",
  "Arief Budiman",
  "Dian Pertiwi",
  "Galih Pratama",
  "Intan Permatasari",
  "Kurniawan",
  "Linda Susanti",
  "Muhammad Yusuf",
  "Nurul Hidayah",
  "Oki Setiadi",
  "Purnama Sari",
  "Qori Amalia",
  "Rama Wijaya",
  "Sinta Dewi",
  "Tono Sudarto",
  "Udin Setiawan",
  "Vina Maulida",
  "Wahyu Santoso",
  "Xena Puspita",
  "Yanto Kusuma",
  "Zahra Safitri",
];

const messages = [
  "Saya tertarik dengan properti subsidi yang Anda tawarkan. Bisa tolong info lebih lanjut?",
  "Apakah masih ada unit tersedia untuk rumah tipe 45?",
  "Ingin konsultasi mengenai KPR dan cara pembeliannya.",
  "Mohon informasi detail lokasi dan harga properti.",
  "Saya ingin jadwalkan kunjungan ke lokasi properti minggu depan.",
  "Apakah ada promo khusus untuk bulan ini?",
  "Berapa DP minimal untuk rumah subsidi?",
  "Ingin tahu lebih detail tentang spesifikasi bangunan.",
  "Mohon info cluster yang tersedia dan fasilitasnya.",
  "Saya tertarik untuk survei lokasi, bagaimana caranya?",
  "Apakah bisa cash bertahap? Mohon penjelasannya.",
  "Ingin konsultasi tentang investasi properti.",
  "Mohon info lengkap tentang legalitas dan sertifikat.",
  "Apakah ada unit ready stock yang bisa langsung ditempati?",
  "Saya mau tanya proses booking unitnya bagaimana?",
];

const statuses: Array<"new" | "in_progress" | "closed"> = ["new", "in_progress", "closed"];

async function seedSubmissions(count: number = 50) {
  const db = await getDB();

  console.log(`Creating ${count} dummy submissions...`);

  for (let i = 0; i < count; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomEmail = `${randomName.toLowerCase().replace(/\s+/g, ".")}${i}@example.com`;
    const randomPhone = `08${Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(10, "0")}`;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Random date in the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    // Calculate due date (3 days after creation for new/in_progress)
    let dueDate: string | null = null;
    if (randomStatus !== "closed") {
      const due = new Date(createdAt);
      due.setDate(due.getDate() + 3);
      dueDate = due.toISOString().split("T")[0];
    }

    const emailSent = Math.random() > 0.1 ? 1 : 0; // 90% success rate
    const isResponded = randomStatus === "closed" ? 1 : Math.random() > 0.5 ? 1 : 0;

    await db
      .prepare(
        `INSERT INTO contact_submissions
         (name, email, phone, message, preferred_date, preferred_time, status, notes, due_date,
          is_responded, closed_reason, email_sent, email_error, source, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        randomName,
        randomEmail,
        randomPhone,
        randomMessage,
        null, // preferred_date
        null, // preferred_time
        randomStatus,
        randomStatus === "in_progress" ? "Follow up needed" : null,
        dueDate,
        isResponded,
        randomStatus === "closed" ? "Customer satisfied" : null,
        emailSent,
        emailSent ? null : "SMTP connection failed",
        "website",
        createdAt.toISOString(),
        createdAt.toISOString()
      )
      .run();

    if ((i + 1) % 10 === 0) {
      console.log(`Created ${i + 1}/${count} submissions...`);
    }
  }

  console.log(`✅ Successfully created ${count} dummy submissions!`);
}

// Run the seeder
seedSubmissions(50).catch(console.error);
