-- Migration: Add site configuration tables
-- Description: Creates tables for site settings, company info, social links, navigation,
--              hero slides, value propositions, stats, team members, agents, and page sections

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    tagline TEXT,
    logo TEXT,
    favicon TEXT,
    language TEXT DEFAULT 'id',
    primary_color TEXT DEFAULT '#162d50',
    secondary_color TEXT DEFAULT '#0056d6',
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- COMPANY INFO
-- =============================================
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

-- =============================================
-- SOCIAL LINKS
-- =============================================
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

-- =============================================
-- NAVIGATION ITEMS
-- =============================================
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

-- =============================================
-- HERO SLIDES
-- =============================================
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

-- =============================================
-- VALUE PROPOSITIONS
-- =============================================
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

-- =============================================
-- STATS
-- =============================================
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

-- =============================================
-- TEAM MEMBERS
-- =============================================
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

-- =============================================
-- AGENTS
-- =============================================
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

-- =============================================
-- PAGE SECTIONS (JSON storage for flexible content)
-- =============================================
CREATE TABLE IF NOT EXISTS page_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content TEXT NOT NULL, -- JSON content
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(page_slug, section_key)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_social_links_active ON social_links(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_navigation_items_active ON navigation_items(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_hero_slides_page ON hero_slides(page_slug, is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_value_propositions_active ON value_propositions(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_stats_active ON stats(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_page_sections_page ON page_sections(page_slug, section_key);
