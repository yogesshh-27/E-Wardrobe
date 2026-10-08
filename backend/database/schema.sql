-- WARDROBE AI - Production Relational PostgreSQL & pgvector Schema
-- High-performance schema supporting modular monolith, asynchronous workers, and vector similarity search.

-- Enable pgvector extension for semantic fashion embeddings
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(32) UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(32) DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- 2. USER PROFILES TABLE (Privacy: measurements/hair are optional)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gender VARCHAR(64) DEFAULT 'neutral',
    avatar_image_key TEXT,
    hair_details JSONB DEFAULT '{}'::jsonb,
    measurements JSONB DEFAULT '{}'::jsonb,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_profiles_user_id UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- 3. STYLE PREFERENCES TABLE (Style DNA & Weights)
CREATE TABLE IF NOT EXISTS style_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    primary_style VARCHAR(64) DEFAULT 'Minimalist',
    style_weights JSONB DEFAULT '{"Classic": 0.35, "Casual": 0.35, "Streetwear": 0.15, "Formal": 0.10, "Traditional": 0.05}'::jsonb,
    fit_preferences TEXT[] DEFAULT ARRAY['Relaxed', 'Tailored']::TEXT[],
    color_dislikes TEXT[] DEFAULT ARRAY[]::TEXT[],
    aesthetics TEXT[] DEFAULT ARRAY['Minimal', 'Quiet Luxury']::TEXT[],
    style_embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_style_preferences_user_id UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_style_preferences_user_id ON style_preferences(user_id);

-- 4. WARDROBE FOLDERS TABLE (Custom, gender-neutral organization)
CREATE TABLE IF NOT EXISTS wardrobe_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL,
    icon VARCHAR(64) DEFAULT 'Folder',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_user_folder_slug UNIQUE(user_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_wardrobe_folders_user_id ON wardrobe_folders(user_id);

-- 5. WARDROBE ITEMS TABLE
CREATE TABLE IF NOT EXISTS wardrobe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES wardrobe_folders(id) ON DELETE SET NULL,
    image_storage_key TEXT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    status VARCHAR(32) DEFAULT 'processing' NOT NULL, -- 'pending', 'processing', 'analyzed', 'confirmed', 'error'
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_folder_id ON wardrobe_items(folder_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_created_at ON wardrobe_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_created ON wardrobe_items(user_id, created_at DESC);

-- HNSW Vector Index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_embedding ON wardrobe_items USING hnsw (embedding vector_cosine_ops);

-- 6. WARDROBE ITEM ATTRIBUTES TABLE (AI-extracted metadata)
CREATE TABLE IF NOT EXISTS wardrobe_item_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wardrobe_item_id UUID NOT NULL REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL, -- Tops, Bottoms, Outerwear, Footwear, Accessories
    subcategory VARCHAR(64),
    primary_color VARCHAR(64) NOT NULL,
    accent_colors TEXT[] DEFAULT ARRAY[]::TEXT[],
    pattern VARCHAR(64) DEFAULT 'Solid',
    style VARCHAR(64) DEFAULT 'Casual',
    fit VARCHAR(64) DEFAULT 'Regular',
    material VARCHAR(64),
    season TEXT[] DEFAULT ARRAY['All Season']::TEXT[],
    occasions TEXT[] DEFAULT ARRAY['Casual', 'Daily']::TEXT[],
    formality_level INT DEFAULT 5, -- 1 (ultra-casual) to 10 (black tie)
    confidence NUMERIC(4, 3) DEFAULT 0.950,
    is_confirmed BOOLEAN DEFAULT FALSE,
    ai_raw_analysis JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_attributes_item_id UNIQUE(wardrobe_item_id)
);

CREATE INDEX IF NOT EXISTS idx_wardrobe_item_attributes_item_id ON wardrobe_item_attributes(wardrobe_item_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_item_attributes_category ON wardrobe_item_attributes(category);
CREATE INDEX IF NOT EXISTS idx_wardrobe_item_attributes_primary_color ON wardrobe_item_attributes(primary_color);
CREATE INDEX IF NOT EXISTS idx_wardrobe_item_attributes_style ON wardrobe_item_attributes(style);

-- 7. OUTFITS TABLE
CREATE TABLE IF NOT EXISTS outfits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    occasion VARCHAR(128),
    season VARCHAR(64),
    rating INT DEFAULT 5,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_occasion ON outfits(occasion);

-- 8. OUTFIT ITEMS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS outfit_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    wardrobe_item_id UUID NOT NULL REFERENCES wardrobe_items(id) ON DELETE CASCADE,
    item_role VARCHAR(64) DEFAULT 'main', -- 'top', 'bottom', 'shoes', 'accessory', 'layer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_outfit_item UNIQUE(outfit_id, wardrobe_item_id)
);

CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit_id ON outfit_items(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items_item_id ON outfit_items(wardrobe_item_id);

-- 9. TRIPS TABLE (Primary USP Travel Planner)
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    climate VARCHAR(128),
    weather_summary JSONB DEFAULT '{}'::jsonb,
    packing_list JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON trips(start_date);

-- 10. TRIP DAYS TABLE
CREATE TABLE IF NOT EXISTS trip_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    trip_date DATE NOT NULL,
    activity VARCHAR(255) NOT NULL,
    occasion VARCHAR(128),
    outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_trip_day_number UNIQUE(trip_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_trip_days_trip_id ON trip_days(trip_id);

-- 11. RECOMMENDATIONS TABLE (Multi-Stage Pipeline Outputs)
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    context_type VARCHAR(64) NOT NULL, -- 'daily', 'occasion', 'travel', 'shopping'
    query_context JSONB DEFAULT '{}'::jsonb,
    outfit_data JSONB NOT NULL,
    reasoning TEXT,
    confidence_score NUMERIC(4, 3) DEFAULT 0.900,
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON recommendations(created_at DESC);

-- 12. RECOMMENDATION FEEDBACK TABLE (Style Learning Loop)
CREATE TABLE IF NOT EXISTS recommendation_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    action VARCHAR(32) NOT NULL, -- 'liked', 'disliked', 'saved', 'skipped', 'purchased'
    feedback_weight NUMERIC(4, 3) DEFAULT 1.000,
    user_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rec_feedback_user_id ON recommendation_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_rec_feedback_rec_id ON recommendation_feedback(recommendation_id);

-- 13. USER EVENTS AUDIT TABLE (Security & Analytics)
CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_name VARCHAR(128) NOT NULL,
    ip_address_hash VARCHAR(128),
    user_agent TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at DESC);
