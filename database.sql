-- Xóa các bảng cũ nếu tồn tại
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS stadiums;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS teams;

-- Tạo bảng teams (đội bóng)
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tạo bảng stadiums (sân vận động)
CREATE TABLE stadiums (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tạo bảng users (người dùng)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tạo bảng matches (trận đấu)
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    club1_id INTEGER REFERENCES teams(id),
    club2_id INTEGER REFERENCES teams(id),
    stadium_id INTEGER REFERENCES stadiums(id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tạo bảng bookings (đặt vé)
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    match_id INTEGER REFERENCES matches(id),
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Thêm dữ liệu mẫu cho bảng teams
INSERT INTO teams (name, logo_url) VALUES
('Manchester United', 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg'),
('Liverpool', 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg'),
('Arsenal', 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg'),
('Chelsea', 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'),
('Barcelona', 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg'),
('Real Madrid', 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg'),
('Manchester City', 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg'),
('Tottenham', 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg'),
('Bayern Munich', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg'),
('Borussia Dortmund', 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg'),
('Juventus', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg'),
('Inter Milan', 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg'),
('PSG', 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg'),
('Monaco', 'https://upload.wikimedia.org/wikipedia/en/e/ea/AS_Monaco_FC.svg');

-- Thêm dữ liệu mẫu cho bảng stadiums
INSERT INTO stadiums (name, capacity, price) VALUES
('Old Trafford', 74140, 50.00),
('Anfield', 53394, 45.00),
('Emirates Stadium', 60704, 55.00),
('Stamford Bridge', 41837, 60.00),
('Camp Nou', 99354, 65.00),
('Santiago Bernabéu', 81044, 70.00),
('Etihad Stadium', 53400, 40.00),
('Tottenham Hotspur Stadium', 62850, 50.00),
('Allianz Arena', 75000, 55.00),
('Signal Iduna Park', 81365, 45.00),
('Allianz Stadium', 41507, 60.00),
('San Siro', 80018, 50.00),
('Parc des Princes', 48712, 55.00),
('Stade Louis II', 18523, 40.00);

-- Thêm dữ liệu mẫu cho bảng matches
INSERT INTO matches (club1_id, club2_id, stadium_id, date, time, status) VALUES
(1, 2, 1, '2024-03-20', '20:00:00', 'upcoming'),
(3, 4, 3, '2024-03-21', '19:45:00', 'upcoming'),
(5, 6, 5, '2024-03-22', '21:00:00', 'upcoming'),
(7, 8, 7, '2024-03-23', '15:00:00', 'upcoming'),
(9, 10, 9, '2024-03-24', '17:30:00', 'upcoming'),
(11, 12, 11, '2024-03-25', '20:00:00', 'upcoming'),
(13, 14, 13, '2024-03-26', '19:45:00', 'upcoming'),
(2, 3, 2, '2024-03-27', '21:00:00', 'upcoming'),
(4, 5, 4, '2024-03-28', '15:00:00', 'upcoming'),
(6, 7, 6, '2024-03-29', '17:30:00', 'upcoming'); 