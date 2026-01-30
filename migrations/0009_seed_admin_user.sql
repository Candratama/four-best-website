-- Migration: Seed default admin user
-- Password: admin123 (change immediately after first login)
-- Hash generated with bcrypt, 12 rounds

INSERT OR IGNORE INTO admin_users (id, username, password_hash, name, is_active)
VALUES (
    1,
    'admin',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYWWQRAOyO2i',
    'Administrator',
    1
);
