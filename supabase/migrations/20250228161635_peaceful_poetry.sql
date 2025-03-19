/*
  # Initial schema for Football Match Scheduling

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `stadiums`
      - `id` (uuid, primary key)
      - `name` (text)
      - `team` (text)
      - `capacity` (integer)
      - `created_at` (timestamp)
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `stadium_id` (uuid, references stadiums)
      - `date` (date)
      - `time` (time)
      - `number_of_players` (integer)
      - `status` (text)
      - `notes` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for public access to stadiums
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create stadiums table
CREATE TABLE IF NOT EXISTS stadiums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  number_of_players INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(stadium_id, date, time)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stadiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Stadiums policies (public read access)
CREATE POLICY "Anyone can view stadiums"
  ON stadiums
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample stadium data
INSERT INTO stadiums (name, team, capacity)
VALUES
  ('Emirates Stadium', 'Arsenal', 60704),
  ('Villa Park', 'Aston Villa', 42785),
  ('Brentford Community Stadium', 'Brentford', 17250),
  ('Amex Stadium', 'Brighton & Hove Albion', 31800),
  ('Turf Moor', 'Burnley', 21944),
  ('Stamford Bridge', 'Chelsea', 40853),
  ('Selhurst Park', 'Crystal Palace', 25486),
  ('Goodison Park', 'Everton', 39572),
  ('Elland Road', 'Leeds United', 37890),
  ('King Power Stadium', 'Leicester City', 32312),
  ('Anfield', 'Liverpool', 53394),
  ('Etihad Stadium', 'Manchester City', 55017),
  ('Old Trafford', 'Manchester United', 74140),
  ('St James'' Park', 'Newcastle United', 52305),
  ('Carrow Road', 'Norwich City', 27359),
  ('St Mary''s Stadium', 'Southampton', 32384),
  ('Tottenham Hotspur Stadium', 'Tottenham Hotspur', 62850),
  ('Vicarage Road', 'Watford', 21577),
  ('London Stadium', 'West Ham United', 60000),
  ('Molineux Stadium', 'Wolverhampton Wanderers', 32050);

-- Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();