PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS homepage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    headline TEXT,
    subheadline TEXT,
    description TEXT,
    hero_image TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
INSERT OR REPLACE INTO "homepage" VALUES(1,'4Best','Mitra Properti Terpercaya','Temukan hunian impian Anda bersama 4Best dan mitra-mitra kami yang terpercaya.',NULL,'2025-12-20 22:16:22');
CREATE TABLE IF NOT EXISTS contact_page (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
INSERT OR REPLACE INTO "contact_page" VALUES(1,'','','','','2025-12-20 22:16:22');
CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_profile TEXT,
    logo TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
, hero_image TEXT);
INSERT OR REPLACE INTO "partners" VALUES(1,'PT Mitra Properti Utama','pt-mitra-properti-utama','Developer terkemuka dengan pengalaman lebih dari 20 tahun di industri properti.','PT Mitra Properti Utama adalah perusahaan pengembang properti yang berpengalaman lebih dari 20 tahun. Kami berkomitmen untuk menghadirkan hunian berkualitas dengan harga terjangkau untuk semua kalangan masyarakat Indonesia.','https://cdn.4best.id/partners/logo-mitra-properti.svg','021-1234567','info@mitraproperti.com',1,1,1,'2025-12-25 12:17:25','2026-01-29 06:48:46','https://cdn.4best.id/properties/apartment/1.webp');
INSERT OR REPLACE INTO "partners" VALUES(2,'Perumahan Sejahtera Indonesia','perumahan-sejahtera-indonesia','Spesialis perumahan subsidi dengan standar kualitas internasional.','Perumahan Sejahtera Indonesia fokus pada pengembangan perumahan subsidi yang terjangkau namun tetap berkualitas. Kami telah membangun ribuan unit rumah di berbagai lokasi strategis di Indonesia.','https://cdn.4best.id/partners/logo-sejahtera-indonesia.svg','021-2345678','contact@sejahteraindonesia.com',1,1,2,'2025-12-25 12:17:25','2026-01-29 06:48:46','https://cdn.4best.id/properties/apartment/2.webp');
INSERT OR REPLACE INTO "partners" VALUES(3,'Graha Komersial Nusantara','graha-komersial-nusantara','Pengembang properti komersial dengan fokus pada pusat bisnis modern.','Graha Komersial Nusantara mengkhususkan diri dalam pengembangan properti komersial premium. Kami menciptakan ruang bisnis modern yang mendukung pertumbuhan ekonomi dan investasi jangka panjang.','https://cdn.4best.id/partners/logo-graha-komersial.svg','021-3456789','business@grahakomersial.com',1,1,3,'2025-12-25 12:17:25','2026-01-29 06:48:46','https://cdn.4best.id/properties/apartment/3.webp');
INSERT OR REPLACE INTO "partners" VALUES(4,'Hunian Masa Depan Group','hunian-masa-depan-group','Inovator dalam pengembangan hunian berkelanjutan dan ramah lingkungan.','Hunian Masa Depan Group adalah pelopor dalam mengembangkan hunian yang berkelanjutan dan ramah lingkungan. Kami mengintegrasikan teknologi hijau dan desain modern untuk menciptakan komunitas yang sehat dan produktif.','https://cdn.4best.id/partners/logo-hunian-masa-depan.svg','021-4567890','green@hunianmasadepan.com',1,1,4,'2025-12-25 12:17:25','2026-01-29 06:48:46','https://cdn.4best.id/properties/apartment/4.webp');
INSERT OR REPLACE INTO "partners" VALUES(5,'Properti Rakyat Indonesia','properti-rakyat-indonesia','Mitra terpercaya untuk hunian terjangkau bagi masyarakat menengah ke bawah.','Properti Rakyat Indonesia berkomitmen untuk menyediakan hunian berkualitas dengan harga yang terjangkau bagi seluruh lapisan masyarakat. Kami percaya bahwa setiap orang berhak memiliki rumah yang layak.','https://cdn.4best.id/partners/logo-properti-rakyat.svg','021-5678901','info@propertirayat.com',0,1,5,'2025-12-25 12:17:25','2026-01-29 06:48:46','https://cdn.4best.id/properties/apartment/5.webp');
INSERT OR REPLACE INTO "partners" VALUES(6,'Investasi Properti Cerdas','investasi-properti-cerdas','Platform investasi properti dengan return yang kompetitif dan transparan.','Investasi Properti Cerdas menawarkan peluang investasi properti yang menguntungkan dengan sistem yang transparan dan profesional. Kami membantu investor mencapai tujuan finansial mereka melalui properti.','https://cdn.4best.id/partners/logo-investasi-cerdas.svg','021-6789012','invest@properticerdas.com',0,1,6,'2025-12-25 12:17:25','2026-01-29 06:48:46','https://cdn.4best.id/properties/apartment/6.webp');
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partner_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT CHECK(category IN ('commercial', 'subsidi')) NOT NULL,
    location TEXT,
    description TEXT,
    main_image TEXT,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
);
INSERT OR REPLACE INTO "products" VALUES(1,1,'Perumahan Mitra Indah Komersial','perumahan-mitra-indah-komersial','commercial','Jakarta Selatan','Perumahan komersial premium dengan fasilitas lengkap dan lokasi strategis di pusat bisnis Jakarta.','https://cdn.4best.id/properties/apartment/1.webp',1,1,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(2,1,'Rumah Sejahtera Subsidi','rumah-sejahtera-subsidi','subsidi','Tangerang','Program subsidi untuk masyarakat menengah dengan cicilan ringan dan proses mudah.','https://cdn.4best.id/properties/apartment/2.webp',1,2,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(3,2,'Sejahtera Subsidi Bekasi','sejahtera-subsidi-bekasi','subsidi','Bekasi','Perumahan subsidi dengan 500 unit rumah tipe 36 dan 45 di lokasi strategis Bekasi.','https://cdn.4best.id/properties/apartment/3.webp',1,1,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(4,2,'Sejahtera Komersial Surabaya','sejahtera-komersial-surabaya','commercial','Surabaya','Perumahan komersial modern dengan fasilitas premium di kota Surabaya.','https://cdn.4best.id/properties/apartment/4.webp',1,2,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(5,3,'Graha Bisnis Pusat Jakarta','graha-bisnis-pusat-jakarta','commercial','Jakarta Pusat','Pusat bisnis modern dengan office space dan retail di jantung kota Jakarta.','https://cdn.4best.id/properties/apartment/5.webp',1,1,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(6,3,'Graha Komersial Bandung','graha-komersial-bandung','commercial','Bandung','Kompleks komersial terintegrasi dengan mall, office, dan hotel di Bandung.','https://cdn.4best.id/properties/apartment/6.webp',1,2,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(7,4,'Hunian Hijau Subsidi','hunian-hijau-subsidi','subsidi','Depok','Perumahan subsidi ramah lingkungan dengan konsep green living dan fasilitas komunitas.','https://cdn.4best.id/properties/apartment/1.webp',1,1,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(8,4,'Hunian Masa Depan Premium','hunian-masa-depan-premium','commercial','Bogor','Hunian premium dengan teknologi smart home dan desain berkelanjutan di Bogor.','https://cdn.4best.id/properties/apartment/2.webp',1,2,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(9,5,'Rumah Rakyat Subsidi Medan','rumah-rakyat-subsidi-medan','subsidi','Medan','Program subsidi untuk masyarakat dengan harga terjangkau dan cicilan ringan di Medan.','https://cdn.4best.id/properties/apartment/3.webp',1,1,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(10,5,'Rumah Rakyat Komersial Semarang','rumah-rakyat-komersial-semarang','commercial','Semarang','Perumahan komersial dengan lokasi strategis dan fasilitas lengkap di Semarang.','https://cdn.4best.id/properties/apartment/4.webp',1,2,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(11,6,'Investasi Subsidi Yogyakarta','investasi-subsidi-yogyakarta','subsidi','Yogyakarta','Peluang investasi properti subsidi dengan return stabil di Yogyakarta.','https://cdn.4best.id/properties/apartment/5.webp',1,1,'2025-12-25 12:17:25','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "products" VALUES(12,6,'Investasi Komersial Makassar','investasi-komersial-makassar','commercial','Makassar','Investasi properti komersial dengan potensi pertumbuhan tinggi di Makassar.','https://cdn.4best.id/properties/apartment/6.webp',1,2,'2025-12-25 12:17:25','2026-01-29 06:48:46');
CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
INSERT OR REPLACE INTO "product_images" VALUES(1,1,'/images/apartment/1.jpg','Tampilan depan perumahan',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(2,1,'/images/apartment/2.jpg','Area taman dan fasilitas',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(3,1,'/images/apartment/3.jpg','Rumah model tipe A',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(4,2,'/images/apartment/2.jpg','Tampilan perumahan subsidi',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(5,2,'/images/apartment/3.jpg','Rumah tipe 36',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(6,2,'/images/apartment/4.jpg','Fasilitas umum',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(7,3,'/images/apartment/3.jpg','Entrance perumahan',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(8,3,'/images/apartment/4.jpg','Rumah model',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(9,3,'/images/apartment/5.jpg','Taman bermain anak',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(10,4,'/images/apartment/4.jpg','Tampilan komersial',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(11,4,'/images/apartment/5.jpg','Area retail',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(12,4,'/images/apartment/6.jpg','Fasilitas parkir',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(13,5,'/images/apartment/5.jpg','Gedung perkantoran',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(14,5,'/images/apartment/6.jpg','Lobby modern',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(15,5,'/images/apartment/1.jpg','Ruang kantor',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(16,6,'/images/apartment/6.jpg','Kompleks komersial',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(17,6,'/images/apartment/1.jpg','Area mall',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(18,6,'/images/apartment/2.jpg','Fasilitas hotel',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(19,7,'/images/apartment/1.jpg','Hunian hijau',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(20,7,'/images/apartment/2.jpg','Taman komunitas',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(21,7,'/images/apartment/3.jpg','Rumah model',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(22,8,'/images/apartment/2.jpg','Hunian premium',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(23,8,'/images/apartment/3.jpg','Smart home technology',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(24,8,'/images/apartment/4.jpg','Fasilitas premium',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(25,9,'/images/apartment/3.jpg','Perumahan subsidi',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(26,9,'/images/apartment/4.jpg','Rumah tipe 36',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(27,9,'/images/apartment/5.jpg','Area bermain',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(28,10,'/images/apartment/4.jpg','Perumahan komersial',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(29,10,'/images/apartment/5.jpg','Lokasi strategis',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(30,10,'/images/apartment/6.jpg','Fasilitas lengkap',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(31,11,'/images/apartment/5.jpg','Investasi subsidi',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(32,11,'/images/apartment/6.jpg','Lokasi Yogyakarta',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(33,11,'/images/apartment/1.jpg','Rumah model',3,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(34,12,'/images/apartment/6.jpg','Investasi komersial',1,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(35,12,'/images/apartment/1.jpg','Lokasi Makassar',2,'2025-12-25 12:17:25');
INSERT OR REPLACE INTO "product_images" VALUES(36,12,'/images/apartment/2.jpg','Potensi pertumbuhan',3,'2025-12-25 12:17:25');
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS company_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT,
    address_line_2 TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    opening_hours TEXT,
    map_url TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
INSERT OR REPLACE INTO "company_info" VALUES(1,'Perum Ungaran Asri JL. Serasi Raya Atas No C1, Ungaran, Kab. Semarang',NULL,'+62 812 3456 7890','+62 812 3456 7890','contact@4best.id','Sen - Sab 08:00 - 17:00','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4963.889128070553!2d110.3945777!3d-7.156002399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70876fe068fe99%3A0x3410f61e63dc8c6b!2sPerumahan%20Ungaran%20Asri!5e1!3m2!1sen!2sid!4v1769677523022!5m2!1sen!2sid','2026-01-29 10:01:45');
CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS navigation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    parent_id INTEGER,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES navigation_items(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS hero_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL,
    image TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    overlay_opacity REAL DEFAULT 0.4,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS value_propositions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    grid_class TEXT,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value INTEGER NOT NULL,
    label TEXT NOT NULL,
    suffix TEXT,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
INSERT OR REPLACE INTO "stats" VALUES(1,500,'Properti Terjual','+',1,1,'2026-01-27 09:14:34','2026-01-27 09:14:34');
INSERT OR REPLACE INTO "stats" VALUES(2,1000,'Klien Puas','+',1,2,'2026-01-27 09:14:34','2026-01-27 09:14:34');
INSERT OR REPLACE INTO "stats" VALUES(3,10,'Tahun Pengalaman','+',1,3,'2026-01-27 09:14:34','2026-01-27 09:14:34');
INSERT OR REPLACE INTO "stats" VALUES(4,50,'Partner Developer','+',1,4,'2026-01-27 09:14:34','2026-01-27 09:14:34');
CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    image TEXT,
    bio TEXT,
    social_facebook TEXT,
    social_twitter TEXT,
    social_instagram TEXT,
    social_linkedin TEXT,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
INSERT OR REPLACE INTO "team_members" VALUES(5,'Doni Saputra','Direktur Utama','https://cdn.4best.id/team/1.webp',NULL,NULL,NULL,NULL,NULL,1,1,'2026-01-28 06:43:47','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "team_members" VALUES(6,'Trengginas Bagus Wijayanto','Direktur Digital Marketing','https://cdn.4best.id/team/2.webp',NULL,NULL,NULL,NULL,NULL,1,2,'2026-01-28 06:43:47','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "team_members" VALUES(7,'Resza Dian Handayani','Direktur Keuangan','https://cdn.4best.id/team/3.webp',NULL,NULL,NULL,NULL,NULL,1,3,'2026-01-28 06:43:47','2026-01-29 06:48:46');
INSERT OR REPLACE INTO "team_members" VALUES(8,'Dita Nugrahaningsih','Direktur HR dan Operasional','https://cdn.4best.id/team/4.webp',NULL,NULL,NULL,NULL,NULL,1,4,'2026-01-28 06:43:47','2026-01-29 06:48:46');
CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    image TEXT,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS page_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content TEXT NOT NULL, 
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(page_slug, section_key)
);
CREATE TABLE IF NOT EXISTS d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT OR REPLACE INTO "d1_migrations" VALUES(1,'0002_add_site_tables.sql','2026-01-27 09:07:53');
CREATE TABLE IF NOT EXISTS about_page (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_background_image TEXT,
    
    intro_subtitle TEXT,
    intro_title TEXT,
    intro_description TEXT,
    intro_image_left TEXT,
    intro_image_right TEXT,
    
    vision_subtitle TEXT,
    vision_title TEXT,
    vision_text TEXT,
    
    mission_subtitle TEXT,
    mission_title TEXT,
    
    cta_title TEXT,
    cta_button_text TEXT,
    cta_button_href TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
INSERT OR REPLACE INTO "about_page" VALUES(1,'Tentang 4BEST','Pilihan Tepat, Hasil Terbaik','https://cdn.4best.id/backgrounds/5.webp','Tentang Kami','4Best Agent Property','4Best Agent Property adalah perusahaan agen properti profesional yang menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil. Didukung oleh tim berpengalaman, pemahaman pasar yang kuat, serta sistem kerja transparan, kami berkomitmen membantu klien mendapatkan solusi properti terbaik dan bernilai investasi jangka panjang.','https://cdn.4best.id/misc/p1.webp','https://cdn.4best.id/misc/p2.webp','Visi Kami','Menjadi yang Terdepan','Menjadi agen pemasaran properti terpercaya, profesional, dan berorientasi hasil yang memberikan solusi terbaik bagi klien serta berkontribusi dalam pertumbuhan sektor properti di Indonesia.','Misi Kami','Komitmen untuk Hasil Terbaik','Siap menemukan properti impian Anda?','Konsultasi Gratis','/contact','2026-01-29 06:48:46');
CREATE TABLE IF NOT EXISTS missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    text TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
INSERT OR REPLACE INTO "missions" VALUES(1,'Handshake','Memberikan layanan pemasaran properti yang jujur, transparan, dan bertanggung jawab kepada setiap klien. Mengutamakan kepuasan klien melalui strategi pemasaran yang efektif dan tepat sasaran.',1,1,'2026-01-27 09:14:34','2026-01-27 09:14:34');
INSERT OR REPLACE INTO "missions" VALUES(2,'Users','Mengembangkan tim yang kompeten, berintegritas, dan berdaya saing tinggi di bidang properti.',1,2,'2026-01-27 09:14:34','2026-01-27 09:14:34');
INSERT OR REPLACE INTO "missions" VALUES(3,'Laptop','Memanfaatkan teknologi dan media digital secara optimal untuk meningkatkan jangkauan dan kecepatan pemasaran.',1,3,'2026-01-27 09:14:34','2026-01-27 09:14:34');
INSERT OR REPLACE INTO "missions" VALUES(4,'Heart','Membangun hubungan jangka panjang dengan klien, mitra, dan developer berdasarkan kepercayaan dan profesionalisme.',1,4,'2026-01-27 09:14:34','2026-01-27 09:14:34');
ANALYZE sqlite_schema;
ANALYZE sqlite_schema;
DELETE FROM sqlite_sequence;
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('homepage',1);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('contact_page',1);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('partners',6);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('products',12);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('product_images',36);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('d1_migrations',1);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('about_page',1);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('missions',4);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('stats',4);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('team_members',8);
INSERT OR REPLACE INTO "sqlite_sequence" VALUES('company_info',1);
CREATE INDEX IF NOT EXISTS idx_partners_slug ON partners(slug);
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active);
CREATE INDEX IF NOT EXISTS idx_partners_featured ON partners(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_partner ON products(partner_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_social_links_active ON social_links(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_navigation_items_active ON navigation_items(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_hero_slides_page ON hero_slides(page_slug, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_value_propositions_active ON value_propositions(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_stats_active ON stats(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_page_sections_page ON page_sections(page_slug, section_key);
CREATE INDEX IF NOT EXISTS idx_missions_active ON missions(is_active, display_order);
