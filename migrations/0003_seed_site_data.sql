-- Migration: Seed site configuration data
-- Description: Insert initial data for site settings, company info, social links, etc.

-- =============================================
-- SITE SETTINGS
-- =============================================
INSERT INTO site_settings (id, name, tagline, logo, favicon, language, primary_color, secondary_color)
VALUES (1, '4best', 'Property Agency', '/logo.svg', '/favicon.ico', 'id', '#162d50', '#0056d6');

-- =============================================
-- COMPANY INFO
-- =============================================
INSERT INTO company_info (id, address, address_line_2, phone, whatsapp, email, opening_hours, map_url)
VALUES (1, 'Perum Ungaran Asri, No C1, Ungaran', 'Semarang, Jawa Tengah', '+62 812 3456 7890', '+62 812 3456 7890', 'contact@4best.id', 'Mon to Sat 08:00 - 20:00', 'https://maps.app.goo.gl/BSpMhDN2Z6Jgp9UL6');

-- =============================================
-- SOCIAL LINKS
-- =============================================
INSERT INTO social_links (id, platform, url, icon, is_active, display_order) VALUES
(1, 'facebook', 'https://facebook.com/4best', 'fa-brands fa-facebook-f', 1, 1),
(2, 'twitter', 'https://twitter.com/4best', 'fa-brands fa-x-twitter', 1, 2),
(3, 'instagram', 'https://instagram.com/4best', 'fa-brands fa-instagram', 1, 3),
(4, 'youtube', 'https://youtube.com/4best', 'fa-brands fa-youtube', 1, 4),
(5, 'whatsapp', 'https://wa.me/6281234567890', 'fa-brands fa-whatsapp', 1, 5);

-- =============================================
-- NAVIGATION ITEMS
-- =============================================
INSERT INTO navigation_items (id, label, href, is_active, display_order) VALUES
(1, 'Home', '/', 1, 1),
(2, 'Partners', '/partners', 1, 2),
(3, 'About', '/about', 1, 3),
(4, 'Contact', '/contact', 1, 4);

-- =============================================
-- HERO SLIDES
-- =============================================
INSERT INTO hero_slides (id, page_slug, image, title, subtitle, overlay_opacity, is_active, display_order) VALUES
(1, 'home', '/images/slider/apt-1.webp', NULL, NULL, 0.4, 1, 1),
(2, 'home', '/images/slider/apt-2.webp', NULL, NULL, 0.4, 1, 2);

-- =============================================
-- VALUE PROPOSITIONS
-- =============================================
INSERT INTO value_propositions (id, icon, title, description, grid_class, is_active, display_order) VALUES
(1, 'UserCheck', 'Pendekatan Personal', 'Setiap klien ditangani secara khusus sesuai kebutuhan dan tujuan.', NULL, 1, 1),
(2, 'TrendingUp', 'Market Insight Akurat', 'Analisis pasar yang tepat untuk hasil optimal.', NULL, 1, 2),
(3, 'Shield', 'Proses Transparan & Aman', 'Komunikasi jelas dari awal hingga transaksi selesai.', NULL, 1, 3),
(4, 'Award', 'Agen Profesional & Terpercaya', 'Berpengalaman dan berorientasi pada kepuasan klien.', 'md:col-span-2', 1, 4),
(5, 'Target', 'Fokus Nilai Investasi', 'Membantu memaksimalkan potensi jangka pendek dan panjang.', NULL, 1, 5);

-- =============================================
-- STATS
-- =============================================
INSERT INTO stats (id, value, label, suffix, is_active, display_order) VALUES
(1, 25000, 'Square Areas', NULL, 1, 1),
(2, 150, 'Luxurious Unit', NULL, 1, 2),
(3, 300, 'Parking Spaces', NULL, 1, 3),
(4, 20, 'Public Facilities', NULL, 1, 4);

-- =============================================
-- TEAM MEMBERS
-- =============================================
INSERT INTO team_members (id, name, role, image, bio, social_facebook, social_twitter, social_instagram, social_linkedin, is_active, display_order) VALUES
(1, 'Barbara Charline', 'Property Manager', '/images/team/1.webp', NULL, '#', '#', '#', NULL, 1, 1),
(2, 'Thomas Bennett', 'Leasing Consultant', '/images/team/2.webp', NULL, '#', '#', '#', NULL, 1, 2),
(3, 'Madison Jane', 'Community Coordinator', '/images/team/3.webp', NULL, '#', '#', '#', NULL, 1, 3),
(4, 'Joshua Henry', 'Maintenance Supervisor', '/images/team/4.webp', NULL, '#', '#', '#', NULL, 1, 4);

-- =============================================
-- AGENTS
-- =============================================
INSERT INTO agents (id, name, phone, email, image, is_active, display_order) VALUES
(1, 'Emily Rodriguez', '(555) 234-5678', NULL, '/images/agents/1.webp', 1, 1),
(2, 'Michael Chen', '(555) 345-6789', NULL, '/images/agents/2.webp', 1, 2),
(3, 'Jessica Patel', '(555) 567-8901', NULL, '/images/agents/3.webp', 1, 3);

-- =============================================
-- PAGE SECTIONS
-- =============================================
INSERT INTO page_sections (page_slug, section_key, content, is_active, display_order) VALUES
('home', 'hero', '{"title": "Property Agency", "subtitle": null}', 1, 1),
('home', 'overview', '{"subtitle": "4Best", "title": "Pilihan Tepat, Hasil Terbaik", "description": "4Best Agent Property adalah perusahaan agen properti profesional yang menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil. Didukung oleh tim berpengalaman, pemahaman pasar yang kuat, serta sistem kerja transparan, kami berkomitmen membantu klien mendapatkan solusi properti terbaik dan bernilai investasi jangka panjang.", "cta_text": "Schedule Visit", "cta_href": "/contact", "images": ["/images/misc/s2.webp", "/images/misc/s3.webp", "/images/misc/s4.webp", "/images/misc/s5.webp"]}', 1, 2),
('home', 'partners', '{"subtitle": "Our Partners", "title": "Trusted Partners"}', 1, 3),
('home', 'value_proposition', '{"subtitle": "Mengapa Memilih Kami", "title": "Value Proposition"}', 1, 4),
('home', 'video', '{"title": "Virtual Tour", "youtube_url": "https://www.youtube.com/watch?v=C6rf51uHWJg", "background_image": "/images/background/3.webp"}', 1, 5),
('home', 'contact', '{"subtitle": "Contact Us", "title": "Talk to a Sales Agent"}', 1, 6),
('about', 'hero', '{"title": "About Us", "subtitle": "Creating Spaces You Love to Live In", "background_image": "/images/background/5.webp"}', 1, 1),
('about', 'content', '{"subtitle": "About Us", "title": "Welcome to Residem, Where Comfort Meets Community", "description": "At Residem, we believe that home is more than just a place — it is where your story unfolds. Located in the heart of New York, our apartments are designed to offer a perfect blend of modern living, convenience, and community.", "image_left": "/images/misc/p1.webp", "image_right": "/images/misc/p2.webp"}', 1, 2),
('about', 'mission', '{"subtitle": "Our Mission", "title": "To create welcoming, well-maintained, and thoughtfully designed living spaces where residents feel proud to call home.", "background_image": "/images/misc/l9.webp"}', 1, 3),
('about', 'team', '{"subtitle": "Our Team", "title": "Meet the Team"}', 1, 4),
('about', 'cta', '{"title": "Ready to make your next move?", "button_text": "Schedule a Visit", "button_href": "/contact"}', 1, 5),
('contact', 'hero', '{"title": "Schedule a Visit", "subtitle": "We''ll Be Happy to Show You Around!", "background_image": "/images/background/8.webp"}', 1, 1),
('partners', 'hero', '{"title": "Our Partners", "subtitle": "Trusted Developers & Property Partners"}', 1, 1);
