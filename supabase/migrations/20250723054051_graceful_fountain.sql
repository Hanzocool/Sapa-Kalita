/*
  # Sistem Berita Warga Cluster Kalita

  1. New Tables
    - `news_categories`
      - `id` (uuid, primary key)
      - `name` (text, nama kategori)
      - `description` (text, deskripsi kategori)
      - `color` (text, warna untuk UI)
      - `created_at` (timestamp)
    
    - `news`
      - `id` (uuid, primary key)
      - `title` (text, judul berita)
      - `content` (text, isi berita)
      - `excerpt` (text, ringkasan berita)
      - `image_url` (text, URL gambar)
      - `category_id` (uuid, foreign key ke categories)
      - `author_id` (uuid, foreign key ke auth.users)
      - `status` (text, draft/published/archived)
      - `priority` (text, normal/important/urgent)
      - `published_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `news_comments`
      - `id` (uuid, primary key)
      - `news_id` (uuid, foreign key ke news)
      - `user_id` (uuid, foreign key ke auth.users)
      - `content` (text, isi komentar)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS pada semua tabel
    - Policy untuk membaca berita yang published
    - Policy untuk admin mengelola berita
    - Policy untuk warga berkomentar

  3. Initial Data
    - Kategori default: Pengumuman, Kegiatan, Keamanan, Lingkungan
*/

-- Create news categories table
CREATE TABLE IF NOT EXISTS news_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#10b981',
  created_at timestamptz DEFAULT now()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text DEFAULT '',
  image_url text DEFAULT '',
  category_id uuid REFERENCES news_categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  priority text DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create news comments table
CREATE TABLE IF NOT EXISTS news_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id uuid REFERENCES news(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news_categories
CREATE POLICY "Anyone can read news categories"
  ON news_categories
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON news_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for news
CREATE POLICY "Anyone can read published news"
  ON news
  FOR SELECT
  TO authenticated, anon
  USING (status = 'published');

CREATE POLICY "Authors can read their own news"
  ON news
  FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all news"
  ON news
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Authors can manage their own news"
  ON news
  FOR ALL
  TO authenticated
  USING (author_id = auth.uid());

-- RLS Policies for news_comments
CREATE POLICY "Anyone can read comments on published news"
  ON news_comments
  FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM news 
      WHERE news.id = news_comments.news_id 
      AND news.status = 'published'
    )
  );

CREATE POLICY "Authenticated users can create comments"
  ON news_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own comments"
  ON news_comments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON news_comments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_comments_news_id ON news_comments(news_id);

-- Insert default categories
INSERT INTO news_categories (name, description, color) VALUES
  ('Pengumuman', 'Pengumuman resmi dari pengurus cluster', '#3b82f6'),
  ('Kegiatan', 'Informasi kegiatan warga dan acara cluster', '#10b981'),
  ('Keamanan', 'Informasi terkait keamanan lingkungan', '#ef4444'),
  ('Lingkungan', 'Informasi kebersihan dan perawatan lingkungan', '#22c55e'),
  ('Fasilitas', 'Informasi terkait fasilitas umum cluster', '#f59e0b')
ON CONFLICT DO NOTHING;

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for news table
CREATE TRIGGER update_news_updated_at 
  BEFORE UPDATE ON news 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();