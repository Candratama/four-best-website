-- Add hero_image column to partners table (missing in production)
ALTER TABLE partners ADD COLUMN hero_image TEXT;

-- Update partner images with correct values
UPDATE partners SET
    logo = '/images/partners/logo-mitra-properti.svg',
    hero_image = '/images/apartment/1.jpg'
WHERE slug = 'pt-mitra-properti-utama';

UPDATE partners SET
    logo = '/images/partners/logo-sejahtera-indonesia.svg',
    hero_image = '/images/apartment/2.jpg'
WHERE slug = 'perumahan-sejahtera-indonesia';

UPDATE partners SET
    logo = '/images/partners/logo-graha-komersial.svg',
    hero_image = '/images/apartment/3.jpg'
WHERE slug = 'graha-komersial-nusantara';

UPDATE partners SET
    logo = '/images/partners/logo-hunian-masa-depan.svg',
    hero_image = '/images/apartment/4.jpg'
WHERE slug = 'hunian-masa-depan-group';

UPDATE partners SET
    logo = '/images/partners/logo-properti-rakyat.svg',
    hero_image = '/images/apartment/5.jpg'
WHERE slug = 'properti-rakyat-indonesia';

UPDATE partners SET
    logo = '/images/partners/logo-investasi-cerdas.svg',
    hero_image = '/images/apartment/6.jpg'
WHERE slug = 'investasi-properti-cerdas';
