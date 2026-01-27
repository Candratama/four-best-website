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
    profile TEXT,
    vision TEXT,
    mission TEXT,
    advantages TEXT,
    image TEXT,
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
VALUES (1, '4Best', 'Mitra Properti Terpercaya', 'Temukan hunian impian Anda bersama 4Best dan mitra-mitra kami yang terpercaya.');

-- Insert default about page
INSERT OR IGNORE INTO about_page (id, profile, vision, mission, advantages)
VALUES (1,
    'Tentang 4Best akan ditampilkan di sini.',
    'Visi 4Best',
    'Misi 4Best',
    'Keunggulan 4Best'
);

-- Insert default contact
INSERT OR IGNORE INTO contact_page (id, phone, whatsapp, email, address)
VALUES (1, '', '', '', '');
