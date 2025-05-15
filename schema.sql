-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cycles table
CREATE TABLE IF NOT EXISTS cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES cycles(id) ON DELETE SET NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create moods table
CREATE TABLE IF NOT EXISTS moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_id UUID REFERENCES cycles(id) ON DELETE SET NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  mood TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS cycles_user_id_idx ON cycles(user_id);
CREATE INDEX IF NOT EXISTS cycles_start_date_idx ON cycles(start_date);
CREATE INDEX IF NOT EXISTS symptoms_user_id_idx ON symptoms(user_id);
CREATE INDEX IF NOT EXISTS symptoms_cycle_id_idx ON symptoms(cycle_id);
CREATE INDEX IF NOT EXISTS symptoms_date_idx ON symptoms(date);
CREATE INDEX IF NOT EXISTS moods_user_id_idx ON moods(user_id);
CREATE INDEX IF NOT EXISTS moods_cycle_id_idx ON moods(cycle_id);
CREATE INDEX IF NOT EXISTS moods_date_idx ON moods(date);
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);
CREATE INDEX IF NOT EXISTS notes_date_idx ON notes(date);
CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON reminders(user_id);
CREATE INDEX IF NOT EXISTS reminders_date_idx ON reminders(date);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Cycles policies
CREATE POLICY "Users can view their own cycles" ON cycles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cycles" ON cycles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cycles" ON cycles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cycles" ON cycles
  FOR DELETE USING (auth.uid() = user_id);

-- Symptoms policies
CREATE POLICY "Users can view their own symptoms" ON symptoms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own symptoms" ON symptoms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own symptoms" ON symptoms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own symptoms" ON symptoms
  FOR DELETE USING (auth.uid() = user_id);

-- Moods policies
CREATE POLICY "Users can view their own moods" ON moods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own moods" ON moods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own moods" ON moods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own moods" ON moods
  FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view their own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- Reminders policies
CREATE POLICY "Users can view their own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);
