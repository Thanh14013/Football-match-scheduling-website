import { supabase } from './supabase.js';

// SQL để tạo và thiết lập cơ sở dữ liệu
const SQL_SCRIPTS = [
  // Xóa các bảng cũ nếu tồn tại
  `DROP TABLE IF EXISTS bookings;`,
  `DROP TABLE IF EXISTS matches;`,
  `DROP TABLE IF EXISTS stadiums;`,
  `DROP TABLE IF EXISTS teams;`,
  `DROP TABLE IF EXISTS users;`,
  
  // Tạo bảng teams (đội bóng)
  `CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );`,
  
  // Tạo bảng stadiums (sân vận động)
  `CREATE TABLE stadiums (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );`,
  
  // Tạo bảng users (người dùng)
  `CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );`,
  
  // Tạo bảng matches (trận đấu)
  `CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    club1_id INTEGER REFERENCES teams(id),
    club2_id INTEGER REFERENCES teams(id),
    stadium_id INTEGER REFERENCES stadiums(id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );`,
  
  // Tạo bảng bookings (đặt vé)
  `CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    match_id INTEGER REFERENCES matches(id),
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );`,
];

// Dữ liệu mẫu cho teams
const TEAMS_DATA = [
  { name: 'Manchester United', logo_url: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },
  { name: 'Liverpool', logo_url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
  { name: 'Arsenal', logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
  { name: 'Chelsea', logo_url: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
  { name: 'Barcelona', logo_url: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
  { name: 'Real Madrid', logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
  { name: 'Manchester City', logo_url: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' },
  { name: 'Tottenham', logo_url: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg' },
  { name: 'Bayern Munich', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg' },
  { name: 'Borussia Dortmund', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg' },
  { name: 'Juventus', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg' },
  { name: 'Inter Milan', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg' },
  { name: 'PSG', logo_url: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg' },
  { name: 'Monaco', logo_url: 'https://upload.wikimedia.org/wikipedia/en/e/ea/AS_Monaco_FC.svg' }
];

// Dữ liệu mẫu cho stadiums
const STADIUMS_DATA = [
  { name: 'Old Trafford', capacity: 74140, price: 50.00 },
  { name: 'Anfield', capacity: 53394, price: 45.00 },
  { name: 'Emirates Stadium', capacity: 60704, price: 55.00 },
  { name: 'Stamford Bridge', capacity: 41837, price: 60.00 },
  { name: 'Camp Nou', capacity: 99354, price: 65.00 },
  { name: 'Santiago Bernabéu', capacity: 81044, price: 70.00 },
  { name: 'Etihad Stadium', capacity: 53400, price: 40.00 },
  { name: 'Tottenham Hotspur Stadium', capacity: 62850, price: 50.00 },
  { name: 'Allianz Arena', capacity: 75000, price: 55.00 },
  { name: 'Signal Iduna Park', capacity: 81365, price: 45.00 },
  { name: 'Allianz Stadium', capacity: 41507, price: 60.00 },
  { name: 'San Siro', capacity: 80018, price: 50.00 },
  { name: 'Parc des Princes', capacity: 48712, price: 55.00 },
  { name: 'Stade Louis II', capacity: 18523, price: 40.00 }
];

// Hàm tạo dữ liệu trận đấu
const generateMatchesData = (teams, stadiums) => {
  const matches = [];
  const now = new Date();
  
  for (let i = 0; i < 10; i++) {
    const club1Index = i % teams.length;
    const club2Index = (i + 1) % teams.length;
    const stadiumIndex = i % stadiums.length;
    
    const matchDate = new Date(now);
    matchDate.setDate(matchDate.getDate() + i + 1);
    
    matches.push({
      club1_id: teams[club1Index].id,
      club2_id: teams[club2Index].id,
      stadium_id: stadiums[stadiumIndex].id,
      date: matchDate.toISOString().split('T')[0],
      time: '19:30:00',
      status: 'upcoming'
    });
  }
  
  return matches;
};

export async function setupDatabase() {
  try {
    console.log('Bắt đầu thiết lập cơ sở dữ liệu...');
    
    // 1. Thử thực thi câu lệnh SQL để xem server có hỗ trợ RPC không
    console.log('Kiểm tra khả năng hỗ trợ RPC...');
    const { error: rpcTestError } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' });
    const useRpc = !rpcTestError;
    
    if (useRpc) {
      // Nếu hỗ trợ RPC, thực thi các câu lệnh SQL qua RPC
      for (const sql of SQL_SCRIPTS) {
        console.log(`Đang thực thi: ${sql.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql });
        
        if (error) {
          console.error('Lỗi khi thực thi SQL:', error);
        }
      }
    } else {
      console.log('Không hỗ trợ RPC, sử dụng Supabase API thông thường...');
      
      // Xóa dữ liệu cũ (thứ tự quan trọng vì có ràng buộc khóa ngoại)
      console.log('Xóa dữ liệu cũ từ bảng bookings...');
      await supabase.from('bookings').delete().neq('id', 0);
      
      console.log('Xóa dữ liệu cũ từ bảng matches...');
      await supabase.from('matches').delete().neq('id', 0);
      
      console.log('Xóa dữ liệu cũ từ bảng stadiums...');
      await supabase.from('stadiums').delete().neq('id', 0);
      
      console.log('Xóa dữ liệu cũ từ bảng teams...');
      await supabase.from('teams').delete().neq('id', 0);
    }
    
    // 2. Thêm dữ liệu teams
    console.log('Thêm dữ liệu teams...');
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .insert(TEAMS_DATA)
      .select();
    
    if (teamsError) {
      console.error('Lỗi khi thêm teams:', teamsError);
      throw teamsError;
    }
    
    if (!teamsData || teamsData.length === 0) {
      console.error('Không thể thêm dữ liệu teams.');
      throw new Error('Không thể thêm dữ liệu teams.');
    }
    
    // 3. Thêm dữ liệu stadiums
    console.log('Thêm dữ liệu stadiums...');
    const { data: stadiumsData, error: stadiumsError } = await supabase
      .from('stadiums')
      .insert(STADIUMS_DATA)
      .select();
    
    if (stadiumsError) {
      console.error('Lỗi khi thêm stadiums:', stadiumsError);
      throw stadiumsError;
    }
    
    if (!stadiumsData || stadiumsData.length === 0) {
      console.error('Không thể thêm dữ liệu stadiums.');
      throw new Error('Không thể thêm dữ liệu stadiums.');
    }
    
    // 4. Tạo và thêm dữ liệu matches
    const matchesData = generateMatchesData(teamsData, stadiumsData);
    console.log('Thêm dữ liệu matches...');
    const { error: matchesError } = await supabase
      .from('matches')
      .insert(matchesData);
    
    if (matchesError) {
      console.error('Lỗi khi thêm matches:', matchesError);
      throw matchesError;
    }
    
    console.log('Thiết lập cơ sở dữ liệu hoàn tất!');
  } catch (error) {
    console.error('Lỗi khi thiết lập cơ sở dữ liệu:', error);
    throw error;
  }
} 