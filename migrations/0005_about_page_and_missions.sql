-- Migration: Update about_page table and add missions table
-- Description: Restructures about_page with detailed fields and adds missions table for 4BEST

-- =============================================
-- DROP AND RECREATE ABOUT_PAGE
-- =============================================
DROP TABLE IF EXISTS about_page;

CREATE TABLE about_page (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Hero Section
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_background_image TEXT,
    -- Company Intro Section
    intro_subtitle TEXT,
    intro_title TEXT,
    intro_description TEXT,
    intro_image_left TEXT,
    intro_image_right TEXT,
    -- Vision Section
    vision_subtitle TEXT,
    vision_title TEXT,
    vision_text TEXT,
    -- Mission Section
    mission_subtitle TEXT,
    mission_title TEXT,
    -- CTA Section
    cta_title TEXT,
    cta_button_text TEXT,
    cta_button_href TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- MISSIONS TABLE
-- =============================================
DROP TABLE IF EXISTS missions;

CREATE TABLE missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    text TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_missions_active ON missions(is_active, display_order);

-- =============================================
-- SEED DATA: ABOUT PAGE
-- =============================================
INSERT INTO about_page (
    id,
    hero_title,
    hero_subtitle,
    hero_background_image,
    intro_subtitle,
    intro_title,
    intro_description,
    intro_image_left,
    intro_image_right,
    vision_subtitle,
    vision_title,
    vision_text,
    mission_subtitle,
    mission_title,
    cta_title,
    cta_button_text,
    cta_button_href
)
VALUES (
    1,
    'Tentang 4BEST',
    'Pilihan Tepat, Hasil Terbaik',
    '/images/background/5.webp',
    'Tentang Kami',
    '4Best Agent Property',
    '4Best Agent Property adalah perusahaan agen properti profesional yang menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil. Didukung oleh tim berpengalaman, pemahaman pasar yang kuat, serta sistem kerja transparan, kami berkomitmen membantu klien mendapatkan solusi properti terbaik dan bernilai investasi jangka panjang.',
    '/images/misc/p1.webp',
    '/images/misc/p2.webp',
    'Visi Kami',
    'Menjadi yang Terdepan',
    'Menjadi agen pemasaran properti terpercaya, profesional, dan berorientasi hasil yang memberikan solusi terbaik bagi klien serta berkontribusi dalam pertumbuhan sektor properti di Indonesia.',
    'Misi Kami',
    'Komitmen untuk Hasil Terbaik',
    'Siap menemukan properti impian Anda?',
    'Konsultasi Gratis',
    '/contact'
);

-- =============================================
-- SEED DATA: MISSIONS
-- =============================================
INSERT INTO missions (id, icon, text, is_active, display_order) VALUES
(1, 'Handshake', 'Memberikan layanan pemasaran properti yang jujur, transparan, dan bertanggung jawab kepada setiap klien. Mengutamakan kepuasan klien melalui strategi pemasaran yang efektif dan tepat sasaran.', 1, 1),
(2, 'Users', 'Mengembangkan tim yang kompeten, berintegritas, dan berdaya saing tinggi di bidang properti.', 1, 2),
(3, 'Laptop', 'Memanfaatkan teknologi dan media digital secara optimal untuk meningkatkan jangkauan dan kecepatan pemasaran.', 1, 3),
(4, 'Heart', 'Membangun hubungan jangka panjang dengan klien, mitra, dan developer berdasarkan kepercayaan dan profesionalisme.', 1, 4);

-- =============================================
-- SEED DATA: STATS (if not exists)
-- =============================================
INSERT OR IGNORE INTO stats (id, value, label, suffix, is_active, display_order) VALUES
(1, 500, 'Properti Terjual', '+', 1, 1),
(2, 1000, 'Klien Puas', '+', 1, 2),
(3, 10, 'Tahun Pengalaman', '+', 1, 3),
(4, 50, 'Partner Developer', '+', 1, 4);
