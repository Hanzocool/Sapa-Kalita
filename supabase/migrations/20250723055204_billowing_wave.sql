/*
  # Sistem Informasi Warga Cluster Kalita

  1. New Tables
    - `resident_info`
      - `id` (uuid, primary key)
      - `full_name` (text, nama lengkap)
      - `phone` (text, nomor telepon)
      - `house_number` (text, nomor rumah)
      - `block` (text, blok rumah)
      - `family_members` (integer, jumlah anggota keluarga)
      - `occupation` (text, pekerjaan)
      - `emergency_contact` (text, kontak darurat)
      - `vehicle_info` (text, informasi kendaraan)
      - `notes` (text, catatan tambahan)
      - `is_public` (boolean, tampil ke publik atau tidak)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `resident_info` table
    - Add policy for public to read public resident info
    - Add policy for authenticated users to manage their own info
    - Add policy for admins to manage all resident info

  3. Functions
    - Update trigger for updated_at column
*/

-- Create resident_info table
CREATE TABLE IF NOT EXISTS resident_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text DEFAULT '',
  house_number text NOT NULL,
  block text NOT NULL,
  family_members integer DEFAULT 1,
  occupation text DEFAULT '',
  emergency_contact text DEFAULT '',
  vehicle_info text DEFAULT '',
  notes text DEFAULT '',
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE resident_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read public resident info"
  ON resident_info
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Users can read their own resident info"
  ON resident_info
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own resident info"
  ON resident_info
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own resident info"
  ON resident_info
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all resident info"
  ON resident_info
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resident_info_user_id ON resident_info(user_id);
CREATE INDEX IF NOT EXISTS idx_resident_info_block ON resident_info(block);
CREATE INDEX IF NOT EXISTS idx_resident_info_house_number ON resident_info(house_number);
CREATE INDEX IF NOT EXISTS idx_resident_info_public ON resident_info(is_public);

-- Create trigger for updated_at
CREATE TRIGGER update_resident_info_updated_at
  BEFORE UPDATE ON resident_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();