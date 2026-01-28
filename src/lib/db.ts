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
  hero_image: string | null;
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
  // Hero Section
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_background_image: string | null;
  // Company Intro Section
  intro_subtitle: string | null;
  intro_title: string | null;
  intro_description: string | null;
  intro_image_left: string | null;
  intro_image_right: string | null;
  // Vision Section
  vision_subtitle: string | null;
  vision_title: string | null;
  vision_text: string | null;
  // Mission Section
  mission_subtitle: string | null;
  mission_title: string | null;
  // CTA Section
  cta_title: string | null;
  cta_button_text: string | null;
  cta_button_href: string | null;
  updated_at: string;
}

export interface Mission {
  id: number;
  icon: string | null;
  text: string;
  is_active: number;
  display_order: number;
  created_at: string;
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
  try {
    const db = await getDB();
    return db.prepare("SELECT * FROM about_page WHERE id = 1").first<AboutPage>();
  } catch (error) {
    console.error("Error fetching about page:", error);
    return null;
  }
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
// MISSIONS QUERIES
// =============================================

export async function getMissions(options?: { activeOnly?: boolean }): Promise<Mission[]> {
  try {
    const db = await getDB();
    let query = "SELECT * FROM missions WHERE 1=1";
    if (options?.activeOnly) query += " AND is_active = 1";
    query += " ORDER BY display_order ASC";
    const result = await db.prepare(query).all<Mission>();
    return result.results;
  } catch (error) {
    console.error("Error fetching missions:", error);
    return [];
  }
}

export async function getMissionById(id: number): Promise<Mission | null> {
  const db = await getDB();
  return db.prepare("SELECT * FROM missions WHERE id = ?").bind(id).first<Mission>();
}

export async function createMission(
  data: Omit<Mission, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO missions (icon, text, is_active, display_order)
       VALUES (?, ?, ?, ?)`
    )
    .bind(data.icon, data.text, data.is_active, data.display_order)
    .run();
  return result.meta.last_row_id as number;
}

export async function updateMission(id: number, data: Partial<Mission>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => !["id", "created_at"].includes(k))
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );
  await db
    .prepare(`UPDATE missions SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteMission(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM missions WHERE id = ?").bind(id).run();
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

export interface PartnerWithProductCount extends Partner {
  product_count: number;
}

export async function getPartnersWithProductCount(options?: {
  activeOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<PartnerWithProductCount[]> {
  const db = await getDB();
  let query = `
    SELECT p.*, COUNT(pr.id) as product_count
    FROM partners p
    LEFT JOIN products pr ON p.id = pr.partner_id AND pr.is_active = 1
    WHERE 1=1
  `;

  if (options?.activeOnly) query += " AND p.is_active = 1";
  if (options?.featuredOnly) query += " AND p.is_featured = 1";

  query += " GROUP BY p.id ORDER BY p.display_order ASC, p.name ASC";

  const result = await db.prepare(query).all<PartnerWithProductCount>();
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

// =============================================
// SITE SETTINGS QUERIES
// =============================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const db = await getDB();
  return db.prepare("SELECT * FROM site_settings WHERE id = 1").first<SiteSettings>();
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => k !== "id")
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter((_, i) => Object.keys(data)[i] !== "id");

  await db
    .prepare(`UPDATE site_settings SET ${fields}, updated_at = datetime('now') WHERE id = 1`)
    .bind(...values)
    .run();
}

// =============================================
// COMPANY INFO QUERIES
// =============================================

export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  const db = await getDB();
  return db.prepare("SELECT * FROM company_info WHERE id = 1").first<CompanyInfo>();
}

export async function updateCompanyInfo(data: Partial<CompanyInfo>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => k !== "id")
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter((_, i) => Object.keys(data)[i] !== "id");

  await db
    .prepare(`UPDATE company_info SET ${fields}, updated_at = datetime('now') WHERE id = 1`)
    .bind(...values)
    .run();
}

// =============================================
// SOCIAL LINKS QUERIES
// =============================================

export async function getSocialLinks(options?: { activeOnly?: boolean }): Promise<SocialLink[]> {
  const db = await getDB();
  let query = "SELECT * FROM social_links WHERE 1=1";
  if (options?.activeOnly) query += " AND is_active = 1";
  query += " ORDER BY display_order ASC";
  const result = await db.prepare(query).all<SocialLink>();
  return result.results;
}

export async function createSocialLink(
  data: Omit<SocialLink, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO social_links (platform, url, icon, is_active, display_order)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(data.platform, data.url, data.icon, data.is_active, data.display_order)
    .run();
  return result.meta.last_row_id as number;
}

export async function updateSocialLink(id: number, data: Partial<SocialLink>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => !["id", "created_at"].includes(k))
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );
  await db
    .prepare(`UPDATE social_links SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteSocialLink(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM social_links WHERE id = ?").bind(id).run();
}

// =============================================
// NAVIGATION ITEMS QUERIES
// =============================================

export async function getNavigationItems(options?: { activeOnly?: boolean }): Promise<NavigationItem[]> {
  const db = await getDB();
  let query = "SELECT * FROM navigation_items WHERE 1=1";
  if (options?.activeOnly) query += " AND is_active = 1";
  query += " ORDER BY display_order ASC";
  const result = await db.prepare(query).all<NavigationItem>();
  return result.results;
}

export async function createNavigationItem(
  data: Omit<NavigationItem, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO navigation_items (label, href, parent_id, is_active, display_order)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(data.label, data.href, data.parent_id, data.is_active, data.display_order)
    .run();
  return result.meta.last_row_id as number;
}

export async function updateNavigationItem(id: number, data: Partial<NavigationItem>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => !["id", "created_at"].includes(k))
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );
  await db
    .prepare(`UPDATE navigation_items SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteNavigationItem(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM navigation_items WHERE id = ?").bind(id).run();
}

// =============================================
// HERO SLIDES QUERIES
// =============================================

export async function getHeroSlides(options?: {
  pageSlug?: string;
  activeOnly?: boolean;
}): Promise<HeroSlide[]> {
  const db = await getDB();
  let query = "SELECT * FROM hero_slides WHERE 1=1";
  const bindings: string[] = [];

  if (options?.pageSlug) {
    query += " AND page_slug = ?";
    bindings.push(options.pageSlug);
  }
  if (options?.activeOnly) query += " AND is_active = 1";
  query += " ORDER BY display_order ASC";

  const result = await db.prepare(query).bind(...bindings).all<HeroSlide>();
  return result.results;
}

export async function createHeroSlide(
  data: Omit<HeroSlide, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO hero_slides (page_slug, image, title, subtitle, overlay_opacity, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.page_slug,
      data.image,
      data.title,
      data.subtitle,
      data.overlay_opacity,
      data.is_active,
      data.display_order
    )
    .run();
  return result.meta.last_row_id as number;
}

export async function updateHeroSlide(id: number, data: Partial<HeroSlide>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => !["id", "created_at"].includes(k))
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );
  await db
    .prepare(`UPDATE hero_slides SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteHeroSlide(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM hero_slides WHERE id = ?").bind(id).run();
}

// =============================================
// VALUE PROPOSITIONS QUERIES
// =============================================

export async function getValuePropositions(options?: { activeOnly?: boolean }): Promise<ValueProposition[]> {
  const db = await getDB();
  let query = "SELECT * FROM value_propositions WHERE 1=1";
  if (options?.activeOnly) query += " AND is_active = 1";
  query += " ORDER BY display_order ASC";
  const result = await db.prepare(query).all<ValueProposition>();
  return result.results;
}

export async function createValueProposition(
  data: Omit<ValueProposition, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO value_propositions (icon, title, description, grid_class, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(data.icon, data.title, data.description, data.grid_class, data.is_active, data.display_order)
    .run();
  return result.meta.last_row_id as number;
}

export async function updateValueProposition(id: number, data: Partial<ValueProposition>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => !["id", "created_at"].includes(k))
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );
  await db
    .prepare(`UPDATE value_propositions SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteValueProposition(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM value_propositions WHERE id = ?").bind(id).run();
}

// =============================================
// STATS QUERIES
// =============================================

export async function getStats(options?: { activeOnly?: boolean }): Promise<Stat[]> {
  try {
    const db = await getDB();
    let query = "SELECT * FROM stats WHERE 1=1";
    if (options?.activeOnly) query += " AND is_active = 1";
    query += " ORDER BY display_order ASC";
    const result = await db.prepare(query).all<Stat>();
    return result.results;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return [];
  }
}

export async function createStat(
  data: Omit<Stat, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO stats (value, label, suffix, is_active, display_order)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(data.value, data.label, data.suffix, data.is_active, data.display_order)
    .run();
  return result.meta.last_row_id as number;
}

export async function updateStat(id: number, data: Partial<Stat>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => !["id", "created_at"].includes(k))
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );
  await db
    .prepare(`UPDATE stats SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteStat(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM stats WHERE id = ?").bind(id).run();
}

// =============================================
// TEAM MEMBERS QUERIES
// =============================================

export async function getTeamMembers(options?: { activeOnly?: boolean }): Promise<TeamMember[]> {
  try {
    const db = await getDB();
    let query = "SELECT * FROM team_members WHERE 1=1";
    if (options?.activeOnly) query += " AND is_active = 1";
    query += " ORDER BY display_order ASC";
    const result = await db.prepare(query).all<TeamMember>();
    return result.results;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export async function getTeamMemberById(id: number): Promise<TeamMember | null> {
  const db = await getDB();
  return db.prepare("SELECT * FROM team_members WHERE id = ?").bind(id).first<TeamMember>();
}

export async function createTeamMember(
  data: Omit<TeamMember, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO team_members (name, role, image, bio, social_facebook, social_twitter, social_instagram, social_linkedin, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.name,
      data.role,
      data.image,
      data.bio,
      data.social_facebook,
      data.social_twitter,
      data.social_instagram,
      data.social_linkedin,
      data.is_active,
      data.display_order
    )
    .run();
  return result.meta.last_row_id as number;
}

export async function updateTeamMember(id: number, data: Partial<TeamMember>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => !["id", "created_at"].includes(k))
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );
  await db
    .prepare(`UPDATE team_members SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteTeamMember(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM team_members WHERE id = ?").bind(id).run();
}

// =============================================
// AGENTS QUERIES
// =============================================

export async function getAgents(options?: { activeOnly?: boolean }): Promise<Agent[]> {
  const db = await getDB();
  let query = "SELECT * FROM agents WHERE 1=1";
  if (options?.activeOnly) query += " AND is_active = 1";
  query += " ORDER BY display_order ASC";
  const result = await db.prepare(query).all<Agent>();
  return result.results;
}

export async function getAgentById(id: number): Promise<Agent | null> {
  const db = await getDB();
  return db.prepare("SELECT * FROM agents WHERE id = ?").bind(id).first<Agent>();
}

export async function createAgent(
  data: Omit<Agent, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO agents (name, phone, email, image, is_active, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(data.name, data.phone, data.email, data.image, data.is_active, data.display_order)
    .run();
  return result.meta.last_row_id as number;
}

export async function updateAgent(id: number, data: Partial<Agent>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => !["id", "created_at"].includes(k))
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );
  await db
    .prepare(`UPDATE agents SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function deleteAgent(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM agents WHERE id = ?").bind(id).run();
}

// =============================================
// PAGE SECTIONS QUERIES
// =============================================

export async function getPageSections(options?: {
  pageSlug?: string;
  activeOnly?: boolean;
}): Promise<PageSection[]> {
  const db = await getDB();
  let query = "SELECT * FROM page_sections WHERE 1=1";
  const bindings: string[] = [];

  if (options?.pageSlug) {
    query += " AND page_slug = ?";
    bindings.push(options.pageSlug);
  }
  if (options?.activeOnly) query += " AND is_active = 1";
  query += " ORDER BY display_order ASC";

  const result = await db.prepare(query).bind(...bindings).all<PageSection>();
  return result.results;
}

export async function getPageSection(
  pageSlug: string,
  sectionKey: string
): Promise<PageSection | null> {
  const db = await getDB();
  return db
    .prepare("SELECT * FROM page_sections WHERE page_slug = ? AND section_key = ?")
    .bind(pageSlug, sectionKey)
    .first<PageSection>();
}

export async function getPageSectionContent<T>(
  pageSlug: string,
  sectionKey: string
): Promise<T | null> {
  const section = await getPageSection(pageSlug, sectionKey);
  if (!section) return null;
  try {
    return JSON.parse(section.content) as T;
  } catch {
    return null;
  }
}

export async function createPageSection(
  data: Omit<PageSection, "id" | "created_at" | "updated_at">
): Promise<number> {
  const db = await getDB();
  const result = await db
    .prepare(
      `INSERT INTO page_sections (page_slug, section_key, content, is_active, display_order)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(data.page_slug, data.section_key, data.content, data.is_active, data.display_order)
    .run();
  return result.meta.last_row_id as number;
}

export async function updatePageSection(id: number, data: Partial<PageSection>): Promise<void> {
  const db = await getDB();
  const fields = Object.keys(data)
    .filter((k) => !["id", "created_at"].includes(k))
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(data).filter(
    (_, i) => !["id", "created_at"].includes(Object.keys(data)[i])
  );
  await db
    .prepare(`UPDATE page_sections SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...values, id)
    .run();
}

export async function updatePageSectionContent<T>(
  pageSlug: string,
  sectionKey: string,
  content: T
): Promise<void> {
  const db = await getDB();
  await db
    .prepare(
      `UPDATE page_sections SET content = ?, updated_at = datetime('now') 
       WHERE page_slug = ? AND section_key = ?`
    )
    .bind(JSON.stringify(content), pageSlug, sectionKey)
    .run();
}

export async function deletePageSection(id: number): Promise<void> {
  const db = await getDB();
  await db.prepare("DELETE FROM page_sections WHERE id = ?").bind(id).run();
}
