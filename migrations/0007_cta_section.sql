-- CTA Section table for global CTA content management
CREATE TABLE IF NOT EXISTS cta_section (
  id INTEGER PRIMARY KEY DEFAULT 1,
  subtitle TEXT DEFAULT 'Hubungi Kami',
  title TEXT DEFAULT 'Siap Menemukan Properti Impian Anda?',
  description TEXT DEFAULT 'Tim profesional kami siap membantu Anda menemukan properti yang tepat. Konsultasi gratis dan tanpa komitmen.',
  primary_button_text TEXT DEFAULT 'Hubungi via WhatsApp',
  primary_button_href TEXT DEFAULT 'https://wa.me/6281234567890',
  secondary_button_text TEXT DEFAULT 'Jadwalkan Konsultasi',
  secondary_button_href TEXT DEFAULT '/contact',
  background_image TEXT DEFAULT 'https://cdn.4best.id/backgrounds/8.webp',
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Insert default data
INSERT OR IGNORE INTO cta_section (id) VALUES (1);
