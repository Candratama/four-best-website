import { getDB } from "./cloudflare";

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface Partner {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  full_profile: string | null;
  logo: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  is_featured: number;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  partner_id: number;
  name: string;
  slug: string;
  category: "commercial" | "subsidi";
  location: string | null;
  description: string | null;
  main_image: string | null;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Homepage {
  id: number;
  headline: string | null;
  subheadline: string | null;
  description: string | null;
  hero_image: string | null;
  updated_at: string;
}

export interface AboutPage {
  id: number;
  profile: string | null;
  vision: string | null;
  mission: string | null;
  advantages: string | null;
  image: string | null;
  updated_at: string;
}

export interface ContactPage {
  id: number;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  updated_at: string;
}

// =============================================
// SITE CONFIGURATION TYPES
// =============================================

export interface SiteSettings {
  id: number;
  name: string;
  tagline: string | null;
  logo: string | null;
  favicon: string | null;
  language: string;
  primary_color: string;
  secondary_color: string;
  updated_at: string;
}

export interface CompanyInfo {
  id: number;
  address: string | null;
  address_line_2: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  opening_hours: string | null;
  map_url: string | null;
  updated_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: number;
  label: string;
  href: string;
  parent_id: number | null;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HeroSlide {
  id: number;
  page_slug: string;
  image: string;
  title: string | null;
  subtitle: string | null;
  overlay_opacity: number;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ValueProposition {
  id: number;
  icon: string;
  title: string;
  description: string | null;
  grid_class: string | null;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Stat {
  id: number;
  value: number;
  label: string;
  suffix: string | null;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string | null;
  image: string | null;
  bio: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  social_linkedin: string | null;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  image: string | null;
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: number;
  page_slug: string;
  section_key: string;
  content: string; // JSON string
  is_active: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Parsed page section content types
export interface HeroSectionContent {
  title: string;
  subtitle?: string | null;
  background_image?: string | null;
}

export interface OverviewSectionContent {
  subtitle: string;
  title: string;
  description: string;
  cta_text: string;
  cta_href: string;
  images: string[];
}

export interface VideoSectionContent {
  title: string;
  youtube_url: string;
  background_image: string;
}

export interface CTASectionContent {
  title: string;
  button_text: string;
  button_href: string;
}

// =============================================
// HOMEPAGE QUERIES
// =============================================

export async function getHomepage(): Promise<Homepage | null> {
  const db = await getDB();
  const result = await db
    .prepare("SELECT * FROM homepage WHERE id = 1")
    .first<Homepage>();
  return result;
}

export async function updateHomepage(data: Partial<Homepage>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => k !== "id")
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter((_, i) => Object.keys(data)[i] !== "id");

  await db
    .prepare(`UPDATE homepage SET ${fields}, updated_at = datetime('now') WHERE id = 1`)
    .bind(...values)
    .run();
}

// =============================================
// ABOUT PAGE QUERIES
// =============================================

export async function getAboutPage(): Promise<AboutPage | null> {
  const db = await getDB();
  return db.prepare("SELECT * FROM about_page WHERE id = 1").first<AboutPage>();
}

export async function updateAboutPage(data: Partial<AboutPage>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => k !== "id")
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter((_, i) => Object.keys(data)[i] !== "id");

  await db
    .prepare(`UPDATE about_page SET ${fields}, updated_at = datetime('now') WHERE id = 1`)
    .bind(...values)
    .run();
}

// =============================================
// CONTACT PAGE QUERIES
// =============================================

export async function getContactPage(): Promise<ContactPage | null> {
  const db = await getDB();
  return db.prepare("SELECT * FROM contact_page WHERE id = 1").first<ContactPage>();
}

export async function updateContactPage(data: Partial<ContactPage>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => k !== "id")
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter((_, i) => Object.keys(data)[i] !== "id");

  await db
    .prepare(`UPDATE contact_page SET ${fields}, updated_at = datetime('now') WHERE id = 1`)
    .bind(...values)
    .run();
}

// =============================================
// PARTNER QUERIES
// =============================================

export async function getPartners(options?: {
  activeOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<Partner[]> {
  const db = await getDB();
  let query = "SELECT * FROM partners WHERE 1=1";

  if (options?.activeOnly) query += " AND is_active = 1";
  if (options?.featuredOnly) query += " AND is_featured = 1";

  query += " ORDER BY display_order ASC, name ASC";

  const result = await db.prepare(query).all<Partner>();
  return result.results;
}

export async function getPartnerBySlug(slug: string): Promise<Partner | null> {
  const db = await getDB();
  return db
    .prepare("SELECT * FROM partners WHERE slug = ?")
    .bind(slug)
    .first<Partner>();
}

export async function getPartnerById(id: number): Promise<Partner | null> {
  const db = await getDB();
  return db
    .prepare("SELECT * FROM partners WHERE id = ?")
    .bind(id)
    .first<Partner>();
}

export async function createPartner(
  data: Omit<Partner, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO partners (name, slug, short_description, full_profile, logo, contact_phone, contact_email, is_featured, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.name,
      data.slug,
      data.short_description,
      data.full_profile,
      data.logo,
      data.contact_phone,
      data.contact_email,
      data.is_featured,
      data.is_active,
      data.display_order
    )
    .run();

  return result.meta.last_row_id as number;
}

export async function updatePartner(
  id: number,
  data: Partial<Partner>
): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => k !== "id" && k !== "created_at")
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );

  await db
    .prepare(`UPDATE partners SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deletePartner(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM partners WHERE id = ?").bind(id).run();
}

// =============================================
// PRODUCT QUERIES
// =============================================

export async function getProducts(options?: {
  partnerId?: number;
  category?: "commercial" | "subsidi";
  activeOnly?: boolean;
}): Promise<Product[]> {
  const db = await getDB();
  let query = "SELECT * FROM products WHERE 1=1";
  const bindings: (number | string)[] = [];

  if (options?.partnerId) {
    query += " AND partner_id = ?";
    bindings.push(options.partnerId);
  }
  if (options?.category) {
    query += " AND category = ?";
    bindings.push(options.category);
  }
  if (options?.activeOnly) {
    query += " AND is_active = 1";
  }

  query += " ORDER BY display_order ASC, name ASC";

  const result = await db.prepare(query).bind(...bindings).all<Product>();
  return result.results;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await getDB();
  return db
    .prepare("SELECT * FROM products WHERE slug = ?")
    .bind(slug)
    .first<Product>();
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = await getDB();
  return db
    .prepare("SELECT * FROM products WHERE id = ?")
    .bind(id)
    .first<Product>();
}

export async function createProduct(
  data: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO products (partner_id, name, slug, category, location, description, main_image, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.partner_id,
      data.name,
      data.slug,
      data.category,
      data.location,
      data.description,
      data.main_image,
      data.is_active,
      data.display_order
    )
    .run();

  return result.meta.last_row_id as number;
}

export async function updateProduct(
  id: number,
  data: Partial<Product>
): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => k !== "id" && k !== "created_at")
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );

  await db
    .prepare(`UPDATE products SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
}
