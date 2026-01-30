-- Migration: Seed default admin user
-- Password: admin123 (change immediately after first login)
-- Hash generated with bcrypt, 12 rounds

INSERT OR IGNORE INTO admin_users (id, username, password_hash, name, is_active)
VALUES (
    1,
    'admin',
    '$2b$12$AwQcmoz6UspYV35Kkn8MYetFRIrIfuGzmjlxiR3UVUW1IiMBHoMvq',
    'Administrator',
    1
);
