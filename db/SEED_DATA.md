# Dummy Partner Data Seed

This directory contains seed data for the 4Best website database.

## Overview

The `seed-partners.sql` file contains dummy data for:
- **6 Partner Companies** (Mitra)
- **12 Products** (Perumahan) - 6 commercial, 6 subsidi
- **36 Product Images** (Gallery images)

## Partner Companies

1. **PT Mitra Properti Utama** (Featured)
   - Slug: `pt-mitra-properti-utama`
   - Description: Developer terkemuka dengan pengalaman lebih dari 20 tahun
   - Products: 2 (1 commercial, 1 subsidi)

2. **Perumahan Sejahtera Indonesia** (Featured)
   - Slug: `perumahan-sejahtera-indonesia`
   - Description: Spesialis perumahan subsidi dengan standar kualitas internasional
   - Products: 2 (1 commercial, 1 subsidi)

3. **Graha Komersial Nusantara** (Featured)
   - Slug: `graha-komersial-nusantara`
   - Description: Pengembang properti komersial dengan fokus pada pusat bisnis modern
   - Products: 2 (2 commercial)

4. **Hunian Masa Depan Group** (Featured)
   - Slug: `hunian-masa-depan-group`
   - Description: Inovator dalam pengembangan hunian berkelanjutan dan ramah lingkungan
   - Products: 2 (1 commercial, 1 subsidi)

5. **Properti Rakyat Indonesia**
   - Slug: `properti-rakyat-indonesia`
   - Description: Mitra terpercaya untuk hunian terjangkau bagi masyarakat menengah ke bawah
   - Products: 2 (1 commercial, 1 subsidi)

6. **Investasi Properti Cerdas**
   - Slug: `investasi-properti-cerdas`
   - Description: Platform investasi properti dengan return yang kompetitif dan transparan
   - Products: 2 (1 commercial, 1 subsidi)

## Products by Category

### Commercial (Komersial) - 6 products
- Perumahan Mitra Indah Komersial (Jakarta Selatan)
- Sejahtera Komersial Surabaya (Surabaya)
- Graha Bisnis Pusat Jakarta (Jakarta Pusat)
- Graha Komersial Bandung (Bandung)
- Hunian Masa Depan Premium (Bogor)
- Rumah Rakyat Komersial Semarang (Semarang)
- Investasi Komersial Makassar (Makassar)

### Subsidi - 6 products
- Rumah Sejahtera Subsidi (Tangerang)
- Sejahtera Subsidi Bekasi (Bekasi)
- Hunian Hijau Subsidi (Depok)
- Rumah Rakyat Subsidi Medan (Medan)
- Investasi Subsidi Yogyakarta (Yogyakarta)

## How to Apply Seed Data

### Option 1: Using Cloudflare D1 (Production)

```bash
# Execute the seed file on your D1 database
wrangler d1 execute four-best-db --file db/seed-partners.sql
```

### Option 2: Using Local SQLite (Development)

```bash
# If you have a local SQLite database
sqlite3 your-database.db < db/seed-partners.sql
```

### Option 3: Using Node.js Script

```bash
# Run the seed script
node scripts/seed-partners.js
```

## Data Structure

### Partners Table
```sql
- id: INTEGER PRIMARY KEY
- name: TEXT (Partner name)
- slug: TEXT UNIQUE (URL-friendly identifier)
- short_description: TEXT (Brief description)
- full_profile: TEXT (Detailed profile)
- logo: TEXT (Logo/image path)
- contact_phone: TEXT (Phone number)
- contact_email: TEXT (Email address)
- is_featured: INTEGER (0 or 1)
- is_active: INTEGER (0 or 1)
- display_order: INTEGER (Sort order)
```

### Products Table
```sql
- id: INTEGER PRIMARY KEY
- partner_id: INTEGER FOREIGN KEY
- name: TEXT (Product name)
- slug: TEXT UNIQUE (URL-friendly identifier)
- category: TEXT ('commercial' or 'subsidi')
- location: TEXT (City/location)
- description: TEXT (Product description)
- main_image: TEXT (Main image path)
- is_active: INTEGER (0 or 1)
- display_order: INTEGER (Sort order)
```

### Product Images Table
```sql
- id: INTEGER PRIMARY KEY
- product_id: INTEGER FOREIGN KEY
- image_url: TEXT (Image path)
- alt_text: TEXT (Alternative text)
- display_order: INTEGER (Sort order)
```

## Image Paths

All images use existing template images from `/public/images/apartment/`:
- `/images/apartment/1.jpg`
- `/images/apartment/2.jpg`
- `/images/apartment/3.jpg`
- `/images/apartment/4.jpg`
- `/images/apartment/5.jpg`
- `/images/apartment/6.jpg`

## Notes

- All partners are set to `is_active = 1` (active)
- 4 partners are marked as `is_featured = 1` (featured)
- Each partner has 2 products (1 commercial, 1 subsidi)
- Each product has 3 gallery images
- All data uses Indonesian language for descriptions
- Contact information is placeholder data

## Resetting Data

To remove all seed data and reset the database:

```sql
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM partners;
```

Or use the wrangler command:

```bash
wrangler d1 execute four-best-db --command "DELETE FROM product_images; DELETE FROM products; DELETE FROM partners;"
```

## Next Steps

After applying the seed data:

1. Verify partners appear on `/partners` page
2. Check partner details on `/partners/[slug]` pages
3. Verify products are categorized correctly (commercial vs subsidi)
4. Test gallery images load properly
5. Verify contact information displays correctly
