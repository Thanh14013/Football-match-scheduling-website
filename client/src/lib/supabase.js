import { createClient } from '@supabase/supabase-js'

// Dùng biến môi trường hoặc giá trị mặc định
const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL 
  ? import.meta.env.VITE_SUPABASE_URL 
  : process.env.SUPABASE_URL || 'https://example.supabase.co';
  
const supabaseAnonKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY
  ? import.meta.env.VITE_SUPABASE_ANON_KEY
  : process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Hàm lấy danh sách trận đấu với thông tin sân vận động và đội bóng
export const getMatches = async () => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        stadiums (
          id,
          name,
          capacity,
          price
        ),
        club1:teams!matches_club1_id_fkey (
          id,
          name,
          logo_url
        ),
        club2:teams!matches_club2_id_fkey (
          id,
          name,
          logo_url
        )
      `)
      .order('date', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách trận đấu:', error);
    return [];
  }
}

// Hàm lấy danh sách đội bóng
export const getTeams = async () => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đội bóng:', error);
    return [];
  }
}

// Hàm lấy danh sách sân vận động
export const getStadiums = async () => {
  try {
    const { data, error } = await supabase
      .from('stadiums')
      .select('*')
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sân vận động:', error);
    return [];
  }
}

// Hàm thêm trận đấu mới
export const addMatch = async (matchData) => {
  const { data, error } = await supabase
    .from('matches')
    .insert([matchData])
    .select()
  
  if (error) throw error
  return data[0]
}

// Hàm cập nhật trạng thái trận đấu
export const updateMatchStatus = async (matchId, status) => {
  const { data, error } = await supabase
    .from('matches')
    .update({ status })
    .eq('id', matchId)
    .select()
  
  if (error) throw error
  return data[0]
}

// Hàm lấy danh sách trận đấu theo trạng thái
export const getMatchesByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        stadiums (
          id,
          name,
          capacity,
          price
        ),
        club1:teams!matches_club1_id_fkey (
          id,
          name,
          logo_url
        ),
        club2:teams!matches_club2_id_fkey (
          id,
          name,
          logo_url
        )
      `)
      .eq('status', status)
      .order('date', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách trận đấu theo trạng thái:', error);
    return [];
  }
}

// Hàm lấy danh sách trận đấu theo đội bóng
export const getMatchesByTeam = async (teamId) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        stadiums (
          id,
          name,
          capacity,
          price
        ),
        club1:teams!matches_club1_id_fkey (
          id,
          name,
          logo_url
        ),
        club2:teams!matches_club2_id_fkey (
          id,
          name,
          logo_url
        )
      `)
      .or(`club1_id.eq.${teamId},club2_id.eq.${teamId}`)
      .order('date', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách trận đấu theo đội bóng:', error);
    return [];
  }
}

// Hàm đặt vé
export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
  
  if (error) throw error
  return data[0]
}

// Hàm lấy danh sách đặt vé của user
export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      matches (
        *,
        stadiums (
          id,
          name,
          capacity,
          price
        ),
        club1:teams!matches_club1_id_fkey (
          id,
          name,
          logo_url
        ),
        club2:teams!matches_club2_id_fkey (
          id,
          name,
          logo_url
        )
      )
    `)
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

// Hàm lấy thông tin profile
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// Hàm cập nhật profile
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
  
  if (error) throw error
  return data[0]
}

// Hàm đăng nhập
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

// Hàm đăng ký
export const signUp = async (email, password, profileData) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  })
  
  if (authError) throw authError
  
  if (authData.user) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        ...profileData
      }])
      .select()
    
    if (profileError) throw profileError
    return profileData[0]
  }
  
  return null
}

// Hàm đăng xuất
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}