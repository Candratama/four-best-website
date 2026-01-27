-- Migration: Drop and recreate site configuration tables
-- Description: Drops existing tables and recreates with correct schema

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS page_sections;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS value_propositions;
DROP TABLE IF EXISTS hero_slides;
DROP TABLE IF EXISTS navigation_items;
DROP TABLE IF EXISTS social_links;
DROP TABLE IF EXISTS company_info;
DROP TABLE IF EXISTS site_settings;

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE site_settings (
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
CREATE TABLE company_info (
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
CREATE TABLE social_links (
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
CREATE TABLE navigation_items (
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
CREATE TABLE hero_slides (
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
CREATE TABLE value_propositions (
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
CREATE TABLE stats (
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
CREATE TABLE team_members (
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
CREATE TABLE agents (
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
CREATE TABLE page_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_slug TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(page_slug, section_key)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_social_links_active ON social_links(is_active, display_order);
CREATE INDEX idx_navigation_items_active ON navigation_items(is_active, display_order);
CREATE INDEX idx_hero_slides_page ON hero_slides(page_slug, is_active, display_order);
CREATE INDEX idx_value_propositions_active ON value_propositions(is_active, display_order);
CREATE INDEX idx_stats_active ON stats(is_active, display_order);
CREATE INDEX idx_team_members_active ON team_members(is_active, display_order);
CREATE INDEX idx_agents_active ON agents(is_active, display_order);
CREATE INDEX idx_page_sections_page ON page_sections(page_slug, section_key);
