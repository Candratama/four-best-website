-- =============================================
-- DUMMY PARTNER DATA
-- =============================================

-- Insert dummy partners
INSERT OR IGNORE INTO partners (id, name, slug, short_description, full_profile, logo, hero_image, contact_phone, contact_email, is_featured, is_active, display_order)
VALUES 
(1, 'PT Mitra Properti Utama', 'pt-mitra-properti-utama', 'Developer terkemuka dengan pengalaman lebih dari 20 tahun di industri properti.', 'PT Mitra Properti Utama adalah perusahaan pengembang properti yang berpengalaman lebih dari 20 tahun. Kami berkomitmen untuk menghadirkan hunian berkualitas dengan harga terjangkau untuk semua kalangan masyarakat Indonesia.', '/images/partners/logo-mitra-properti.svg', '/images/apartment/1.jpg', '021-1234567', 'info@mitraproperti.com', 1, 1, 1),
(2, 'Perumahan Sejahtera Indonesia', 'perumahan-sejahtera-indonesia', 'Spesialis perumahan subsidi dengan standar kualitas internasional.', 'Perumahan Sejahtera Indonesia fokus pada pengembangan perumahan subsidi yang terjangkau namun tetap berkualitas. Kami telah membangun ribuan unit rumah di berbagai lokasi strategis di Indonesia.', '/images/partners/logo-sejahtera-indonesia.svg', '/images/apartment/2.jpg', '021-2345678', 'contact@sejahteraindonesia.com', 1, 1, 2),
(3, 'Graha Komersial Nusantara', 'graha-komersial-nusantara', 'Pengembang properti komersial dengan fokus pada pusat bisnis modern.', 'Graha Komersial Nusantara mengkhususkan diri dalam pengembangan properti komersial premium. Kami menciptakan ruang bisnis modern yang mendukung pertumbuhan ekonomi dan investasi jangka panjang.', '/images/partners/logo-graha-komersial.svg', '/images/apartment/3.jpg', '021-3456789', 'business@grahakomersial.com', 1, 1, 3),
(4, 'Hunian Masa Depan Group', 'hunian-masa-depan-group', 'Inovator dalam pengembangan hunian berkelanjutan dan ramah lingkungan.', 'Hunian Masa Depan Group adalah pelopor dalam mengembangkan hunian yang berkelanjutan dan ramah lingkungan. Kami mengintegrasikan teknologi hijau dan desain modern untuk menciptakan komunitas yang sehat dan produktif.', '/images/partners/logo-hunian-masa-depan.svg', '/images/apartment/4.jpg', '021-4567890', 'green@hunianmasadepan.com', 1, 1, 4),
(5, 'Properti Rakyat Indonesia', 'properti-rakyat-indonesia', 'Mitra terpercaya untuk hunian terjangkau bagi masyarakat menengah ke bawah.', 'Properti Rakyat Indonesia berkomitmen untuk menyediakan hunian berkualitas dengan harga yang terjangkau bagi seluruh lapisan masyarakat. Kami percaya bahwa setiap orang berhak memiliki rumah yang layak.', '/images/partners/logo-properti-rakyat.svg', '/images/apartment/5.jpg', '021-5678901', 'info@propertirayat.com', 0, 1, 5),
(6, 'Investasi Properti Cerdas', 'investasi-properti-cerdas', 'Platform investasi properti dengan return yang kompetitif dan transparan.', 'Investasi Properti Cerdas menawarkan peluang investasi properti yang menguntungkan dengan sistem yang transparan dan profesional. Kami membantu investor mencapai tujuan finansial mereka melalui properti.', '/images/partners/logo-investasi-cerdas.svg', '/images/apartment/6.jpg', '021-6789012', 'invest@properticerdas.com', 0, 1, 6);

-- =============================================
-- DUMMY PRODUCT DATA (PERUMAHAN)
-- =============================================

-- Products for PT Mitra Properti Utama (ID: 1)
INSERT OR IGNORE INTO products (id, partner_id, name, slug, category, location, description, main_image, is_active, display_order)
VALUES
(1, 1, 'Perumahan Mitra Indah Komersial', 'perumahan-mitra-indah-komersial', 'commercial', 'Jakarta Selatan', 'Perumahan komersial premium dengan fasilitas lengkap dan lokasi strategis di pusat bisnis Jakarta.', '/images/apartment/1.jpg', 1, 1),
(2, 1, 'Rumah Sejahtera Subsidi', 'rumah-sejahtera-subsidi', 'subsidi', 'Tangerang', 'Program subsidi untuk masyarakat menengah dengan cicilan ringan dan proses mudah.', '/images/apartment/2.jpg', 1, 2);

-- Products for Perumahan Sejahtera Indonesia (ID: 2)
INSERT OR IGNORE INTO products (id, partner_id, name, slug, category, location, description, main_image, is_active, display_order)
VALUES
(3, 2, 'Sejahtera Subsidi Bekasi', 'sejahtera-subsidi-bekasi', 'subsidi', 'Bekasi', 'Perumahan subsidi dengan 500 unit rumah tipe 36 dan 45 di lokasi strategis Bekasi.', '/images/apartment/3.jpg', 1, 1),
(4, 2, 'Sejahtera Komersial Surabaya', 'sejahtera-komersial-surabaya', 'commercial', 'Surabaya', 'Perumahan komersial modern dengan fasilitas premium di kota Surabaya.', '/images/apartment/4.jpg', 1, 2);

-- Products for Graha Komersial Nusantara (ID: 3)
INSERT OR IGNORE INTO products (id, partner_id, name, slug, category, location, description, main_image, is_active, display_order)
VALUES
(5, 3, 'Graha Bisnis Pusat Jakarta', 'graha-bisnis-pusat-jakarta', 'commercial', 'Jakarta Pusat', 'Pusat bisnis modern dengan office space dan retail di jantung kota Jakarta.', '/images/apartment/5.jpg', 1, 1),
(6, 3, 'Graha Komersial Bandung', 'graha-komersial-bandung', 'commercial', 'Bandung', 'Kompleks komersial terintegrasi dengan mall, office, dan hotel di Bandung.', '/images/apartment/6.jpg', 1, 2);

-- Products for Hunian Masa Depan Group (ID: 4)
INSERT OR IGNORE INTO products (id, partner_id, name, slug, category, location, description, main_image, is_active, display_order)
VALUES
(7, 4, 'Hunian Hijau Subsidi', 'hunian-hijau-subsidi', 'subsidi', 'Depok', 'Perumahan subsidi ramah lingkungan dengan konsep green living dan fasilitas komunitas.', '/images/apartment/1.jpg', 1, 1),
(8, 4, 'Hunian Masa Depan Premium', 'hunian-masa-depan-premium', 'commercial', 'Bogor', 'Hunian premium dengan teknologi smart home dan desain berkelanjutan di Bogor.', '/images/apartment/2.jpg', 1, 2);

-- Products for Properti Rakyat Indonesia (ID: 5)
INSERT OR IGNORE INTO products (id, partner_id, name, slug, category, location, description, main_image, is_active, display_order)
VALUES
(9, 5, 'Rumah Rakyat Subsidi Medan', 'rumah-rakyat-subsidi-medan', 'subsidi', 'Medan', 'Program subsidi untuk masyarakat dengan harga terjangkau dan cicilan ringan di Medan.', '/images/apartment/3.jpg', 1, 1),
(10, 5, 'Rumah Rakyat Komersial Semarang', 'rumah-rakyat-komersial-semarang', 'commercial', 'Semarang', 'Perumahan komersial dengan lokasi strategis dan fasilitas lengkap di Semarang.', '/images/apartment/4.jpg', 1, 2);

-- Products for Investasi Properti Cerdas (ID: 6)
INSERT OR IGNORE INTO products (id, partner_id, name, slug, category, location, description, main_image, is_active, display_order)
VALUES
(11, 6, 'Investasi Subsidi Yogyakarta', 'investasi-subsidi-yogyakarta', 'subsidi', 'Yogyakarta', 'Peluang investasi properti subsidi dengan return stabil di Yogyakarta.', '/images/apartment/5.jpg', 1, 1),
(12, 6, 'Investasi Komersial Makassar', 'investasi-komersial-makassar', 'commercial', 'Makassar', 'Investasi properti komersial dengan potensi pertumbuhan tinggi di Makassar.', '/images/apartment/6.jpg', 1, 2);

-- =============================================
-- PRODUCT IMAGES (GALLERY)
-- =============================================

-- Images for Perumahan Mitra Indah Komersial (Product ID: 1)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(1, 1, '/images/apartment/1.jpg', 'Tampilan depan perumahan', 1),
(2, 1, '/images/apartment/2.jpg', 'Area taman dan fasilitas', 2),
(3, 1, '/images/apartment/3.jpg', 'Rumah model tipe A', 3);

-- Images for Rumah Sejahtera Subsidi (Product ID: 2)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(4, 2, '/images/apartment/2.jpg', 'Tampilan perumahan subsidi', 1),
(5, 2, '/images/apartment/3.jpg', 'Rumah tipe 36', 2),
(6, 2, '/images/apartment/4.jpg', 'Fasilitas umum', 3);

-- Images for Sejahtera Subsidi Bekasi (Product ID: 3)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(7, 3, '/images/apartment/3.jpg', 'Entrance perumahan', 1),
(8, 3, '/images/apartment/4.jpg', 'Rumah model', 2),
(9, 3, '/images/apartment/5.jpg', 'Taman bermain anak', 3);

-- Images for Sejahtera Komersial Surabaya (Product ID: 4)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(10, 4, '/images/apartment/4.jpg', 'Tampilan komersial', 1),
(11, 4, '/images/apartment/5.jpg', 'Area retail', 2),
(12, 4, '/images/apartment/6.jpg', 'Fasilitas parkir', 3);

-- Images for Graha Bisnis Pusat Jakarta (Product ID: 5)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(13, 5, '/images/apartment/5.jpg', 'Gedung perkantoran', 1),
(14, 5, '/images/apartment/6.jpg', 'Lobby modern', 2),
(15, 5, '/images/apartment/1.jpg', 'Ruang kantor', 3);

-- Images for Graha Komersial Bandung (Product ID: 6)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(16, 6, '/images/apartment/6.jpg', 'Kompleks komersial', 1),
(17, 6, '/images/apartment/1.jpg', 'Area mall', 2),
(18, 6, '/images/apartment/2.jpg', 'Fasilitas hotel', 3);

-- Images for Hunian Hijau Subsidi (Product ID: 7)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(19, 7, '/images/apartment/1.jpg', 'Hunian hijau', 1),
(20, 7, '/images/apartment/2.jpg', 'Taman komunitas', 2),
(21, 7, '/images/apartment/3.jpg', 'Rumah model', 3);

-- Images for Hunian Masa Depan Premium (Product ID: 8)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(22, 8, '/images/apartment/2.jpg', 'Hunian premium', 1),
(23, 8, '/images/apartment/3.jpg', 'Smart home technology', 2),
(24, 8, '/images/apartment/4.jpg', 'Fasilitas premium', 3);

-- Images for Rumah Rakyat Subsidi Medan (Product ID: 9)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(25, 9, '/images/apartment/3.jpg', 'Perumahan subsidi', 1),
(26, 9, '/images/apartment/4.jpg', 'Rumah tipe 36', 2),
(27, 9, '/images/apartment/5.jpg', 'Area bermain', 3);

-- Images for Rumah Rakyat Komersial Semarang (Product ID: 10)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(28, 10, '/images/apartment/4.jpg', 'Perumahan komersial', 1),
(29, 10, '/images/apartment/5.jpg', 'Lokasi strategis', 2),
(30, 10, '/images/apartment/6.jpg', 'Fasilitas lengkap', 3);

-- Images for Investasi Subsidi Yogyakarta (Product ID: 11)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(31, 11, '/images/apartment/5.jpg', 'Investasi subsidi', 1),
(32, 11, '/images/apartment/6.jpg', 'Lokasi Yogyakarta', 2),
(33, 11, '/images/apartment/1.jpg', 'Rumah model', 3);

-- Images for Investasi Komersial Makassar (Product ID: 12)
INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order)
VALUES
(34, 12, '/images/apartment/6.jpg', 'Investasi komersial', 1),
(35, 12, '/images/apartment/1.jpg', 'Lokasi Makassar', 2),
(36, 12, '/images/apartment/2.jpg', 'Potensi pertumbuhan', 3);
