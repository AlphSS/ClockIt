-- ============================================================
-- UniNest / ClockIt Stays Module — Database Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Stays (properties)
CREATE TABLE IF NOT EXISTS stays (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  description           TEXT,
  property_type         TEXT DEFAULT 'flat',
  bhk                   TEXT NOT NULL,
  bathrooms             INT DEFAULT 1,
  area_sqft             INT,
  floor                 INT,
  total_floors          INT,
  rent                  INT NOT NULL,
  security_deposit      INT DEFAULT 0,
  furnishing            TEXT DEFAULT 'unfurnished',
  location_area         TEXT,
  location_address      TEXT,
  location_city         TEXT DEFAULT 'Pune',
  location_pincode      TEXT,
  location_landmark     TEXT,
  location_campus       TEXT,
  distance_from_college NUMERIC(4,1) DEFAULT 0,
  occupancy_preference  TEXT DEFAULT 'any',
  gender_preference     TEXT DEFAULT 'any',
  facilities            TEXT[] DEFAULT '{}',
  amenities             TEXT[] DEFAULT '{}',
  images                TEXT[] DEFAULT '{}',
  available_from        DATE,
  status                TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'rented')),
  is_verified           BOOLEAN DEFAULT false,
  verification_status   TEXT DEFAULT 'pending',
  rating                NUMERIC(3,2) DEFAULT 0,
  review_count          INT DEFAULT 0,
  views                 INT DEFAULT 0,
  is_featured           BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- Safely add columns if table already existed without them
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='status') THEN
    ALTER TABLE stays ADD COLUMN status TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'rented'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='distance_from_college') THEN
    ALTER TABLE stays ADD COLUMN distance_from_college NUMERIC(4,1) DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='occupancy_preference') THEN
    ALTER TABLE stays ADD COLUMN occupancy_preference TEXT DEFAULT 'any';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='gender_preference') THEN
    ALTER TABLE stays ADD COLUMN gender_preference TEXT DEFAULT 'any';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stays' AND column_name='facilities') THEN
    ALTER TABLE stays ADD COLUMN facilities TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- 2. Saved stays (Wishlist)
CREATE TABLE IF NOT EXISTS saved_stays (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stay_id    UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, stay_id)
);

-- 3. Stay Reviews
CREATE TABLE IF NOT EXISTS stay_reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id     UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(stay_id, reviewer_id)
);

-- 4. Recently viewed
CREATE TABLE IF NOT EXISTS recently_viewed (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stay_id    UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  viewed_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, stay_id)
);

-- 5. Inquiries
CREATE TABLE IF NOT EXISTS stay_inquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stay_id     UUID NOT NULL REFERENCES stays(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  status      TEXT DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 6. Areas
CREATE TABLE IF NOT EXISTS areas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT UNIQUE NOT NULL,
  city       TEXT DEFAULT 'Pune',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Area reviews
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
CREATE INDEX IF NOT EXISTS stays_status_idx ON stays (status);
CREATE INDEX IF NOT EXISTS stays_distance_idx ON stays (distance_from_college);
CREATE INDEX IF NOT EXISTS stays_featured_idx ON stays (is_featured);
CREATE INDEX IF NOT EXISTS stays_owner_idx ON stays (owner_id);
CREATE INDEX IF NOT EXISTS saved_stays_user_idx ON saved_stays (user_id);
CREATE INDEX IF NOT EXISTS stay_reviews_stay_idx ON stay_reviews (stay_id);
CREATE INDEX IF NOT EXISTS stay_reviews_reviewer_idx ON stay_reviews (reviewer_id);
CREATE INDEX IF NOT EXISTS recently_viewed_user_idx ON recently_viewed (user_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_student_idx ON stay_inquiries (student_id);
CREATE INDEX IF NOT EXISTS inquiries_owner_idx ON stay_inquiries (owner_id);
CREATE INDEX IF NOT EXISTS area_reviews_area_idx ON area_reviews (area_id);

-- Disable RLS if managing through backend service role key, OR configure RLS policies
ALTER TABLE stays           DISABLE ROW LEVEL SECURITY;
ALTER TABLE saved_stays     DISABLE ROW LEVEL SECURITY;
ALTER TABLE stay_reviews    DISABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed DISABLE ROW LEVEL SECURITY;
ALTER TABLE stay_inquiries  DISABLE ROW LEVEL SECURITY;
ALTER TABLE areas            DISABLE ROW LEVEL SECURITY;
ALTER TABLE area_reviews     DISABLE ROW LEVEL SECURITY;

-- Optional: If Row Level Security is enabled in Supabase Dashboard, apply these policies:
/*
-- Stays RLS
ALTER TABLE stays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stays" ON stays FOR SELECT USING (status = 'available' OR auth.uid() = owner_id);
CREATE POLICY "Owners insert stays" ON stays FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update stays" ON stays FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete stays" ON stays FOR DELETE USING (auth.uid() = owner_id);

-- Saved Stays RLS
ALTER TABLE saved_stays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own saved stays" ON saved_stays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert saved stays" ON saved_stays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete saved stays" ON saved_stays FOR DELETE USING (auth.uid() = user_id);

-- Stay Reviews RLS
ALTER TABLE stay_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON stay_reviews FOR SELECT USING (true);
CREATE POLICY "Users insert own reviews" ON stay_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users update own reviews" ON stay_reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Users delete own reviews" ON stay_reviews FOR DELETE USING (auth.uid() = reviewer_id);
*/
