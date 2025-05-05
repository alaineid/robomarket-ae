-- Create and configure storage buckets for the RoboMarket application

-- Create storage schema if it doesn't exist already
CREATE SCHEMA IF NOT EXISTS storage;

-- Enable the storage extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create buckets table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.buckets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  owner UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  public BOOLEAN DEFAULT FALSE
);

-- Create objects table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id TEXT REFERENCES storage.buckets(id),
  name TEXT NOT NULL,
  owner UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB,
  path_tokens TEXT[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
  UNIQUE (bucket_id, name)
);

-- Create bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT DO NOTHING;

-- Create bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT DO NOTHING;

-- Create bucket for site assets (logos, icons, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to view objects in public buckets
CREATE POLICY "Allow public access to all buckets"
ON storage.buckets FOR SELECT
USING (public = true);

-- Allow all users to view objects in public buckets
CREATE POLICY "Allow public access to objects in public buckets"
ON storage.objects FOR SELECT
USING (bucket_id IN (SELECT id FROM storage.buckets WHERE public = true));

-- Allow authenticated users to upload objects
CREATE POLICY "Allow authenticated users to upload objects"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own objects
CREATE POLICY "Allow users to update their own objects"
ON storage.objects FOR UPDATE
USING (owner = auth.uid());

-- Allow users to delete their own objects
CREATE POLICY "Allow users to delete their own objects"
ON storage.objects FOR DELETE
USING (owner = auth.uid());