-- ============================================================
-- UniNest Stays Module — Database Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Stays (properties)
CREATE TABLE IF NOT EXISTS stays (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title                TEXT NOT NULL,
  description          TEXT,
  property_type        TEXT DEFAULT 'flat',
  bhk                  TEXT NOT NULL,
  bathrooms            INT DEFAULT 1,
  area_sqft            INT,
  floor                INT,
  total_floors         INT,
  rent                 INT NOT NULL,
  security_deposit     INT DEFAULT 0,
  furnishing           TEXT DEFAULT 'unfurnished',
  location_area        TEXT,
  location_address     TEXT,
  location_city        TEXT DEFAULT 'Pune',
  location_pincode     TEXT,
  location_landmark    TEXT,
  location_campus      TEXT,
  amenities            TEXT[] DEFAULT '{}',
  images               TEXT[] DEFAULT '{}',
  available_from       DATE,
  is_verified          BOOLEAN DEFAULT false,
  verification_status  TEXT DEFAULT 'pending',
  rating               NUMERIC(3,2) DEFAULT 0,
  review_count         INT DEFAULT 0,
  views                INT DEFAULT 0,
  is_featured          BOOLEAN DEFAULT false,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

-- 2. Saved stays
CREATE TABLE IF NOT EXISTS saved_stays (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stay_id    UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, stay_id)
);

-- 3. Recently viewed
CREATE TABLE IF NOT EXISTS recently_viewed (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stay_id    UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  viewed_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, stay_id)
);

-- 4. Inquiries
CREATE TABLE IF NOT EXISTS stay_inquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id     UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  status      TEXT DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 5. Areas
CREATE TABLE IF NOT EXISTS areas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT UNIQUE NOT NULL,
  city       TEXT DEFAULT 'Pune',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Area reviews
CREATE TABLE IF NOT EXISTS area_reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id           UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  safety_rating     INT CHECK (safety_rating BETWEEN 1 AND 5),
  transport_rating  INT CHECK (transport_rating BETWEEN 1 AND 5),
  food_rating       INT CHECK (food_rating BETWEEN 1 AND 5),
  water_rating      INT CHECK (water_rating BETWEEN 1 AND 5),
  internet_rating   INT CHECK (internet_rating BETWEEN 1 AND 5),
  comment           TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS stays_location_area_idx ON stays (location_area);
CREATE INDEX IF NOT EXISTS stays_rent_idx ON stays (rent);
CREATE INDEX IF NOT EXISTS stays_featured_idx ON stays (is_featured);
CREATE INDEX IF NOT EXISTS stays_owner_idx ON stays (owner_id);
CREATE INDEX IF NOT EXISTS saved_stays_user_idx ON saved_stays (user_id);
CREATE INDEX IF NOT EXISTS recently_viewed_user_idx ON recently_viewed (user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_student_idx ON stay_inquiries (student_id);
CREATE INDEX IF NOT EXISTS area_reviews_area_idx ON area_reviews (area_id);

-- Disable RLS (backend uses service-role key)
ALTER TABLE stays           DISABLE ROW LEVEL SECURITY;
ALTER TABLE saved_stays     DISABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed DISABLE ROW LEVEL SECURITY;
ALTER TABLE stay_inquiries  DISABLE ROW LEVEL SECURITY;
ALTER TABLE areas            DISABLE ROW LEVEL SECURITY;
ALTER TABLE area_reviews     DISABLE ROW LEVEL SECURITY;
