-- Migration: Seed dynamic content data
-- Description: Populates tables with initial data for dynamic content

-- =============================================
-- SITE SETTINGS
-- =============================================
INSERT OR REPLACE INTO site_settings (id, name, tagline, logo, favicon, language, primary_color, secondary_color)
VALUES (
    1,
    '4best',
    'Property Agent',
    'https://cdn.4best.id/branding/logo.svg',
    '/favicon.svg',
    'id',
    '#162d50',
    '#0056d6'
);

-- =============================================
-- COMPANY INFO (if not exists)
-- =============================================
INSERT OR IGNORE INTO company_info (id, address, phone, whatsapp, email, opening_hours, map_url)
VALUES (
    1,
    'Perum Ungaran Asri, No C1, Ungaran',
    '+62 812 3456 7890',
    '+62 812 3456 7890',
    'contact@4best.id',
    'Sen - Sab 08:00 - 17:00',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.8!2d110.4!3d-7.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b5d4e4b0001%3A0x1234567890abcdef!2sPerum%20Ungaran%20Asri!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid'
);

-- =============================================
-- NAVIGATION ITEMS
-- =============================================
DELETE FROM navigation_items;

INSERT INTO navigation_items (label, href, parent_id, is_active, display_order) VALUES
('Beranda', '/', NULL, 1, 1),
('Partner', '/partners', NULL, 1, 2),
('Tentang', '/about', NULL, 1, 3),
('Kontak', '/contact', NULL, 1, 4);

-- =============================================
-- SOCIAL LINKS
-- =============================================
INSERT OR IGNORE INTO social_links (platform, url, icon, is_active, display_order)
VALUES ('instagram', 'https://instagram.com/4best.id', 'fa-brands fa-instagram', 1, 1);

-- =============================================
-- HERO SLIDES (Homepage)
-- =============================================
DELETE FROM hero_slides WHERE page_slug = 'home';

INSERT INTO hero_slides (page_slug, image, title, subtitle, overlay_opacity, is_active, display_order) VALUES
('home', 'https://cdn.4best.id/slider/apt-1.webp', NULL, NULL, 0.4, 1, 1),
('home', 'https://cdn.4best.id/slider/apt-2.webp', NULL, NULL, 0.4, 1, 2);

-- =============================================
-- VALUE PROPOSITIONS
-- =============================================
DELETE FROM value_propositions;

INSERT INTO value_propositions (icon, title, description, grid_class, is_active, display_order) VALUES
('UserCheck', 'Pendekatan Personal', 'Setiap klien ditangani secara khusus sesuai kebutuhan dan tujuan.', NULL, 1, 1),
('TrendingUp', 'Market Insight Akurat', 'Analisis pasar yang tepat untuk hasil optimal.', NULL, 1, 2),
('Shield', 'Proses Transparan & Aman', 'Komunikasi jelas dari awal hingga transaksi selesai.', NULL, 1, 3),
('Award', 'Agen Profesional & Terpercaya', 'Berpengalaman dan berorientasi pada kepuasan klien.', 'md:col-span-2', 1, 4),
('Target', 'Fokus Nilai Investasi', 'Membantu memaksimalkan potensi jangka pendek dan panjang.', NULL, 1, 5);

-- =============================================
-- PAGE SECTIONS
-- =============================================

-- Home Overview Section
INSERT OR REPLACE INTO page_sections (id, page_slug, section_key, content, is_active, display_order)
SELECT
    COALESCE((SELECT id FROM page_sections WHERE page_slug = 'home' AND section_key = 'overview'), NULL),
    'home',
    'overview',
    '{
        "subtitle": "4Best",
        "title": "Pilihan Tepat, Hasil Terbaik",
        "description": "4Best Agent Property adalah perusahaan agen properti profesional. Kami menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil.",
        "cta_text": "Hubungi Kami",
        "cta_href": "/contact",
        "images": [
            "https://cdn.4best.id/misc/s2.webp",
            "https://cdn.4best.id/misc/s3.webp",
            "https://cdn.4best.id/misc/s4.webp",
            "https://cdn.4best.id/misc/s5.webp"
        ]
    }',
    1,
    1;

-- Home Hero Section (for title and address)
INSERT OR REPLACE INTO page_sections (id, page_slug, section_key, content, is_active, display_order)
SELECT
    COALESCE((SELECT id FROM page_sections WHERE page_slug = 'home' AND section_key = 'hero'), NULL),
    'home',
    'hero',
    '{
        "title": "Property Agency"
    }',
    1,
    0;

-- Contact Hero Section
INSERT OR REPLACE INTO page_sections (id, page_slug, section_key, content, is_active, display_order)
SELECT
    COALESCE((SELECT id FROM page_sections WHERE page_slug = 'contact' AND section_key = 'hero'), NULL),
    'contact',
    'hero',
    '{
        "title": "Hubungi Kami",
        "subtitle": "Kami Siap Membantu Anda!",
        "background_image": "https://cdn.4best.id/backgrounds/8.webp"
    }',
    1,
    0;

-- Partners Hero Section
INSERT OR REPLACE INTO page_sections (id, page_slug, section_key, content, is_active, display_order)
SELECT
    COALESCE((SELECT id FROM page_sections WHERE page_slug = 'partners' AND section_key = 'hero'), NULL),
    'partners',
    'hero',
    '{
        "title": "Partner",
        "subtitle": "Kolaborasi untuk Hasil Terbaik",
        "background_image": "https://cdn.4best.id/misc/gallery/l15.webp"
    }',
    1,
    0;
