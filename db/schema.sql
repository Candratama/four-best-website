-- 4Best Website Database Schema
-- Created: 2025-12-21

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- HOMEPAGE CONTENT
-- =============================================
CREATE TABLE IF NOT EXISTS homepage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    headline TEXT,
    subheadline TEXT,
    description TEXT,
    hero_image TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- ABOUT PAGE
-- =============================================
CREATE TABLE IF NOT EXISTS about_page (
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
    intro_image_3 TEXT,
    intro_image_4 TEXT,
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
-- MISSIONS (for About page)
-- =============================================
CREATE TABLE IF NOT EXISTS missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    text TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- CONTACT PAGE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_page (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- PARTNERS (MITRA)
-- =============================================
CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_profile TEXT,
    logo TEXT,
    hero_image TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- PRODUCTS (PERUMAHAN)
-- =============================================
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

-- =============================================
-- PRODUCT IMAGES (GALLERY)
-- =============================================
CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =============================================
-- ADMIN USERS
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- SESSIONS (for auth)
-- =============================================
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_partners_slug ON partners(slug);
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active);
CREATE INDEX IF NOT EXISTS idx_partners_featured ON partners(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_partner ON products(partner_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert default homepage content
INSERT OR IGNORE INTO homepage (id, headline, subheadline, description)
VALUES (1, '4Best', 'Pilihan Tepat, Hasil Terbaik', 'Temukan hunian impian Anda bersama 4Best dan mitra-mitra kami yang terpercaya.');

-- Insert default about page with 4BEST data
INSERT OR IGNORE INTO about_page (
    id,
    hero_title,
    hero_subtitle,
    hero_background_image,
    intro_subtitle,
    intro_title,
    intro_description,
    intro_image_left,
    intro_image_right,
    intro_image_3,
    intro_image_4,
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
    '/images/misc/p3.webp',
    '/images/misc/p4.webp',
    'Visi Kami',
    'Menjadi yang Terdepan',
    'Menjadi agen pemasaran properti terpercaya, profesional, dan berorientasi hasil yang memberikan solusi terbaik bagi klien serta berkontribusi dalam pertumbuhan sektor properti di Indonesia.',
    'Misi Kami',
    'Komitmen untuk Hasil Terbaik',
    'Siap menemukan properti impian Anda?',
    'Konsultasi Gratis',
    '/contact'
);

-- Insert missions
INSERT OR IGNORE INTO missions (id, icon, text, display_order) VALUES
(1, 'Handshake', 'Memberikan layanan pemasaran properti yang jujur, transparan, dan bertanggung jawab kepada setiap klien. Mengutamakan kepuasan klien melalui strategi pemasaran yang efektif dan tepat sasaran.', 1),
(2, 'Users', 'Mengembangkan tim yang kompeten, berintegritas, dan berdaya saing tinggi di bidang properti.', 2),
(3, 'Laptop', 'Memanfaatkan teknologi dan media digital secara optimal untuk meningkatkan jangkauan dan kecepatan pemasaran.', 3),
(4, 'Heart', 'Membangun hubungan jangka panjang dengan klien, mitra, dan developer berdasarkan kepercayaan dan profesionalisme.', 4);

-- Insert default contact
INSERT OR IGNORE INTO contact_page (id, phone, whatsapp, email, address)
VALUES (1, '', '', '', '');
